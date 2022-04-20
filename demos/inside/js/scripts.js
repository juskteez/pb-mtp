/* Initiate functions */
//if (gsap) gsap.registerPlugin(ScrollTrigger);

// Add Window Events
var addEvent = function(object, type, callback) {
  if (object == null || typeof(object) == 'undefined') return;
  if (object.addEventListener) {
    object.addEventListener(type, callback, false);
  } else if (object.attachEvent) {
    object.attachEvent('on' + type, callback);
  } else {
    object['on' + type] = callback;
  }
};

var site_body      = document.body,
    search_input   = document.getElementById('search-input'),
    executer_input = document.getElementById('search-popup-executer'),
    popup_closer   = document.querySelectorAll('.popup-close'),
    search_trigger = document.querySelectorAll('[for="search_popup"]'),
    search_key     = document.getElementById('skw'),
    searchDelay    = 1000,
    loaded         = false,
    searchDefer, searchProcess;

var all_previews = document.querySelectorAll('.product-preview-single');

var mouseX = 0,
    mouseY = 0;

window.addEventListener('mousemove', function(event) {

  if (window.innerWidth > 1280) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

});

// Limit Number
function minmax(num, min, max){
  const MIN = min || -100;
  const MAX = max || 100;
  const parsed = num // parseInt(num)
  return Math.min(Math.max(parsed, MIN), MAX)
}

// Lazy Image Listener
document.addEventListener("DOMContentLoaded", function() {
  let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
  let active = false;

  const lazyLoad = function() {
    if (active === false) {
      active = true;

      setTimeout(function() {
        lazyImages.forEach(function(lazyImage) {
          if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.srcset = lazyImage.dataset.srcset;
            lazyImage.classList.remove("lazy");
            lazyImage.classList.add("lazied");

            lazyImages = lazyImages.filter(function(image) {
              return image !== lazyImage;
            });

            if (lazyImages.length === 0) {
              document.removeEventListener("scroll", lazyLoad);
              window.removeEventListener("resize", lazyLoad);
              window.removeEventListener("orientationchange", lazyLoad);
            }
          }
        });

        active = false;
      }, 700);
    }
  };

  document.addEventListener("scroll", lazyLoad);
  window.addEventListener("resize", lazyLoad);
  window.addEventListener("orientationchange", lazyLoad);

  lazyLoad();
});

// Easing Conversion
(function (definition) {
  if (typeof exports === "object") {
    module.exports = definition();
  }
  else if (typeof window.define === 'function' && window.define.amd) {
    window.define([], definition);
  } else {
    window.BezierEasing = definition();
  }
}(function () {

  /**
  * BezierEasing - use bezier curve for transition easing function
  * is inspired from Firefox's nsSMILKeySpline.cpp
  * Usage:
  * var spline = new BezierEasing(0.25, 0.1, 0.25, 1.0)
  * spline(x) => returns the easing value | x must be in [0, 1] range
  */
  function BezierEasing (mX1, mY1, mX2, mY2) {
    if (!(this instanceof BezierEasing)) return new BezierEasing(mX1, mY1, mX2, mY2);
   
    function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C(aA1)      { return 3.0 * aA1; }
   
    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function CalcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
    }
   
    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function GetSlope(aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }
   
    function GetTForX(aX) {
      // Newton raphson iteration
      var aGuessT = aX;
      for (var i = 0; i < 4; ++i) {
        var currentSlope = GetSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) return aGuessT;
        var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }

    return function (aX) {
      if (mX1 === mY1 && mX2 === mY2) return aX; // linear
      return CalcBezier(GetTForX(aX), mY1, mY2);
    };
  }

  // CSS mapping
  BezierEasing.css = {
    "ease":        BezierEasing(0.25, 0.1, 0.25, 1.0), 
    "linear":      BezierEasing(0.00, 0.0, 1.00, 1.0),
    "ease-in":     BezierEasing(0.42, 0.0, 1.00, 1.0),
    "ease-out":    BezierEasing(0.00, 0.0, 0.58, 1.0),
    "ease-in-out": BezierEasing(0.42, 0.0, 0.58, 1.0),
    "carousel":    BezierEasing(0.56, 0.0, 0.24, 1.0)
  };

  return BezierEasing;

}));

// Easing a Progress 0% --> 100%
function animate (render, duration, easing, startPoint, endPoint) {
  var start = Date.now();
  (function loop () {
    var p = (Date.now()-start)/duration;
    if (p > 1) {
      render(1, startPoint, endPoint);
    }
    else {
      requestAnimationFrame(loop);
      render(easing(p), startPoint, endPoint);
    }
  }());
}

// Search popup input keys & results
function process_input(input_value) {

  clearTimeout(searchDefer);
  clearTimeout(searchProcess);

  search_key.innerHTML = '"' + input_value + '"';

  searchDefer = setTimeout(function() {
    if (input_value != '') executer_input.setAttribute('data-state','processing');
  }, 100);

  searchProcess = setTimeout(function() {
    if (input_value == 'tsh' || input_value == 'tshirt' || input_value == 't-sh' || input_value == undefined) {
      executer_input.setAttribute('data-state','unavailable');
    } else if (input_value == '') {
      executer_input.setAttribute('data-state','empty');
    } else {
      executer_input.setAttribute('data-state','available');
    }
  }, searchDelay);

  return false;

}

// Search input listener
if (search_input) {
  search_input.addEventListener('keyup', function(e) {
    process_input(this.value);
  });
}

// Focus on search input
if (search_trigger) {
  for (var i = 0;i<search_trigger.length;i++) {
    search_trigger[i].addEventListener('click', function() {
      if (!this.classList.contains('popup-close')) search_input.focus();
    });
  }
}

// Close any opening popup
if (popup_closer) {
  for (var i = 0;i<popup_closer.length;i++) {
    popup_closer[i].addEventListener('click', function() {
      if (executer_input && search_input) {
        executer_input.setAttribute('data-state','empty');
        search_input.value = '';
      }
    });
  }
}

// Escape action
var any_popups = document.querySelectorAll('input[name="popups"]');
if (any_popups && any_popups.length > 0) {
  document.addEventListener('keyup', function(event) {
    var active_popup = document.querySelectorAll('input[name="popups"]:checked')[0];

    if (event.key === "Escape") {
      if (active_popup) active_popup.checked = false;
    }
  });
}

// Mega Menu
var main_menu_items    = document.querySelectorAll('#menu-list > li'),
    mega_menu_triggers = document.querySelectorAll('.mega_menu-parrent'),
    main_header        = document.getElementById('header'),
    mega_active;

if (main_header && main_menu_items && mega_menu_triggers) {

  var mega_base = document.createElement('DIV');
  
  mega_base.classList.add('mega_menu-base');
  main_header.appendChild(mega_base);

  mega_base = main_header.querySelectorAll('.mega_menu-base')[0];

  for (var i = 0;i<main_menu_items.length;i++) {
    main_menu_items[i].addEventListener('mouseenter', function(event) {
      if (window.innerWidth > 1280) {
        if (this.classList.contains('mega_menu-parrent')) {
          clearTimeout(mega_active);
          if (!site_body.classList.contains('mega_menu-visible')) {
            site_body.classList.add('mega_menu-visible');
          }
          mega_base.style.height = this.querySelectorAll('.mega_menu')[0].offsetHeight + 'px';
        } else {
          mega_active = setTimeout(function() {
            if (site_body.classList.contains('mega_menu-visible')) site_body.classList.remove('mega_menu-visible');
          },10);
        }
      }
    });
    main_menu_items[i].addEventListener('mouseleave', function(event) {
      if (window.innerWidth > 1280) {
        mega_active = setTimeout(function() {
          if (site_body.classList.contains('mega_menu-visible')) site_body.classList.remove('mega_menu-visible');
        },200);
      }
    });
  }
}

// Featured Collection
const collection_carousels = document.querySelectorAll('.collection-carousel');
let cc_highest_height      = 0;

function collection_carousel_boxer() {
  if (collection_carousels.length > 0) {

    for (var i = 0;i<collection_carousels.length;i++) {
      let this_carousel = collection_carousels[i];
      const all_slides    = this_carousel.querySelectorAll('.collection-carousel-slide');
  
      for (var n = 0;n<all_slides.length;n++) {
        if (all_slides[n].offsetHeight > cc_highest_height) cc_highest_height = all_slides[n].offsetHeight;
  
        if (n == all_slides.length - 1)  {
          this_carousel.style.height = cc_highest_height + 'px';
          cc_highest_height = 0;
        }
  
      }
    }
  }
}

// Product Detail Accordion Menu
var product_contents = document.querySelectorAll('.product-content');
if (product_contents) {
  for (var i = 0;i<product_contents.length;i++) {
    var this_content = product_contents[i];
    this_content.style['max-height'] = this_content.offsetHeight + 'px';
  }
}

// Variant button selection
var variant_options = document.querySelectorAll('.variant-options .btn.segment');

if (variant_options) {

  for (var i = 0;i<variant_options.length;i++) {
    var this_segment = variant_options[i];

    variant_options[i].addEventListener('click', function(e) {
      var current_selection = this.parentElement.querySelectorAll('.btn.segment.selected')[0];
      if (current_selection) {
        if (current_selection.classList.contains('selected')) current_selection.classList.remove('selected');
        if (!this.classList.contains('selected')) this.classList.add('selected');
      }
      return false;
      
    });
  }
}

// Product Preview Carousel
var preview_thumbs = document.getElementById('product-preview-thumbs'),
    swatches       = document.querySelectorAll('.product-preview-thumb'),
    activeSwatcher = document.querySelector('.product-preview-thumb.active');

if (preview_thumbs && swatches && activeSwatcher) {
  for (var i = 0;i<swatches.length;i++) {
    swatches[i].addEventListener('click', function() {
      var scrolledPoint = preview_thumbs.scrollLeft,
          centerPoint = (preview_thumbs.offsetWidth / 2) - (this.offsetWidth / 2);
          scrollLength = this.offsetLeft - scrolledPoint - centerPoint;

      activeSwatcher.classList.remove('active');
      this.classList.add('active');
      activeSwatcher = this;

      animate(scrollGroup, 375, BezierEasing(0.56, 0.0, 0.24, 1.0), scrolledPoint, scrollLength);
    });
  }

  function scrollGroup (p, startPoint, endPoint) { // p move from 0 to 1
    preview_thumbs.scrollTo((startPoint+endPoint*p), 0);
  }
}

// Product Preview Zoom
var preview_target, zoom_target, zoomAnimation;

var jx   = void 0,
    jy   = void 0,
    jdx  = void 0,
    jdy  = void 0,
    jtx  = 0,
    jty  = 0,
    jkey = -1;

function zoomoving() {

  if(!jx || !jy) {
    jx = mouseX;
    jy = mouseY;
  } else {
    jdx = (mouseX - jx) * 0.9;
    jdy = (mouseY - jy) * 0.9;
    if(Math.abs(jdx) + Math.abs(jdy) < 0.1) {
      jx = mouseX;
      jy = mouseY;
    } else {
      jx += jdx;
      jy += jdy;
    }
  }

  if (preview_target && zoom_target && zoom_target != null) {
    var previewX = ((jx - preview_target.getBoundingClientRect().left - (preview_target.offsetWidth / 2)) / (preview_target.offsetWidth / 2) * 100) * 1.375 * -1,
        previewY = ((jy - preview_target.getBoundingClientRect().top - (preview_target.offsetHeight / 2)) / (preview_target.offsetHeight / 2) * 100) * 1.375 * -1;

    zoom_target.style['transform'] = 'translate3d(' + minmax(previewX) + '%, ' + minmax(previewY) + '%,0) scale(3)';
  }

  if (window.innerWidth <= 1280) {
    cancelAnimationFrame(zoomAnimation);
  } else {
    zoomAnimation = requestAnimationFrame(zoomoving);
  }
}

if (all_previews) {
  for (var i = 0;i<all_previews.length;i++) {

    if (all_previews[i].getElementsByTagName('IMG')[0]) all_previews[i].style['background-image'] = 'url(' + all_previews[i].getElementsByTagName('IMG')[0].getAttribute('src') + ')';

    all_previews[i].addEventListener('mouseenter', function(event) {

      if (preview_target == null) preview_target = this;
      if (zoom_target == null) zoom_target = this.getElementsByTagName('IMG')[0];

      if (window.innerWidth > 1280) {
        zoomAnimation = requestAnimationFrame(zoomoving);
      } else {
        cancelAnimationFrame(zoomAnimation);
      }

    });
    all_previews[i].addEventListener('mouseleave', function(event) {

      cancelAnimationFrame(zoomAnimation);

      if (zoom_target != null) zoom_target = null;
      if (preview_target != null) preview_target = null;

    });
  }
}

var product_preview = document.getElementById('preview-anchor'),
    preview_box     = document.getElementById('preview-box'),
    detail_contents = document.getElementById('detail-contents'),
    pre_scale       = 1,
    pre_height      = 0,
    pre_edge        = 0,
    shrink_edge     = 240,
    preview_item    = null,
    shrink_width    = 0,
    shrinker;

function resetPreview (p, startPoint, endPoint) { // p move from 0 to 1
  if (preview_box) preview_box.scrollTo((startPoint+(0-startPoint)*p), 0);
}

function preview_shrinker() {
  if (preview_box && preview_thumbs && detail_contents && window.innerWidth < 768) {
    
    var pre_shrink = minmax(pre_edge, 0, pre_height),
        img_shrink = pre_shrink;

    if (pre_shrink <= 0) pre_shrink = img_shrink = 0;

    if (pre_shrink) {
      if (pre_shrink <= shrink_edge) pre_shrink = shrink_edge;
      pre_scale  = pre_shrink / pre_height;
      
      preview_box.style['transform'] = 'translate3d(-50%,0,0) scale(' + pre_scale + ')';

    } requestAnimationFrame(preview_shrinker);
  } else {
    cancelAnimationFrame(shrinker);
  }
}

function update_variables() {
  //if (product_preview) scale_ratio = shrink_edge / product_preview.offsetHeight;
  if (product_preview) pre_height = product_preview.offsetHeight;
  if (preview_box && product_preview && (window.innerWidth < 768)) {
    preview_box.style['transform'] = 'translate3d(-50%,0,0) scale(' + pre_scale + ')';
    shrink_width = (product_preview.offsetWidth / shrink_edge) * product_preview.offsetHeight;
    preview_box.style.width = shrink_width + 'px';
    preview_item.style.width = shrink_width + 'px';
    if (loaded == true) {
      let preview_image = preview_item.getElementsByTagName('IMG')[0];
      if (preview_image) {
        let image_gap = (preview_item.offsetWidth - preview_image.offsetWidth) / 2 + 1;
        preview_item.style['margin-right'] = image_gap * -1 + 'px';
        preview_box.style['padding-right'] = image_gap + 'px';
      }
    } shrinker = requestAnimationFrame(preview_shrinker);
  } else {
    if (preview_box) {
      preview_box.removeAttribute('style');
      preview_item.style.width = '';
      preview_item.style['margin-right'] = '';
    }
    cancelAnimationFrame(shrinker);
  }

}

const kinectict_comps   = document.querySelectorAll('.kinect-comp');
let kinect_states       = [];
let kinect_parents      = [];

if (kinectict_comps.length > 0) {
  for (var i = 0;i < kinectict_comps.length;i++) {
    const kinect_eles       = kinectict_comps[i].querySelectorAll('.kinect-ele');
    const comp_top          = kinectict_comps[i].offsetTop.toString();
    let kinect_child_states = [];

    for (var n = 0;n < kinect_eles.length;n++) {
      const ele_top = kinect_eles[n].offsetTop.toString();

      kinect_eles[n].dataset.kianchor = 'ki-'+comp_top+'-'+ele_top;      
      kinect_child_states.push(false);
    }
    
    if (kinect_eles.length > 0) {
      kinect_states.push(kinect_child_states);
      kinect_parents.push(true);
      kinectict_comps[i].classList.add('kinect-childs');
    } else {
      kinect_states.push(false);
      kinect_parents.push(false);
    }
  }
  
}

function kinetict_scroll(reversable) {
  if (kinectict_comps.length > 0) {
    const windowBounce = window.innerHeight/100 * 88;
    for (var i = 0;i < kinectict_comps.length;i++) {
      let topBounce = kinectict_comps[i].getBoundingClientRect().top;
      let kinect_eles;

      if (kinect_parents[i] == true) kinect_eles = kinectict_comps[i].querySelectorAll('.kinect-ele');

      if (kinect_parents[i] == true) {
        for (var n = 0;n<kinect_eles.length;n++) {
          let topEleBounce = kinect_eles[n].getBoundingClientRect().top;
          if (topEleBounce <= windowBounce) {
            if (kinect_states[i][n] == false) {
              kinect_eles[n].classList.add('kinected');
              kinect_states[i][n] = true;
            }
          } else if (reversable == true) {
            if (kinect_states[i][n] == true) {
              kinect_eles[n].classList.remove('kinected');
              kinect_states[i][n] = false;
            }
          }
        }
        kinectict_comps[i].classList.add('kinected-child');
      } else {
        if (kinectict_comps[i].id == 'footer') {
          let botBounce = kinectict_comps[i].getBoundingClientRect().bottom;
          //console.log(botBounce,window.innerHeight+40);
          if (botBounce <= window.innerHeight+40) {
            if (!kinectict_comps[i].classList.contains('kinected')) kinectict_comps[i].classList.add('kinected');
          }
        }
        if (topBounce <= windowBounce) {
          if (kinect_states[i] == false) {
            kinectict_comps[i].classList.add('kinected');
            kinect_states[i] = true;
          }
        } else if (reversable == true) {
          if (kinect_states[i] == true) {
            kinectict_comps[i].classList.remove('kinected');
            kinect_states[i] = false;
          }
        }
      }
      
    }
  }
} kinetict_scroll(true);

let resize_func;

window.addEventListener("resize", function() {
  clearTimeout(resize_func);

  resize_func = setTimeout(function() {
    update_variables();
    collection_carousel_boxer();
  }, 250);

});
window.addEventListener("orientationchange", update_variables);
document.addEventListener("scroll", function() {

  kinetict_scroll(true);

  if (detail_contents) pre_edge   = detail_contents.getBoundingClientRect().top;

  if (preview_box) {
    if ((pre_edge - pre_height) <= 0) {
      if (!preview_box.classList.contains('active')) {
        var box_scroll = preview_box.scrollLeft;
        preview_box.classList.add('active');
        if (box_scroll > 0) animate(resetPreview, 375, BezierEasing(0.56, 0.0, 0.24, 1.0), box_scroll, 0);
      }
    } else {
      if (preview_box.classList.contains('active')) preview_box.classList.remove('active');
    }
  }

});

if (product_preview && preview_box && detail_contents) {
  preview_item = preview_box.querySelector('.product-preview-single:first-child');
  pre_edge     = detail_contents.getBoundingClientRect().top;
  update_variables()
}


addEvent(window, 'load', function() {

  collection_carousel_boxer()

  if (preview_box && product_preview && (window.innerWidth < 768)) {
    let preview_image = preview_item.getElementsByTagName('IMG')[0];
    if (preview_image) {
      let image_gap = (preview_item.offsetWidth - preview_image.offsetWidth) / 2 + 1;
      preview_item.style['margin-right'] = image_gap * -1 + 'px';
      preview_box.style['padding-right'] = image_gap + 'px';
    }
  }

  loaded = true;
}, 0);

const carousel_controls = document.querySelectorAll('.carousel-control');

if (carousel_controls.length > 0) {
  for (var i = 0;i<carousel_controls.length;i++) {
    carousel_controls[i].addEventListener('click', function() {
      let control_class = this.classList,
          control_tags  = this.getAttribute('name');

      if (control_tags) {
        let active_radio = document.querySelector('input[name="' + control_tags + '"]:checked'),
            target_radio;

        if (control_class.contains('prev')) target_radio = active_radio.previousElementSibling;
        if (control_class.contains('next')) target_radio = active_radio.nextElementSibling;

        if (target_radio && target_radio !== null) target_radio.checked = true;

      }
      
    });
  }
}

const accordion_switches = document.querySelectorAll('.product-content-title');

if (accordion_switches.length > 0) {
  for (var i = 0;i<accordion_switches.length;i++) {
    accordion_switches[i].addEventListener('click', function(event) {
      event.preventDefault();
      let target_switch = document.getElementById(this.getAttribute('for'));
      let switch_check   = target_switch.checked;

      (switch_check) ? target_switch.checked = false : target_switch.checked = true;
      
    });
  }
}


// Scroll to top when reload page
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

let mouseDownX,
    mouseDownY,
    mouseDown = false,
    touching = false,
    swiping = false,
    event_catcher = true,
    xDown,
    yDown;

let swipeDetect = (event,ele,pX,pY) => {
  if (swiping) {
    if ( ! xDown ) return;
    let xDiff = xDown - pX;
    let yDiff = yDown - pY;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
      if ( xDiff > 0 ) {
        /* left swipe */
        Swiper(event,ele,'left',xDiff,yDiff);
      } else {
        /* right swipe */
        Swiper(event,ele,'right',xDiff,yDiff);
      }
    }

    swiping = false;
  }
}

let Swiper = (event,ele,direction) => {
  if (event_catcher) console.log(direction, ele);
}

// Touch Down
document.addEventListener('touchstart', function(event) {
  if (!touching) {
    const ele = event.target;

    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
    mouseDownX = xDown;
    mouseDownY = yDown;
    touching = true;
    swiping = true;

    //Touched(event,ele);

  }
}, {passive: false});

// Touch Move
document.addEventListener('touchmove', function(event) {

  if (touching) {
    var ele = event.target;

    var xUp = event.touches[0].clientX;
    var yUp = event.touches[0].clientY;

    swipeDetect(event,ele,xUp,yUp);

    //TouchMoving(event,ele,xUp,yUp);

  }
}, {passive: false});

// Touch Up
document.addEventListener('touchend', function(event) {
  const ele = event.target;
  if (touching) {

    touching = false;

    //Released(event,ele);

    // reset values
    xDown = null;
    yDown = null;

  }
}, {passive: false});

// Mouse Down
document.addEventListener('mousedown', function(event) {
  var ele = event.target;

  mouseDownX = event.clientX,
  mouseDownY = event.clientY;
  xDown = mouseDownX,
  yDown = mouseDownY;
  mouseDown = true;
  swiping = true;

});

// Mouse Move
document.addEventListener('mousemove', function(event) {
  var ele = event.target;

  var pointerX = event.clientX,
    pointerY = event.clientY;

  swipeDetect(event,ele,pointerX,pointerY);

});

// Mouse Up
document.addEventListener('mouseup', function(event) {
  var ele = event.target;

  var pointerX = event.clientX,
      pointerY = event.clientY;
  mouseDown = false;

});