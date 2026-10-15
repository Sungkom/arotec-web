/* Geometry-only connectors for the existing, translated neurodegeneration content. */
(() => {
  'use strict';
  const root=document.getElementById('stress-neurodegeneration');
  const content=root?.querySelector('.sn-neuro-content');
  if(!content) return;
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');
  svg.classList.add('sn-neuro-connection-layer');
  svg.setAttribute('aria-hidden','true');
  svg.setAttribute('focusable','false');
  svg.setAttribute('data-color-artwork','');
  content.append(svg);
  let queued=false;
  function draw(){
    queued=false;
    const origin=content.getBoundingClientRect();
    if(!origin.width || !origin.height) return;
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.left-origin.left,y:r.top-origin.top,w:r.width,h:r.height,cx:r.left-origin.left+r.width/2,cy:r.top-origin.top+r.height/2,right:r.right-origin.left,bottom:r.bottom-origin.top};};
    svg.setAttribute('viewBox',`0 0 ${origin.width} ${origin.height}`);
    svg.replaceChildren();
    const path=(d,kind,dash)=>{const p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.dataset.connection=kind;if(dash)p.setAttribute('stroke-dasharray',dash);svg.append(p);return p;};
    const head=(x,y,dx,dy,kind)=>{const l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,s=7;path(`M ${x-ux*s-uy*s*.7} ${y-uy*s+ux*s*.7} L ${x} ${y} L ${x-ux*s+uy*s*.7} ${y-uy*s-ux*s*.7}`,kind+'-head');};
    const line=(a,b,kind)=>{path(`M ${a.x} ${a.y} L ${b.x} ${b.y}`,kind);head(b.x,b.y,b.x-a.x,b.y-a.y,kind);};
    const phases=[...content.querySelectorAll('.sn-neuro-phase')];
    const imgs=phases.map(e=>rect(e.querySelector('img')));
    const mobile=matchMedia('(max-width:650px)').matches;
    const desktop=matchMedia('(min-width:1400px)').matches;
    if(mobile){
      const a=rect(phases[0]),b=rect(phases[1]);
      line({x:a.cx,y:a.bottom+8},{x:b.cx,y:b.y-12},'stress-to-dysregulation');
    } else {
      const a=imgs[0],b=imgs[1],y=Math.min(a.cy,b.cy);
      line({x:a.right+2,y},{x:b.x-4,y},'stress-to-dysregulation');
    }
    const loop=rect(content.querySelector('.sn-neuro-loop'));
    if(desktop){
      const left=loop.x+2,right=loop.right-2,top=loop.y+19,bottom=loop.bottom-17;
      path(`M ${left} ${top+10} Q ${loop.cx} ${top-19} ${right} ${top+10}`,'dysregulation-to-vulnerability');
      head(right,top+10,right-loop.cx,29,'dysregulation-to-vulnerability');
      path(`M ${right} ${bottom-10} Q ${loop.cx} ${bottom+19} ${left} ${bottom-10}`,'vulnerability-to-dysregulation');
      head(left,bottom-10,left-loop.cx,-29,'vulnerability-to-dysregulation');
    } else if(mobile) {
      const top=loop.y+3,bottom=loop.bottom-3,left=loop.x+21,right=loop.right-21;
      path(`M ${left+6} ${top} Q ${left-15} ${loop.cy} ${left+6} ${bottom}`,'dysregulation-to-vulnerability');
      head(left+6,bottom,21,bottom-loop.cy,'dysregulation-to-vulnerability');
      path(`M ${right-6} ${bottom} Q ${right+15} ${loop.cy} ${right-6} ${top}`,'vulnerability-to-dysregulation');
      head(right-6,top,-21,top-loop.cy,'vulnerability-to-dysregulation');
    } else {
      const a=imgs[1],b=imgs[2],gap=(a.right+b.x)/2;
      line({x:a.right+2,y:a.cy-9},{x:b.x-4,y:b.cy-9},'dysregulation-to-vulnerability');
      line({x:b.x-4,y:b.cy+9},{x:a.right+2,y:a.cy+9},'vulnerability-to-dysregulation');
    }
    const cognitive=[...content.querySelectorAll('.sn-cognitive-grid > li')];
    for(let i=0;i<cognitive.length-1;i++){
      const a=rect(cognitive[i]),b=rect(cognitive[i+1]);
      if(mobile) line({x:a.cx,y:a.bottom+7},{x:b.cx,y:b.y-9},'cognitive-'+(i+1));
      else {const ai=rect(cognitive[i].querySelector('img')),bi=rect(cognitive[i+1].querySelector('img'));line({x:ai.right+3,y:ai.cy},{x:bi.x-4,y:bi.cy},'cognitive-'+(i+1));}
    }
    if(!mobile){
      const note=rect(content.querySelector('.sn-neuro-caution')),first=rect(cognitive[0]),last=rect(cognitive[3]),y=note.y+16;
      path(`M ${first.cx} ${y-8} Q ${first.cx} ${y+3} ${first.cx+28} ${y+3} L ${last.cx-28} ${y+3} Q ${last.cx} ${y+3} ${last.cx} ${y-8}`,'heterogeneous-trajectory-span','6 7');
      head(first.cx,y-8,0,-1,'trajectory-start');head(last.cx,y-8,0,-1,'trajectory-end');
    }
    const contributors=rect(content.querySelector('.sn-neuro-contributors')),last=rect(content.querySelector('.sn-neuro-contributors > li:last-child img')),result=rect(content.querySelector('.sn-neuro-result')),resultImg=rect(content.querySelector('.sn-neuro-result img'));
    if(matchMedia('(max-width:800px)').matches) line({x:contributors.cx,y:contributors.bottom+9},{x:result.cx,y:result.y-8},'mechanisms-to-endpoint');
    else line({x:last.right+10,y:last.cy},{x:resultImg.x-9,y:resultImg.cy},'mechanisms-to-endpoint');
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(draw);}}
  const observer=new ResizeObserver(schedule);observer.observe(content);
  content.querySelectorAll('img').forEach(img=>img.addEventListener('load',schedule));
  new MutationObserver(records=>{if(records.some(r=>!svg.contains(r.target)))schedule();}).observe(content,{childList:true,subtree:true,characterData:true});
  window.addEventListener('resize',schedule);
  document.fonts?.ready.then(schedule);
  schedule();
})();
