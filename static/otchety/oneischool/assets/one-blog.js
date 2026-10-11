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
})();
