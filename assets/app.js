/* Общие скрипты подборок: автообновление версии, просмотр скриншотов, кнопка «Наверх», копирование ссылки на игру */
(function(){
  var V = "2026-11-14.1";
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

/* Кнопка «Ссылка на игру»: кладёт в буфер адрес карточки (…#id) */
(function(){
  function copyText(text){
    function legacy(){
      return new Promise(function(resolve,reject){
        var ta=document.createElement('textarea');
        ta.value=text; ta.setAttribute('readonly','');
        ta.style.cssText='position:fixed;top:-2000px;left:-2000px;opacity:0';
        document.body.appendChild(ta); ta.focus(); ta.select();
        var ok=false;
        try{ ok=document.execCommand('copy'); }catch(e){ ok=false; }
        document.body.removeChild(ta);
        if(ok){ resolve(); } else { reject(new Error('copy failed')); }
      });
    }
    if(navigator.clipboard && window.isSecureContext){
      return navigator.clipboard.writeText(text).catch(legacy);
    }
    return legacy();
  }
  var CARDS=document.querySelectorAll('article.card[id]');
  for(var i=0;i<CARDS.length;i++){
    (function(card){
      var foot=card.querySelector('.foot');
      if(!foot) return;
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='copylink';
      var nameEl=card.querySelector('h3');
      var gameName=nameEl?nameEl.textContent.trim():'';
      var hint='Скопировать ссылку на игру'+(gameName?' «'+gameName+'»':'');
      btn.title=hint;
      btn.setAttribute('aria-label',hint);
      btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg><span>Ссылка на игру</span>';
      var label=btn.querySelector('span');
      var timer=null;
      function reset(){ btn.classList.remove('done'); label.textContent='Ссылка на игру'; }
      btn.addEventListener('click',function(){
        var base=location.href.split('#')[0].split('?')[0];
        copyText(base+'#'+card.id).then(function(){
          btn.classList.add('done'); label.textContent='Скопировано';
        }).catch(function(){
          label.textContent='Не вышло';
        });
        clearTimeout(timer); timer=setTimeout(reset,1800);
      });
      var steam=foot.querySelector('.steam');
      if(steam){ foot.insertBefore(btn,steam); } else { foot.appendChild(btn); }
    })(CARDS[i]);
  }
})();
