/* Общие скрипты подборок: автообновление версии, просмотр скриншотов, кнопка «Наверх» */
(function(){
  var V = "2026-11-11.1";
  try {
    fetch("../version.json?t=" + Date.now(), {cache: "no-store"}).then(function(r){ return r.ok ? r.json() : null; }).then(function(d){
      if (!d || !d.v || d.v === V) return;
      var k = "vupd:" + d.v;
      try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); } catch (e) {}
      location.replace(location.pathname + "?v=" + encodeURIComponent(d.v) + location.hash);
    }).catch(function(){});
  } catch (e) {}
})();

(function(){
  var lb=document.createElement('div'); lb.className='lb'; lb.innerHTML='<img alt="">';
  document.body.appendChild(lb); var im=lb.querySelector('img');
  document.addEventListener('click',function(e){
    var b=e.target.closest('.shot');
    if(b){ im.src=b.getAttribute('data-full'); lb.classList.add('on'); document.body.style.overflow='hidden'; return; }
    if(e.target.closest('.lb')){ lb.classList.remove('on'); document.body.style.overflow=''; }
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ lb.classList.remove('on'); document.body.style.overflow=''; }});
})();
(function(){
  var btn=document.querySelector('.totop');
  if(!btn) return;
  var touch = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  function upd(){
    var nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120;
    if(window.scrollY>500 && !(touch && nearBottom)){btn.classList.add('on');}else{btn.classList.remove('on');}
  }
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('resize',upd);
  upd();
  btn.addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); });
})();
