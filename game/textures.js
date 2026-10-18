import * as THREE from 'three';
const tex=(w,h,draw,rx=1,ry=1)=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t};
const noise=(g,w,h,n,cols,a=.4)=>{g.globalAlpha=a;for(let i=0;i<n;i++){g.fillStyle=cols[i%cols.length];g.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*2)}g.globalAlpha=1};
export const asphalt=ry=>tex(256,256,(g,w,h)=>{g.fillStyle='#4d5054';g.fillRect(0,0,w,h);noise(g,w,h,7000,['#555','#222','#707070','#2a2a2a']);
  g.fillStyle='rgba(0,0,0,.16)';[.14,.3,.64,.8].forEach(p=>g.fillRect(w*p,0,16,h))},1,ry);
export const paving=ry=>tex(128,128,(g,w,h)=>{g.fillStyle='#8a8c8a';g.fillRect(0,0,w,h);noise(g,w,h,2500,['#777','#9a9c9a','#666']);
  g.strokeStyle='#6b6d6b';g.strokeRect(0,0,w,h);g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2,h);g.stroke()},1,ry);
export const grass=()=>tex(128,128,(g,w,h)=>{g.fillStyle='#5e8a3a';g.fillRect(0,0,w,h);noise(g,w,h,3000,['#4e7a30','#72a04a','#58843a'],.6)},30,6);
export const hedgeTex=()=>tex(128,128,(g,w,h)=>{g.fillStyle='#2f5224';g.fillRect(0,0,w,h);noise(g,w,h,3500,['#244a1c','#3f6b2c','#1d3c16','#4d7d35'],.7)},8,1);
export const facade=brick=>tex(256,256,(g,w,h)=>{g.fillStyle=brick;g.fillRect(0,0,w,h);
  for(let y=0;y<h;y+=8){g.fillStyle='rgba(235,225,210,.3)';g.fillRect(0,y,w,1);for(let x=(y/8%2)*8;x<w;x+=16)g.fillRect(x,y,1,8)}
  noise(g,w,h,2500,['#000000','#ffffff'],.12);
  const win=(x,y)=>{g.fillStyle='#ecece6';g.fillRect(x-4,y-4,48,64);const k=g.createLinearGradient(0,y,0,y+56);k.addColorStop(0,'#5d7184');k.addColorStop(1,'#1f2a34');g.fillStyle=k;g.fillRect(x,y,40,56);g.fillStyle='#ecece6';g.fillRect(x+19,y,2,56);g.fillRect(x,y+26,40,2)};
  win(40,36);win(176,36);win(40,150);win(176,150);g.fillStyle='#223a2f';g.fillRect(108,170,40,86);g.fillStyle='#ecece6';g.fillRect(104,164,48,6)});

export const leafTex=()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),cols=['#1f4a1a','#2d6a22','#3b8a2b','#4da038','#6cb84a','#245a1d'];
  for(let i=0;i<420;i++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*112;g.save();g.translate(128+Math.cos(a)*r,128+Math.sin(a)*r*.9);g.rotate(Math.random()*6.28);
    g.fillStyle=cols[Math.random()*cols.length|0];g.beginPath();g.ellipse(0,0,9+Math.random()*6,4+Math.random()*3,0,0,6.28);g.fill();g.restore()}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t};
export const barkTex=()=>tex(64,128,(g,w,h)=>{g.fillStyle='#4a3b2e';g.fillRect(0,0,w,h);g.globalAlpha=.6;for(let i=0;i<120;i++){g.fillStyle=i%2?'#352a20':'#5d4a39';g.fillRect(Math.random()*w,0,1+Math.random()*3,h)}g.globalAlpha=1},1,2);
