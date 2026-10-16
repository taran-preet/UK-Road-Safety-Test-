'use client';
import {downloadPdf} from '../lib/downloadPdf';
const msg=h=>h>=9?'Excellent hazard awareness. You spotted almost everything early.':h>=6?'Good work. A few developing hazards slipped past you.':h>=3?'Fair. Keep scanning side roads, kerbs and driveways.':'Needs practice. Look for vehicles that signal, creep or pull away.';
export default function ResultsModal({name,result,onAgain,onHome}){
  const r=result||{score:0,hits:0,misses:0};
  const total=r.hits+r.misses;
  const pct=total>0?Math.round(r.hits/total*100):0;
  const handleDownload=()=>downloadPdf({name,score:r.score,hits:r.hits,misses:r.misses,pct});
  return(<div className="overlay"><div className="modal">
    <h2>Test complete, {name}</h2>
    <div style={{display:'flex',justifyContent:'center',gap:'2rem',alignItems:'baseline'}}>
      <div className="score">{r.score}<small> points</small></div>
      <div className="score">{pct}<small>% Score</small></div>
    </div>
    <dl>
      <div><dt>Hazards stopped</dt><dd>{r.hits}</dd></div>
      <div><dt>Hazards missed</dt><dd>{r.misses}</dd></div>
      <div><dt>Test duration</dt><dd>60 seconds</dd></div>
    </dl>
    <p>{msg(r.hits)}</p>
    <div className="row"><button className="btn" onClick={onAgain}>Play Again</button><button className="btn ghost" onClick={onHome}>Return Home</button></div>
    <button className="btn" style={{marginTop:'10px',background:'#1a6fd4',color:'#fff'}} onClick={handleDownload}>⬇ Download PDF</button>
  </div></div>);
}
