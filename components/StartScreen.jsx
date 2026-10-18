'use client';
import {useState} from 'react';
export default function StartScreen({onStart}){
  const [name,setName]=useState('');
  const go=e=>{e.preventDefault();if(name.trim())onStart(name.trim())};
  return(
    <main className="start">
      <form className="start-card" onSubmit={go}>
        <span className="plate">Hazard Perception</span>
        <h1>UK Road Hazard Perception Test</h1>
        <p>You are the driver. Watch the road for hazards that develop or come in between, and click the vehicle as soon as you would need to take action. 60 second exam test.</p>
        <label htmlFor="n">Your name</label>
        <input id="n" value={name} maxLength={24} autoFocus autoComplete="off" onChange={e=>setName(e.target.value)} placeholder="Enter your name"/>
        <button className="btn" disabled={!name.trim()}>Start Test</button>
      </form>
    </main>);
}