
// Only one accordion open at a time on small screens
(function(){
  const mql = window.matchMedia('(max-width: 782px)');
  function bind(){
    if(!mql.matches) return;
    const items = document.querySelectorAll('.services-accordion details');
    items.forEach(d=>{
      d.addEventListener('toggle', ()=>{
        if(d.open){ items.forEach(o=>{ if(o!==d && o.open) o.open = false; }); }
      });
    });
  }
  document.addEventListener('DOMContentLoaded', bind);
})();
