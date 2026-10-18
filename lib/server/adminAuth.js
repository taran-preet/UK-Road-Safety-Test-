import crypto from 'crypto';
import { cookies } from 'next/headers';
import getClientPromise from './db.js';

const COOKIE = 'hp_admin_session', TTL = 8 * 3600 * 1000;
const fails = (globalThis.__adminFails ??= new Map()); // rate-limit only, ok in-memory

const sha = s => crypto.createHash('sha256').update(String(s)).digest('hex');
const same = (a, b) => crypto.timingSafeEqual(
  crypto.createHash('sha256').update(String(a)).digest(),
  crypto.createHash('sha256').update(String(b)).digest()
);

let sessionIndexed = false;
async function col() {
  const client = await getClientPromise();
  const c = client.db('hazard').collection('admin_sessions');
  if (!sessionIndexed) {
    await c.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {});
    sessionIndexed = true;
  }
  return c;
}

export function checkCreds(email, pw) {
  const E = process.env.ADMIN_EMAIL, P = process.env.ADMIN_PASSWORD;
  if (!E || !P) return null;
  const a = same(String(email || '').trim().toLowerCase(), E.trim().toLowerCase());
  const b = same(pw || '', P);
  return a && b;
}

export function limited(ip) {
  const f = fails.get(ip);
  return !!f && f.n >= 5 && Date.now() - f.t < 600000;
}
export function noteFail(ip) {
  const f = fails.get(ip);
  fails.set(ip, { n: f && Date.now() - f.t < 600000 ? f.n + 1 : 1, t: Date.now() });
}
export function clearFails(ip) { fails.delete(ip); }

export async function createSession() {
  const token = crypto.randomBytes(32).toString('hex');
  const key = sha(token);
  const c = await col();
  await c.insertOne({ _id: key, expiresAt: new Date(Date.now() + TTL) });
  cookies().set(COOKIE, token, {
    httpOnly: true, sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: TTL / 1000,
  });
}

export async function isAdmin() {
  const t = cookies().get(COOKIE)?.value;
  if (!t) return false;
  const key = sha(t);
  const c = await col();
  const doc = await c.findOne({ _id: key, expiresAt: { $gt: new Date() } });
  return !!doc;
}

export async function destroySession() {
  const t = cookies().get(COOKIE)?.value;
  if (t) {
    const c = await col();
    await c.deleteOne({ _id: sha(t) });
  }
  cookies().set(COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
}
