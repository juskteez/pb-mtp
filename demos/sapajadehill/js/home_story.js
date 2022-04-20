
/*
 * Title: Jmooth
 * Description: A native javascript smooth scroll experience experiment
 * Author: Juskteez
 * Contact: juskteez@gmail.com
 * Version: 1.0.2
 */

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

// SETTINGS
var scroll_Area_id   = 'storyline_content',
  page_Loaded_Class  = 'page_loaded',
  scrollbar_id       = 'jmooth_scrollbar',
  scroll_Progress_id = 'jmooth_scrollprogress',
  scrolling_Class    = 'im_scrolling',
  dragging_Class     = 'im_dragging',
  draggable_Class    = 'draggable',
  bar_Dragging_Class = 'scroll_bar_dragging',
  horizontal_Class   = 'horizontal',
  horizon_Bar_Class  = 'horizon_scrollbar',
  scrollSpeed        = 1,
  scroll_Step        = 200,
  drag_Speed         = 1.5,
  touch_Speed        = 6,
  easing_time        = 0.075;


// DECLEARING DEFAULT VARIABLES
var scroll_Content         = document.getElementById(scroll_Area_id);

if (scroll_Content) {

    var scroll_Bar           = document.createElement('DIV'),
    scroll_Progress          = document.createElement('DIV'),
    $body                    = document.body,
    $bodyClass               = $body.classList,
    content_Style            = scroll_Content.style,
    scroll_Bar_Style         = scroll_Bar.style,
    progress_style           = scroll_Progress.style,
    scroll_Position_Y        = 0, // default scroll position
    scroll_Position_X        = 0, // default horizontal scroll position
    scroll_Position          = 0, // default scroll value
    scroll_Bar_Position      = 0, // default scrollbar pos
    scroll_Current_Progress  = 0, // default scrollbar progress
    translate_Property       = 'translate3d(',
    loaded                   = false,
    horizontal               = false,
    draggable                = false,
    progress                 = false,
    dragging                 = false,
    scroll_Bar_Dragging      = false,
    scrollAllow              = true,
    scrP                     = 0,
    startDrag                = 0,
    touching                 = false,
    touch_Move               = 0,
    touch_Object,
    content_Transform,
    scroll_Transform,
    body_Height,
    window_Height,
    visible_Height,
    body_Width,
    window_Width,
    visible_Width,
    scrPrcs,
    clearScroll,
    posX,
    posY,
    i;

  // DECLAERING CUSTOM VARIABLES
  var product_marker = document.getElementById('products_marker'),
    product_nav = document.getElementById('product_nav'),
    product_thums = document.getElementsByClassName('product_thumbnail'),
    product_lists = document.querySelector('.products.horizontal');

  var after_Load = function() {
    // CUSTOM THINGS HAPPENDS RIGHT AFTER PAGE LOADED

  };

  var before_Scroll = function() {
    // CUSTOM THINGS HAPPENDS RIGHT BEFORE YOU SCROLL
  };

  var after_Scroll = function() {
    // CUSTOM THINGS HAPPENDS RIGHT AFTER YOU SCROLL

    if (product_marker) {
      product_marker.style.left = Math.abs(scroll_Current_Progress) + '%';
      var nav_item = product_nav.getElementsByTagName('a'),n,
        marker_offLeft = product_marker.offsetLeft;

      //console.log(marker_offLeft);

      for (n=0;n<nav_item.length;n++) {
        var this_item = nav_item[n],
          this_space = Number(this_item.offsetLeft - marker_offLeft);

        if (this_space <= -14) this_space = -14;
        if (this_space >= 14) this_space = 14;
        if (this_space < 0) this_space = this_space * -1;
        this_item.style.height = 100 - this_space*3 + '%';

      }
    }

    var swing_suit = (scroll_Position - scroll_Position_X) / 100 * -1;

    if (product_thums && product_lists) {
      for (var t=0;t<product_thums.length;t++) {
        //if (!product_thums[t].parentNode.parentNode.classList.contains('statue')) product_thums[t].style.transform = 'rotate('+swing_suit+'deg) translate3d(0,-50%,0)';
      }
    }

    if (scroll_Position < -200) {
      if (!$bodyClass.contains('over_top')) $bodyClass.add('over_top')
    } else {
      if ($bodyClass.contains('over_top')) $bodyClass.remove('over_top');
    }

    //if (product_nav) product_nav.setAttribute('scroll_Position_X',jump_Spacing_X);

  };

  var cached_axis;

  if (scroll_Content.classList.contains(horizontal_Class) && window.innerWidth >= 768) {
    horizontal = true;
    console.log('Okay horizontal');
  } else {
    scroll_Content.classList.remove(horizontal_Class);
  }

  cached_axis = horizontal;

  if (window.innerWidth >= 768) {
    scrollAllow = true;
  } else {
    scrollAllow = false;
  }

  if (scrollAllow) console.log('yes scroll');

  if (scroll_Content.classList.contains(draggable_Class)) draggable = true;

  scroll_Bar.setAttribute('id', scrollbar_id);
  if (horizontal) scroll_Bar.classList.add(horizon_Bar_Class);
  $body.appendChild(scroll_Bar);

  if (progress) {
    scroll_Progress.setAttribute('id', scroll_Progress_id);
    $body.appendChild(scroll_Progress);
  }

  var firefox = navigator.userAgent.indexOf('Firefox') > -1;

  if (firefox) scrollSpeed = 0.15 / scrollSpeed;

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args      = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  var content_Transformer = function(content_Transform_Value, scroll_Bar_Transform_Value) {
    content_Style['-webkit-transform']     = content_Transform_Value;
    content_Style['transform']             = content_Transform_Value;
    scroll_Bar_Style['-webkit-transform']  = scroll_Bar_Transform_Value;
    scroll_Bar_Style['transform']          = scroll_Bar_Transform_Value;
  };

  var scroll_Proceeding = function() {
    if ($bodyClass.contains(scrolling_Class)) {
      clearTimeout(clearScroll);
      clearScroll = setTimeout(closeScroll, 250);
    } else {
      if (!$bodyClass.contains(scrolling_Class)) $bodyClass.add(scrolling_Class);
    }
  };

  var lastScrollX = 0,
    lastScrollY = 0,
    lastScrollPos = 0;

  function product_bounce() {
    if (window.innerWidth < 768) {
      scroll_Content.style.maxHeight = 'none';
      var scroll_Content_HalfHeight = (scroll_Content.offsetHeight)/2;
      scroll_Content.style.maxHeight = scroll_Content_HalfHeight+'px';
      //console.log(scroll_Content);
    } else {
      scroll_Content.style.maxHeight = 'none';
    }
  } product_bounce();

  var scrollRecall = debounce(function() {


    if (window.innerWidth < 768) {
      horizontal = false;
      scrollAllow = false;
    } else {
      if (cached_axis) horizontal = true;
      scrollAllow = true;
    }

    product_bounce();

    if (horizontal) {
      scroll_Bar.classList.add(horizon_Bar_Class);
    } else {
      scroll_Bar.classList.remove(horizon_Bar_Class);
    }

    if (horizontal) {
      body_Width         = scroll_Content.offsetWidth,
      window_Width       = window.innerWidth,
      visible_Width      = body_Width - window_Width,
      scrPrcs            = window_Width - scroll_Bar.offsetWidth;

      if (scroll_Position != lastScrollPos) {
        content_Transform  = translate_Property + scroll_Position.toFixed(2) + 'px,0,0)';
        scroll_Transform   = translate_Property + (scroll_Bar_Position * -1).toFixed(2) + 'px,0,0)';
      }
    } else {
      body_Height        = scroll_Content.offsetHeight,
      window_Height      = window.innerHeight,
      visible_Height     = body_Height - window_Height,
      scrPrcs            = window_Height - scroll_Bar.offsetHeight;

      if (scroll_Position != lastScrollPos) {
        content_Transform  = translate_Property + '0px,' + scroll_Position.toFixed(2) + 'px,0)';
        scroll_Transform   = translate_Property + '0px,' + (scroll_Bar_Position * -1).toFixed(2) + 'px,0)';
      }
    }

    limitScroll();

    content_Transformer(content_Transform,scroll_Transform);

    lastScrollPos = scroll_Position;

  }, 500);

  var limitScroll = function() {
    if (horizontal) {
      scroll_Position_X  = Math.max(visible_Width * -1, scroll_Position_X);
      scroll_Position_X  = Math.min(0, scroll_Position_X);
    } else {
      scroll_Position_Y  = Math.max(visible_Height * -1, scroll_Position_Y);
      scroll_Position_Y  = Math.min(0, scroll_Position_Y);
    }
  };

  function closeScroll() {
    $bodyClass.remove(scrolling_Class);
  }

  function jmoothScroller() {
    requestAnimationFrame(jmoothScroller);

    (horizontal) ? scrP = scroll_Position_X / visible_Width * 100 : scrP = scroll_Position_Y / visible_Height * 100;

    var sclP  = scrP * scrPrcs / 100;

    if (isNaN(sclP)) sclP = 0;

    (horizontal) ? scroll_Position += (scroll_Position_X - scroll_Position) * easing_time : scroll_Position += (scroll_Position_Y - scroll_Position) * easing_time;

    scroll_Bar_Position += (sclP - scroll_Bar_Position) * easing_time;

    //if (progress) scroll_Current_Progress += (scrP - scroll_Current_Progress) * easing_time;
    scroll_Current_Progress += (scrP - scroll_Current_Progress) * easing_time;

    if (horizontal & scroll_Position != lastScrollPos) {
      content_Transform  = translate_Property + scroll_Position.toFixed(2) + 'px,0,0)';
      scroll_Transform   = translate_Property + (scroll_Bar_Position * -1).toFixed(2) + 'px,0,0)';
    } else if (scroll_Position != lastScrollPos) {
      content_Transform  = translate_Property + '0,' + scroll_Position.toFixed(2) + 'px,0)';
      scroll_Transform   = translate_Property + '0,' + (scroll_Bar_Position * -1).toFixed(2) + 'px,0)';
    }

    // BEFORE SCROLL
    before_Scroll();

    content_Transformer(content_Transform,scroll_Transform);

    if (progress) progress_style.height = Math.abs(scroll_Current_Progress) + '%';

    // AFTER SCROLL
    after_Scroll();

    /*var swing_suit = (scroll_Position - scroll_Position_X) / 100;

    $body.setAttribute('swing',swing_suit);*/

    lastScrollPos = scroll_Position;

  }

  var windowLoad = function() {

    if (horizontal) {
      body_Width     = scroll_Content.offsetWidth,
      window_Width   = window.innerWidth,
      visible_Width  = body_Width - window_Width,
      scrPrcs        = window_Width - scroll_Bar.offsetWidth;
    } else {
      body_Height    = scroll_Content.offsetHeight,
      window_Height  = window.innerHeight,
      visible_Height = body_Height - window_Height,
      scrPrcs        = window_Height - scroll_Bar.offsetHeight;
    }

    loaded = true;

    if (!$bodyClass.contains(page_Loaded_Class)) $bodyClass.add(page_Loaded_Class);

    after_Load();
    jmoothScroller();

    addEvent(window, 'resize', scrollRecall, 250);

  };


  addEvent(window, 'load', windowLoad, 0);

  var check_cart = function() {
    if (document.body.classList.contains('showing_cart')) {
      return false;
    } else {
      return true;
    }
  };

  window.onpoint = false;
  window.return_trigger = false;

  document.addEventListener('wheel', function(event) {
    var the_target = event.target;
    if (loaded && check_cart() && scrollAllow && the_target.id == scroll_Area_id) {
      window.onpoint = true;
      event.preventDefault();
      scroll_Proceeding();

      //if (document.body.classList.contains('showing_cart')) console.log('yeah');

      (horizontal) ? scroll_Position_X += ((event.deltaY+event.deltaX) / scrollSpeed) * -1 : scroll_Position_Y += (event.deltaY / scrollSpeed) * -1;
      /*if (horizontal) {
        jump_Spacing_X = ((event.deltaY+event.deltaX) / scrollSpeed) * -1;
        scroll_Position_X += jump_Spacing_X;
      } else {
        jump_Spacing_Y = (event.deltaY / scrollSpeed) * -1;
        scroll_Position_Y += (event.deltaY / scrollSpeed) * -1;
      }*/

      limitScroll();

    } else {
      window.onpoint = false;
      window.return_trigger = false;
    }
  });

  //console.log(scrollAllow);

  document.addEventListener('keydown', function(event) {
    var key = event.which || event.keyCode || event.charCode;
    if (loaded && (key == 37 || key == 38 || key == 39 || key == 40) && check_cart() && scrollAllow) {
      event.preventDefault();
      scroll_Proceeding();

      if (horizontal) {
        if (key == 37) scroll_Position_X += scroll_Step;
        if (key == 39) scroll_Position_X -= scroll_Step;
      } else {
        if (key == 38) scroll_Position_Y += scroll_Step;
        if (key == 40) scroll_Position_Y -= scroll_Step;
      }

      limitScroll();

    }
  });

  document.addEventListener('mousedown', function(event) {
    var the_target = event.target;
    if (the_target.id == scrollbar_id) scroll_Bar_Dragging = true;

    if (loaded && draggable && the_target.id != scrollbar_id && check_cart() && scrollAllow) {

      (horizontal) ? startDrag = event.clientX : startDrag = event.clientY;

      dragging = true;
    }
  });

  var dragger = function(draggerX,draggerY,draggerPoint,draggerSpeed) {

    $bodyClass.add(dragging_Class);
    (horizontal) ? scroll_Position_X -= ( draggerPoint - draggerX ) / 10 * draggerSpeed : scroll_Position_Y -= ( draggerPoint - draggerY ) / 10 * draggerSpeed;

  };

  document.addEventListener('mousemove', function(event) {
    if (loaded && (dragging || scroll_Bar_Dragging) && check_cart() && scrollAllow) {
      event.preventDefault();

      scroll_Proceeding();

      (horizontal) ? posX = event.clientX : posY = event.clientY;

      if (scroll_Bar_Dragging) {
        if (!$bodyClass.contains(bar_Dragging_Class)) $bodyClass.add(bar_Dragging_Class);
        (horizontal) ? scroll_Position_X = posX / window_Width * visible_Width * -1 : scroll_Position_Y = posY / window_Height * visible_Height * -1;
      }

      if (dragging) dragger(posX,posY,startDrag,drag_Speed);

      limitScroll();

    }

  });

  document.addEventListener('mouseup', function() {
    if (loaded && (dragging || scroll_Bar_Dragging) && check_cart() && scrollAllow) {

      dragging = false;

      if ($bodyClass.contains(dragging_Class)) $bodyClass.remove(dragging_Class);
      if ($bodyClass.contains(bar_Dragging_Class)) $bodyClass.remove(bar_Dragging_Class);

      scroll_Bar_Dragging = false;
    }
  });



  document.addEventListener('touchstart', function(event) {
    var theTarget = event.changedTouches[0];

    if (loaded && check_cart() && (scroll_Content.contains(theTarget.target) || theTarget.target == scroll_Content) && scrollAllow) {
      //event.preventDefault();

      (horizontal) ? touch_Move = event.changedTouches[0].clientX : touch_Move = event.changedTouches[0].clientY;

      touching = true;
    }
  }, {passive: false});

  var main_menu_wrap = document.getElementsByClassName('main_menu_wrap')[0];

  document.addEventListener('touchmove', function(event) {
    touch_Object = event.changedTouches[0];

    if (loaded && touching && check_cart() && scrollAllow) {
      event.preventDefault();
      /*if ((scroll_Content.contains(touch_Object.target)) || touch_Object.target == scroll_Content) {
        console.log('allowed to scroll');
      } else {
        console.log('scroll no more');
      }*/
      scroll_Proceeding();

      dragger(touch_Object.clientX,touch_Object.clientY,touch_Move,touch_Speed);

      limitScroll();

    }
  }, {passive: false});

  var cancel_Touch = function() {
    if (loaded && touching && scrollAllow) {
      //event.preventDefault();
      touching = false;
      if ($bodyClass.contains(dragging_Class)) $bodyClass.remove(dragging_Class);
    }
  };

  document.addEventListener('touchend', function() {
    cancel_Touch();
  }, {passive: false});

  document.addEventListener('touchcancel', function() {
    cancel_Touch();
  }, {passive: false});

  }
