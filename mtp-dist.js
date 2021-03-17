'use strict';

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

var vue_slides = document.querySelectorAll('.VueCarousel-slide .slideshow-section__background img');

var init_slides = function init_slides() {
  var init_slides = document.querySelectorAll('.VueCarousel-slide .slideshow-section__background img');
  for (var _i = 0; _i < vue_slides.length; _i++) {
    var the_image = vue_slides[_i];
    var image_wrap = the_image.parentElement;

    var new_image_1 = the_image.cloneNode(true);
    var new_image_2 = the_image.cloneNode(true);

    new_image_1.classList.add('sub_1');
    new_image_2.classList.add('sub_2');

    image_wrap.appendChild(new_image_1);
    image_wrap.appendChild(new_image_2);
    console.log(new_image_1);
  }
};

var _loop = function _loop(_i2) {
  var the_image = vue_slides[_i2];
  var image_wrap = the_image.parentElement;
  var defer_slides = void 0;

  defer_slides = setInterval(function () {
    if (the_image.getAttribute('lazy') == 'loaded') {
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
      clearInterval(defer_slides);
    }
  }, 100);
};

for (var _i2 = 0; _i2 < vue_slides.length; _i2++) {
  _loop(_i2);
}