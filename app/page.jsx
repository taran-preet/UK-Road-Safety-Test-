'use client';
import {useRef,useState} from 'react';
import dynamic from 'next/dynamic';
import StartScreen from '../components/StartScreen';
import ResultsModal from '../components/ResultsModal';
import {startSession,submitResult} from '../lib/logClient';

// Three.js needs the browser (canvas/WebGL), so the game is loaded client-side only.
const GameCanvas=dynamic(()=>import('../components/GameCanvas'),{ssr:false});

export default function Page(){
  const [screen,setScreen]=useState('home');
  const [name,setName]=useState('');
  const [result,setResult]=useState(null);
  const [run,setRun]=useState(0);
  const meta=useRef(null);
  const play=n=>{meta.current=startSession();setName(n);setResult(null);setRun(r=>r+1);setScreen('play')};
  return(<>
    {screen!=='home'&&<GameCanvas key={run} name={name} onEnd={r=>{submitResult(meta.current,name,r);setResult(r);setScreen('results')}}/>}
    {screen==='home'&&<StartScreen onStart={play}/>}
    {screen==='results'&&<ResultsModal name={name} result={result} onAgain={()=>play(name)} onHome={()=>setScreen('home')}/>}
  </>);
}
