'use strict';

var main_content = document.querySelector('.default-layout');
var drop_navs = document.querySelectorAll('.site-nav--has-dropdown');
var header = document.querySelector('.header-section');

var defer_drops = void 0;

for (var i = 0; i < drop_navs.length; i++) {
  drop_navs[i].addEventListener('mouseenter', function () {
    clearTimeout(defer_drops);
    if (!header.classList.contains('show_mega')) {
      header.classList.add('show_mega');
    }
  });
  drop_navs[i].addEventListener('mouseleave', function () {
    defer_drops = setTimeout(function () {
      if (header.classList.contains('show_mega')) {
        header.classList.remove('show_mega');
      }
    }, 100);
  });
}

var init_slides = function init_slides() {
  console.log('init slides');

  var vue_slides = document.querySelectorAll('.section[data-id="homepage_slideshow"] .VueCarousel-slide .slideshow-section__background img');
  var first_slide = document.querySelector('.section[data-id="homepage_slideshow"] .VueCarousel-inner .VueCarousel-slide:first-child');
  if (!first_slide.classList.contains('VueCarousel-slide-active')) {
    first_slide.classList.add('VueCarousel-slide-active');
  }

  var _loop = function _loop(_i) {
    var the_image = vue_slides[_i];
    var image_wrap = the_image.parentElement;
    var defer_slides = void 0;

    defer_slides = setInterval(function () {
      if (the_image.getAttribute('lazy') == 'loaded') {
        console.log('trigger slide');
        clearInterval(defer_slides);
        var new_image_1 = the_image.cloneNode(true);
        var new_image_2 = the_image.cloneNode(true);

        var new_wrap_0 = document.createElement('DIV');
        var new_wrap_1 = document.createElement('DIV');
        var new_wrap_2 = document.createElement('DIV');

        new_wrap_0.classList.add('sub_wrap-1');
        new_wrap_1.classList.add('sub_wrap-2');
        new_wrap_2.classList.add('sub_wrap-3');

        new_wrap_0.appendChild(the_image);
        new_wrap_1.appendChild(new_image_1);
        new_wrap_2.appendChild(new_image_2);

        image_wrap.appendChild(new_wrap_0);
        image_wrap.appendChild(new_wrap_1);
        image_wrap.appendChild(new_wrap_2);

        console.log('lazy_loaded');
      }
    }, 100);
  };

  for (var _i = 0; _i < vue_slides.length; _i++) {
    _loop(_i);
  }
};

var main_content_observer = function main_content_observer(mutations) {
  console.log('Main content changed');
  var home_slider = document.querySelector('.section[data-id="homepage_slideshow"]');
  var vueWrap = document.getElementById('gallery-carousel');
  if (home_slider) {
    if (!vueWrap.classList.contains('mutated')) {
      vueWrap.classList.add('mutated');
      init_slides();
    }
  }
  var sticky_bar = document.getElementById('sticky-bar');
  if (sticky_bar) {
    if (!main_content.classList.contains('stickies')) main_content.classList.add('stickies');
  } else {
    if (main_content.classList.contains('stickies')) main_content.classList.remove('stickies');
  }
};

if (main_content) {

  var main_observer = new MutationObserver(main_content_observer);
  var options = {
    childList: true,
    subtree: true
  };

  main_observer.observe(main_content, options);
  // console.log('Observing main content')
}