import * as THREE from 'three';
import {asphalt,paving,grass,hedgeTex,facade,leafTex,barkTex} from './textures';
import {makeVehicle} from './vehicles';
import {R,pick} from './util';
export const L=36,CAM_X=-1.6;
const box=new THREE.BoxGeometry(1,1,1),cyl=new THREE.CylinderGeometry(1,1,1,10),ico=new THREE.IcosahedronGeometry(1,1),
  pl=new THREE.PlaneGeometry(1,1),sph=new THREE.SphereGeometry(1,10,8),tri=new THREE.CylinderGeometry(1,1,1,3),
  roofG=new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-6,0),new THREE.Vector2(6,0),new THREE.Vector2(0,3.4)]),{depth:9,bevelEnabled:false});
const S=(c,r=.9)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
const M={road:new THREE.MeshStandardMaterial({map:asphalt(L/6),roughness:.95}),pave:new THREE.MeshStandardMaterial({map:paving(L/3),roughness:.95}),
  grass:new THREE.MeshStandardMaterial({map:grass(),roughness:1}),hedge:new THREE.MeshStandardMaterial({map:hedgeTex(),roughness:1}),
  kerb:S('#a6a8a6'),white:S('#e9e9e4',.8),yellow:S('#d8b712',.8),black:S('#18181a'),side:S('#4d5054',.95),trunk:S('#4a3b2e'),
  pole:S('#70777c',.5),brick:S('#7b4634'),red:S('#c61f1b'),skin:S('#c79a7c'),
  slate:new THREE.MeshStandardMaterial({color:'#38404a',roughness:.8,side:THREE.DoubleSide}),
  orb:new THREE.MeshStandardMaterial({color:'#f59a00',emissive:'#f59a00',emissiveIntensity:.6})};
const bark=new THREE.MeshStandardMaterial({map:barkTex(),roughness:1}),trunkG=new THREE.CylinderGeometry(.6,1,1,8).translate(0,.5,0);
const crownG=n=>{const P=[],N=[],U=[],I=[];for(let i=0;i<n;i++){const s=R(2.4,4),c=new THREE.Vector3(R(-1,1),R(-.8,.9),R(-1,1)).normalize().multiplyScalar(R(.3,1)*2.1);c.y*=.8;
  const m=new THREE.Matrix4().compose(c,new THREE.Quaternion().setFromEuler(new THREE.Euler(R(-.7,.7),R(0,6.28),R(-.5,.5))),new THREE.Vector3(s,s,1));
  [[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].forEach(([x,y])=>{const v=new THREE.Vector3(x,y,0).applyMatrix4(m),q=v.clone().add(new THREE.Vector3(0,.3,0)).normalize();P.push(v.x,v.y,v.z);N.push(q.x,q.y,q.z);U.push(x+.5,y+.5)});
  I.push(i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(I);return g};
const crowns=[0,1,2].map(()=>crownG(34)),leaves=[leafTex(),leafTex()];
const crownM=['#ffffff','#e6f3c8','#cfe3b0','#f2ffd8'].map((c,i)=>new THREE.MeshStandardMaterial({map:leaves[i%2],color:c,alphaTest:.5,side:THREE.DoubleSide,roughness:1}));
const greens=['#3f7a2e','#4d8c35','#5e9c3e','#386f29','#6aa845'].map(c=>S(c,1));
const walls=['#8a4a35','#98583f','#7c412f','#b9ab92'].map(c=>new THREE.MeshStandardMaterial({map:facade(c),roughness:.9}));
const clothes=['#2a3f6b','#7a2a2a','#2f5a4a','#555','#c9c9c0'].map(c=>S(c));
const mesh=(p,g,m,x,y,z,sx=1,sy=1,sz=1)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);p.add(o);return o};
const flat=(p,m,x,y,z,w,d)=>{const o=mesh(p,pl,m,x,y,z,w,d,1);o.rotation.x=-Math.PI/2;return o};

const tree=(p,x,z,big)=>{const k=big?1.5:1,h=big?7:4.6;mesh(p,trunkG,bark,x,0,z,.28*k,h+1.5*k,.28*k);const cr=mesh(p,crowns[Math.random()*3|0],pick(crownM),x,h+1.4*k,z,k*R(.95,1.2),k*R(.9,1.1),k*R(.95,1.2));cr.rotation.y=R(0,6.28);return;
  for(let i=0;i<5;i++){const r=R(1.8,2.8)*k;mesh(p,ico,pick(greens),x+R(-1.6,1.6)*k,h+R(-.5,2.2)*k,z+R(-1.6,1.6)*k,r,r*.85,r)}};
const house=(p,s,z)=>{const m=Array(6).fill(M.brick);m[s>0?1:0]=pick(walls);const cx=s*22.5;
  mesh(p,box,m,cx,3.5,z,9,7,11);const r=mesh(p,roofG,M.slate,cx-4.5,7,z);r.rotation.y=Math.PI/2;mesh(p,box,M.brick,cx,8.8,z+3,1,2,1)};
const person=(p,x,z)=>{mesh(p,cyl,M.black,x,.54,z,.1,.8,.1);mesh(p,cyl,pick(clothes),x,1.26,z,.2,.65,.14);mesh(p,sph,M.skin,x,1.75,z,.12,.12,.12)};
const lamp=(p,s,z)=>{mesh(p,cyl,M.pole,s*5.5,4,z,.09,8,.09);mesh(p,box,M.pole,s*4.4,8,z,2.4,.08,.08);mesh(p,box,M.black,s*3.3,7.9,z,.9,.12,.35)};
const sign=(p,s,z)=>{mesh(p,cyl,M.pole,s*7.2,1.6,z,.04,3.2,.04);
  mesh(p,tri,M.red,s*7.2,3.1,z,.6,.04,.6).rotation.x=-Math.PI/2;mesh(p,tri,S('#f2f2f2'),s*7.2,3.1,z+.03,.42,.04,.42).rotation.x=-Math.PI/2};

export function buildChunk(z0){
  const g=new THREE.Group();g.position.z=z0;
  const sr=Math.random()<.5?pick([-1,1]):0,cross=!sr&&Math.random()<.14;
  flat(g,M.grass,0,-.01,-L/2,170,L);flat(g,M.road,0,0,-L/2,9.2,L);
  for(let i=0;i<4;i++)flat(g,M.white,0,.012,-4.5-i*9,.14,3);
  const park={'-1':false,1:false};
  if(!park[-1]&&sr!==-1){flat(g,M.yellow,-4.48,.013,-L/2,.09,L);flat(g,M.yellow,-4.32,.013,-L/2,.09,L)}
  if(cross){for(let i=-4;i<=4;i++)flat(g,M.white,i*1.05,.013,-L/2,.5,3.6);
    for(const s of[-1,1]){mesh(g,cyl,M.black,s*5.1,1.6,-L/2-2.2,.06,3.2,.06);mesh(g,sph,M.orb,s*5.1,3.3,-L/2-2.2,.2,.2,.2);person(g,s*5.6,-L/2+2.4)}}
  if(sr){flat(g,M.side,sr*18.6,.011,-L/2,28,12);flat(g,M.white,sr*5.3,.013,-L/2,.3,11.6)}
  for(const s of[-1,1]){
    const ok=z=>s!==sr||Math.abs(z+L/2)>9,wall=Math.random()<.5;
    for(const[a,b]of s===sr?[[0,-L/2+6],[-L/2-6,-L]]:[[0,-L]]){const c=(a+b)/2,len=a-b;
      mesh(g,box,M.kerb,s*4.75,.07,c,.3,.14,len);flat(g,M.pave,s*6.5,.142,c,3.2,len);
      mesh(g,box,wall?M.brick:M.hedge,s*8.6,wall?.5:.85,c,.6,wall?1:1.7,len)}
    for(const z of[-6-R(0,3),-24-R(0,3)])if(ok(z))tree(g,s*R(6.2,6.9),z);
    for(const z of[-9,-27])if(ok(z)){house(g,s,z+R(-2,2));if(Math.random()<.5)tree(g,s*R(11,15),z+R(-4,4),true)}
    if(Math.random()<.3){const z=-R(4,30);if(ok(z))person(g,s*R(5.4,7.2),z)}
  }
  lamp(g,pick([-1,1]),-R(8,28));if(Math.random()<.2)sign(g,pick([-1,1]),-R(6,30));
  if(Math.random()<.5){const s=pick([-1,1]);for(let i=0;i<9;i++){const z=-2-i*3.8;if(s!==sr||Math.abs(z+L/2)>7)mesh(g,cyl,M.black,s*5.05,.6,z,.07,.9,.07)}}
  return{g,sr,z0,used:false};
}
