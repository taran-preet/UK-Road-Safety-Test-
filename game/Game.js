// import * as THREE from "three";
// import { L, CAM_X, buildChunk } from "./world";
// import { makeVehicle, flash } from "./vehicles";
// import { R, pick, shuffle } from "./util";

// const V0 = 9.5,
//   DURATION = 60,
//   OB = 1.75,
//   DEAD_GAP = 13,
//   NC = 9,
//   PTS = 30;
// const ease = (u) => u * u * (3 - 2 * u);
// const car = {
//   t: "car",
//   xt: CAM_X,
//   vz0: 0,
//   vze: -6,
//   D: 3.2,
//   delay: 2.6,
//   trig: 56,
//   sg: 125,
//   ind: 1,
// };
// const jn = {
//   t: "car",
//   xt: CAM_X,
//   vz0: -0.4,
//   vze: -7,
//   D: 3.2,
//   delay: 2.5,
//   trig: 62,
//   sg: 100,
//   ind: 0,
// };
// const SPEC = {
//   parkedCar: { ...car, x0: -3.6 },
//   parkedTruck: {
//     ...car,
//     t: "truck",
//     x0: -3.55,
//     D: 4,
//     delay: 3,
//     trig: 64,
//     vze: -4.5,
//   },
//   junctionR: jn,
//   junctionL: jn,
//   moto: {
//     t: "moto",
//     xt: CAM_X,
//     vz0: -0.3,
//     vze: -9,
//     D: 2.4,
//     delay: 1.5,
//     trig: 56,
//     sg: 100,
//     ind: 0,
//   },
//   cyclist: {
//     t: "bike",
//     x0: -3.95,
//     xt: -2.45,
//     vz0: -4,
//     vze: -4,
//     D: 2.2,
//     delay: 0.8,
//     trig: 42,
//     sg: 80,
//     ind: 0,
//   },
// };
// const angDiff = (d) => Math.atan2(Math.sin(d), Math.cos(d));
// const sky = () => {
//   const c = document.createElement("canvas");
//   c.width = 512;
//   c.height = 256;
//   const g = c.getContext("2d"),
//     k = g.createLinearGradient(0, 0, 0, 256);
//   k.addColorStop(0, "#2f7fd8");
//   k.addColorStop(0.5, "#9fcdf2");
//   k.addColorStop(0.75, "#d4e8f5");
//   k.addColorStop(1, "#d4e8f5");
//   g.fillStyle = k;
//   g.fillRect(0, 0, 512, 256);
//   for (let i = 0; i < 14; i++) {
//     const x = Math.random() * 480,
//       y = 20 + Math.random() * 80;
//     for (let j = 0; j < 6; j++) {
//       const cx = x + j * 14,
//         r = g.createRadialGradient(cx, y, 2, cx, y, 26);
//       r.addColorStop(0, "rgba(255,255,255,.85)");
//       r.addColorStop(1, "rgba(255,255,255,0)");
//       g.fillStyle = r;
//       g.fillRect(cx - 30, y - 30, 60, 60);
//     }
//   }
//   const t = new THREE.CanvasTexture(c);
//   t.colorSpace = THREE.SRGBColorSpace;
//   return t;
// };

// const envMap=r=>{const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d'),k=g.createLinearGradient(0,0,0,256);
//   k.addColorStop(0,'#3d86d6');k.addColorStop(.45,'#bfe0f7');k.addColorStop(.5,'#e9f2f8');k.addColorStop(.52,'#6f7a63');k.addColorStop(1,'#4a5240');g.fillStyle=k;g.fillRect(0,0,512,256);
//   const s=g.createRadialGradient(150,70,2,150,70,40);s.addColorStop(0,'rgba(255,250,230,1)');s.addColorStop(1,'rgba(255,250,230,0)');g.fillStyle=s;g.fillRect(100,20,100,100);
//   const t=new THREE.CanvasTexture(c);t.mapping=THREE.EquirectangularReflectionMapping;t.colorSpace=THREE.SRGBColorSpace;
//   const pm=new THREE.PMREMGenerator(r),e=pm.fromEquirectangular(t).texture;pm.dispose();return e};
// export default class Game {
//   constructor(el, cb) {
//     Object.assign(this, {
//       el,
//       cb,
//       tm: 0,
//       t: 0,
//       score: 0,
//       hits: 0,
//       misses: 0,
//       speed: V0,
//       cz: 0,
//       V: [],
//       H: [],
//       running: true,
//       ls: -1,
//       lsc: -1,
//       tOnc: 1,
//       tAhead: 5,
//     });
//     const w = el.clientWidth,
//       h = el.clientHeight;
//     this.r = new THREE.WebGLRenderer({
//       antialias: true,
//       logarithmicDepthBuffer: true,
//     });
//     this.r.setPixelRatio(Math.min(devicePixelRatio, 2));
//     this.r.setSize(w, h);
//     this.r.shadowMap.enabled=true;this.r.shadowMap.type=THREE.PCFSoftShadowMap;this.r.toneMapping = THREE.ACESFilmicToneMapping;
//     this.r.toneMappingExposure = 1.1;
//     el.appendChild(this.r.domElement);
//     const sc = (this.scene = new THREE.Scene());
//     sc.background = sky();sc.environment=envMap(this.r);
//     sc.fog = new THREE.Fog("#d4e8f5", 90, 300);
//     sc.add(new THREE.HemisphereLight("#cfe6ff", "#7a8a5a", 0.7));
//     const sun = new THREE.DirectionalLight("#fff6e0", 2.6);
//     this.sun=sun;sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sh=sun.shadow.camera;sh.left=sh.bottom=-34;sh.right=sh.top=34;sh.near=1;sh.far=140;sun.shadow.bias=-.0004;sun.shadow.normalBias=.04;sc.add(sun,sun.target);
//     this.cam = new THREE.PerspectiveCamera(60, w / h, 0.2, 420);
//     this.ray = new THREE.Raycaster();
//     this.ch = [];
//     for (let i = 0; i < NC; i++) {
//       const c = buildChunk(L - i * L);
//       this.ch.push(c);this.shade(c.g);
//       sc.add(c.g);
//     }
//     this.far = L - (NC - 1) * L;
//     const base = [
//       "parkedCar",
//       "parkedCar",
//       "parkedTruck",
//       "junctionR",
//       "junctionR",
//       "junctionL",
//       "junctionL",
//       "junctionR",
//       "junctionL",
//     ];
//     if (Math.random() < 0.5) base[R(0, 9) | 0] = pick(["moto", "cyclist"]);
//     this.plan = shuffle(base).map((kind, i) => ({
//       kind,
//       at: 0.5 + i * 5.4 + R(-0.4, 0.4),
//     }));
//     this.onDown = (e) => this.pick(e);
//     this.onSize = () => {
//       const w = el.clientWidth,
//         h = el.clientHeight;
//       this.r.setSize(w, h);
//       this.cam.aspect = w / h;
//       this.cam.updateProjectionMatrix();
//     };
//     this.r.domElement.addEventListener("pointerdown", this.onDown);
//     addEventListener("resize", this.onSize);
//     this.clock = new THREE.Clock();
//     this.loop = this.loop.bind(this);
//     this.raf = requestAnimationFrame(this.loop);
//   }
//   dispose() {
//     cancelAnimationFrame(this.raf);
//     removeEventListener("resize", this.onSize);
//     this.r.domElement.remove();
//     this.r.dispose();
//   }
//   loop() {
//     this.raf = requestAnimationFrame(this.loop);
//     this.update(Math.min(this.clock.getDelta(), 0.05));
//     this.r.render(this.scene, this.cam);
//   }

//   addV(type, x, z, vz, yaw = 0) {
//     const m = makeVehicle(type);
//     m.position.set(x, 0, z);
//     m.rotation.y = yaw;
//     this.shade(m);this.scene.add(m);
//     const v = { m, vz };
//     m.userData.proxy.userData.v = v;
//     this.V.push(v);
//     return v;
//   }

//   update(dt) {
//     this.tm += dt;
//     if (this.running) {
//       this.t += dt;
//       while (this.plan.length && this.plan[0].at <= this.t) {
//         if (this.blocked()) {
//           for (const p of this.plan) p.at += dt;
//           break;
//         }
//         this.spawnHazard(this.plan.shift().kind);
//       }
//       if (this.t >= DURATION) this.finish();
//     }
//     const left = Math.max(0, Math.ceil(DURATION - this.t));
//     if (left !== this.ls || this.score !== this.lsc) {
//       this.ls = left;
//       this.lsc = this.score;
//       this.cb.onTick({ left, score: this.score });
//     }
//     // player speed: follow any vehicle in our lane ahead
//     let tg = V0;
//     for (const v of this.V) {
//       const gap = this.cz - v.m.position.z;
//       if (gap > 0 && gap < 45 && Math.abs(v.m.position.x - CAM_X) < OB) {
//         const f = Math.max(0, -v.vz) + Math.max(0, gap - 9) * 0.7;
//         tg = Math.min(tg, v.h?.state === "missed" ? Math.max(f, 3) : f);
//       }
//     }
//     tg = Math.max(tg, 3);
//     this.speed +=
//       (tg - this.speed) * Math.min(1, dt * (tg < this.speed ? 2.5 : 0.7));
//     this.cz -= this.speed * dt;
//     const c = this.cam,
//       t = this.tm;
//     c.position.set(
//       CAM_X + Math.sin(t * 0.5) * 0.03,
//       1.25 + Math.sin(t * 8) * 0.004 * (this.speed / V0),
//       this.cz,
//     );
//     c.rotation.set(-0.02, Math.sin(t * 0.4) * 0.004, Math.sin(t * 0.7) * 0.002);this.sun.target.position.set(CAM_X,0,this.cz-24);this.sun.position.set(CAM_X-26,48,this.cz-10);
//     this.ch.forEach((k, i) => {
//       if (k.z0 - L > this.cz + 15) {
//         this.scene.remove(k.g);
//         const n = buildChunk(this.far - L);
//         this.far -= L;
//         this.ch[i] = n;this.shade(n.g);
//         this.scene.add(n.g);
//       }
//     });
//     this.background(dt);
//     for (const v of this.V) if (v.h) this.stepH(v.h, dt);
//     this.sep();
//     for (const v of this.V) v.m.position.z += v.vz * dt;
//     for (const v of this.V) {
//       const gap = this.cz - v.m.position.z,
//         mg = v.m.userData.l / 2 + 2.2;
//       if (gap > 0 && gap < mg && Math.abs(v.m.position.x - CAM_X) < OB)
//         v.m.position.z = this.cz - mg;
//     }
//     this.V = this.V.filter((v) => {
//       const gap = this.cz - v.m.position.z;
//       if (gap < -25 || gap > 400) {
//         this.scene.remove(v.m);
//         return false;
//       }
//       return true;
//     });
//   }
//   background(dt) {
//     const busy = this.H.some(
//       (h) =>
//         ["pending", "dev", "missed"].includes(h.state) && this.V.includes(h.v),
//     );
//     const rightBusy = this.H.some(
//       (h) => ["pending", "dev", "missed"].includes(h.state) && h.s.x0 > 0,
//     );
//     if ((this.tOnc -= dt) <= 0) {
//       this.tOnc = R(2.2, 5);
//       if (!rightBusy && this.free(1.7, this.cz - 170, 2, 22)) this.addOnc();
//     }
//     if ((this.tAhead -= dt) <= 0) {
//       this.tAhead = R(7, 12);
//       if (!busy && this.free(CAM_X, this.cz - 70, 2.5, 20))
//         this.addV(
//           pick(["car", "car", "car", "suv"]),
//           CAM_X,
//           this.cz - 70,
//           -V0 * R(0.97, 1.1),
//         );
//     }
//   }
//   addOnc() {
//     const t = pick([
//       "car",
//       "car",
//       "car",
//       "car",
//       "suv",
//       "suv",
//       "truck",
//       "bus",
//       "van",
//       "car",
//     ]);
//     this.addV(
//       t,
//       t === "truck" || t === "bus" ? 1.5 : 1.7 + R(-0.1, 0.1),
//       this.cz - 170,
//       R(8, 11),
//       Math.PI,
//     );
//   }
//   blocked() {
//     return this.V.some((q) => {
//       const d = this.cz - q.m.position.z;
//       return (
//         q.m.userData.h > 2.3 &&
//         Math.abs(q.m.position.x - CAM_X) < 1.2 &&
//         d > 0 &&
//         d < 75
//       );
//     });
//   }
//   sep() {
//     const mvf = (q) =>
//       !q.h || ((q.h.state === "dev" || q.h.state === "missed") && q.h.u > 0);
//     for (const dir of [-1, 1]) {
//       const S = (q) => (dir < 0 ? -q.m.position.z : q.m.position.z),
//         F = (q) => (dir < 0 ? -q.vz : q.vz);
//       const g = this.V.filter((q) =>
//         dir < 0 ? q.vz <= 0.05 : q.vz > 0.05,
//       ).sort((a, b) => S(a) - S(b));
//       for (let i = 0; i < g.length; i++)
//         for (let j = i + 1; j < g.length; j++) {
//           const a = g[i],
//             b = g[j],
//             ua = a.m.userData,
//             ub = b.m.userData,
//             both = mvf(a) && mvf(b);
//           if (
//             Math.abs(a.m.position.x - b.m.position.x) >=
//             (ua.w + ub.w) / 2 + (both ? 0.3 : -0.1)
//           )
//             continue;
//           const gap = S(b) - S(a) - (ua.l + ub.l) / 2;
//           if (gap > 14) continue;
//           const ok = Math.max(
//             F(b) + Math.max(gap - 2.5, 0) * 0.8,
//             Math.min(mvf(a) ? 3.5 : 0, F(b)),
//           );
//           if (F(a) > ok) a.vz = dir < 0 ? -ok : ok;
//           if (gap < 1) a.m.position.z += dir < 0 ? 1 - gap : gap - 1;
//         }
//     }
//   }
//   shade(o){o.traverse(m=>{if(!m.isMesh)return;m.receiveShadow=true;m.castShadow=m.geometry.type!=='PlaneGeometry'&&m.material.visible!==false&&!m.material.transparent})}
//   free(x, z, dx, dz) {
//     return !this.V.some(
//       (q) =>
//         Math.abs(q.m.position.x - x) < dx && Math.abs(q.m.position.z - z) < dz,
//     );
//   }
//   clearSpot(x, z0, z1) {
//     for (const k of this.ch)
//       for (const o of k.g.children)
//         if (
//           o.userData.parked &&
//           Math.abs(o.position.x - x) < 2.5 &&
//           k.g.position.z + o.position.z < z0 + 5 &&
//           k.g.position.z + o.position.z > z1 - 5
//         )
//           o.visible = false;
//   }
//   drop(f) {
//     this.V = this.V.filter((q) => {
//       const d = f(q);
//       if (d) this.scene.remove(q.m);
//       return !d;
//     });
//   }
//   spawnHazard(kind) {
//     let k = kind,
//       c = null;
//     if (/^(junction|moto)/.test(k)) {
//       const gp = (q) => this.cz - (q.z0 - L / 2),
//         ok = (q) => q.sr && !q.used && gp(q) > 90 && gp(q) < 150,
//         want = k === "junctionR" ? 1 : k === "junctionL" ? -1 : 0,
//         srt = (a, b) => gp(a) - gp(b);
//       c =
//         this.ch.filter((q) => ok(q) && (!want || q.sr === want)).sort(srt)[0] ||
//         this.ch.filter(ok).sort(srt)[0];
//       if (c) c.used = true;
//       else k = pick(["parkedCar", "parkedTruck"]);
//     }
//     const s = { ...SPEC[k] };
//     let z = this.cz - s.sg,
//       type = s.t,
//       yaw = 0;
//     if (c) {
//       s.x0 = c.sr * 9.5;
//       s.ind = k === "moto" ? 0 : c.sr > 0 ? -1 : 1;
//       z = c.z0 - L / 2;
//       if (k !== "moto") {
//         type = pick(["car", "car", "car", "suv", "suv", "truck", "truck"]);
//         if (type === "truck")
//           Object.assign(s, { D: 4.4, delay: 3, vze: -5.5, trig: 66 });
//       }
//       yaw = Math.atan2(-Math.sign(s.xt - s.x0), 0.4);
//     }
//     if (c) {
//       if (c.sr > 0)
//         this.drop(
//           (q) =>
//             !q.h &&
//             q.vz > 0 &&
//             q.m.position.z < z + 10 &&
//             q.m.position.z > z - 110,
//         );
//     } else {
//       this.clearSpot(s.x0, z + 6, z - (k === "cyclist" ? 80 : 20));
//       this.drop((q) => !q.h && q.vz < 0 && this.cz - q.m.position.z > 30);
//     }
//     const v = this.addV(type, s.x0, z, s.vz0, yaw);
//     const h = {
//       kind: k,
//       s,
//       v,
//       yaw0: yaw,
//       z0: z,
//       state: "pending",
//       u: 0,
//       cue: 0,
//       hold: 0,
//       trig: Math.min(s.trig, this.cz - z - 8),
//     };
//     v.h = h;
//     this.H.push(h);
//   }
//   stepH(h, dt) {
//     const { s, v } = h,
//       m = v.m,
//       gap = this.cz - m.position.z;
//     if (h.state === "pending") {
//       if (h.kind !== "cyclist") v.vz = 0;
//       if (gap <= h.trig) {
//         if (!this.blocked()) {
//           h.state = "dev";
//           h.cue = 0;
//         } else if (gap < DEAD_GAP + 25) h.state = "retreat";
//       }
//       return;
//     }
//     if (h.state === "dev" || h.state === "missed") {
//       h.cue += dt;
//       if (h.cue > s.delay && (gap >= 24 || h.u > 0))
//         h.u = Math.min(1, h.u + dt / s.D);
//       if (h.state === "dev") {
//         if (h.u === 0 && gap < DEAD_GAP + 8) h.state = "retreat";
//         else if (
//           gap <= DEAD_GAP ||
//           (h.u > 0 && Math.abs(m.position.x - CAM_X) < OB)
//         )
//           this.miss(h);
//       }
//       if (
//         h.state === "missed" &&
//         h.u >= 1 &&
//         h.kind === "cyclist" &&
//         (h.hold += dt) > 2.5
//       )
//         h.state = "retreat";
//     } else if (h.state === "retreat") {
//       h.u = Math.max(0, h.u - dt / (s.D * 0.5));
//       if (!h.u) h.state = "done";
//     }
//     const px = m.position.x,
//       x = s.x0 + (s.xt - s.x0) * ease(h.u);
//     m.position.x = x;
//     v.vz =
//       h.state === "missed" && h.u >= 1 && h.kind !== "cyclist"
//         ? Math.max(
//             v.vz - (m.userData.h > 2.3 ? 4 : 2.5) * dt,
//             m.userData.h > 2.3 ? -16 : -14,
//           )
//         : s.vz0 + (s.vze - s.vz0) * ease(h.u);
//     if ((h.state === "retreat" || h.state === "done") && h.kind !== "cyclist")
//       v.vz = Math.max(-6, Math.min(6, (h.z0 - m.position.z) * 2.5));
//     const vx = (x - px) / dt;
//     if (h.state === "retreat" || h.state === "done")
//       m.rotation.y += angDiff(h.yaw0 - m.rotation.y) * Math.min(1, 5 * dt);
//     else if (Math.hypot(vx, v.vz) > 0.15)
//       m.rotation.y +=
//         angDiff(Math.atan2(-vx, -v.vz) - m.rotation.y) * Math.min(1, 6 * dt);
//     flash(
//       m,
//       s.ind,
//       (h.state === "dev" || h.state === "missed") &&
//         h.u < 1 &&
//         Math.sin(this.tm * 9.4) > 0,
//     );
//   }
//   miss(h) {
//     h.state = "missed";
//     if (!this.running) return;
//     this.misses++;
//     this.cb.onMiss();
//   }
//   pick(e) {
//     if (!this.running) return;
//     const r = this.r.domElement.getBoundingClientRect(),
//       px = e.clientX - r.left,
//       py = e.clientY - r.top;
//     this.ray.setFromCamera(
//       new THREE.Vector2((px / r.width) * 2 - 1, -(py / r.height) * 2 + 1),
//       this.cam,
//     );
//     let v = this.ray.intersectObjects(
//         this.V.map((q) => q.m.userData.proxy),
//         false,
//       )[0]?.object.userData.v,
//       best = 1e9;
//     if (!v)
//       for (const q of this.V) {
//         const d = this.cz - q.m.position.z;
//         if (d < 4) continue;
//         const p = q.m.position.clone();
//         p.y += 0.8;
//         p.project(this.cam);
//         const dist = Math.hypot(
//           ((p.x + 1) / 2) * r.width - px,
//           ((1 - p.y) / 2) * r.height - py,
//         );
//         if (
//           dist <
//             Math.max(34, (r.height * 1.4) / d) *
//               (q.h?.state === "dev" ? 2.5 : 1) &&
//           dist < best
//         ) {
//           best = dist;
//           v = q;
//         }
//       }
//     if (v?.h?.state === "dev") {
//       v.h.state = "retreat";
//       this.hits++;
//       this.score += PTS;
//       this.cb.onHit({ x: px, y: py - 30 });
//     }
//   }
//   finish() {
//     this.running = false;
//     this.cb.onEnd({
//       score: this.hits * PTS,
//       hits: this.hits,
//       misses: this.misses,
//     });
//   }
// }

import * as THREE from "three";
import { L, CAM_X, buildChunk } from "./world";
import { makeVehicle, flash } from "./vehicles";
import { R, pick, shuffle } from "./util";

const V0 = 9.5,
  DURATION = 60,
  OB = 1.75,
  DEAD_GAP = 13,
  NC = 9,
  PTS = 30;
const ease = (u) => u * u * (3 - 2 * u);
const car = {
  t: "car",
  xt: CAM_X,
  vz0: 0,
  vze: -6,
  D: 3.2,
  delay: 2.6,
  trig: 56,
  sg: 125,
  ind: 1,
};
const jn = {
  t: "car",
  xt: CAM_X,
  vz0: -0.4,
  vze: -7,
  D: 3.2,
  delay: 2.5,
  trig: 62,
  sg: 100,
  ind: 0,
};
const SPEC = {
  parkedCar: { ...car, x0: -3.6 },
  parkedTruck: {
    ...car,
    t: "truck",
    x0: -3.55,
    D: 4,
    delay: 3,
    trig: 64,
    vze: -4.5,
  },
  junctionR: jn,
  junctionL: jn,
  moto: {
    t: "moto",
    xt: CAM_X,
    vz0: -0.3,
    vze: -9,
    D: 2.4,
    delay: 1.5,
    trig: 56,
    sg: 100,
    ind: 0,
  },
  cyclist: {
    t: "bike",
    x0: -3.95,
    xt: -2.45,
    vz0: -4,
    vze: -4,
    D: 2.2,
    delay: 0.8,
    trig: 42,
    sg: 80,
    ind: 0,
  },
};
const angDiff = (d) => Math.atan2(Math.sin(d), Math.cos(d));
const sky = () => {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d"),
    k = g.createLinearGradient(0, 0, 0, 256);
  k.addColorStop(0, "#2f7fd8");
  k.addColorStop(0.5, "#9fcdf2");
  k.addColorStop(0.75, "#d4e8f5");
  k.addColorStop(1, "#d4e8f5");
  g.fillStyle = k;
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 14; i++) {
    const x = Math.random() * 480,
      y = 20 + Math.random() * 80;
    for (let j = 0; j < 6; j++) {
      const cx = x + j * 14,
        r = g.createRadialGradient(cx, y, 2, cx, y, 26);
      r.addColorStop(0, "rgba(255,255,255,.85)");
      r.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = r;
      g.fillRect(cx - 30, y - 30, 60, 60);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const envMap = (r) => {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d"),
    k = g.createLinearGradient(0, 0, 0, 256);
  k.addColorStop(0, "#3d86d6");
  k.addColorStop(0.45, "#bfe0f7");
  k.addColorStop(0.5, "#e9f2f8");
  k.addColorStop(0.52, "#6f7a63");
  k.addColorStop(1, "#4a5240");
  g.fillStyle = k;
  g.fillRect(0, 0, 512, 256);
  const s = g.createRadialGradient(150, 70, 2, 150, 70, 40);
  s.addColorStop(0, "rgba(255,250,230,1)");
  s.addColorStop(1, "rgba(255,250,230,0)");
  g.fillStyle = s;
  g.fillRect(100, 20, 100, 100);
  const t = new THREE.CanvasTexture(c);
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.colorSpace = THREE.SRGBColorSpace;
  const pm = new THREE.PMREMGenerator(r),
    e = pm.fromEquirectangular(t).texture;
  pm.dispose();
  return e;
};
export default class Game {
  constructor(el, cb) {
    Object.assign(this, {
      el,
      cb,
      tm: 0,
      t: 0,
      score: 0,
      hits: 0,
      misses: 0,
      speed: V0,
      cz: 0,
      V: [],
      H: [],
      running: true,
      ls: -1,
      lsc: -1,
      tOnc: 1,
      tAhead: 5,
    });
    const w = el.clientWidth,
      h = el.clientHeight;
    this.r = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.r.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.r.setSize(w, h);
    this.r.shadowMap.enabled = true;
    this.r.shadowMap.type = THREE.PCFSoftShadowMap;
    this.r.toneMapping = THREE.ACESFilmicToneMapping;
    this.r.toneMappingExposure = 1.1;
    el.appendChild(this.r.domElement);
    const sc = (this.scene = new THREE.Scene());
    sc.background = sky();
    sc.environment = envMap(this.r);
    sc.fog = new THREE.Fog("#d4e8f5", 90, 300);
    sc.add(new THREE.HemisphereLight("#cfe6ff", "#7a8a5a", 0.7));
    const sun = new THREE.DirectionalLight("#fff6e0", 2.6);
    this.sun = sun;
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sh = sun.shadow.camera;
    sh.left = sh.bottom = -34;
    sh.right = sh.top = 34;
    sh.near = 1;
    sh.far = 140;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.04;
    sc.add(sun, sun.target);
    this.cam = new THREE.PerspectiveCamera(60, w / h, 0.2, 420);
    this.ray = new THREE.Raycaster();
    this.ch = [];
    for (let i = 0; i < NC; i++) {
      const c = buildChunk(L - i * L);
      this.ch.push(c);
      this.shade(c.g);
      sc.add(c.g);
    }
    this.far = L - (NC - 1) * L;
    const base = [
      "parkedCar",
      "parkedCar",
      "parkedTruck",
      "junctionR",
      "junctionR",
      "junctionL",
      "junctionL",
      "junctionR",
      "junctionL",
    ];
    if (Math.random() < 0.5) base[R(0, 9) | 0] = pick(["moto", "cyclist"]);
    this.plan = shuffle(base).map((kind, i) => ({
      kind,
      at: 0.5 + i * 5.4 + R(-0.4, 0.4),
    }));
    this.onDown = (e) => this.pick(e);
    this.onSize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      this.r.setSize(w, h);
      this.cam.aspect = w / h;
      this.cam.updateProjectionMatrix();
    };
    this.r.domElement.addEventListener("pointerdown", this.onDown);
    addEventListener("resize", this.onSize);
    this.clock = new THREE.Clock();
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }
  dispose() {
    cancelAnimationFrame(this.raf);
    removeEventListener("resize", this.onSize);
    this.r.domElement.remove();
    this.r.dispose();
  }
  loop() {
    this.raf = requestAnimationFrame(this.loop);
    this.update(Math.min(this.clock.getDelta(), 0.05));
    this.r.render(this.scene, this.cam);
  }

  addV(type, x, z, vz, yaw = 0) {
    const m = makeVehicle(type);
    m.position.set(x, 0, z);
    m.rotation.y = yaw;
    this.shade(m);
    this.scene.add(m);
    const v = { m, vz };
    m.userData.proxy.userData.v = v;
    this.V.push(v);
    return v;
  }

  update(dt) {
    this.tm += dt;
    if (this.running) {
      this.t += dt;
      while (this.plan.length && this.plan[0].at <= this.t) {
        if (this.blocked()) {
          for (const p of this.plan) p.at += dt;
          break;
        }
        this.spawnHazard(this.plan.shift().kind);
      }
      if (this.t >= DURATION) this.finish();
    }
    const left = Math.max(0, Math.ceil(DURATION - this.t));
    if (left !== this.ls || this.score !== this.lsc) {
      this.ls = left;
      this.lsc = this.score;
      this.cb.onTick({ left, score: this.score });
    }
    // player speed: follow any vehicle in our lane ahead
    let tg = V0;
    for (const v of this.V) {
      const gap = this.cz - v.m.position.z;
      if (gap > 0 && gap < 45 && Math.abs(v.m.position.x - CAM_X) < OB) {
        const f = Math.max(0, -v.vz) + Math.max(0, gap - 9) * 0.7;
        tg = Math.min(tg, v.h?.state === "missed" ? Math.max(f, 3) : f);
      }
    }
    tg = Math.max(tg, 3);
    this.speed +=
      (tg - this.speed) * Math.min(1, dt * (tg < this.speed ? 2.5 : 0.7));
    this.cz -= this.speed * dt;
    const c = this.cam,
      t = this.tm;
    c.position.set(
      CAM_X + Math.sin(t * 0.5) * 0.03,
      1.25 + Math.sin(t * 8) * 0.004 * (this.speed / V0),
      this.cz,
    );
    c.rotation.set(-0.02, Math.sin(t * 0.4) * 0.004, Math.sin(t * 0.7) * 0.002);
    this.sun.target.position.set(CAM_X, 0, this.cz - 24);
    this.sun.position.set(CAM_X - 26, 48, this.cz - 10);
    this.ch.forEach((k, i) => {
      if (k.z0 - L > this.cz + 15) {
        this.scene.remove(k.g);
        const n = buildChunk(this.far - L);
        this.far -= L;
        this.ch[i] = n;
        this.shade(n.g);
        this.scene.add(n.g);
      }
    });
    this.background(dt);
    for (const v of this.V) if (v.h) this.stepH(v.h, dt);
    this.sep();
    for (const v of this.V) v.m.position.z += v.vz * dt;
    for (const v of this.V) {
      const gap = this.cz - v.m.position.z,
        mg = v.m.userData.l / 2 + 2.2;
      if (gap > 0 && gap < mg && Math.abs(v.m.position.x - CAM_X) < OB)
        v.m.position.z = this.cz - mg;
    }
    this.V = this.V.filter((v) => {
      const gap = this.cz - v.m.position.z;
      if (gap < -25 || gap > 400) {
        this.scene.remove(v.m);
        return false;
      }
      return true;
    });
  }
  background(dt) {
    const busy = this.H.some(
      (h) =>
        ["pending", "dev", "missed"].includes(h.state) && this.V.includes(h.v),
    );
    const rightBusy = this.H.some(
      (h) => ["pending", "dev", "missed"].includes(h.state) && h.s.x0 > 0,
    );
    if ((this.tOnc -= dt) <= 0) {
      this.tOnc = R(2.2, 5);
      if (!rightBusy && this.free(1.7, this.cz - 170, 2, 22)) this.addOnc();
    }
    if ((this.tAhead -= dt) <= 0) {
      this.tAhead = R(7, 12);
      if (!busy && this.free(CAM_X, this.cz - 70, 2.5, 20))
        this.addV(
          pick(["car", "car", "car", "suv"]),
          CAM_X,
          this.cz - 70,
          -V0 * R(0.97, 1.1),
        );
    }
  }
  addOnc() {
    const t = pick([
      "car",
      "car",
      "car",
      "car",
      "suv",
      "suv",
      "truck",
      "bus",
      "van",
      "car",
    ]);
    this.addV(
      t,
      t === "truck" || t === "bus" ? 1.5 : 1.7 + R(-0.1, 0.1),
      this.cz - 170,
      R(8, 11),
      Math.PI,
    );
  }
  blocked(self) {
    const sg = self ? this.cz - self.m.position.z : 0;
    return this.V.some((q) => {
      const d = this.cz - q.m.position.z;
      if (q === self || Math.abs(q.m.position.x - CAM_X) >= 1.2 || d <= 0)
        return false;
      // a vehicle already ahead of me in my lane: the hazard would pull out in front of it, not me
      return self ? d < sg : q.m.userData.h > 2.3 && d < 75;
    });
  }
  sep() {
    const mvf = (q) =>
      !q.h || ((q.h.state === "dev" || q.h.state === "missed") && q.h.u > 0);
    for (const dir of [-1, 1]) {
      const S = (q) => (dir < 0 ? -q.m.position.z : q.m.position.z),
        F = (q) => (dir < 0 ? -q.vz : q.vz);
      const g = this.V.filter((q) =>
        dir < 0 ? q.vz <= 0.05 : q.vz > 0.05,
      ).sort((a, b) => S(a) - S(b));
      for (let i = 0; i < g.length; i++)
        for (let j = i + 1; j < g.length; j++) {
          const a = g[i],
            b = g[j],
            ua = a.m.userData,
            ub = b.m.userData,
            both = mvf(a) && mvf(b);
          if (
            Math.abs(a.m.position.x - b.m.position.x) >=
            (ua.w + ub.w) / 2 + (both ? 0.3 : -0.1)
          )
            continue;
          const gap = S(b) - S(a) - (ua.l + ub.l) / 2;
          if (gap > 14) continue;
          const ok = Math.max(
            F(b) + Math.max(gap - 2.5, 0) * 0.8,
            Math.min(mvf(a) ? 3.5 : 0, F(b)),
          );
          if (F(a) > ok) a.vz = dir < 0 ? -ok : ok;
          if (gap < 1) a.m.position.z += dir < 0 ? 1 - gap : gap - 1;
        }
    }
  }
  shade(o) {
    o.traverse((m) => {
      if (!m.isMesh) return;
      m.receiveShadow = true;
      m.castShadow =
        m.geometry.type !== "PlaneGeometry" &&
        m.material.visible !== false &&
        !m.material.transparent;
    });
  }
  free(x, z, dx, dz) {
    return !this.V.some(
      (q) =>
        Math.abs(q.m.position.x - x) < dx && Math.abs(q.m.position.z - z) < dz,
    );
  }
  clearSpot(x, z0, z1) {
    for (const k of this.ch)
      for (const o of k.g.children)
        if (
          o.userData.parked &&
          Math.abs(o.position.x - x) < 2.5 &&
          k.g.position.z + o.position.z < z0 + 5 &&
          k.g.position.z + o.position.z > z1 - 5
        )
          o.visible = false;
  }
  drop(f) {
    this.V = this.V.filter((q) => {
      const d = f(q);
      if (d) this.scene.remove(q.m);
      return !d;
    });
  }
  spawnHazard(kind) {
    let k = kind,
      c = null;
    if (/^(junction|moto)/.test(k)) {
      const gp = (q) => this.cz - (q.z0 - L / 2),
        ok = (q) => q.sr && !q.used && gp(q) > 90 && gp(q) < 150,
        want = k === "junctionR" ? 1 : k === "junctionL" ? -1 : 0,
        srt = (a, b) => gp(a) - gp(b);
      c =
        this.ch.filter((q) => ok(q) && (!want || q.sr === want)).sort(srt)[0] ||
        this.ch.filter(ok).sort(srt)[0];
      if (c) c.used = true;
      else k = pick(["parkedCar", "parkedTruck"]);
    }
    const s = { ...SPEC[k] };
    let z = this.cz - s.sg,
      type = s.t,
      yaw = 0;
    if (c) {
      s.x0 = c.sr * 9.5;
      s.ind = k === "moto" ? 0 : c.sr > 0 ? -1 : 1;
      z = c.z0 - L / 2;
      if (k !== "moto") {
        type = pick(["car", "car", "car", "suv", "suv", "truck", "truck"]);
        if (type === "truck")
          Object.assign(s, { D: 4.4, delay: 3, vze: -5.5, trig: 66 });
      }
      yaw = Math.atan2(-Math.sign(s.xt - s.x0), 0.4);
    }
    if (c) {
      if (c.sr > 0)
        this.drop(
          (q) =>
            !q.h &&
            q.vz > 0 &&
            q.m.position.z < z + 10 &&
            q.m.position.z > z - 110,
        );
    } else {
      this.clearSpot(s.x0, z + 6, z - (k === "cyclist" ? 80 : 20));
      this.drop((q) => !q.h && q.vz < 0 && this.cz - q.m.position.z > 30);
    }
    const v = this.addV(type, s.x0, z, s.vz0, yaw);
    const h = {
      kind: k,
      s,
      v,
      yaw0: yaw,
      z0: z,
      state: "pending",
      u: 0,
      cue: 0,
      hold: 0,
      trig: Math.min(s.trig, this.cz - z - 8),
    };
    v.h = h;
    this.H.push(h);
  }
  stepH(h, dt) {
    const { s, v } = h,
      m = v.m,
      gap = this.cz - m.position.z;
    if (h.state === "pending") {
      if (h.kind !== "cyclist") v.vz = 0;
      if (gap <= h.trig) {
        if (!this.blocked(h.v)) {
          h.state = "dev";
          h.cue = 0;
        } else if (gap < DEAD_GAP + 25) h.state = "retreat";
      }
      return;
    }
    if (h.state === "dev" || h.state === "missed") {
      h.cue += dt;
      if (h.cue > s.delay && (gap >= 24 || h.u > 0))
        h.u = Math.min(1, h.u + dt / s.D);
      if (h.state === "dev") {
        if (h.u === 0 && gap < DEAD_GAP + 8) h.state = "retreat";
        else if (
          gap <= DEAD_GAP ||
          (h.u > 0 && Math.abs(m.position.x - CAM_X) < OB)
        )
          this.miss(h);
      }
      if (
        h.state === "missed" &&
        h.u >= 1 &&
        h.kind === "cyclist" &&
        (h.hold += dt) > 2.5
      )
        h.state = "retreat";
    } else if (h.state === "retreat") {
      h.u = Math.max(0, h.u - dt / (s.D * 0.5));
      if (!h.u) h.state = "done";
    }
    const px = m.position.x,
      x = s.x0 + (s.xt - s.x0) * ease(h.u);
    m.position.x = x;
    v.vz =
      h.state === "missed" && h.u >= 1 && h.kind !== "cyclist"
        ? Math.max(
            v.vz - (m.userData.h > 2.3 ? 4 : 2.5) * dt,
            m.userData.h > 2.3 ? -16 : -14,
          )
        : s.vz0 + (s.vze - s.vz0) * ease(h.u);
    if ((h.state === "retreat" || h.state === "done") && h.kind !== "cyclist")
      v.vz = Math.max(-6, Math.min(6, (h.z0 - m.position.z) * 2.5));
    const vx = (x - px) / dt;
    if (h.state === "retreat" || h.state === "done")
      m.rotation.y += angDiff(h.yaw0 - m.rotation.y) * Math.min(1, 5 * dt);
    else if (Math.hypot(vx, v.vz) > 0.15)
      m.rotation.y +=
        angDiff(Math.atan2(-vx, -v.vz) - m.rotation.y) * Math.min(1, 6 * dt);
    flash(
      m,
      s.ind,
      (h.state === "dev" || h.state === "missed") &&
        h.u < 1 &&
        Math.sin(this.tm * 9.4) > 0,
    );
  }
  miss(h) {
    h.state = "missed";
    if (!this.running) return;
    this.misses++;
    this.cb.onMiss();
  }
  pick(e) {
    if (!this.running) return;
    const r = this.r.domElement.getBoundingClientRect(),
      px = e.clientX - r.left,
      py = e.clientY - r.top;
    this.ray.setFromCamera(
      new THREE.Vector2((px / r.width) * 2 - 1, -(py / r.height) * 2 + 1),
      this.cam,
    );
    let v = this.ray.intersectObjects(
        this.V.map((q) => q.m.userData.proxy),
        false,
      )[0]?.object.userData.v,
      best = 1e9;
    if (!v)
      for (const q of this.V) {
        const d = this.cz - q.m.position.z;
        if (d < 4) continue;
        const p = q.m.position.clone();
        p.y += 0.8;
        p.project(this.cam);
        const dist = Math.hypot(
          ((p.x + 1) / 2) * r.width - px,
          ((1 - p.y) / 2) * r.height - py,
        );
        if (
          dist <
            Math.max(34, (r.height * 1.4) / d) *
              (q.h?.state === "dev" ? 2.5 : 1) &&
          dist < best
        ) {
          best = dist;
          v = q;
        }
      }
    if (v?.h?.state === "dev") {
      v.h.state = "retreat";
      this.hits++;
      this.score += PTS;
      this.cb.onHit({ x: px, y: py - 30 });
    }
  }
  finish() {
    this.running = false;
    this.cb.onEnd({
      score: this.hits * PTS,
      hits: this.hits,
      misses: this.misses,
    });
  }
}
