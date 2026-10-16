export const R=(a,b)=>a+Math.random()*(b-a);
export const pick=a=>a[Math.random()*a.length|0];
export const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
