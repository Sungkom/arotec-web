/* Mobile access to each complete localized Sleep Health composition.
   Iframes contain markup/styles only; all lifecycle and interaction live here. */
(() => {
  'use strict';
  if (window.ArotecSleepImageViewer || !document.body.classList.contains('sleep-health-page')) return;
  const api = window.ArotecSleepImageViewer = { version:'1.5.4' };
  const narrow = matchMedia('(width < 1200px)'), WIDTH = 1200;
  const words = {
    "en": {
        "loading": "Loading image.",
        "error": "The diagram is unavailable. The complete section text is shown below."
    },
    "th": {
        "loading": "กำลังโหลดภาพ",
        "error": "ไม่สามารถแสดงแผนภาพได้ ข้อความทั้งหมดของส่วนนี้แสดงอยู่ด้านล่าง"
    },
    "ja": {
        "loading": "画像を読み込み中です。",
        "error": "図を表示できません。このセクションの全文は下に表示されています。"
    },
    "zh-Hant": {
        "loading": "正在載入圖片。",
        "error": "無法顯示圖表。本節完整文字顯示於下方。"
    },
    "zh-Hans": {
        "loading": "正在加载图片。",
        "error": "无法显示图表。本节完整文字显示于下方。"
    }
};
  const locale = () => { const l=window.ArotecI18n?.currentLocale || document.documentElement.lang; return l==='zh'||l==='zh-TW'?'zh-Hant':l==='zh-CN'?'zh-Hans':words[l]?l:'en'; };
  const copy = () => words[locale()];
  const sections = [...document.querySelectorAll('main.sh-main > article > section.sh-section')];
  const records = new Map(); let updateQueued=false, resizeQueued=false;
  const attr = (node,name,value) => { if(node.getAttribute(name)!==value)node.setAttribute(name,value); };
  const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const headingOf = record => [...record.section.querySelectorAll('h1,h2')].find(heading=>!heading.closest('.shm-mobile-diagram,.shi-view,.shi-reading'));
  const titleOf = record => {
    const heading=headingOf(record)?.cloneNode(true);
    heading?.querySelectorAll('br').forEach(br=>br.replaceWith(' '));
    return heading?.textContent.replace(/\s+/g,' ').trim() || document.title.split('|')[0].trim();
  };
  const clean = (node,prefix='') => {
    node.querySelectorAll('script,noscript,iframe,.shi-view,.shi-reading,.shm-mobile-diagram,svg[data-shi-conditions-arrow],svg[data-arotec-symbol-frame-owned]').forEach(e=>e.remove());
    window.ArotecTextFrames?.clean?.(node);
    // The narrow source has a dark editorial surface, whereas this complete
    // desktop composition owns a light intro backplate. Do not carry the
    // narrow viewport's computed text annotation into that light surface.
    if(node.id==='disrupted-sleep')for(const text of node.querySelectorAll('.sh-intro h2,.sh-intro p,.sh-intro span,.sh-intro strong,.sh-intro em')){
      text.setAttribute('data-arotec-text-tone','navy');text.setAttribute('data-arotec-text-mode','color-and-fill');
      text.style.setProperty('color','var(--arotec-text-navy, #113568)','important');
      text.style.setProperty('-webkit-text-fill-color','var(--arotec-text-navy, #113568)','important');
    }
    // Architecture's refreshed caption has a light surface in the complete
    // composition; discard a narrow source's inherited white annotation.
    if(node.id==='sleep-architecture')for(const text of node.querySelectorAll('figcaption,figcaption strong,figcaption span,figcaption small')){
      text.setAttribute('data-arotec-text-tone','navy');text.setAttribute('data-arotec-text-mode','color-and-fill');
      text.style.setProperty('color','var(--arotec-text-navy, #113568)','important');
      text.style.setProperty('-webkit-text-fill-color','var(--arotec-text-navy, #113568)','important');
    }
    // The text engine can alternate equivalent white paint annotations. Keep
    // these six diagram labels deterministic so refresh does not replace frames.
    if(node.id==='disrupted-sleep')for(const text of node.querySelectorAll('.sh-disruption-list h3,.sh-disruption-hpa span')){
      text.setAttribute('data-arotec-text-tone','white');text.setAttribute('data-arotec-text-mode','color-and-fill');
      text.style.removeProperty('color');text.style.removeProperty('-webkit-text-fill-color');
      text.style.setProperty('color','var(--arotec-text-white, #ffffff)','important');
      text.style.setProperty('-webkit-text-fill-color','var(--arotec-text-white, #ffffff)','important');
    }
    // Measured decoration is rebuilt for each document, never part of a content signature.
    if(node.id==='biological-restoration')for(const layer of node.querySelectorAll('[data-repair-leaders="dynamic"]')){
      layer.removeAttribute('data-repair-ready');layer.removeAttribute('data-repair-error');
      for(const group of layer.querySelectorAll('[data-repair-connector]'))group.removeAttribute('data-route-status');
      for(const svg of layer.querySelectorAll('svg'))for(const name of ['width','height','viewBox'])svg.removeAttribute(name);
      for(const line of layer.querySelectorAll('polyline'))line.removeAttribute('points');
      for(const circle of layer.querySelectorAll('circle'))for(const name of ['cx','cy','r'])circle.removeAttribute(name);
    }
    const ids=new Map();
    for(const e of [node,...node.querySelectorAll('*')]){
      const navOwned=[...e.attributes].some(a=>a.name.startsWith('data-breadcrumb-'));
      for(const a of [...e.attributes])if(/^on/i.test(a.name)||(a.name.startsWith('data-breadcrumb-')&&a.name!=='data-breadcrumb-sleep-surface')||a.name.startsWith('data-shi-'))e.removeAttribute(a.name);
      e.classList.remove('shi-section','shi-source');
      if(navOwned){e.style.removeProperty('margin-top');e.style.removeProperty('padding-top');e.style.removeProperty('--breadcrumb-clearance');}
      if(prefix&&e.id){ids.set(e.id,prefix+e.id);e.id=prefix+e.id;}
      if(e.matches('img')){e.loading='eager';e.decoding='async';e.removeAttribute('fetchpriority');}
    }
    if(prefix)for(const e of [node,...node.querySelectorAll('*')])for(const a of ['aria-labelledby','aria-describedby','aria-controls','for'])if(e.hasAttribute(a))e.setAttribute(a,e.getAttribute(a).split(/\s+/).map(id=>ids.get(id)||id).join(' '));
    return node;
  };
  // Section 5 alone owns measured decorative leaders. Geometry never enters
  // the source signature, and the parent also updates script-free frame copies.
  const updateRepairConnectors = section => {
    if(section?.id!=='biological-restoration')return;
    const scene=section.querySelector('.sh-scene'),layer=scene?.querySelector('[data-repair-leaders="dynamic"]'),svg=layer?.querySelector('svg');
    if(!scene||!layer||!svg)return;
    const image=scene.querySelector('.sh-art'),box=scene.getBoundingClientRect(),width=scene.clientWidth,height=scene.clientHeight;
    if(!image?.naturalWidth||width<100||height<100||!box.width||!box.height){attr(layer,'data-repair-ready','false');return;}
    const sx=box.width/width,sy=box.height/height;
    const local=r=>({left:(r.left-box.left)/sx,top:(r.top-box.top)/sy,right:(r.right-box.left)/sx,bottom:(r.bottom-box.top)/sy});
    const textRects=element=>{
      const rects=[],doc=element.ownerDocument,walker=doc.createTreeWalker(element,4);
      for(let node;node=walker.nextNode();){
        if(!node.textContent.trim())continue;
        const parent=node.parentElement,style=doc.defaultView.getComputedStyle(parent);
        if(style.display==='none'||style.visibility==='hidden'||!parent.getClientRects().length)continue;
        const range=doc.createRange();range.selectNodeContents(node);
        for(const r of range.getClientRects())if(r.width&&r.height)rects.push(local(r));
      }
      return rects;
    };
    const rectangles=[...scene.querySelectorAll('h2,h3,p,.sh-number')].flatMap(textRects);
    const obstacles=rectangles.map(r=>({left:r.left-6,right:r.right+6,top:r.top-6,bottom:r.bottom+6}));
    const imageBox=local(image.getBoundingClientRect()),basisW=Number(svg.dataset.sourceWidth),basisH=Number(svg.dataset.sourceHeight);
    const sourcePoint=value=>{const [x,y]=String(value||'').split(',').map(Number);return Number.isFinite(x)&&Number.isFinite(y)?{x:imageBox.left+x/basisW*(imageBox.right-imageBox.left),y:imageBox.top+y/basisH*(imageBox.bottom-imageBox.top)}:null;};
    const intersects=(a,b,r)=>{
      let low=0,high=1;const dx=b.x-a.x,dy=b.y-a.y;
      for(const [p,q] of [[-dx,a.x-r.left],[dx,r.right-a.x],[-dy,a.y-r.top],[dy,r.bottom-a.y]]){
        if(Math.abs(p)<1e-8){if(q<0)return false;}else{const t=q/p;if(p<0)low=Math.max(low,t);else high=Math.min(high,t);if(low>high)return false;}
      }
      return true;
    };
    const clear=(a,b)=>!obstacles.some(r=>intersects(a,b,r));
    const route=(start,dot,bend,verticalFirst=false,sourceEntry=null)=>{
      for(const points of [sourceEntry?[start,{x:sourceEntry.x,y:start.y},sourceEntry,dot]:null,verticalFirst&&bend?[start,{x:start.x,y:bend.y},bend,dot]:null,bend?[start,bend,dot]:null,[start,dot],[start,{x:dot.x,y:start.y},dot],[start,{x:start.x,y:dot.y},dot]])if(points&&points.slice(1).every((p,i)=>clear(points[i],p)))return points;
      // A small visibility graph around this callout bounds work and avoids all
      // measured copy. Expanded corners preserve a six-pixel text clearance.
      const left=Math.max(0,Math.min(start.x,dot.x,bend?.x??start.x)-120),right=Math.min(width,Math.max(start.x,dot.x,bend?.x??start.x)+120);
      const top=Math.max(0,Math.min(start.y,dot.y,bend?.y??start.y)-100),bottom=Math.min(height,Math.max(start.y,dot.y,bend?.y??start.y)+100);
      const nodes=[start,dot];
      for(const r of obstacles)if(r.right>=left&&r.left<=right&&r.bottom>=top&&r.top<=bottom){
        for(const p of [{x:r.left-.5,y:r.top-.5},{x:r.right+.5,y:r.top-.5},{x:r.left-.5,y:r.bottom+.5},{x:r.right+.5,y:r.bottom+.5}])if(p.x>=left&&p.x<=right&&p.y>=top&&p.y<=bottom&&!obstacles.some(o=>p.x>=o.left&&p.x<=o.right&&p.y>=o.top&&p.y<=o.bottom))nodes.push(p);
      }
      const distances=nodes.map(()=>Infinity),previous=nodes.map(()=>-1),done=new Set();distances[0]=0;
      for(let step=0;step<nodes.length;step++){
        let index=-1;for(let i=0;i<nodes.length;i++)if(!done.has(i)&&(index<0||distances[i]<distances[index]))index=i;
        if(index<0||!Number.isFinite(distances[index]))break;if(index===1){const result=[];for(let i=1;i!==-1;i=previous[i])result.unshift(nodes[i]);return result;}
        done.add(index);
        for(let i=0;i<nodes.length;i++)if(!done.has(i)&&clear(nodes[index],nodes[i])){const distance=distances[index]+Math.hypot(nodes[i].x-nodes[index].x,nodes[i].y-nodes[index].y)+8;if(distance<distances[i]){distances[i]=distance;previous[i]=index;}}
      }
      return null;
    };
    let completed=0;const failures=[];
    attr(svg,'viewBox',`0 0 ${width} ${height}`);
    for(const group of svg.querySelectorAll('[data-repair-connector]')){
      const key=group.dataset.repairConnector,heading=scene.querySelector(`[data-repair-callout="${key}"] .sh-repair-heading`),rects=heading?textRects(heading):[],lines=[];
      for(const r of rects.sort((a,b)=>a.top-b.top||a.left-b.left)){
        let line=lines.find(l=>Math.min(l.bottom,r.bottom)-Math.max(l.top,r.top)>Math.min(l.bottom-l.top,r.bottom-r.top)*.45);
        if(line){line.left=Math.min(line.left,r.left);line.right=Math.max(line.right,r.right);line.top=Math.min(line.top,r.top);line.bottom=Math.max(line.bottom,r.bottom);}else lines.push({...r});
      }
      lines.sort((a,b)=>a.top-b.top);
      const line=group.dataset.labelLine==='last'?lines.at(-1):lines[0],dot=sourcePoint(group.dataset.sourceDot),bend=group.dataset.sourceBend?sourcePoint(group.dataset.sourceBend):null;
      if(!line||!dot){failures.push(key);attr(group,'data-route-status','unmeasured');continue;}
      const start={x:group.dataset.labelSide==='right'?line.right+10:line.left-10,y:(line.top+line.bottom)/2},points=route(start,dot,bend,key==='glymphatic',key==='immune'?sourcePoint(group.dataset.sourceFree):null);
      if(!points){failures.push(key);attr(group,'data-route-status','blocked');continue;}
      attr(group.querySelector('polyline'),'points',points.map(p=>`${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' '));
      const circle=group.querySelector('circle');attr(circle,'cx',dot.x.toFixed(3));attr(circle,'cy',dot.y.toFixed(3));attr(circle,'r','3');attr(group,'data-route-status','ready');completed++;
    }
    attr(layer,'data-repair-error',failures.join(','));attr(layer,'data-repair-ready',String(completed===5));
  };
  const observeRepairSource = record => {
    if(record.section.id!=='biological-restoration')return;
    let queued=false;const update=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;updateRepairConnectors(record.section);});};
    const observer=new ResizeObserver(update);
    for(const node of record.section.querySelectorAll('.sh-scene,.sh-art,.sh-repair-heading,.sh-repair-list p'))observer.observe(node);
    record.repairObserver=observer;record.repairUpdate=update;
    for(const image of record.section.querySelectorAll('.sh-art')){image.addEventListener('load',update);image.addEventListener('error',update);}
    document.fonts?.ready.then(update);document.fonts?.addEventListener('loadingdone',update);update();
  };


  /* Preserve the Conditions photograph beneath its single directional arrow.
   * The parent maintains inert frame decoration at three physical CSS pixels. */
  const updateConditionsArrow = (section, frame = null) => {
    if (section?.id !== 'restorative-conditions') return;
    const parent = section.querySelector('.sh-conditions-artwork');
    const image = parent?.querySelector(':scope > .sh-art');
    let svg = parent?.querySelector(':scope > svg[data-shi-conditions-arrow]');
    const paint = (node, key, value) => { value=String(value); if(node.style.getPropertyValue(key)!==value||node.style.getPropertyPriority(key)!=='important')node.style.setProperty(key,value,'important'); };
    const hide = () => { if (svg) paint(svg,'display','none'); };
    if (!parent || !image?.naturalWidth || !image.naturalHeight) { hide(); return; }
    const box = parent.getBoundingClientRect(), img = image.getBoundingClientRect();
    const width = parent.clientWidth, height = parent.clientHeight;
    // The visually clipped accessible original must not produce a second layer.
    if (width < 100 || height < 50 || !box.width || !box.height || !img.width || !img.height) { hide(); return; }
    const frameScaleX = frame ? frame.getBoundingClientRect().width / frame.clientWidth : 1;
    const frameScaleY = frame ? frame.getBoundingClientRect().height / frame.clientHeight : 1;
    const localScaleX = box.width / width, localScaleY = box.height / height;
    const physicalX = localScaleX * frameScaleX, physicalY = localScaleY * frameScaleY;
    if (![physicalX, physicalY].every(v => Number.isFinite(v) && v > 0) || Math.abs(physicalX / physicalY - 1) > .002) { hide(); return; }
    const sourceScale = img.width / image.naturalWidth * frameScaleX;
    const point = (x, y) => ({
      x: (img.left - box.left + x * img.width / image.naturalWidth) / localScaleX,
      y: (img.top - box.top + y * img.height / image.naturalHeight) / localScaleY
    });
    const start = point(1930, 1534), tip = point(1930, 1641);
    const headWidth = Math.max(8, 42 * sourceScale) / physicalX;
    const headHeight = Math.max(6, 33 * sourceScale) / physicalY;
    // Very small/zoomed canvases retain the original arrow rather than producing a dot.
    // At the existing 320px composition: 10.75px overall, 4.75px exposed shaft, 8px head.
    const physicalLength = (tip.y-start.y)*physicalY;
    const caption = section.querySelector('.sh-conditions-outcomes > p');
    const captionClearance = caption ? (caption.getBoundingClientRect().top-(box.top+tip.y*localScaleY))*frameScaleY-1 : Infinity;
    if (physicalLength < 10 || physicalLength-headHeight*physicalY < 4 || captionClearance < 0) { hide(); return; }
    const namespace = 'http://www.w3.org/2000/svg';
    const set = (node, name, value) => { value = String(value); if (node.getAttribute(name) !== value) node.setAttribute(name, value); };
    const fmt = value => String(Math.round(value * 100000) / 100000);
    if (!svg) {
      svg = section.ownerDocument.createElementNS(namespace, 'svg');
      set(svg, 'data-shi-conditions-arrow', '');
      set(svg, 'data-arotec-arrow-owned', 'sleep-conditions');
      set(svg, 'data-arotec-arrow-generated', 'sleep-conditions');
      set(svg, 'data-arotec-i18n-ignore', '');
      set(svg, 'aria-hidden', 'true'); set(svg, 'focusable', 'false');
      for (const [key, value] of Object.entries({position:'absolute',left:'0',top:'0',width:'100%',height:'100%',margin:'0',padding:'0',border:'0',transform:'none',transition:'none','pointer-events':'none',overflow:'hidden','z-index':'1'})) paint(svg,key,value);
      const restoration = section.ownerDocument.createElementNS(namespace, 'image');
      set(restoration, 'data-shi-arrow-restoration', 'fitted-gradient'); svg.append(restoration);
      for (const role of ['white-shaft','white-head']) {
        const path = section.ownerDocument.createElementNS(namespace, 'path');
        set(path, 'data-shi-arrow-role', role); svg.append(path);
      }
      parent.append(svg);
    }
    paint(svg,'display','block');
    set(svg, 'viewBox', `0 0 ${width} ${height}`);
    set(svg, 'data-arotec-arrow-stroke', '3');
    set(svg, 'data-arotec-arrow-color', '#fff');
    set(svg, 'data-shi-physical-scale', fmt(physicalX));
    // Only the reviewed old-arrow footprint is opaque; original ring and fill remain untouched.
    // This is an approximate quadratic fill fit, not recovered original background pixels.
    const patch = svg.querySelector('[data-shi-arrow-restoration]'), origin = point(1878,1534);
    set(patch,'href',new URL('restorative-conditions-arrow-fill-v4.png',image.currentSrc||image.src).href);
    set(patch,'x',fmt(origin.x));set(patch,'y',fmt(origin.y));
    set(patch,'width',fmt(108*img.width/image.naturalWidth/localScaleX));
    set(patch,'height',fmt(113*img.height/image.naturalHeight/localScaleY));
    const shaft = `M${fmt(start.x)} ${fmt(start.y)} L${fmt(tip.x)} ${fmt(tip.y)}`;
    const head = `M${fmt(tip.x-headWidth/2)} ${fmt(tip.y-headHeight)} L${fmt(tip.x)} ${fmt(tip.y)} L${fmt(tip.x+headWidth/2)} ${fmt(tip.y-headHeight)}`;
    const definitions = [
      {d:shaft,fill:'none',stroke:'#fff',strokeWidth:3/physicalX},
      {d:head,fill:'none',stroke:'#fff',strokeWidth:3/physicalX}
    ];
    for (let index=0;index<definitions.length;index++) {
      const path=svg.querySelectorAll('path')[index],definition=definitions[index];
      set(path,'d',definition.d);set(path,'fill',definition.fill);set(path,'stroke',definition.stroke);
      set(path,'stroke-width',fmt(definition.strokeWidth));set(path,'stroke-linecap','butt');set(path,'stroke-linejoin','round');
      for(const [key,value] of Object.entries({fill:definition.fill,stroke:definition.stroke,'stroke-width':fmt(definition.strokeWidth),'stroke-linecap':'butt','stroke-linejoin':'round','vector-effect':'none',filter:'none',opacity:'1',transition:'none'}))paint(path,key,value);
      // Do not use non-scaling-stroke: the parent iframe transform must be compensated.
      set(path,'vector-effect','none');
    }
    if(caption) set(svg,'data-shi-caption-box-clearance',fmt(captionClearance));
  };

  const observeConditionsSource = record => {
    if (record.section.id !== 'restorative-conditions') return;
    let queued=false;
    const update=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;updateConditionsArrow(record.section);});};
    const observer=new ResizeObserver(update);
    for(const node of record.section.querySelectorAll('.sh-conditions-artwork,.sh-conditions-artwork > .sh-art')) observer.observe(node);
    for(const image of record.section.querySelectorAll('.sh-conditions-artwork > .sh-art')) {image.addEventListener('load',update);image.addEventListener('error',update);}
    record.conditionsObserver=observer;record.conditionsUpdate=update;update();
  };

  const source = record => clean(record.section.cloneNode(true));
  // Keep the 1200px composition/font basis, but express the page's visible
  // hero gutters in that coordinate system. The overview keeps this composition.
  const heroGutter = record => {
    if(record?.section.id!=='sleep-health')return null;
    const token=getComputedStyle(document.documentElement).getPropertyValue('--arotec-page-gutter').trim();
    const gutter=/^\d+(?:\.\d+)?px$/.test(token)?parseFloat(token):parseFloat(getComputedStyle(record.reading).paddingLeft);
    const width=record.overview.clientWidth||record.section.clientWidth||document.documentElement.clientWidth;
    return Number.isFinite(gutter)&&gutter>=0&&width>0?gutter*WIDTH/width:null;
  };
  const applyHeroGutter = (record,frame) => {
    const gutter=heroGutter(record),root=frame?.contentDocument?.documentElement;
    if(gutter===null||!root||frame._shiHeroGutter===gutter)return false;
    root.style.setProperty('--sh-hero-gutter',gutter+'px');frame._shiHeroGutter=gutter;return true;
  };
  // Two Forces has its own gutter contract; keep the existing hero path intact.
  const forcesGutter = record => {
    if(record?.section.id!=='two-forces')return null;
    const token=getComputedStyle(document.documentElement).getPropertyValue('--arotec-page-gutter').trim();
    const gutter=/^\d+(?:\.\d+)?px$/.test(token)?parseFloat(token):parseFloat(getComputedStyle(record.reading).paddingLeft);
    const width=record.overview.clientWidth||record.section.clientWidth||document.documentElement.clientWidth;
    return Number.isFinite(gutter)&&gutter>=0&&width>0?gutter*WIDTH/width:null;
  };
  const applyForcesGutter = (record,frame) => {
    const gutter=forcesGutter(record),root=frame?.contentDocument?.documentElement;
    if(gutter===null||!root||frame._shiForcesGutter===gutter)return false;
    root.style.setProperty('--sh-forces-gutter',gutter+'px');frame._shiForcesGutter=gutter;return true;
  };
  // Only Two Forces follows the host's responsive heading roles inside its
  // fixed-width composition. The full-image overview remains a thumbnail.
  const forcesRoles = record => {
    if(record?.section.id!=='two-forces')return null;
    const phone=matchMedia('(width < 768px)').matches;
    return {'--sh-forces-h2-size':phone?'32px':'48px','--sh-forces-h2-line':phone?'38px':'58px','--sh-forces-h2-letter':phone?'-.64px':'-.96px','--sh-forces-h3-size':phone?'28px':'40px','--sh-forces-h3-line':phone?'36px':'56px','--sh-forces-h3-letter':phone?'-.56px':'-.8px'};
  };
  const applyForcesRoles = (record,frame) => {
    const roles=forcesRoles(record),root=frame?.contentDocument?.documentElement;
    if(!roles||!root)return false;
    const signature=JSON.stringify(roles);if(frame._shiForcesRoles===signature)return false;
    for(const [name,value] of Object.entries(roles))root.style.setProperty(name,value);
    frame._shiForcesRoles=signature;return true;
  };
  // These seven live-text reference compositions use native host heading roles.
  // Hero and Two Forces retain their separate, established bridges above.
  const referenceSections = new Set(['neurobiology','sleep-architecture','biological-restoration','disrupted-sleep','biological-burden','restorative-conditions','multisystem-health']);
  const isReference = record => referenceSections.has(record?.section.id);
  const referencePhysicalGutter = record => {
    const token=getComputedStyle(document.documentElement).getPropertyValue('--arotec-page-gutter').trim();
    const gutter=/^\d+(?:\.\d+)?px$/.test(token)?parseFloat(token):parseFloat(getComputedStyle(record.reading).paddingLeft);
    return Number.isFinite(gutter)&&gutter>=0?gutter:16;
  };
  const referenceProperties = record => {
    if(!isReference(record))return null;
    const phone=matchMedia('(width < 768px)').matches;
    const width=record.overview.clientWidth||record.section.clientWidth||document.documentElement.clientWidth;
    return {'--sh-reference-gutter':(referencePhysicalGutter(record)*compositionWidth(record)/width)+'px','--sh-reference-h2-size':phone?'32px':'48px','--sh-reference-h2-line':phone?'38px':'58px','--sh-reference-h2-letter':phone?'-.64px':'-.96px','--sh-reference-h3-size':phone?'28px':'40px','--sh-reference-h3-line':phone?'36px':'56px','--sh-reference-h3-letter':phone?'-.56px':'-.8px'};
  };
  const applyReferenceProperties = (record,frame) => {
    const properties=referenceProperties(record),doc=frame?.contentDocument,root=doc?.documentElement;
    if(!properties||!root||!doc.getElementById(record.section.id))return false;
    const signature=JSON.stringify(properties);if(frame._shiReferenceProperties===signature)return false;
    for(const [name,value] of Object.entries(properties))root.style.setProperty(name,value);
    frame._shiReferenceProperties=signature;return true;
  };
  // These four dense references retain a complete 1920px composition.
  // All other sections keep their established 1200px basis and interaction.
  const denseSections=new Set(['neurobiology','biological-burden','restorative-conditions','multisystem-health']);
  const isDense=record=>denseSections.has(record?.section.id);
  const burdenNarrow=matchMedia('(width < 1920px)');
  const compositionWidth=record=>isDense(record)?1920:WIDTH;
  const viewerEnabled=record=>isDense(record)?burdenNarrow.matches:narrow.matches;
  const headMarkup = () => [...document.head.querySelectorAll('link[rel="stylesheet"],style')].filter(e=>!e.matches('link[href*="sleep-health-image-viewer.css"]')).map(e=>{const n=e.cloneNode(true);if(n.tagName==='LINK')n.href=e.href;return n.outerHTML;}).join('\n');
  const signatureOf = record => locale()+'|'+source(record).outerHTML+'|'+[...document.head.querySelectorAll('link[rel="stylesheet"]')].map(link=>link.href).join('|');
  const makeDocument = record => {
    const section=source(record), l=locale(),gutter=heroGutter(record);
    const heroStyle=gutter===null?'':':root{--sh-hero-gutter:'+gutter+'px}';
    const forces=forcesGutter(record),forcesStyle=forces===null?'':':root{--sh-forces-gutter:'+forces+'px}';
    const roles=forcesRoles(record),roleStyle=roles?':root{'+Object.entries(roles).map(([name,value])=>name+':'+value).join(';')+'}':'';
    const reference=referenceProperties(record),referenceStyle=reference?':root{'+Object.entries(reference).map(([name,value])=>name+':'+value).join(';')+'}':'';
    const bodyClass=[...document.body.classList].filter(c=>!['shi-dialog-open','shm-diagram-is-open'].includes(c)).join(' ');
    const main=document.querySelector('main.sh-main');
    const attrs=(node,omit)=>[...node.attributes].filter(a=>!omit.includes(a.name)&&!/^on/i.test(a.name)&&!a.name.startsWith('data-breadcrumb-')).map(a=>`${a.name}="${escape(a.value)}"`).join(' ');
    return '<!doctype html><html '+attrs(document.documentElement,['lang'])+' lang="'+escape(l)+'"><head><meta charset="utf-8"><base href="'+escape(document.baseURI)+'">'+headMarkup()+'<style>'+heroStyle+forcesStyle+roleStyle+referenceStyle+'html,body{margin:0!important;padding:0!important;min-height:0!important;height:auto!important;overflow:hidden!important}body{width:'+compositionWidth(record)+'px!important}#main.sh-main{margin:0!important;padding:0!important;max-width:none!important;width:100%!important;min-height:0!important}#main>article{margin:0!important;padding:0!important}.shm-mobile-diagram{display:none!important}section.sh-section{scroll-margin:0!important}</style></head><body class="'+escape(bodyClass)+'" '+attrs(document.body,['class','lang'])+' lang="'+escape(l)+'"><main '+attrs(main,['lang'])+' lang="'+escape(l)+'"><article>'+section.outerHTML+'</article></main></body></html>';
  };
  const waitBounded = (promise,ms) => Promise.race([promise,new Promise(resolve=>setTimeout(resolve,ms))]);
  const styleLoadStates=new WeakMap();
  const localStyleReady = link => {
    const url=new URL(link.href);
    if(url.origin!==location.origin)return true;
    let state=styleLoadStates.get(link);
    if(!state){
      state={loaded:false,failed:false};styleLoadStates.set(link,state);
      link.addEventListener('load',()=>{state.loaded=true;state.failed=false;});
      link.addEventListener('error',()=>{state.loaded=false;state.failed=true;});
    }
    if(state.failed||!link.sheet)return false;
    try{return link.sheet.cssRules.length>0;}catch(error){
      // Local-file styles can be fully loaded and painted while Chromium denies
      // CSSOM inspection across opaque file origins. That is not a load failure.
      return location.protocol==='file:'&&url.protocol==='file:'&&error.name==='SecurityError'&&(state.loaded||!!link.sheet);
    }
  };
  const disposeFrame = frame => {if(!frame)return;clearTimeout(frame._shiPoll);clearTimeout(frame._shiFailureTimer);frame._shiObserver?.disconnect();frame.remove();};
  const createFrame = (record,onSize) => {
    const frame=document.createElement('iframe');frame.className='shi-frame';frame.width=String(compositionWidth(record));if(compositionWidth(record)!==WIDTH)frame.style.width=compositionWidth(record)+'px';frame.height='1';frame.tabIndex=-1;frame.setAttribute('sandbox','allow-same-origin');frame.setAttribute('scrolling','no');frame.setAttribute('aria-hidden','true');frame.title=titleOf(record);frame.inert=true;
    const fallbackHeight=compositionWidth(record)*9/16;
    let started=false,attachedAt=0;
    const initialize=async()=>{
      if(!frame.isConnected)return;
      if(!attachedAt)attachedAt=performance.now();
      const doc=frame.contentDocument;if(!doc?.querySelector('section.sh-section'))return;
      if(started)return;started=true;clearTimeout(frame._shiPoll);
      await waitBounded(doc.fonts?.ready||Promise.resolve(),4000);
      await waitBounded(Promise.all([...doc.images].map(img=>img.decode?.().catch(()=>{})||Promise.resolve())),2000);
      if(!frame.isConnected)return;
      const section=doc.querySelector('section.sh-section');
      let recoveryPending=false;
      const measure=()=>{
        if(!frame.isConnected)return;
        applyHeroGutter(record,frame);
        applyForcesGutter(record,frame);
        applyForcesRoles(record,frame);
        applyReferenceProperties(record,frame);
        const missing=[...doc.images].some(img=>!img.naturalWidth)||[...doc.querySelectorAll('link[rel="stylesheet"]')].some(link=>!localStyleReady(link));
        if(record.section.id==='biological-restoration')updateRepairConnectors(section);
        const measured=missing?fallbackHeight:Math.ceil(section.getBoundingClientRect().height),changedError=frame.dataset.imageError!==String(missing);
        const paintReady=!missing&&measured>0,changedPaint=frame._shiPaintReady!==paintReady;frame._shiPaintReady=paintReady;
        const confirmed=missing&&([...doc.images].some(img=>img.complete&&!img.naturalWidth)||[...doc.querySelectorAll('link[rel="stylesheet"]')].some(link=>styleLoadStates.get(link)?.failed)||performance.now()-attachedAt>=15000),changedFailure=frame._shiFailureConfirmed!==confirmed;frame._shiFailureConfirmed=confirmed;
        frame.dataset.imageError=String(missing);
        if(changedError||changedPaint||changedFailure||recoveryPending||(measured>0&&measured!==frame._shiHeight)){
          // Error views hide the frame. Notify recovery before requiring a
          // visible border box, then remeasure its restored desktop layout.
          recoveryPending=!missing&&measured===0;
          const height=measured||frame._shiHeight||fallbackHeight;frame._shiHeight=height;frame.style.height=height+'px';frame.height=String(height);onSize(height,frame);
          if(recoveryPending)requestAnimationFrame(measure);
        }
        updateConditionsArrow(section,frame);
      };
      frame._shiMeasure=measure;
      frame._shiFailureTimer=setTimeout(measure,Math.max(0,15000-(performance.now()-attachedAt)));
      frame._shiObserver=new ResizeObserver(()=>requestAnimationFrame(measure));frame._shiObserver.observe(section);if(record.section.id==='biological-restoration')for(const node of section.querySelectorAll('.sh-scene,.sh-art,.sh-repair-heading,.sh-repair-list p'))frame._shiObserver.observe(node);measure();
      for(const img of doc.images){img.addEventListener('load',measure);img.addEventListener('error',measure);}
      for(const link of doc.querySelectorAll('link[rel="stylesheet"]')){link.addEventListener('load',measure);link.addEventListener('error',measure);}
      doc.fonts?.addEventListener('loadingdone',measure);
    };
    // A stalled image/font request must not keep a styled document hidden forever.
    // Wait for local styles, then measure without depending on the window load event.
    const poll=()=>{
      if(!frame.isConnected){frame._shiPoll=setTimeout(poll,100);return;}
      if(!attachedAt)attachedAt=performance.now();
      const doc=frame.contentDocument,parsed=doc?.readyState!=='loading'&&doc?.querySelector('section.sh-section');
      const stylesReady=parsed&&[...doc.querySelectorAll('link[rel="stylesheet"]')].every(localStyleReady);
      if(!parsed&&performance.now()-attachedAt>15000){
        frame.dataset.imageError='true';frame._shiPaintReady=false;frame._shiFailureConfirmed=true;frame._shiHeight=fallbackHeight;
        frame.style.height=fallbackHeight+'px';frame.height=String(fallbackHeight);onSize(fallbackHeight,frame);return;
      }
      if(parsed&&(stylesReady||performance.now()-attachedAt>15000))initialize();else frame._shiPoll=setTimeout(poll,100);
    };
    frame.addEventListener('load',initialize);frame._shiPoll=setTimeout(poll,0);
    frame.srcdoc=makeDocument(record);return frame;
  };
  function reserveBreadcrumb(){
    const record=records.get(document.getElementById('sleep-health'));if(!record)return;
    const nav=document.querySelector('.arotec-breadcrumbs');
    const reserve=narrow.matches&&nav?Math.max(0,Math.ceil(nav.getBoundingClientRect().bottom+8-record.view.getBoundingClientRect().top)):0;
    record.view.style.setProperty('--shi-breadcrumb-space',reserve+'px');
  }
  function overviewSize(record){
    if(isDense(record)&&record.retainedFrame&&!record.frame?._shiPaintReady&&record.frame?._shiFailureConfirmed!==true){
      const scale=record.overview.clientWidth/compositionWidth(record);
      record.overview.style.height=(record.retainedFrame._shiHeight*scale)+'px';record.retainedFrame.style.transform=`scale(${scale})`;updateConditionsArrow(record.retainedFrame.contentDocument?.getElementById(record.section.id),record.retainedFrame);return;
    }
    if(!record.frame?._shiHeight)return;
    if(applyHeroGutter(record,record.frame))record.frame._shiMeasure?.();
    if(applyForcesGutter(record,record.frame))record.frame._shiMeasure?.();
    if(applyForcesRoles(record,record.frame))record.frame._shiMeasure?.();
    if(applyReferenceProperties(record,record.frame))record.frame._shiMeasure?.();
    const width=record.overview.clientWidth,scale=width/compositionWidth(record);
    record.overview.style.height=(record.frame._shiHeight*scale)+'px';record.overview.setAttribute('data-ready','');record.frame.style.transform=`scale(${scale})`;
    const failed=record.frame.dataset.imageError==='true';
    const fallback=record.frame._shiFailureConfirmed===true||(!record.frame._shiPaintReady&&record.section.dataset.shiFailed==='true');
    showFallback(record,fallback);
    record.status.hidden=fallback||!!record.frame._shiPaintReady;record.status.textContent=copy().loading;
    record.frame.hidden=failed;
    // A recovered document must be laid out before it can be measured again.
    // Keep it unpainted until it replaces the fallback, never alongside it.
    if(fallback&&!record.frame._shiPaintReady)record.frame.style.visibility='hidden';else record.frame.style.removeProperty('visibility');
    if(fallback)record.overview.style.height='0px';
    if(isDense(record))attr(record.section,'data-shi-ready',String(record.frame._shiPaintReady&&record.frame.dataset.imageError==='false'));
    updateConditionsArrow(record.frame.contentDocument?.getElementById(record.section.id),record.frame);
    reserveBreadcrumb();focusRing(record);
  }
  function focusRing(record){
    const active=document.activeElement;
    for(const node of record.reading.querySelectorAll('[data-shi-heading-focus]'))node.removeAttribute('data-shi-heading-focus');
    if(!record.section.contains(active)||!active.matches('h1,h2,h3')){record.view.removeAttribute('data-heading-focus');return;}
    record.view.setAttribute('data-heading-focus','');
    if(!record.reading.hidden){
      const target=active.id?record.reading.querySelector('[id="shi-reading-'+CSS.escape(active.id)+'"]'):record.reading.querySelector('h1,h2,h3');
      target?.setAttribute('data-shi-heading-focus','');
    }
    const displayed=record.retainedFrame||record.frame;
    const target=active.id&&displayed?.contentDocument?.getElementById(active.id),r=target?.getBoundingClientRect();const scale=record.overview.clientWidth/compositionWidth(record);
    Object.assign(record.ring.style,{left:(r?r.x*scale:3)+'px',top:(r?r.y*scale:3)+'px',width:(r?r.width*scale:Math.max(0,record.overview.clientWidth-6))+'px',height:(r?r.height*scale:Math.max(20,record.overview.clientHeight-6))+'px'});
  }
  function render(record){
    if(!viewerEnabled(record)||!record.near)return;
    const signature=signatureOf(record);
    if(signature===record.signature&&record.frame)return;
    if(isDense(record)){
      // Keep the last complete composition visible while its replacement loads.
      // Re-exposing the source here would change automatic paint annotations,
      // which in turn would invalidate the next content signature indefinitely.
      if(!record.retainedFrame&&record.frame?._shiPaintReady&&record.frame.dataset.imageError==='false')record.retainedFrame=record.frame;
      else disposeFrame(record.frame);
      if(!record.retainedFrame)attr(record.section,'data-shi-ready','false');
      if(record.section.dataset.shiFailed==='true')showFallback(record,true);
      record.signature=signature;record.status.textContent=copy().loading;record.status.hidden=!!record.retainedFrame;record.status.removeAttribute('data-error');
      record.frame=createFrame(record,(height,frame)=>{
        if(record.frame!==frame||!viewerEnabled(record))return;
        if(record.retainedFrame&&!frame._shiPaintReady&&frame._shiFailureConfirmed!==true)return;
        disposeFrame(record.retainedFrame);record.retainedFrame=null;
        frame.style.removeProperty('visibility');record.status.hidden=true;showFallback(record,frame._shiFailureConfirmed===true||(!frame._shiPaintReady&&record.section.dataset.shiFailed==='true'));overviewSize(record);
      });
      if(record.retainedFrame)record.frame.style.visibility='hidden';
      record.overview.prepend(record.frame);return;
    }
    record.signature=signature;record.status.textContent=copy().loading;record.status.hidden=false;record.status.removeAttribute('data-error');disposeFrame(record.frame);
    record.frame=createFrame(record,()=>{record.status.hidden=true;overviewSize(record);});record.overview.prepend(record.frame);
  }
  function completeText(record,prefix){
    const text=clean(record.section.cloneNode(true),prefix);text.querySelectorAll('img,picture,svg,.sh-repair-leaders,.sh-burden-connectors,.sh-burden-text-backdrop,.sh-health-source-details,.sh-conditions-artwork').forEach(e=>e.remove());if(isDense(record))for(const label of text.querySelectorAll('.sh-number,.sh-subtitle'))label.setAttribute('data-shi-text-role','supporting');text.removeAttribute('class');text.querySelectorAll('[class]').forEach(e=>e.removeAttribute('class'));text.querySelectorAll('[style]').forEach(e=>e.removeAttribute('style'));if(isDense(record))for(const node of [text,...text.querySelectorAll('*')]){node.removeAttribute('data-arotec-text-tone');node.removeAttribute('data-arotec-text-mode');}return text;
  }
  function showFallback(record,failed){
    attr(record.section,'data-shi-failed',String(failed));record.reading.hidden=!failed;
    record.readingStatus.hidden=!failed;record.readingStatus.textContent=copy().error;
    readingText(record);
  }
  function readingText(record){
    // Healthy diagrams already contain every label and paragraph. Build a
    // replacement transcript only on confirmed failure, never a second copy.
    if(record.reading.hidden){
      if(record.readingCopy.childNodes.length)record.readingCopy.replaceChildren();
      record.readingSignature='';return;
    }
    const text=completeText(record,'shi-reading-');
    // The original text remains the single accessible copy and keeps the
    // existing anchor/focus IDs. This visual copy contains no interactive UI.
    for(const node of [text,...text.querySelectorAll('*')]){
      node.removeAttribute('tabindex');node.removeAttribute('autofocus');
      node.removeAttribute('data-arotec-text-tone');node.removeAttribute('data-arotec-text-mode');
    }
    const signature=locale()+'|'+text.outerHTML;
    if(signature!==record.readingSignature){record.readingCopy.replaceChildren(text);record.readingSignature=signature;}
    record.readingStatus.textContent=copy().error;
  }
  function setup(section){
    const record={section,near:false};if(isDense(record)){attr(section,'data-shi-dense','');attr(section,'data-shi-ready','false');}section.classList.add('shi-section');for(const child of section.children)if(!child.classList.contains('shm-mobile-diagram'))child.classList.add('shi-source');
    record.view=document.createElement('div');record.view.className='shi-view';record.view.setAttribute('data-arotec-i18n-ignore','');
    record.overview=document.createElement('div');record.overview.className='shi-overview';record.overview.setAttribute('aria-hidden','true');
    record.status=document.createElement('p');record.status.className='shi-status';record.status.textContent=copy().loading;
    record.ring=document.createElement('div');record.ring.className='shi-focus-ring';record.overview.append(record.status,record.ring);record.view.append(record.overview);
    record.reading=document.createElement('div');record.reading.className='shi-reading';record.reading.hidden=true;record.reading.setAttribute('data-arotec-i18n-ignore','');
    record.readingStatus=document.createElement('p');record.readingStatus.className='shi-reading-status';record.readingStatus.setAttribute('role','status');record.readingStatus.hidden=true;
    record.readingCopy=document.createElement('div');record.readingCopy.className='shi-reading-copy';record.readingCopy.setAttribute('aria-hidden','true');
    record.reading.append(record.readingStatus,record.readingCopy);section.append(record.view,record.reading);
    records.set(section,record);readingText(record);observeRepairSource(record);observeConditionsSource(record);return record;
  }
  function refresh(){updateQueued=false;for(const record of records.values()){record.repairUpdate?.();record.conditionsUpdate?.();readingText(record);render(record);}reserveBreadcrumb();}
  function queueRefresh(){if(updateQueued)return;updateQueued=true;requestAnimationFrame(refresh);}
  function resize(){
    resizeQueued=false;
    for(const record of records.values()){
      record.repairUpdate?.();record.conditionsUpdate?.();
      if(!viewerEnabled(record)){
        showFallback(record,false);
        if(isDense(record)){attr(record.section,'data-shi-ready','false');disposeFrame(record.retainedFrame);record.retainedFrame=null;}
        disposeFrame(record.frame);record.frame=null;record.signature='';record.overview.style.height='';record.overview.removeAttribute('data-ready');
      }else{render(record);overviewSize(record);}
    }
    reserveBreadcrumb();
  }
  function queueResize(){if(!resizeQueued){resizeQueued=true;requestAnimationFrame(resize);}}
  async function init(){
    if(window.ArotecI18n?.readyPromise)await window.ArotecI18n.readyPromise;
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){const record=records.get(entry.target);record.near=true;render(record);}},{rootMargin:'300px'});
    for(const section of sections){setup(section);observer.observe(section);}
    refresh();addEventListener('resize',queueResize,{passive:true});narrow.addEventListener('change',queueResize);burdenNarrow.addEventListener('change',queueResize);
    document.addEventListener('arotec:i18n-ready',queueRefresh);document.addEventListener('arotec:images-updated',queueRefresh);
    document.addEventListener('focusin',()=>{for(const record of records.values())focusRing(record);});document.addEventListener('focusout',()=>requestAnimationFrame(()=>{for(const record of records.values())focusRing(record);}));
    const breadcrumb=document.querySelector('.arotec-breadcrumbs');if(breadcrumb)new ResizeObserver(reserveBreadcrumb).observe(breadcrumb);
    api.refresh=queueRefresh;api.records=records;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
