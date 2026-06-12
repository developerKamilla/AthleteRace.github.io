function animatePage(id){
  const el=document.getElementById(id); if(!el) return;
  el.animate([{opacity:.4,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});
}
document.addEventListener('pointermove',e=>{
  document.documentElement.style.setProperty('--mx',e.clientX+'px');
  document.documentElement.style.setProperty('--my',e.clientY+'px');
});
