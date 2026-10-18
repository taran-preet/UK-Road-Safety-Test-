'use client';
import {useEffect,useState} from 'react';
export const FloatingScore=({x,y})=><div className="float" style={{left:x,top:y}}>+30</div>;
export function MissToast(){
  const [on,setOn]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>setOn(false),1800);return()=>clearTimeout(t)},[]);
  return on?<div className="toast" role="status"><b>Hazard Missed</b> — No points awarded.</div>:null;
}
