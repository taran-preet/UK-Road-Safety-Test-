const uid=()=>globalThis.crypto?.randomUUID?.()||Array.from({length:4},()=>Math.random().toString(16).slice(2,10)).join('-');
export const startSession=()=>({id:uid(),start:Date.now(),sent:false});
function note(msg){
  if(typeof document==='undefined')return;
  const d=document.createElement('div');d.textContent=msg;
  d.style.cssText='position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:99;padding:6px 12px;border-radius:6px;background:#000b;color:#f2b632;font:12px sans-serif;pointer-events:none';
  document.body.append(d);setTimeout(()=>d.remove(),4000);
}
export async function submitResult(meta,name,r){
  if(!meta||meta.sent||!r)return;meta.sent=true;
  try{
    const res=await fetch('/api/test-results',{method:'POST',headers:{'Content-Type':'application/json'},keepalive:true,
      body:JSON.stringify({sessionId:meta.id,name,startedAt:meta.start,completedAt:Date.now(),score:r.score,hits:r.hits,misses:r.misses})});
    if(!res.ok)throw new Error(res.status);
  }catch{note('Result could not be saved to the admin log.')}
}
