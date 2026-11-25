(function(){'use strict';const stage=document.querySelector('.fcx-stage');if(!stage)return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-fikra-open]').forEach(btn=>btn.addEventListener('click',()=>{if(window.FikraConnect?.open)window.FikraConnect.open();else document.getElementById('fikraConnectDemo')?.click()}));
if(!reduce.matches&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
 let active=false;stage.addEventListener('pointermove',e=>{if(active)return;active=true;requestAnimationFrame(()=>{const rect=stage.getBoundingClientRect();stage.style.setProperty('--mx',((e.clientX-rect.left)/rect.width*100).toFixed(1)+'%');stage.style.setProperty('--my',((e.clientY-rect.top)/rect.height*100).toFixed(1)+'%');active=false})});
 stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--mx','50%');stage.style.setProperty('--my','50%')});
}
})();