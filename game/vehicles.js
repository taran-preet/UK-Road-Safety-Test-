import * as THREE from 'three';
export const COLORS=['#e8eaec','#f4f4f2','#16213a','#8f1d1d','#2a2d31','#8b9097','#2f5d3a','#c9b68a','#b4bac2','#1b3b6b','#c9cdd2'];
const B=new THREE.BoxGeometry(1,1,1),C=new THREE.CylinderGeometry(1,1,1,22),P=new THREE.SphereGeometry(1,14,10),T=new THREE.TorusGeometry(.34,.035,6,20),Q=new THREE.PlaneGeometry(1,1),D=new THREE.CircleGeometry(1,22);
const S=o=>new THREE.MeshStandardMaterial(o),PH=o=>new THREE.MeshPhysicalMaterial(o);
const glass=PH({color:'#0b1620',metalness:.2,roughness:.05,envMapIntensity:2,clearcoat:1,side:THREE.DoubleSide}),
  tyre=S({color:'#111',roughness:.95}),rim=S({color:'#c6cbd0',metalness:1,roughness:.22}),dark=S({color:'#1a1d22',roughness:.7}),
  tail=S({color:'#7a0000',emissive:'#ff1a1a',emissiveIntensity:.9}),lamp=S({color:'#f4f8ff',emissive:'#dfe9ff',emissiveIntensity:.6,roughness:.2}),
  chrome=S({color:'#b0b6bc',metalness:1,roughness:.25}),vest=S({color:'#d6e23a',emissive:'#8a9a10',emissiveIntensity:.3}),
  amberOn=S({color:'#ffb000',emissive:'#ffb000',emissiveIntensity:1}),hit=new THREE.MeshBasicMaterial({visible:false});
const cv=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t};
const letter=()=>String.fromCharCode(65+Math.random()*25|0);
const plate=y=>S({roughness:.5,map:cv(128,32,(g,w,h)=>{g.fillStyle=y?'#f2c400':'#f5f5f5';g.fillRect(0,0,w,h);g.fillStyle='#111';g.font='bold 22px Arial';g.textAlign='center';
  g.fillText(letter()+letter()+(10+Math.random()*60|0)+' '+letter()+letter()+letter(),64,25)})});
const plF=[0,1,2,3].map(()=>plate(0)),plR=[0,1,2,3].map(()=>plate(1));
const cargoM=S({roughness:.6,map:cv(256,128,(g,w,h)=>{g.fillStyle='#e6e6e0';g.fillRect(0,0,w,h);g.fillStyle='rgba(0,0,0,.08)';for(let x=0;x<w;x+=16)g.fillRect(x,0,2,h);g.fillStyle='#8a929a';g.fillRect(0,h-14,w,14)})});
const shadow=(()=>{const t=cv(64,64,g=>{const r=g.createRadialGradient(32,32,2,32,32,32);r.addColorStop(0,'rgba(0,0,0,.7)');r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64)});
  return new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,opacity:.5})})();
const add=(g,geo,m,x,y,z,sx=1,sy=1,sz=1)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);g.add(o);return o};
const gm=(g,geo,m)=>g.add(new THREE.Mesh(geo,m));
const prof=(pts,w,bev=.05)=>{const sh=new THREE.Shape();pts.forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));
  const d=Math.max(w-2*bev,.05),g=new THREE.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelSize:bev,bevelThickness:bev,bevelSegments:3});
  g.translate(0,0,-d/2);g.rotateY(Math.PI/2);return g};
const quad=(a,b,c,d)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...b,...c,...d],3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();return g};
const wheel=(g,x,y,z,r,w)=>{const s=Math.sign(x)||1,o=x+s*.04;
  add(g,C,tyre,o,y,z,r,w,r).rotation.z=Math.PI/2;
  add(g,C,rim,o+s*(w/2+.003),y,z,r*.68,.02,r*.68).rotation.z=Math.PI/2;
  add(g,C,chrome,o+s*(w/2+.014),y,z,r*.2,.02,r*.2).rotation.z=Math.PI/2;
  add(g,D,dark,s*(Math.abs(x)+.07-.04+.002),y,z,r*1.14,r*1.14,1).rotation.y=s*Math.PI/2};
const wheelS=(g,x,y,z,r,w)=>{add(g,C,tyre,x,y,z,r,w,r).rotation.z=Math.PI/2};

export function makeVehicle(type,colour=COLORS[Math.random()*COLORS.length|0]){
  const g=new THREE.Group(),paint=PH({color:colour,metalness:.35,roughness:.35,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.1});
  const mk=()=>S({color:'#5a3a00',emissive:'#ffb000',emissiveIntensity:0}),ind={1:mk(),'-1':mk()};
  const lights=(zr,zf,y,lw,w,zs)=>{for(const s of[-1,1]){add(g,B,tail,s*lw,y,zr,.34,.14,.05);add(g,B,ind[s],s*(lw+.27),y,zr,.2,.12,.05);
    add(g,B,lamp,s*lw,y,zf,.34,.14,.05);add(g,B,ind[s],s*(lw+.27),y,zf,.2,.12,.05);add(g,B,ind[s],s*(w/2+.012),y,zs,.04,.1,.28)}};
  const plates=(y,zf,zr)=>{const f=add(g,Q,plF[Math.random()*4|0],0,y,zf,.52,.12,1);f.rotation.y=Math.PI;add(g,Q,plR[Math.random()*4|0],0,y,zr,.52,.12,1)};
  let w,h,l;
  if(type==='car'||type==='suv'){const k=type==='suv',br=['honda','toyota','hyundai','tesla'][Math.random()*4|0],tes=br==='tesla',gh=k?.38:.28,bh=k?1.1:.95,roof=k?1.78:1.42,wr=k?.4:.33;w=k?1.9:1.75;h=roof+.02;l=k?4.5:4.1;
    gm(g,prof([[-l/2,gh],[-l/2,bh*.82],[-l/2+.14,bh],[-l*.3,bh+.03],[l*.18,bh+.02],[l/2-.45,bh-(tes?.12:.04)],[l/2-.08,bh*(tes?.68:.8)],[l/2,bh*(tes?.5:.62)],[l/2,gh]],w,.06),paint);
    gm(g,prof(tes?[[-l*.36,bh],[-l*.18,roof],[l*.02,roof],[l*.26,bh]]:[[-l*.3,bh],[-l*.19,roof],[l*.05,roof],[l*.24,bh]],w*.86,.03),glass);
    if(!tes)gm(g,prof([[-l*.2,roof-.03],[l*.06,roof-.03],[l*.06,roof+.015],[-l*.2,roof+.015]],w*.84,.015),paint);
    const fz=-l/2-.012,ly=bh*.72;
    for(const s of[-1,1]){for(const z of[-l*.31,l*.31])wheel(g,s*(w/2-.1),wr,z,wr,.22);add(g,B,paint,s*(w/2+.06),bh+.12,-l*.2,.1,.08,.16);
      if(!tes)add(g,B,chrome,s*(w/2+.005),bh+.02,0,.01,.025,l*.5);
      add(g,B,lamp,s*w*.34,ly,-l/2-.01,tes?.3:br==='hyundai'?.3:.36,tes?.06:br==='hyundai'?.07:.11,.04);
      if(!tes)add(g,B,tail,s*w*.36,bh*.86,l/2+.01,.36,.1,.04)}
    if(tes)add(g,B,tail,0,bh*.86,l/2+.012,w*.78,.05,.03);
    if(br==='honda'){add(g,B,chrome,0,bh*.66,fz,w*.5,.035,.02);add(g,B,dark,0,gh+.3,fz,w*.5,.12,.02)}
    if(br==='toyota'){add(g,B,dark,0,gh+.22,fz,w*.62,.15,.02);add(g,B,chrome,0,bh*.68,fz,w*.4,.03,.02);add(g,B,dark,0,bh*.6,fz,w*.4,.07,.02)}
    if(br==='hyundai'){add(g,B,dark,0,gh+.28,fz,w*.62,.2,.02);add(g,B,lamp,0,ly,fz,w*.8,.025,.02)}
    if(tes)add(g,B,dark,0,gh+.1,fz,w*.4,.07,.02);
    if(!tes){const b=add(g,D,chrome,0,bh*.6,fz-.004,.05,.05,1);b.rotation.y=Math.PI}
    add(g,B,dark,0,gh+.05,-l/2+.02,w*.92,.12,.06);add(g,B,dark,0,gh+.05,l/2-.02,w*.92,.12,.06);
    lights(l/2,-l/2,bh*.7,w*.34,w,-l*.3);plates(gh+.22,-l/2-.03,l/2+.03);
  }else if(type==='van'){w=2;h=2.6;l=5.4;
    gm(g,prof([[-2.7,.4],[-2.7,2.4],[-2.58,2.52],[.9,2.52],[1.55,1.62],[2.25,1.35],[2.7,1.1],[2.7,.4]],w,.08),paint);
    gm(g,quad([-.88,2.49,-.94],[.88,2.49,-.94],[.88,1.68,-1.54],[-.88,1.68,-1.54]),glass);
    for(const s of[-1,1]){const x=s*(w/2+.012);gm(g,quad([x,2.36,-.95],[x,2.36,-1.4],[x,1.72,-1.5],[x,1.72,-.9]),glass);
      for(const z of[-1.8,1.7])wheel(g,s*(w/2-.1),.38,z,.38,.25);add(g,B,dark,s*(w/2+.15),1.9,-1.55,.1,.3,.1)}
    add(g,B,dark,0,.55,-l/2+.02,w*.95,.2,.08);lights(l/2,-l/2,.9,.7,w,-2.2);plates(.72,-l/2-.04,l/2+.03);
  }else if(type==='truck'){w=2;h=3.4;l=8;
    gm(g,prof([[4,.55],[4,1.55],[3.75,1.95],[3.1,3.05],[2.15,3.05],[2.15,.55]],w,.06),paint);
    gm(g,quad([-.85,3.0,-3.14],[.85,3.0,-3.14],[.85,2.0,-3.74],[-.85,2.0,-3.74]),glass);
    add(g,B,cargoM,0,2.2,1.15,w+.1,2.5,5.7);add(g,B,dark,0,.65,0,w*.85,.3,l*.97);
    for(const s of[-1,1]){const x=s*(w/2+.012);gm(g,quad([x,2.95,-2.4],[x,2.95,-3.05],[x,2.1,-3.55],[x,2.1,-2.4]),glass);add(g,B,dark,s*(w/2+.2),2.4,-3.1,.12,.4,.1);
      for(const z of[-3,2.2,3.1])wheel(g,s*(w/2-.1),.5,z,.5,.3)}
    add(g,B,dark,0,.8,-4.03,w*.95,.22,.1);lights(4.02,-4.02,.9,.75,w,-3.3);plates(.8,-4.1,4.06);
  }else if(type==='bus'){w=2.5;h=3.2;l=10.5;
    gm(g,prof([[-5.25,.35],[-5.25,2.95],[-5.1,3.12],[5,3.12],[5.25,2.95],[5.25,.35]],w,.1),paint);
    gm(g,quad([-1.1,2.8,-5.38],[1.1,2.8,-5.38],[1.1,1.35,-5.38],[-1.1,1.35,-5.38]),glass);gm(g,quad([-1,2.7,5.38],[1,2.7,5.38],[1,1.8,5.38],[-1,1.8,5.38]),glass);
    add(g,B,amberOn,0,2.95,-5.4,w*.6,.16,.03);
    for(const s of[-1,1]){const x=s*(w/2+.012);gm(g,quad([x,2.7,-4.6],[x,2.7,4.6],[x,1.45,4.6],[x,1.45,-4.6]),glass);for(const z of[-3.6,3.4])wheel(g,s*(w/2-.1),.5,z,.5,.3)}
    add(g,B,dark,0,.45,-l/2,w*.95,.2,.06);lights(5.26,-5.26,.8,.9,w,-4.4);plates(.7,-5.42,5.42);
  }else if(type==='moto'){w=.7;h=1.8;l=2.1;
    wheelS(g,0,.32,-.75,.32,.12);wheelS(g,0,.32,.75,.32,.12);add(g,B,dark,0,.65,0,.3,.4,1.1);add(g,B,paint,0,.9,-.15,.34,.25,.5);
    add(g,B,dark,0,1.3,.1,.4,.6,.3);for(const s of[-1,1])add(g,B,dark,s*.2,.85,.05,.14,.6,.25);
    add(g,P,paint,0,1.75,.05,.17,.19,.17);add(g,B,tail,0,.8,1.03,.12,.1,.05);add(g,B,lamp,0,.95,-1,.14,.14,.05);
  }else{w=.6;h=1.8;l=1.8;
    for(const z of[-.55,.55])add(g,T,dark,0,.36,z).rotation.y=Math.PI/2;
    add(g,B,chrome,0,.6,0,.04,.04,1.1);add(g,B,vest,0,1.2,.1,.36,.55,.28);for(const s of[-1,1])add(g,B,dark,s*.12,.7,.05,.1,.6,.12);
    add(g,P,dark,0,1.68,.05,.13,.13,.13);add(g,B,tail,0,.8,.85,.08,.08,.04);
  }
  add(g,Q,shadow,0,.03,0,w*1.5,l*1.25,1).rotation.x=-Math.PI/2;
  const proxy=add(g,B,hit,0,h/2,0,Math.max(w*1.4,1.5),h*1.2,l*1.1);
  g.userData={ind,proxy,w,h,l};return g;
}
export const flash=(g,s,on)=>{if(!s)return;const m=g.userData.ind[s];m.emissiveIntensity=on?4:0;m.color.set(on?'#ffb000':'#5a3a00')};
