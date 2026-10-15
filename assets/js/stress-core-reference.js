(() => {
  'use strict';
  const root=document.getElementById('core-systems');
  if(!root)return;
  const host=root.querySelector('.sn-systems-content'),grid=root.querySelector('.sn-system-grid'),cards=[...root.querySelectorAll('.sn-system-card')],photos=cards.map(e=>e.querySelector('img')),note=root.querySelector('.sn-reciprocal'),foundation=root.querySelector('.sn-foundation'),base=foundation.querySelector('img');
  if(!host||photos.length!==4||!note||!base)return;
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  svg.setAttribute('class','sn-core-relationships');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');host.append(svg);
  let raf=0;
  const point=(x,y)=>[+x.toFixed(2),+y.toFixed(2)],fmt=p=>p.join(' ');
  function rect(e,h){const r=e.getBoundingClientRect();return{x:r.x-h.x,y:r.y-h.y,w:r.width,h:r.height,right:r.right-h.x,bottom:r.bottom-h.y,cx:r.x-h.x+r.width/2,cy:r.y-h.y+r.height/2};}
  function head(tip,from,kind='reciprocal'){const dx=from[0]-tip[0],dy=from[1]-tip[1],n=Math.hypot(dx,dy)||1,ux=dx/n,uy=dy/n,l=kind==='foundation'?(matchMedia('(min-width:1200px)').matches?20:18):14,s=kind==='foundation'?(matchMedia('(min-width:1200px)').matches?11:9):7;return`M${fmt(point(tip[0]+ux*l-uy*s,tip[1]+uy*l+ux*s))} L${fmt(tip)} L${fmt(point(tip[0]+ux*l+uy*s,tip[1]+uy*l-ux*s))} Z`;}
  function paint(id,d,start,tip,from,both,kind,startToward,extraHeads=''){
    const reference=matchMedia('(min-width:1200px)').matches;
    const color=kind==='foundation'?(reference?'#fe5a5a':'#d95d52'):'#485b82',width=kind==='foundation'?7.5:3;
    const group=document.createElementNS(ns,'g');group.dataset.coreRelationship=id;group.dataset.coreKind=kind;
    const e=document.createElementNS(ns,'path');e.setAttribute('d',d);e.dataset.coreShaft='true';
    let stroke=color;
    if(kind==='foundation'){
      const gradient=document.createElementNS(ns,'linearGradient'),gid='core-pair-'+id;
      gradient.id=gid;gradient.setAttribute('gradientUnits','userSpaceOnUse');for(const[k,v]of Object.entries({x1:start[0],y1:start[1],x2:tip[0],y2:tip[1]}))gradient.setAttribute(k,v);
      for(const[offset,opacity]of(reference?[[0,0],[.42,.55],[.67,1],[1,1]]:[[0,0],[.45,.68],[1,1]])){const stop=document.createElementNS(ns,'stop');stop.setAttribute('offset',offset);stop.setAttribute('stop-color',color);stop.setAttribute('stop-opacity',opacity);gradient.append(stop);}svg.querySelector('defs').append(gradient);stroke='url(#'+gid+')';
    }
    for(const[k,v]of Object.entries({stroke,'stroke-width':width+'px',fill:'none',filter:'none','stroke-linecap':'round','stroke-linejoin':'round','vector-effect':'none'}))e.style.setProperty(k,v,'important');group.append(e);
    const heads=document.createElementNS(ns,'path');heads.setAttribute('d',head(tip,from,kind)+(both?' '+head(start,startToward,kind):'')+extraHeads);heads.dataset.coreHead='true';heads.style.setProperty('fill',color,'important');heads.style.setProperty('stroke','none','important');heads.style.setProperty('filter','none','important');group.append(heads);svg.append(group);
  }
  function path(id,points,both=false,kind='reciprocal'){
    const inset=(tip,toward,amount)=>{const length=Math.hypot(toward[0]-tip[0],toward[1]-tip[1])||1,distance=Math.min(amount,length/2);return point(tip[0]+(toward[0]-tip[0])*distance/length,tip[1]+(toward[1]-tip[1])*distance/length);};
    const shaftStart=both?inset(points[0],points[1],10):points[0],shaftEnd=inset(points.at(-1),points.at(-2),kind==='foundation'?13.5:10);
    let d='M'+fmt(shaftStart);
    for(let i=1;i<points.length-1;i++){
      const a=points[i-1],b=points[i],c=points[i+1],ab=Math.hypot(b[0]-a[0],b[1]-a[1]),bc=Math.hypot(c[0]-b[0],c[1]-b[1]),r=Math.min(18,ab/3,bc/3);
      if(!ab||!bc){d+=' L'+fmt(b);continue;}
      const before=point(b[0]+(a[0]-b[0])*r/ab,b[1]+(a[1]-b[1])*r/ab),after=point(b[0]+(c[0]-b[0])*r/bc,b[1]+(c[1]-b[1])*r/bc);
      d+=' L'+fmt(before)+' Q'+fmt(b)+' '+fmt(after);
    }
    d+=' L'+fmt(shaftEnd);paint(id,d,points[0],points.at(-1),points.at(-2),both,kind,points[1]);
  }
  function draw(){
    raf=0;if(!root.getClientRects().length||root.getBoundingClientRect().width===0)return;
    root.querySelectorAll('#core-systems-title,.sn-system-card h3,.sn-foundation h3').forEach(e=>e.style.setProperty('text-transform','uppercase','important'));
    const mobile=matchMedia('(max-width:900px)').matches,compact=!mobile&&matchMedia('(max-width:1199px)').matches;
    const stageWidth=root.getBoundingClientRect().width * 2048 / 1913;
    root.style.setProperty('--core-unit',(stageWidth/2048)+'px');
    root.style.setProperty('--core-stage-left',((root.getBoundingClientRect().width-stageWidth)/2)+'px');
    if(!mobile){const gap=Math.max(170,2*(note.getBoundingClientRect().height+38));host.style.setProperty('--core-network-gap',gap+'px');}
    const h=host.getBoundingClientRect(),p=photos.map(e=>rect(e,h)),f=rect(base,h),label=rect(note,h),fw=rect(foundation,h),copy=rect(foundation.querySelector('div'),h);
    svg.setAttribute('viewBox',`0 0 ${h.width} ${h.height}`);svg.replaceChildren();svg.append(document.createElementNS(ns,'defs'));
    if(!mobile&&!compact){
      svg.setAttribute('viewBox','0 0 2048 1152');
      // The full clean source is height-fitted and center-cropped, never stretched.
      const crop=[[780,140,240,185],[1200,72,285,273],[905,305,255,210],[1200,325,285,195],[945,520,470,225]],scale=1152/(1475*2048/3840),dx=(2048-2048*scale)/2;
      [...photos,base].forEach((e,i)=>{const[x,y,w,hh]=crop[i];e.style.left=(x*scale+dx)/2048*100+'%';e.style.top=y*scale/1152*100+'%';e.style.width=w*scale/2048*100+'%';e.style.height=hh*scale/1152*100+'%';});
      // Source-registered connections. Shafts stop inside filled heads, so no round nubs protrude.
      for(const[a,b,id]of[[[1150,372],[1317,372],'1-2'],[[991,384],[991,474],'1-3'],[[1143,407],[1337,537],'1-4'],[[1327,407],[1128,537],'2-3'],[[1510,430],[1510,516],'2-4'],[[1150,585],[1317,585],'3-4']]){
        const length=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/length,uy=(b[1]-a[1])/length;
        paint(id,'M'+fmt(point(a[0]+ux*10,a[1]+uy*10))+' L'+fmt(point(b[0]-ux*10,b[1]-uy*10)),a,b,a,true,'reciprocal',b);
      }
      // Seven visible source arrows grouped into five amplifier relationships.
      // Every segment has its own tail-to-head fade; no masking or raster retouching.
      function amplifier(id,segments){
        let group;
        segments.forEach(([d,tail,tip],i)=>{
          paint(id+(i?'-segment-'+i:''),d,tail,tip,[tip[0],tip[1]+30],false,'foundation');
          const added=svg.lastElementChild;
          if(!group)group=added;else{group.append(...added.children);added.remove();}
        });
      }
      amplifier('foundation-1',[['M875 493 C875 463 875 446 875 429',[875,493],[875,414]]]);
      amplifier('foundation-2',[['M1640 503 C1649 469 1644 448 1644 429',[1640,503],[1644,414]]]);
      amplifier('foundation-3',[
        ['M967 810 C900 777 889 738 891 679',[967,810],[891,664]],
        ['M990 792 C974 768 970 741 970 716',[990,792],[970,701]]
      ]);
      const thai=root.matches(':lang(th)'),innerTip=thai?1600:1547;
      amplifier('foundation-4',[
        ['M1580 792 C1610 768 1630 737 1627 679',[1580,792],[1627,664]],
        [thai?'M1540 790 C1570 768 1600 755 1600 716':'M1530 790 C1545 767 1549 745 1547 716',[thai?1540:1530,790],[innerTip,701]]
      ]);
      amplifier('foundation-network',[['M1240 698 L1240 634',[1240,698],[1240,619]]]);
      root.dataset.coreRelationships='11';root.dataset.coreLayout='reference-scene';return;
    }
    [...photos,base].forEach(e=>{for(const p of['left','top','width','height'])e.style.removeProperty(p);});
    if(mobile){
      const ports=p.map(r=>point(r.x-8,r.cy));
      const pairs=[[0,1,34],[0,2,26],[0,3,18],[1,2,10],[1,3,2],[2,3,34]],offsets=[-10,0,10],degree=[0,0,0,0];
      for(const [a,b,x]of pairs){const aa=point(ports[a][0],ports[a][1]+offsets[degree[a]++]),bb=point(ports[b][0],ports[b][1]+offsets[degree[b]++]);path(`${a+1}-${b+1}`,[aa,point(x,aa[1]),point(x,bb[1]),bb],true);}
      p.forEach((r,i)=>{const x=h.width-3-i*8,from=point(f.right+7,f.y+f.h*(.18+i*.16)),tip=point(r.right+8,r.cy);path(`foundation-${i+1}`,[from,point(x,from[1]),point(x,tip[1]),tip],false,'foundation');});
      const tip=point(h.width/2,label.bottom+10);path('foundation-network',[point(h.width/2,fw.y-10),tip],false,'foundation');
    }else{
      const boxes=compact?cards.map(e=>rect(e,h)):p;
      const upper=Math.max(boxes[0].bottom,boxes[1].bottom),lower=Math.min(boxes[2].y,boxes[3].y);
      const a=point(compact?boxes[0].cx:p[0].right+7,upper+12),b=point(compact?boxes[1].cx:p[1].x-7,upper+12),c=point(compact?boxes[2].cx:p[2].x+7,lower-12),d=point(compact?boxes[3].cx:p[3].x-7,lower-12);
      const centerX=(a[0]+b[0]+c[0]+d[0])/4,centerY=(a[1]+c[1])/2;
      // The reference places the caption below the crossed diagonals and above
      // the lower horizontal pair, rather than inside the crossing itself.
      const diagonalY=lower-label.h-40,diagonalC=point(c[0],diagonalY),diagonalD=point(d[0],diagonalY);
      host.style.setProperty('--core-reciprocal-x',centerX+'px');host.style.setProperty('--core-reciprocal-y',(diagonalY+12)+'px');
      [[a,b,'1-2'],[a,c,'1-3'],[a,diagonalD,'1-4'],[b,diagonalC,'2-3'],[b,d,'2-4'],[c,d,'3-4']].forEach(([s,t,id])=>path(id,[s,t],true));
      // The narrow outer lanes lie between each lower illustration and its text.
      // All starts and tips stay outside the photo rectangles; the central
      // amplifier starts above the foundation copy, matching the source.
      const leftOuter=p[2].x-7,rightOuter=p[3].right+7;
      const shelf=Math.max(p[2].bottom,p[3].bottom,rect(cards[2].querySelector('div'),h).bottom,rect(cards[3].querySelector('div'),h).bottom)+28;
      const leftCopy=Math.min(copy.x-18,f.x-18),rightCopy=Math.max(copy.right+18,f.right+18);
      const starts=[point(f.x-8,f.y+f.h*.2),point(f.right+8,f.y+f.h*.2),point(f.x-8,f.y+f.h*.55),point(f.right+8,f.y+f.h*.55)];
      if(compact){
        [0,2].forEach((i,n)=>{const x=10+n*14,from=starts[n*2];path(`foundation-${i+1}`,[from,point(x,from[1]),point(x,p[i].cy),point(p[i].x-8,p[i].cy)],false,'foundation');});
        [1,3].forEach((i,n)=>{const x=h.width-10-n*14,from=starts[n*2+1];path(`foundation-${i+1}`,[from,point(x,from[1]),point(x,p[i].cy),point(p[i].right+8,p[i].cy)],false,'foundation');});
      }else{
        path('foundation-1',[starts[0],point(leftOuter,starts[0][1]),point(leftOuter,upper+40),point(p[0].cx,p[0].bottom+10)],false,'foundation');
        path('foundation-2',[starts[1],point(rightOuter,starts[1][1]),point(rightOuter,upper+40),point(p[1].cx,p[1].bottom+10)],false,'foundation');
        path('foundation-3',[starts[2],point(leftCopy,starts[2][1]),point(leftCopy,shelf),point(p[2].cx,shelf),point(p[2].cx,p[2].bottom+10)],false,'foundation');
        path('foundation-4',[starts[3],point(rightCopy,starts[3][1]),point(rightCopy,shelf),point(p[3].cx,shelf),point(p[3].cx,p[3].bottom+10)],false,'foundation');
      }
      const clearCenter=(p[2].right+p[3].x)/2,tipY=Math.max(rect(note,h).bottom+18,lower+30);
      path('foundation-network',[point(clearCenter,copy.y-18),point(clearCenter,tipY)],false,'foundation');
    }
    root.dataset.coreRelationships=String(svg.querySelectorAll('g[data-core-relationship]').length);root.dataset.coreLayout=mobile?'stacked':'compact-network';
  }
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(draw);};
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  const resize=new ResizeObserver(schedule);[host,grid,note,foundation,...photos,...cards.map(e=>e.querySelector('div'))].forEach(e=>resize.observe(e));
  new MutationObserver(records=>{if(records.some(r=>r.target!==svg&&!svg.contains(r.target)))schedule();}).observe(root,{subtree:true,childList:true,characterData:true});
  root.closest('details')?.addEventListener('toggle',schedule);window.addEventListener('resize',schedule,{passive:true});document.fonts?.ready.then(schedule);document.fonts?.addEventListener('loadingdone',schedule);photos.forEach(e=>e.addEventListener('load',schedule));schedule();
})();
