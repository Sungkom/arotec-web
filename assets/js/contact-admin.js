(() => {
 "use strict";
 const $=id=>document.getElementById(id),login=$("ct-login"),filter=$("ct-filter"),form=$("ct-detail-form"),dialog=$("ct-dialog");
 if(!login)return;
 const base="../api/admin/contact/inquiries";
 const labels={new:"New",in_progress:"In progress",replied:"Replied",closed:"Closed"};
 const topics={"new_project":"Start a new project","improve_product":"Develop or improve a product","sensory_strategy":"Sensory strategy & consulting","find_solution":"Find a solution","co_creation":"Co-creation & innovation","partnership":"Business & strategic partnership"};
 let token="",generation=0,page=1,selected=null,idle=null,listRun=0,detailRun=0;
 const element=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
 const message=(id,text,error=false)=>{const node=$(id);node.textContent=text;node.classList.toggle("is-error",error);};
 const date=value=>{const time=new Date(value);return Number.isNaN(time.getTime())?value:time.toLocaleString();};
 function logout(reason=""){
  token="";generation++;listRun++;detailRun++;selected=null;clearTimeout(idle);login.reset();form.reset();
  $("ct-inquiries").replaceChildren();$("ct-info").replaceChildren();$("ct-reference").textContent="";$("ct-dialog-title").textContent="Inquiry";$("ct-reply").removeAttribute("href");
  $("ct-workspace").hidden=true;$("ct-logout").hidden=true;$("ct-login-panel").hidden=false;
  if(dialog.open)dialog.close();message("ct-message","");message("ct-detail-message","");message("ct-login-message",reason,Boolean(reason));
 }
 function touch(){if(!token)return;clearTimeout(idle);idle=setTimeout(()=>logout("Signed out after 15 minutes of inactivity."),15*60*1000);}
 async function api(path="",options={}){
  const credential=token,session=generation,headers={Authorization:"Bearer "+credential},config={...options,headers,cache:"no-store",credentials:"omit",mode:"same-origin"};
  if(options.body!==undefined){headers["Content-Type"]="application/json";config.body=JSON.stringify(options.body);}
  const response=await fetch(base+path,config);let data;
  try{data=await response.json();}catch{throw new Error("Open this page through the Arotec Python server. The inquiry service is unavailable.");}
  if(generation!==session||token!==credential)throw new Error("Please sign in again.");
  if(response.status===401){logout("Please sign in again.");throw new Error(data.error||"Unauthorized.");}
  if(!response.ok||!data.ok)throw new Error(data.error||"Unable to complete this request.");
  touch();return data;
 }
 function badge(state){return element("span","ca-badge ca-badge--"+state,labels[state]||state);}
 async function loadList(){
  const run=++listRun,filters=new FormData(filter),query=new URLSearchParams({page:String(page),q:filters.get("q")||"",status:filters.get("status")||""});
  const data=await api("?"+query);if(run!==listRun)return;
  $("ct-inquiries").replaceChildren();
  data.inquiries.forEach(item=>{
   const row=element("tr"),person=element("td"),company=element("td"),status=element("td"),action=element("td");
   person.append(element("strong","",item.first_name+" "+item.last_name),element("small","",item.email),element("small","",item.reference));
   company.append(element("strong","",item.company),element("small","",item.area_of_interest));status.append(badge(item.status));
   const button=element("button","ca-button ca-secondary","Open");button.type="button";button.setAttribute("aria-label","Open inquiry "+item.reference);
   button.addEventListener("click",()=>openInquiry(item.id).catch(error=>message("ct-message",error.message,true)));action.append(button);
   row.append(person,company,element("td","",topics[item.help_topic]||item.help_topic),element("td","",date(item.created_at)),status,action);
   $("ct-inquiries").append(row);
  });
  $("ct-empty").hidden=Boolean(data.inquiries.length);
  const pages=Math.max(1,Math.ceil(data.total/25));$("ct-page-label").textContent="Page "+page+" of "+pages;
  $("ct-caption").textContent=data.total+" inquiries matching your filters";$("ct-previous").disabled=page<=1;$("ct-next").disabled=page>=pages;
 }
 function renderInquiry(item){
  selected=item;$("ct-reference").textContent=item.reference;$("ct-dialog-title").textContent=item.first_name+" "+item.last_name;
  const fields=[["First name",item.first_name],["Last name",item.last_name],["Company",item.company],["Job title",item.job_title||"Not supplied"],
   ["Email",item.email],["Country / Region",item.country],["Area of interest",item.area_of_interest],["How we can help",topics[item.help_topic]||item.help_topic],
   ["Message",item.message||"Not supplied"],["Consent to respond",item.privacy_consent?"Yes":"No"],["Consent version",item.consent_version],
   ["Submitted",date(item.created_at)],["Last updated",date(item.updated_at)]];
  $("ct-info").replaceChildren();fields.forEach(([label,value])=>$("ct-info").append(element("dt","",label),element("dd","",value)));
  $("ct-reply").href="mailto:"+encodeURIComponent(item.email)+"?subject="+encodeURIComponent("Your Arotec inquiry "+item.reference);
  form.elements.status.value=item.status;form.elements.admin_notes.value=item.admin_notes;
 }
 async function openInquiry(id){
  const run=++detailRun,data=await api("/"+id);if(run!==detailRun)return;
  renderInquiry(data.inquiry);message("ct-detail-message","");if(!dialog.open)dialog.showModal();
 }
 login.addEventListener("submit",async event=>{
  event.preventDefault();
  if(location.protocol!=="https:"&&!["localhost","127.0.0.1","[::1]"].includes(location.hostname)){message("ct-login-message","Use HTTPS or the local Arotec server to protect your password.",true);return;}
  const button=login.querySelector("button");button.disabled=true;token=login.elements.password.value.trim();generation++;page=1;filter.reset();message("ct-login-message","Signing in...");
  try{await loadList();login.reset();$("ct-login-panel").hidden=true;$("ct-workspace").hidden=false;$("ct-logout").hidden=false;message("ct-login-message","");}
  catch(error){logout();message("ct-login-message",error.message,true);}finally{button.disabled=false;}
 });
 $("ct-logout").addEventListener("click",()=>logout());
 $("ct-refresh").addEventListener("click",()=>{message("ct-message","");loadList().catch(error=>message("ct-message",error.message,true));});
 filter.addEventListener("submit",event=>{event.preventDefault();page=1;message("ct-message","");loadList().catch(error=>message("ct-message",error.message,true));});
 $("ct-previous").addEventListener("click",()=>{page=Math.max(1,page-1);loadList().catch(error=>message("ct-message",error.message,true));});
 $("ct-next").addEventListener("click",()=>{page++;loadList().catch(error=>message("ct-message",error.message,true));});
 $("ct-close").addEventListener("click",()=>dialog.close());
 form.addEventListener("submit",async event=>{
  event.preventDefault();if(!selected)return;
  const item=selected;$("ct-save").disabled=true;message("ct-detail-message","");
  try{
   const data=await api("/"+item.id,{method:"PUT",body:{status:form.elements.status.value,admin_notes:form.elements.admin_notes.value,updated_at:item.updated_at}});
   if(selected&&selected.id===item.id){renderInquiry(data.inquiry);message("ct-detail-message","Progress saved. No email was sent.");}
   await loadList();
  }catch(error){message("ct-detail-message",error.message,true);}finally{$("ct-save").disabled=false;}
 });
 $("ct-delete").addEventListener("click",async()=>{
  if(!selected||!confirm("Permanently delete inquiry "+selected.reference+"? This cannot be undone."))return;
  const id=selected.id;$("ct-delete").disabled=true;
  try{await api("/"+id,{method:"DELETE"});dialog.close();selected=null;page=1;await loadList();message("ct-message","Inquiry deleted.");}
  catch(error){message("ct-detail-message",error.message,true);}finally{$("ct-delete").disabled=false;}
 });
 ["pointerdown","keydown"].forEach(name=>document.addEventListener(name,touch,{passive:true}));
 window.addEventListener("pagehide",()=>logout());
})();

