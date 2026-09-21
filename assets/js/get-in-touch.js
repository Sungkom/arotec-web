(() => {
 "use strict";
 const form=document.getElementById("ci-form"),button=document.getElementById("ci-submit"),feedback=document.getElementById("ci-feedback");
 if(!form)return;
 const base="../api/contact";
 let ready=false,sending=false,submissionKey="";
 const secure=location.protocol==="https:"||["localhost","127.0.0.1","[::1]"].includes(location.hostname);
 function message(text,state=""){feedback.textContent=text;feedback.classList.toggle("is-error",state==="error");feedback.classList.toggle("is-success",state==="success");}
 function key(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),byte=>byte.toString(16).padStart(2,"0")).join("");}
 async function responseData(response){
  let data;try{data=await response.json();}catch{throw new Error("The inquiry service is unavailable. Open this page through the website server, not a local file.");}
  if(!response.ok||!data.ok)throw new Error(data.error||"Unable to send your inquiry. Please try again.");
  return data;
 }
 async function connect(){
  if(!secure){message("To protect your information, open this page through HTTPS or the local Arotec server.","error");return;}
  try{
   const data=await responseData(await fetch(base+"/status",{cache:"no-store",credentials:"omit",mode:"same-origin"}));
   ready=data.accepting_inquiries===true;button.disabled=!ready;
   message(ready?"":"The inquiry service is not accepting submissions yet. Please contact our team by email below.",ready?"":"error");
  }catch(error){message(error.message,"error");}
 }
 form.addEventListener("input",()=>{if(!sending)submissionKey="";});
 form.addEventListener("change",()=>{if(!sending)submissionKey="";});
 form.addEventListener("submit",async(event)=>{
  event.preventDefault();if(sending)return;
  if(!ready){message("The inquiry service is unavailable. Please try again later or use the email contacts below.","error");return;}
  if(!form.reportValidity())return;
  const payload=Object.fromEntries(new FormData(form));
  payload.privacy_consent=form.elements.privacy_consent.checked;
  submissionKey=submissionKey||key();payload.submission_key=submissionKey;
  const controls=Array.from(form.elements).filter(element=>"disabled" in element),prior=controls.map(element=>element.disabled);
  sending=true;controls.forEach(element=>element.disabled=true);form.setAttribute("aria-busy","true");message("Submitting your inquiry...");
  try{
   const data=await responseData(await fetch(base+"/inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),cache:"no-store",credentials:"omit",mode:"same-origin"}));
   form.reset();submissionKey="";message("Thank you. Your inquiry has been saved. Reference: "+data.reference+". Our team will get back to you.","success");feedback.focus();
  }catch(error){message(error.message,"error");feedback.focus();}
  finally{sending=false;controls.forEach((element,index)=>element.disabled=prior[index]);button.disabled=!ready;form.removeAttribute("aria-busy");}
 });
 connect();
})();

