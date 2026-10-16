'use client';
import {useEffect,useRef,useState} from 'react';
import Game from '../game/Game';
import Hud from './Hud';
import {FloatingScore,MissToast} from './Popups';

export default function GameCanvas({name,onEnd}){
  const box=useRef();
  const [hud,setHud]=useState({left:60,score:0});
  const [floats,setFloats]=useState([]);
  const [miss,setMiss]=useState(0);
  useEffect(()=>{
    const g=new Game(box.current,{
      onTick:setHud,onEnd,
      onHit:p=>{const id=Math.random();setFloats(f=>[...f,{id,...p}]);setTimeout(()=>setFloats(f=>f.filter(x=>x.id!==id)),1000)},
      onMiss:()=>setMiss(m=>m+1)});
    return()=>g.dispose();
  },[]);
  return(<div className="stage">
    <div ref={box} className="canvas"/>
    <div className="vignette"/><div className="mirror"/><div className="dash"/>
    <Hud name={name} {...hud}/>
    {floats.map(f=><FloatingScore key={f.id} x={f.x} y={f.y}/>)}
    {miss>0&&<MissToast key={miss}/>}
  </div>);
}
