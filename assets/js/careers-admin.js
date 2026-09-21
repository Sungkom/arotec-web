(() => {
 "use strict";
 const $=(id)=>document.getElementById(id), login=$("ca-login"), jobForm=$("ca-job-form"), appForm=$("ca-app-form"), dialog=$("ca-app-dialog");
 const apiBase="../api/admin/careers";
 const labels={draft:"Draft",published:"Published",closed:"Closed",new:"New",in_review:"In review",interview:"Interview",offer:"Offer",hired:"Hired",not_selected:"Not selected"};
 const jobFields=["title","department","location","employment_type","experience","summary","description","requirements","status"];
 let token="",jobs=[],editingJob=null,application=null,page=1,idleTimer=null,applicationsRequest=0;
 function node(tag,cls,text){const element=document.createElement(tag);if(cls)element.className=cls;if(text!==undefined)element.textContent=text;return element;}
 function message(id,text,error=false){const target=$(id);target.textContent=text;target.classList.toggle("is-error",error);}
 function date(value){const parsed=new Date(value);return Number.isNaN(parsed.getTime())?value:parsed.toLocaleString();}
 function badge(status){return node("span","ca-badge ca-badge--"+status,labels[status]||status);}
 function logout(reason=""){
  token="";jobs=[];application=null;editingJob=null;page=1;applicationsRequest+=1;clearTimeout(idleTimer);
  login.reset();jobForm.reset();appForm.reset();$("ca-app-filter").reset();
  ["ca-job-counts","ca-jobs-list","ca-apps-list","ca-app-info","ca-app-files"].forEach((id)=>$(id).replaceChildren());
  $("ca-workspace").hidden=true;$("ca-logout").hidden=true;$("ca-login-panel").hidden=false;
  if(dialog.open)dialog.close();message("ca-login-message",reason,Boolean(reason));
 }
 function touch(){clearTimeout(idleTimer);idleTimer=setTimeout(()=>logout("Signed out after 15 minutes of inactivity."),15*60*1000);}
 async function api(path,options={}){
  const credential=token;
  const headers={Authorization:"Bearer "+credential,...options.headers};
  const config={...options,headers,cache:"no-store",credentials:"omit",mode:"same-origin"};
  if(options.body!==undefined){headers["Content-Type"]="application/json";config.body=JSON.stringify(options.body);}
  const response=await fetch(apiBase+path,config);
  let data;try{data=await response.json();}catch{throw new Error("The recruitment server is unavailable. Open this page through the Python backend.");}
  if(token!==credential)throw new Error("Please sign in again.");
  if(response.status===401){logout("Please sign in again.");throw new Error(data.error||"Unauthorized.");}
  if(!response.ok||!data.ok)throw new Error(data.error||"The request could not be completed.");
  touch();return data;
 }
 function editor(job=null){
  editingJob=job;jobForm.reset();$("ca-editor-title").textContent=job?"Edit position":"New position";
  jobFields.forEach((name)=>{jobForm.elements[name].value=job?job[name]:(name==="status"?"draft":name==="employment_type"?"Full-time":"");});renderPreview();
 }
 function renderPreview(){
  const value=(name)=>jobForm.elements[name].value.trim(),status=value("status");
  $("ca-preview-title").textContent=value("title")||"Job title";
  $("ca-preview-location").textContent=value("location")||"Work location";
  $("ca-preview-summary").textContent=value("summary")||"A short summary of the role will appear here.";
  $("ca-preview-tags").replaceChildren();[value("employment_type"),value("experience")].filter(Boolean).forEach((text)=>$("ca-preview-tags").append(node("span","",text)));
  const role=value("department")+" "+value("title");
  $("ca-preview-icon").className="ph ph-"+(/fragrance|perfume/i.test(role)?"spray-bottle":/sensory/i.test(role)?"head-circuit":"flask");
  $("ca-publication-help").textContent=status==="published"?"Saving will make this position visible on Join Us and available in the application form.":status==="closed"?"Saving will hide this position from new applicants. Existing applications will remain available.":"Saving a draft keeps this position private until you publish it.";
  $("ca-save-job").textContent=status==="published"?(editingJob?.status==="published"?"Save published position":"Save and publish position"):status==="closed"?"Save closed position":"Save draft";
 }
 function renderJobs(){
  $("ca-job-counts").replaceChildren();["published","draft","closed"].forEach((status)=>{const count=node("div","ca-job-count");count.append(node("strong","",String(jobs.filter((job)=>job.status===status).length)),node("span","",labels[status]));$("ca-job-counts").append(count);});
  $("ca-jobs-list").replaceChildren();
  if(!jobs.length)$("ca-jobs-list").append(node("p","ca-help","No positions yet. Create your first position."));
  jobs.forEach((job)=>{
   const card=node("article","ca-job"),edit=node("button","ca-button ca-secondary","Edit position");edit.type="button";
   edit.addEventListener("click",()=>{editor(job);jobForm.scrollIntoView({block:"start"});});
   const state=node("div");state.append(badge(job.status));
   card.append(node("h3","",job.title),node("p","",[job.location,job.employment_type,job.experience].filter(Boolean).join(" / ")),state,edit);$("ca-jobs-list").append(card);
  });
 }
 async function loadJobs(){const data=await api("/jobs");jobs=data.jobs;renderJobs();}
 async function loadApplications(){
  const request=++applicationsRequest,requestedPage=page;
  const filter=new FormData($("ca-app-filter")),query=new URLSearchParams({page:String(requestedPage),q:filter.get("q")||"",status:filter.get("status")||""});
  const data=await api("/applications?"+query);if(request!==applicationsRequest)return;
  const pages=Math.max(1,Math.ceil(data.total/25));if(requestedPage>pages){page=pages;return loadApplications();}
  $("ca-apps-list").replaceChildren();
  data.applications.forEach((item)=>{
   const row=node("tr"),person=node("td");person.append(node("strong","",item.full_name),node("small","",item.email),node("small","",item.reference));
   const state=node("td");state.append(badge(item.status));const actions=node("td"),open=node("button","ca-button ca-secondary","Open");open.type="button";
   open.setAttribute("aria-label","Open application from "+item.full_name);open.addEventListener("click",()=>showApplication(item.id).catch((error)=>message("ca-message",error.message,true)));actions.append(open);
   row.append(person,node("td","",item.job_title),node("td","",date(item.created_at)),state,actions);$("ca-apps-list").append(row);
  });
  $("ca-empty-apps").hidden=Boolean(data.applications.length);
  $("ca-page-label").textContent="Page "+requestedPage+" of "+pages+" / "+data.total+" applications";
  $("ca-previous").disabled=page<=1;$("ca-next").disabled=page>=pages;
 }
 async function downloadFile(id,file,button){
  button.disabled=true;
  try {
   const credential=token,response=await fetch(apiBase+"/applications/"+id+"/files/"+file.kind,{headers:{Authorization:"Bearer "+credential},cache:"no-store",credentials:"omit",mode:"same-origin"});
   if(!response.ok){if(response.status===401)logout("Please sign in again.");throw new Error("Unable to download this document.");}
   const blob=await response.blob();if(token!==credential)throw new Error("Please sign in again.");
   const url=URL.createObjectURL(blob),link=node("a");link.href=url;link.download=file.filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);touch();
  }catch(error){message("ca-detail-message",error.message,true);}finally{button.disabled=false;}
 }
 async function showApplication(id){
  const data=await api("/applications/"+id);application=data.application;
  $("ca-app-reference").textContent=application.reference;$("ca-app-dialog-title").textContent=application.full_name;
  const fields=[
   ["Application type",application.job_id?"Position application":"Open application / General talent pool"],
   ["Position",application.job_title],["Email",application.email],["Mobile",application.phone],
   ["Current country / location",application.current_location],["Preferred locations",application.preferred_locations.join(", ")||"Not specified"],
   ["Current / most recent role",application.current_role||"Not specified"],
   ["Professional background",application.professional_background||"Not supplied"],
   ["Profile URL",application.profile_url||"Not supplied"],
   ["Recruitment consent",application.privacy_consent?"Given":"Not given"],["Future opportunities consent",application.future_consent?"Opted in":"Not opted in"],
   ["Consent version",application.consent_version],["Submitted",date(application.created_at)]
  ];
  $("ca-app-info").replaceChildren();fields.forEach(([label,value])=>$("ca-app-info").append(node("dt","",label),node("dd","",value)));
  $("ca-app-files").replaceChildren();application.files.forEach((file)=>{
   const button=node("button","ca-button ca-secondary",(file.kind==="resume"?"Resume / CV":"Portfolio / Supporting document")+" / "+file.filename+" ("+(file.size_bytes/1024/1024).toFixed(2)+" MB)");
   button.type="button";button.addEventListener("click",()=>downloadFile(id,file,button));$("ca-app-files").append(button);
  });
  appForm.elements.status.value=application.status;appForm.elements.admin_notes.value=application.admin_notes;
  message("ca-detail-message","");if(!dialog.open)dialog.showModal();
 }
 async function tab(which,refresh=true){
  const positions=which==="jobs";$("ca-jobs-panel").hidden=!positions;$("ca-apps-panel").hidden=positions;
  $("ca-jobs-tab").setAttribute("aria-pressed",String(positions));$("ca-apps-tab").setAttribute("aria-pressed",String(!positions));
  $("ca-jobs-tab").classList.toggle("ca-secondary",!positions);$("ca-apps-tab").classList.toggle("ca-secondary",positions);
  message("ca-message","");if(refresh){if(positions)await loadJobs();else await loadApplications();}
 }
 login.addEventListener("submit",async(event)=>{
  event.preventDefault();
  if(location.protocol!=="https:"&&!["localhost","127.0.0.1","[::1]"].includes(location.hostname)){message("ca-login-message","Use HTTPS to protect your admin password.",true);return;}
  const button=login.querySelector("button");button.disabled=true;token=login.elements.password.value.trim();message("ca-login-message","Signing in...");
  try {
   await loadJobs();login.reset();$("ca-login-panel").hidden=true;$("ca-workspace").hidden=false;$("ca-logout").hidden=false;
   editor();await tab("jobs",false);message("ca-login-message","");
  }catch(error){token="";message("ca-login-message",error.message,true);}finally{button.disabled=false;}
 });
 $("ca-logout").addEventListener("click",()=>logout());
 $("ca-jobs-tab").addEventListener("click",()=>tab("jobs").catch((error)=>message("ca-message",error.message,true)));
 $("ca-apps-tab").addEventListener("click",()=>tab("applications").catch((error)=>message("ca-message",error.message,true)));
 $("ca-new-job").addEventListener("click",()=>{editor();jobForm.elements.title.focus();});
 $("ca-reset-job").addEventListener("click",()=>editor());
 jobForm.addEventListener("input",renderPreview);jobForm.addEventListener("change",renderPreview);
 jobForm.addEventListener("submit",async(event)=>{
  event.preventDefault();const button=$("ca-save-job");button.disabled=true;
  const payload=Object.fromEntries(new FormData(jobForm));if(editingJob)payload.updated_at=editingJob.updated_at;
  try {
   await api(editingJob?"/jobs/"+editingJob.id:"/jobs",{method:editingJob?"PUT":"POST",body:payload});
   message("ca-message",payload.status==="published"?"Position published. It will appear on Join Us when the page is refreshed.":"Position saved as "+labels[payload.status].toLowerCase()+".");
   await loadJobs();editor();
  }catch(error){message("ca-message",error.message,true);}finally{button.disabled=false;}
 });
 $("ca-app-filter").addEventListener("submit",(event)=>{event.preventDefault();page=1;loadApplications().catch((error)=>message("ca-message",error.message,true));});
 $("ca-previous").addEventListener("click",()=>{page=Math.max(1,page-1);loadApplications().catch((error)=>message("ca-message",error.message,true));});
 $("ca-next").addEventListener("click",()=>{page+=1;loadApplications().catch((error)=>message("ca-message",error.message,true));});
 $("ca-close-dialog").addEventListener("click",()=>dialog.close());
 appForm.addEventListener("submit",async(event)=>{
  event.preventDefault();if(!application)return;const button=$("ca-save-app");button.disabled=true;const id=application.id;
  try {
   await api("/applications/"+id,{method:"PUT",body:{status:appForm.elements.status.value,admin_notes:appForm.elements.admin_notes.value,updated_at:application.updated_at}});
   await showApplication(id);message("ca-detail-message","Application progress saved.");await loadApplications();
  }catch(error){message("ca-detail-message",error.message,true);}finally{button.disabled=false;}
 });
 $("ca-delete-app").addEventListener("click",async()=>{
  if(!application||!confirm("Permanently delete this application and all submitted documents? This cannot be undone."))return;
  const button=$("ca-delete-app");button.disabled=true;
  try{await api("/applications/"+application.id,{method:"DELETE"});dialog.close();application=null;page=1;await loadApplications();message("ca-message","Application and documents deleted.");}
  catch(error){message("ca-detail-message",error.message,true);}finally{button.disabled=false;}
 });
 window.addEventListener("pagehide",()=>logout());
})();
