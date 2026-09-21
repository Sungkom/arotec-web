(() => {
 "use strict";
 const $ = (id) => document.getElementById(id);
 const form = $("ju-application"), submit = $("ju-submit"), select = $("ju-position"), general = $("ju-general");
 const jobsRoot = $("ju-jobs"), jobsStatus = $("ju-jobs-status"), status = $("ju-submit-status"), dialog = $("ju-job-dialog");
 const background = $("ju-background"), backgroundNext = $("ju-background-next");
 let jobs = [], accepting = false, showAll = false, selectedJob = null, submitting = false, submissionKey = "";
 const secure = location.protocol === "https:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
 function newKey() { const bytes = new Uint8Array(16); crypto.getRandomValues(bytes); return Array.from(bytes, (n) => n.toString(16).padStart(2,"0")).join(""); }
 function el(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
 function icon(name) { const node = el("i", "ph ph-" + name); node.setAttribute("aria-hidden","true"); return node; }
 function message(text, error) { status.textContent = text; status.classList.toggle("is-error", Boolean(error)); }
 function syncGeneral() { select.disabled = general.checked; select.required = !general.checked; }
 function showBackground() { background.hidden=false; backgroundNext.setAttribute("aria-expanded","true"); }
 // A country/region is saved in the existing current_location field.
 const regionCodes="AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" ");
 const regionNames=typeof Intl.DisplayNames==="function"?new Intl.DisplayNames(["en"],{type:"region"}):null;
 regionCodes.map((code)=>regionNames?regionNames.of(code):code).sort((a,b)=>a.localeCompare(b,"en")).forEach((name)=>form.elements.current_location.add(new Option(name,name)));
 document.querySelectorAll(".ju-steps li:not(:last-child)").forEach((step)=>{const arrow=icon("caret-right");arrow.classList.add("ju-step-arrow");step.append(arrow);});
 function apply(job) {
  general.checked = !job;
  select.value = job ? job.id : "";
  syncGeneral();
  if (dialog.open) dialog.close();
  form.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  form.elements.full_name.focus({preventScroll:true});
 }
 function details(job) {
  selectedJob = job;
  $("ju-job-dialog-title").textContent = job.title;
  $("ju-job-dialog-meta").textContent = [job.department,job.location,job.employment_type,job.experience].filter(Boolean).join(" / ");
  $("ju-job-dialog-description").textContent = job.description;
  $("ju-job-dialog-requirements").textContent = job.requirements || "Please refer to the role description.";
  $("ju-job-dialog-apply").disabled = !accepting;
  dialog.showModal();
 }
 function renderJobs() {
  jobsRoot.replaceChildren();
  (showAll ? jobs : jobs.slice(0,3)).forEach((job) => {
   const card=el("article","ju-job"), heading=el("div","ju-job-header"), glyph=el("span","ju-icon");
   glyph.append(icon(/fragrance|perfume/i.test(job.department+" "+job.title)?"spray-bottle":/sensory/i.test(job.department+" "+job.title)?"head-circuit":"flask"));
   const copy=el("div"),locationLine=el("p","ju-job-location");locationLine.append(icon("map-pin"),document.createTextNode(job.location));copy.append(el("h3","",job.title),locationLine);
   const tags=el("div","ju-tags"); [job.employment_type,job.experience].filter(Boolean).forEach((text)=>tags.append(el("span","",text))); copy.append(tags); heading.append(glyph,copy);
   const actions=el("div","ju-job-actions"), view=el("button","ju-button ju-button--outline","View details"), applyButton=el("button","ju-button","Apply now");
   view.type=applyButton.type="button"; view.addEventListener("click",()=>details(job)); applyButton.disabled=!accepting; applyButton.addEventListener("click",()=>apply(job));
   actions.append(view,applyButton); card.append(heading,el("p","ju-job-summary",job.summary),actions); jobsRoot.append(card);
  });
  $("ju-all-jobs").hidden=showAll || jobs.length<=3;
 }
 async function loadJobs() {
  try {
   const response=await fetch("../api/careers/jobs",{cache:"no-store",credentials:"same-origin"});
   if(!response.ok) throw new Error("The recruitment service is temporarily unavailable.");
   const data=await response.json();
   if(!data.ok || !Array.isArray(data.jobs)) throw new Error("Could not load current opportunities.");
   const referenceOrder=["Senior Flavorist","Perfumer","Sensory Scientist"];
   const priority=(job)=>{const index=referenceOrder.indexOf(job.title);return index<0?referenceOrder.length:index;};
   jobs=data.jobs.sort((a,b)=>priority(a)-priority(b)); accepting=Boolean(data.accepting_applications) && secure;
   select.replaceChildren(new Option("Select a position",""));
   jobs.forEach((job)=>select.add(new Option(job.title+" / "+job.location,job.id)));
   jobsStatus.textContent=jobs.length?"":"There are no published positions at the moment. You can still join our talent network.";
   jobsStatus.classList.remove("is-error"); renderJobs(); submit.disabled=!accepting;
   if(!secure) message("Please use the HTTPS version of this website before entering or submitting personal information.",true);
   else if(!data.accepting_applications) message("The application service is not accepting submissions yet. Please try again later.",true);
  } catch(error) {
   accepting=false; submit.disabled=true; jobsStatus.textContent="Current opportunities could not be loaded. Please try again later."; jobsStatus.classList.add("is-error");
   message("The application service is unavailable. No information has been submitted.",true);
  }
 }
 function validateFile(input) {
  const file=input.files[0], limit=(input.name==="resume"?10:20)*1024*1024;
  input.setCustomValidity("");
  const info=document.querySelector('[data-file-info="'+input.name+'"]');
  info.textContent=file?file.name+" ("+(file.size/1024/1024).toFixed(2)+" MB)":"";
  if(file && (!/\.pdf$/i.test(file.name) || file.size>limit || !file.size)) input.setCustomValidity("Choose a non-empty PDF no larger than "+(input.name==="resume"?10:20)+" MB.");
 }
 form.querySelectorAll('input[type="file"]').forEach((input)=>input.addEventListener("change",()=>{validateFile(input);input.reportValidity();}));
 general.addEventListener("change",syncGeneral);
 $("ju-talent-button").addEventListener("click",()=>apply(null));
 $("ju-all-jobs").addEventListener("click",()=>{showAll=true;renderJobs();});
 backgroundNext.addEventListener("click",()=>{showBackground();background.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});form.elements.current_role.focus({preventScroll:true});});
 form.addEventListener("invalid",(event)=>{if(background.contains(event.target)) showBackground();},true);
 dialog.querySelector(".ju-dialog-close").addEventListener("click",()=>dialog.close());
 $("ju-job-dialog-apply").addEventListener("click",()=>apply(selectedJob));
 form.addEventListener("input",()=>{if(!submitting) submissionKey="";});
 form.addEventListener("submit",async(event)=>{
  event.preventDefault();
  if(submitting || !accepting) return;
  validateFile(form.elements.resume);validateFile(form.elements.portfolio);
  if(!form.reportValidity()) return;
  const data=new FormData(form);
  data.set("preferred_locations",JSON.stringify(data.getAll("preferred_locations")));
  submissionKey=submissionKey || newKey();data.set("submission_key",submissionKey);
  submitting=true;submit.disabled=true;submit.textContent="Submitting...";
  const controls=Array.from(form.elements).filter((node)=>"disabled" in node).map((node)=>[node,node.disabled]);
  controls.forEach(([node])=>{node.disabled=true;});
  message("Uploading and saving your application. Please keep this page open.",false);
  try {
   const response=await fetch("../api/careers/applications",{method:"POST",body:data,credentials:"same-origin"});
   const result=await response.json();
   if(!response.ok || !result.ok) throw new Error(result.error || "Unable to submit your application.");
   form.reset();submissionKey="";background.hidden=true;backgroundNext.setAttribute("aria-expanded","false");
   form.querySelectorAll(".ju-file-info").forEach((node)=>{node.textContent="";});
   message("Your application and documents have been received. Reference: "+result.reference+". Please keep this reference for your records.",false);
   status.focus();
  } catch(error) {
   message(error.message || "The connection was interrupted. Please retry; the same submission reference will be used to avoid duplicates.",true);status.focus();
  } finally {
   controls.forEach(([node,disabled])=>{node.disabled=disabled;});
   submitting=false;submit.textContent="Submit application";submit.disabled=!accepting;syncGeneral();
  }
 });
 syncGeneral();loadJobs();
})();
