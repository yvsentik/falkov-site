(function(){
  'use strict';
  var mm=document.getElementById('mobmenu'), b=document.getElementById('burger'), c=document.getElementById('mobClose');
  function tog(on){ if(!mm) return; mm.classList.toggle('is-open',on); document.body.style.overflow=on?'hidden':''; }
  if(b) b.addEventListener('click',function(){tog(true)});
  if(c) c.addEventListener('click',function(){tog(false)});
  if(mm) mm.addEventListener('click',function(e){ if(e.target.closest('a')) tog(false); });
  document.querySelectorAll('.faq__q').forEach(function(q){
    q.addEventListener('click',function(){ q.parentElement.classList.toggle('is-open'); });
  });
  document.querySelectorAll('.chips[data-filter]').forEach(function(box){
    var grid=document.querySelector(box.dataset.filter), attr=box.dataset.attr, chips=box.querySelectorAll('.chip');
    chips.forEach(function(ch){ ch.addEventListener('click',function(){
      chips.forEach(function(o){o.classList.remove('is-on')}); ch.classList.add('is-on');
      var v=ch.dataset.v;
      Array.prototype.forEach.call(grid.children,function(el){ var x=el.dataset[attr]; el.hidden=!(v==='all'||x===v||(attr==='stage'&&x==='all')); });
    }); });
  });
  /* содержание: подсветка текущего раздела + полоса прогресса */
  var links=[].slice.call(document.querySelectorAll('.toc a')), bar=document.getElementById('rbar'), body=document.querySelector('.art__body');
  if(links.length){
    var secs=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
    var tick=false;
    function spy(){
      tick=false; var y=window.scrollY+180, cur=-1;
      secs.forEach(function(s,i){ if(s && s.getBoundingClientRect().top+window.scrollY<=y) cur=i; });
      links.forEach(function(a,i){ a.parentElement.classList.toggle('is-on',i===cur); });
      if(bar&&body){ var r=body.getBoundingClientRect(), p=Math.min(1,Math.max(0,(-r.top+200)/(r.height-window.innerHeight+400))); bar.style.width=(p*100)+'%'; }
    }
    window.addEventListener('scroll',function(){ if(!tick){tick=true;requestAnimationFrame(spy);} },{passive:true});
    spy();
  }
})();
