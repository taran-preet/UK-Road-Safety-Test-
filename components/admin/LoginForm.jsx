'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
export default function LoginForm(){
  const router=useRouter();
  const [email,setEmail]=useState(''),[pw,setPw]=useState(''),[show,setShow]=useState(false),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
  const submit=async e=>{
    e.preventDefault();setErr('');
    if(!/^\S+@\S+\.\S+$/.test(email.trim()))return setErr('Enter a valid email address.');
    if(!pw)return setErr('Enter your password.');
    setBusy(true);
    try{
      const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim(),password:pw})});
      const d=await r.json().catch(()=>({}));
      if(!r.ok){setErr(d.error||'Login failed.');setBusy(false);return}
      router.replace('/admin/dashboard');router.refresh();
    }catch{setErr('Network error. Please try again.');setBusy(false)}
  };
  return(<main className="start"><form className="start-card" onSubmit={submit} noValidate>
    <span className="plate">Admin</span><h1>Admin Login</h1>
    <p>Sign in to view candidate test results.</p>
    <label htmlFor="e">Email</label>
    <input id="e" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com"/>
    <label htmlFor="p">Password</label>
    <div className="pw"><input id="p" type={show?'text':'password'} autoComplete="current-password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password"/>
      <button type="button" className="eye" onClick={()=>setShow(s=>!s)} aria-label={show?'Hide password':'Show password'}>{show?'Hide':'Show'}</button></div>
    {err&&<div className="adm-err" role="alert">{err}</div>}
    <button className="btn" disabled={busy}>{busy?'Signing in…':'Login'}</button>
  </form></main>);
}
