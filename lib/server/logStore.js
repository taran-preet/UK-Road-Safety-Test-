import fs from 'fs/promises';
import path from 'path';
const DIR=path.join(process.cwd(),'logs'),FILE=/^test-results-\d{4}-\d{2}-\d{2}\.txt$/,BAR='='.repeat(50);
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const hms=d=>`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const clean=s=>String(s).replace(/[\u0000-\u001f\u007f]+/g,' ').trim();
let chain=(globalThis.__logChain??=Promise.resolve());

const format=(r,s,c)=>[BAR,`TEST SESSION: ${r.sessionId}`,`CANDIDATE NAME: ${clean(r.name)}`,`TEST DATE: ${ymd(c)}`,`TEST START TIME: ${hms(s)}`,
  `TEST COMPLETION TIME: ${hms(c)}`,`TEST DURATION: ${r.duration} seconds`,`TOTAL SCORE: ${r.score}`,`DETECTED HAZARDS: ${r.hits}`,`MISSED HAZARDS: ${r.misses}`,
  `TOTAL HAZARDS: ${r.total}`,`DETECTION PERCENTAGE: ${r.pct.toFixed(2)}%`,`TEST STATUS: Completed`,`STARTED AT (ISO): ${s.toISOString()}`,`COMPLETED AT (ISO): ${c.toISOString()}`,BAR,''].join('\n');

export async function readAll(){
  let files=[];
  try{files=(await fs.readdir(DIR)).filter(f=>FILE.test(f)).sort()}catch(e){if(e.code==='ENOENT')return{records:[],malformed:0};throw e}
  const records=[];let malformed=0;
  for(const f of files){
    let txt='';try{txt=await fs.readFile(path.join(DIR,f),'utf8')}catch{malformed++;continue}
    for(const blk of txt.split(new RegExp(`^${BAR}\\s*$`,'m'))){
      if(!blk.trim())continue;
      const m={};for(const ln of blk.split('\n')){const i=ln.indexOf(': ');if(i>0)m[ln.slice(0,i).trim()]=ln.slice(i+2).trim()}
      const n=k=>Number(m[k]),r={sessionId:m['TEST SESSION'],name:m['CANDIDATE NAME'],date:m['TEST DATE'],startTime:m['TEST START TIME'],completionTime:m['TEST COMPLETION TIME'],
        duration:parseInt(m['TEST DURATION']),score:n('TOTAL SCORE'),hits:n('DETECTED HAZARDS'),misses:n('MISSED HAZARDS'),total:n('TOTAL HAZARDS'),
        pct:parseFloat(m['DETECTION PERCENTAGE']),status:m['TEST STATUS']||'Completed',startedAt:m['STARTED AT (ISO)']||null,completedAt:m['COMPLETED AT (ISO)']||null};
      if(!r.sessionId||!r.name||!r.date||[r.duration,r.score,r.hits,r.misses,r.total,r.pct].some(Number.isNaN)){if(blk.includes('TEST SESSION'))malformed++;continue}
      if(!r.completedAt||isNaN(Date.parse(r.completedAt)))r.completedAt=null;
      records.push(r);
    }
  }
  return{records,malformed};
}
export function appendResult(r){
  const run=chain.then(async()=>{
    await fs.mkdir(DIR,{recursive:true});
    const s=new Date(r.startedAt),c=new Date(r.completedAt);
    if((await readAll()).records.some(x=>x.sessionId===r.sessionId))return{duplicate:true};
    await fs.appendFile(path.join(DIR,`test-results-${ymd(c)}.txt`),format(r,s,c),'utf8');
    return{duplicate:false};
  });
  chain=run.catch(()=>{});return run;
}
