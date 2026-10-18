import {NextResponse} from 'next/server';
import {checkCreds,createSession,limited,noteFail,clearFails} from '../../../../lib/server/adminAuth';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req){
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'local';
  if(limited(ip))return NextResponse.json({error:'Too many attempts. Try again in 10 minutes.'},{status:429});
  let b;try{b=await req.json()}catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
  if(typeof b?.email!=='string'||typeof b?.password!=='string'||!b.email||!b.password)return NextResponse.json({error:'Email and password are required.'},{status:400});
  const ok=checkCreds(b.email,b.password);
  if(ok===null)return NextResponse.json({error:'Admin login is not configured on the server.'},{status:500});
  if(!ok){noteFail(ip);return NextResponse.json({error:'Invalid email or password.'},{status:401})}
  clearFails(ip);await createSession();
  return NextResponse.json({ok:true});
}
