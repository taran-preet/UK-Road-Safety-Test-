'use client';
export default function Hud({name,left,score}){
  return(<div className="hud">
    <span className="hud-name">{name}</span>
    <span className="hud-box"><small>Time</small><b>{left}s</b></span>
    <span className="hud-box"><small>Score</small><b>{score}</b></span>
  </div>);
}
