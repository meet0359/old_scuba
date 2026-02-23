// Adds native lazy-loading to non-critical images after DOMContentLoaded
(function(){
  'use strict';
  function shouldSkip(img){
    if(!img) return true;
    // skip images inside header, logo, nav-logo, banner-carousel (likely critical)
    if(img.closest('.main-header')) return true;
    if(img.closest('.logo')) return true;
    if(img.closest('.nav-logo')) return true;
    if(img.closest('.banner-carousel')) return true;
    if(img.closest('.preloader')) return true;
    return false;
  }

  document.addEventListener('DOMContentLoaded', function(){
    try{
      var imgs = document.querySelectorAll('img');
      imgs.forEach(function(img){
        if(shouldSkip(img)) return;
        if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
      });
    }catch(e){/* silent */}
  });
})();
