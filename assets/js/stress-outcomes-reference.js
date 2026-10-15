/* Latest Outcomes reference: unchanged live labels with source-exact arrow artwork. */
(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  function start(){
    const root=document.getElementById('disease-outcomes');
    if(!root||root.dataset.outcomesReferenceReady)return;
    const mechanism=root.querySelector('.sn-mechanisms'),feedback=root.querySelector('.sn-feedback');
    function svg(className,box,href,width,height){
      const e=document.createElementNS(NS,'svg');e.setAttribute('class',className);e.setAttribute('viewBox',box);
      e.setAttribute('aria-hidden','true');e.setAttribute('focusable','false');
      const image=document.createElementNS(NS,'image');image.setAttribute('href',href);image.setAttribute('width',width);image.setAttribute('height',height);e.append(image);return e;
    }
    for(const side of ['left','right']){const e=svg('sn-outcomes-reciprocal','0 0 137 65','../assets/images/stress-reference-refresh/outcomes/latest-reciprocal'+(side==='right'?'-right':'')+'-20261012.png',137,65);e.dataset.side=side;mechanism.append(e);}
    const loop=svg('sn-outcomes-feedback-loop','0 0 1680 252','../assets/images/stress-reference-refresh/outcomes/latest-feedback-20261012.png',1680,252);
    const defs=document.createElementNS(NS,'defs'),clip=document.createElementNS(NS,'clipPath'),envelope=document.createElementNS(NS,'path');
    clip.id='sn-outcomes-feedback-source-clip';clip.setAttribute('clipPathUnits','userSpaceOnUse');
    envelope.setAttribute('d','M0 56 L176 10 L220 0 H1360 L1500 28 L1680 66 V252 H0 Z');
    clip.append(envelope);defs.append(clip);loop.prepend(defs);loop.querySelector('image').setAttribute('clip-path','url(#sn-outcomes-feedback-source-clip)');
    feedback.prepend(loop);
    root.dataset.outcomesReferenceReady='true';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
