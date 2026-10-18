import {NextResponse} from 'next/server';
import {isAdmin} from '../../../../lib/server/adminAuth';
import {readAll} from '../../../../lib/server/logStore';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(){
  if(!isAdmin())return NextResponse.json({error:'Unauthorised'},{status:401});
  try{return NextResponse.json(await readAll(),{headers:{'Cache-Control':'no-store'}})}
  catch{return NextResponse.json({error:'Could not read log files.'},{status:500})}
}
