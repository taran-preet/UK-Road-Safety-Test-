'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';
import {useRouter} from 'next/navigation';
const ld=iso=>{const d=new Date(iso);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const when=r=>r.completedAt?new Date(r.completedAt):null;
const avg=(a,k)=>a.length?a.reduce((s,r)=>s+r[k],0)/a.length:0;
const SORTS={'date-desc':(a,b)=>(b.completedAt||0)-(a.completedAt||0),'date-asc':(a,b)=>(a.completedAt||0)-(b.completedAt||0),
  'score-desc':(a,b)=>b.score-a.score,'score-asc':(a,b)=>a.score-b.score,'pct-desc':(a,b)=>b.pct-a.pct,'pct-asc':(a,b)=>a.pct-b.pct,
  'name-asc':(a,b)=>a.name.localeCompare(b.name),'name-desc':(a,b)=>b.name.localeCompare(a.name)};
export default function Dashboard(){
  const router=useRouter();
  const [data,setData]=useState(null),[err,setErr]=useState(''),[loading,setLoading]=useState(true);
  const [q,setQ]=useState(''),[date,setDate]=useState(''),[sort,setSort]=useState('date-desc');
  const load=useCallback(async()=>{
    setLoading(true);setErr('');
    try{
      const r=await fetch('/api/admin/results',{cache:'no-store'});
      if(r.status===401){router.replace('/admin');return}
      if(!r.ok)throw new Error();
      setData(await r.json());
    }catch{setErr('Could not load results. Please try again.')}
    setLoading(false);
  },[router]);
  useEffect(()=>{load()},[load]);
  const logout=async()=>{try{await fetch('/api/admin/logout',{method:'POST'})}catch{}router.replace('/admin');router.refresh()};
  const all=data?.records||[];
  const rows=useMemo(()=>all.filter(r=>r.name.toLowerCase().includes(q.trim().toLowerCase())&&(!date||(r.completedAt?ld(r.completedAt):r.date)===date)).sort(SORTS[sort]),[all,q,date,sort]);
  const hits=rows.reduce((s,r)=>s+r.hits,0),miss=rows.reduce((s,r)=>s+r.misses,0);
  const cards=[['Test attempts',rows.length],['Unique candidates (by name)',new Set(rows.map(r=>r.name.toLowerCase())).size],['Average score',avg(rows,'score').toFixed(1)],
    ['Average detection',avg(rows,'pct').toFixed(1)+'%'],['Hazards detected',hits],['Hazards missed',miss]];
  return(<div className="adm">
    <header className="adm-top"><div><span className="plate">Admin</span><h1>Candidate Results</h1></div>
      <div className="adm-actions"><button className="btn ghost" onClick={load} disabled={loading}>{loading?'Loading…':'Refresh'}</button><button className="btn ghost" onClick={logout}>Logout</button></div></header>
    {err&&<div className="adm-err" role="alert">{err}</div>}
    {data?.malformed>0&&<div className="adm-note">{data.malformed} malformed log entr{data.malformed>1?'ies were':'y was'} skipped.</div>}
    <section className="adm-cards">{cards.map(([k,v])=><div key={k} className="adm-card"><small>{k}</small><b>{v}</b></div>)}</section>
    <section className="adm-filters">
      <input placeholder="Search candidate name" value={q} onChange={e=>setQ(e.target.value)} aria-label="Search by name"/>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} aria-label="Filter by date"/>
      <select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort">
        <option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option><option value="score-desc">Score: high to low</option><option value="score-asc">Score: low to high</option>
        <option value="pct-desc">Detection: high to low</option><option value="pct-asc">Detection: low to high</option><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option></select>
      {(q||date)&&<button className="btn ghost" onClick={()=>{setQ('');setDate('')}}>Clear</button>}
    </section>
    {loading&&!data?<div className="adm-empty">Loading results…</div>:rows.length===0?
      <div className="adm-empty">{all.length?'No results match your filters.':'No test results have been recorded yet.'}</div>:
    <div className="adm-table"><table><thead><tr><th>Candidate</th><th>Date</th><th>Time</th><th>Score</th><th>Detection</th><th>Hits</th><th>Missed</th><th>Total</th><th>Duration</th><th>Status</th></tr></thead>
      <tbody>{rows.map(r=>{const d=when(r);return(<tr key={r.sessionId}><td>{r.name}</td><td>{d?d.toLocaleDateString():r.date}</td><td>{d?d.toLocaleTimeString():r.completionTime}</td>
        <td>{r.score}</td><td>{r.pct.toFixed(1)}%</td><td>{r.hits}</td><td>{r.misses}</td><td>{r.total}</td><td>{r.duration}s</td><td>{r.status}</td></tr>)})}</tbody></table></div>}
  </div>);
}
