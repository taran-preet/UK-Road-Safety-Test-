import crypto from 'crypto';
import {cookies} from 'next/headers';
const COOKIE='hp_admin_session',TTL=8*3600*1000;
const sessions=(globalThis.__adminSessions??=new Map());
const fails=(globalThis.__adminFails??=new Map());
const sha=s=>crypto.createHash('sha256').update(String(s)).digest();
const same=(a,b)=>crypto.timingSafeEqual(sha(a),sha(b));
export function checkCreds(email,pw){
  const E=process.env.ADMIN_EMAIL,P=process.env.ADMIN_PASSWORD;
  if(!E||!P)return null;
  const a=same(String(email||'').trim().toLowerCase(),E.trim().toLowerCase()),b=same(pw||'',P);
  return a&&b;
}
export function limited(ip){const f=fails.get(ip);return !!f&&f.n>=5&&Date.now()-f.t<600000}
export function noteFail(ip){const f=fails.get(ip);fails.set(ip,{n:f&&Date.now()-f.t<600000?f.n+1:1,t:Date.now()})}
export function clearFails(ip){fails.delete(ip)}
export function createSession(){
  const token=crypto.randomBytes(32).toString('hex');
  sessions.set(sha(token).toString('hex'),Date.now()+TTL);
  cookies().set(COOKIE,token,{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:TTL/1000});
}
export function isAdmin(){
  const t=cookies().get(COOKIE)?.value;if(!t)return false;
  const k=sha(t).toString('hex'),exp=sessions.get(k);
  if(!exp||exp<Date.now()){sessions.delete(k);return false}
  return true;
}
export function destroySession(){
  const t=cookies().get(COOKIE)?.value;
  if(t)sessions.delete(sha(t).toString('hex'));
  cookies().set(COOKIE,'',{httpOnly:true,sameSite:'strict',path:'/',maxAge:0});
}
