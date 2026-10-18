import {NextResponse} from 'next/server';
import {appendResult} from '../../../lib/server/logStore';
export const runtime='nodejs';export const dynamic='force-dynamic';
const bad=m=>NextResponse.json({error:m},{status:400});
const int=(v,max)=>Number.isInteger(v)&&v>=0&&v<=max;
export async function POST(req){
  let b;try{const t=await req.text();if(t.length>2000)return bad('Payload too large');b=JSON.parse(t)}catch{return bad('Invalid JSON')}
  if(!b||typeof b!=='object')return bad('Invalid payload');
  const{sessionId,startedAt,completedAt,score,hits,misses}=b,name=typeof b.name==='string'?b.name.replace(/[\u0000-\u001f\u007f]+/g,' ').trim():'';
  if(typeof sessionId!=='string'||!/^[A-Za-z0-9-]{8,64}$/.test(sessionId))return bad('Invalid session id');
  if(!name||name.length>24)return bad('Invalid name');
  if(!int(hits,30)||!int(misses,30)||!int(score,900)||score!==hits*30)return bad('Invalid result');
  if(!Number.isFinite(startedAt)||!Number.isFinite(completedAt))return bad('Invalid timestamps');
  const duration=Math.round((completedAt-startedAt)/1000),now=Date.now();
  if(duration<55||duration>75||completedAt>now+60000||completedAt<now-120000)return bad('Implausible test duration');
  const total=hits+misses,pct=total?Math.round(hits/total*10000)/100:0;
  try{
    const r=await appendResult({sessionId,name,startedAt,completedAt,score,hits,misses,total,pct,duration});
    return NextResponse.json({ok:true,duplicate:r.duplicate},{status:r.duplicate?200:201});
  }catch{return NextResponse.json({error:'Could not save result'},{status:500})}
}
