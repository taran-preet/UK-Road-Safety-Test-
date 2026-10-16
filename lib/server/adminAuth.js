import crypto from "crypto";
import { cookies } from "next/headers";
const COOKIE = "hp_admin_session",
  TTL = 8 * 3600 * 1000;
const fails = (globalThis.__adminFails ??= new Map());
const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();
const same = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));
const SECRET = process.env.SESSION_SECRET || 'safetycircle_admin_secret_key_32x';
function signToken(token) {
  return crypto.createHmac('sha256', SECRET).update(token).digest('hex');
}
function makePayload(token) {
  const exp = Date.now() + TTL;
  return Buffer.from(JSON.stringify({ token, exp })).toString('base64');
}
function verifyPayload(raw) {
  try {
    const [payload, sig] = raw.split('.');
    if (signToken(payload) !== sig) return null;
    const { token, exp } = JSON.parse(Buffer.from(payload, 'base64').toString());
    if (Date.now() > exp) return null;
    return token;
  } catch { return null; }
}
export function checkCreds(email, pw) {
  const E = process.env.ADMIN_EMAIL || 'Admin@safetycircle.com',
    P = process.env.ADMIN_PASSWORD || 'safetycircle@123';
  if (!E || !P) return null;
  const a = same(
      String(email || "")
        .trim()
        .toLowerCase(),
      E.trim().toLowerCase(),
    ),
    b = same(pw || "", P);
  return a && b;
}
export function limited(ip) {
  const f = fails.get(ip);
  return !!f && f.n >= 5 && Date.now() - f.t < 600000;
}
export function noteFail(ip) {
  const f = fails.get(ip);
  fails.set(ip, {
    n: f && Date.now() - f.t < 600000 ? f.n + 1 : 1,
    t: Date.now(),
  });
}
export function clearFails(ip) {
  fails.delete(ip);
}
export function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  const payload = makePayload(token);
  const sig = signToken(payload);
  cookies().set(COOKIE, `${payload}.${sig}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL / 1000,
  });
}
export function isAdmin() {
  const raw = cookies().get(COOKIE)?.value;
  if (!raw) return false;
  return verifyPayload(raw) !== null;
}
export function destroySession() {
  cookies().set(COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
