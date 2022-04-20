/*
 * Title: Jmooth
 * Description: A native javascript smooth scroll experience experiment
 * Author: Juskteez
 * Contact: juskteez@gmail.com
 * Version: 1.0.2
 */

// SETTINGS
var scroll_Area_id   = 'scroll_list',
  scroll_Wrap        = document.getElementById('scroll_list_wrap'),
  page_Loaded_Class  = 'page_loaded',
  scrollbar_id       = 'jmooth_scrollbar',
  scroll_Progress_id = 'jmooth_scrollprogress',
  scrolling_Class    = 'im_scrolling',
  dragging_Class     = 'im_dragging',
  draggable_Class    = 'draggable',
  bar_Dragging_Class = 'scroll_bar_dragging',
  horizontal_Class   = 'horizontal',
  horizon_Bar_Class  = 'horizon_scrollbar',
  scrollSpeed        = 2,
  scroll_Step        = 200,
  drag_Speed         = 1.5,
  touch_Speed        = 6,
  easing_time        = 0.075;


// DECLEARING DEFAULT VARIABLES
var scroll_Content         = document.getElementById(scroll_Area_id),
  scroll_Bar               = document.createElement('DIV'),
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
  progress                 = true,
  currentProgress          = 0,
  rawProgress              = 0,
  dragging                 = false,
  scroll_Bar_Dragging      = false,
  scrollAllow              = true,
  scrP                     = 0,
  startDrag                = 0,
  page_Scrolling           = false,
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
var prlxVal          = 0,
  parallax_Position  = 0, // default parallax position
  parallax_Speed     = 5, // min -10; max 10; reverse by negative value
  blockIMGs          = document.getElementsByClassName('block-image'), // CUSTOM FOR PARALLAX DEMO IMAGE
  progressBar        = document.getElementById('progress'),
  runnerBar          = document.getElementById('runner_bar'),
  runnerGrabber      = document.getElementById('runner'),
  runnerCoin         = document.getElementById('runner_coin');

var after_Load = function() {
  // CUSTOM THINGS HAPPENDS RIGHT AFTER PAGE LOADED
  if (parallax_Speed > 10) {
    parallax_Speed = 1;
  } else if (parallax_Speed == 0) {
    parallax_Speed = 0;
  } else if (parallax_Speed < 0) {
    parallax_Speed = -11 - parallax_Speed;
  } else if (parallax_Speed < -10) {
    parallax_Speed = -1;
  } else {
    parallax_Speed = 11 - parallax_Speed;
  }

  for (i = 0; i < blockIMGs.length; i++) {
    (horizontal) ? blockIMGs[i].style.right  = (parallax_Speed * 1.25 * i) + 'vw' : blockIMGs[i].style.bottom = (parallax_Speed * i) + 'vh';
  }
};

var before_Scroll = function() {
  // CUSTOM THINGS HAPPENDS RIGHT BEFORE YOU SCROLL
};

var roadmap_ico = document.getElementsByClassName('roadmap_timeline_ico'),
  roadmap_mark = document.getElementsByClassName('roadmap_timeline_mark');

var theBody = document.body,
  bodyClass = theBody.classList,
  theHTML = document.documentElement,
  roadmapWrap = document.getElementById('roadmap_timeline_wrap');

var after_Scroll = function() {
  // CUSTOM THINGS HAPPENDS RIGHT AFTER YOU SCROLL

  (horizontal) ? prlxVal = scroll_Position_X / parallax_Speed : prlxVal = scroll_Position_Y / parallax_Speed;

  (horizontal && scroll_Position < (window_Width/2*-1)) ? $bodyClass.add('highnoon') : $bodyClass.remove('highnoon');

  // currentProgress
  if (progressBar) progressBar.style.width = currentProgress+'%';
  if (roadmapWrap && window.innerWidth < 768) roadmapWrap.style.transform = 'translate3d('+((rawProgress*1.2/2*-1)+'%')+',0,0)';
  if (runnerGrabber) {
    runnerGrabber.style.left = rawProgress+'%';
    runnerCoin.style.transform = 'translate3d(-50%, 0, 0) rotate(' + (rawProgress/12*360) +'deg)';
    var coinOffset = runnerGrabber.offsetLeft;
    for (i=0;i<roadmap_ico.length;i++) {
      var this_ico = roadmap_ico[i],
        this_mark = roadmap_mark[i],
        this_space = Number(this_mark.offsetLeft - coinOffset),
        passed;

        if (this_space>50) this_space = 50;
        if (this_space<-50) this_space = -50;

        if (this_space<0) {
          passed = true;
          this_space = this_space*-1;
        } else {
          passed = false;
        }

        this_space = (this_space*2)/100;

      //this_ico.setAttribute('space',this_space);
      this_ico.style.transform = 'translate3d(-50%, 0, 0) scale(' + this_space +')';
      (passed) ? this_ico.classList.add('active') : this_ico.classList.remove('active');
    }
  }

};

/*window.addEventListener('scroll', function(event) {
  if (window.innerWidth < 768) {
    var wH = window.innerHeight;
    var maxheight = Math.max( theBody.scrollHeight, theBody.offsetHeight, theHTML.clientHeight, theHTML.scrollHeight, theHTML.offsetHeight ) - wH,
      scrolled = window.pageYOffset,
      scrollProgress = scrolled / maxheight * 100;

    //console.log('scrolled '+scrollProgress+'%');

    if (progressBar) progressBar.style.width = scrollProgress+'%';
    if (roadmapWrap) roadmapWrap.style.transform = 'translate3d('+((scrollProgress*1.2/2*-1)+'%')+',0,0)';
    if (runnerGrabber) {
      runnerGrabber.style.left = scrollProgress+'%';
      runnerCoin.style.transform = 'translate3d(-50%, 0, 0) rotate(' + (scrollProgress/12*360) +'deg)';
      var coinOffset = runnerGrabber.offsetLeft;
      for (i=0;i<roadmap_ico.length;i++) {
        var this_ico = roadmap_ico[i],
          this_mark = roadmap_mark[i],
          this_space = Number(this_mark.offsetLeft - coinOffset),
          passed;

          if (this_space>50) this_space = 50;
          if (this_space<-50) this_space = -50;

          if (this_space<=0) {
            passed = true;
            this_space = this_space*-1;
          } else {
            passed = false;
          }

          this_space = (this_space*2)/100;

        //this_ico.setAttribute('space',this_space);
        this_ico.style.transform = 'translate3d(-50%, 0, 0) scale(' + this_space +')';
        (passed) ? this_ico.classList.add('active') : this_ico.classList.remove('active');
      }
    }
  }
});*/

var cached_ori;

if (scroll_Content.classList.contains(horizontal_Class)) horizontal = true;

cached_ori = horizontal;

if (window.innerWidth >= 768) {
  //scrollAllow = true;
  horizontal = true;
  if (cached_ori) scroll_Content.classList.add(horizontal_Class);
} else {
  //scrollAllow = false;
  horizontal = false;
  if (cached_ori) scroll_Content.classList.remove(horizontal_Class);
}

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
    if (!page_Scrolling) page_Scrolling = true;
  }
};

var scrollRecall = debounce(function() {

  if (window.innerWidth < 768) {
    //scrollAllow = false;
    horizontal = false;
    if (cached_ori) scroll_Content.classList.remove(horizontal_Class);
  } else {
    //scrollAllow = true;
    horizontal = true;
    if (cached_ori) scroll_Content.classList.add(horizontal_Class);
  }

  roadmapWrap.removeAttribute('style');

  if (horizontal) {
    scroll_Bar.classList.add(horizon_Bar_Class);
    body_Width         = scroll_Content.offsetWidth,
    window_Width       = scroll_Wrap.offsetWidth,
    visible_Width      = body_Width - window_Width,
    scrPrcs            = window_Width - scroll_Bar.offsetWidth;

    content_Transform  = translate_Property + scroll_Position.toFixed(2) + 'px,-50%,0)';
    scroll_Transform   = translate_Property + (scroll_Bar_Position * -1).toFixed(2) + 'px,0,0)';
  } else {
    scroll_Bar.classList.remove(horizon_Bar_Class);
    body_Height        = scroll_Content.offsetHeight,
    window_Height      = scroll_Wrap.offsetHeight,
    visible_Height     = body_Height - window_Height,
    scrPrcs            = window_Height - scroll_Bar.offsetHeight;

    content_Transform  = translate_Property + '0px,' + scroll_Position.toFixed(2) + 'px,0)';
    scroll_Transform   = translate_Property + '0px,' + (scroll_Bar_Position * -1).toFixed(2) + 'px,0)';
  }

  limitScroll();

  content_Transformer(content_Transform,scroll_Transform);

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
  page_Scrolling = false;
}

function jmoothScroller() {
  requestAnimationFrame(jmoothScroller);

  (horizontal) ? scrP = scroll_Position_X / visible_Width * 100 : scrP = scroll_Position_Y / visible_Height * 100;

  var sclP  = scrP * scrPrcs / 100;

  if (isNaN(sclP)) sclP = 0;

  (horizontal) ? scroll_Position += (scroll_Position_X - scroll_Position) * easing_time : scroll_Position += (scroll_Position_Y - scroll_Position) * easing_time;

  scroll_Bar_Position += (sclP - scroll_Bar_Position) * easing_time;

  if (progress) scroll_Current_Progress += (scrP - scroll_Current_Progress) * easing_time;

  if (horizontal) {
    content_Transform  = translate_Property + scroll_Position.toFixed(2) + 'px,-50%,0)';
    scroll_Transform   = translate_Property + (scroll_Bar_Position * -1).toFixed(2) + 'px,0,0)';
  } else {
    content_Transform  = translate_Property + '0,' + scroll_Position.toFixed(2) + 'px,0)';
    scroll_Transform   = translate_Property + '0,' + (scroll_Bar_Position * -1).toFixed(2) + 'px,0)';
  }

  // BEFORE SCROLL
  before_Scroll();

  content_Transformer(content_Transform,scroll_Transform);

  if (progress) {
    rawProgress = Math.abs(scroll_Current_Progress);
    currentProgress = rawProgress.toFixed(2);
    progress_style.height = currentProgress + '%';
  }

  //console.log(currentProgress + '%');

  // AFTER SCROLL
  after_Scroll();

}

var windowLoad = function() {

  if (horizontal) {
    body_Width     = scroll_Content.offsetWidth,
    window_Width   = scroll_Wrap.offsetWidth,
    visible_Width  = body_Width - window_Width,
    scrPrcs        = window_Width - scroll_Bar.offsetWidth;
  } else {
    body_Height    = scroll_Content.offsetHeight,
    window_Height  = scroll_Wrap.offsetHeight,
    visible_Height = body_Height - window_Height,
    scrPrcs        = window_Height - scroll_Bar.offsetHeight;
  }

  loaded = true;

  $bodyClass.add(page_Loaded_Class);

  after_Load();
  jmoothScroller();

  addEvent(window, 'resize', scrollRecall, 250);

};

addEvent(window, 'load', windowLoad, 0);

document.addEventListener('wheel', function(event) {
  if (loaded && scrollAllow) {
    scroll_Proceeding();

    (horizontal) ? scroll_Position_X += ((event.deltaY+event.deltaX) / scrollSpeed) * -1 : scroll_Position_Y += (event.deltaY / scrollSpeed) * -1;

    limitScroll();

  }
});

document.addEventListener('keydown', function(event) {
  var key = event.which || event.keyCode || event.charCode;
  if (loaded && (key == 37 || key == 38 || key == 39 || key == 40) && scrollAllow) {
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

function scroll_to(scroll_target) {
  var target_element = document.getElementById(scroll_target),
    targetOffset, containerOffset;
  if (horizontal) {
    targetOffset       = target_element.offsetLeft;
    scroll_Position_X = targetOffset*-1;
  } else {
    targetOffset       = target_element.offsetLeft;
    scroll_Position_Y = targetOffset*-1;
  }
}

document.addEventListener('click', function(event) {
  var the_target = event.target;

  if (the_target.hasAttribute('scroll_target') && scrollAllow) {
    var scroll_target = the_target.getAttribute('scroll_target');

    scroll_to(scroll_target);
  }

});

var touch_grabber = false;

document.addEventListener('mousedown', function(event) {
  var the_target = event.target;
  if (the_target.id == scrollbar_id) scroll_Bar_Dragging = true;

  if (loaded && draggable && the_target.id != scrollbar_id && scrollAllow) {

    (horizontal) ? startDrag = event.clientX : startDrag = event.clientY;

    dragging = true;
  }
  if (the_target == runnerCoin && scrollAllow) {
    //console.log(scroll_Wrap.getBoundingClientRect().left);
    // (horizontal) ? startDrag = event.clientX : startDrag = event.clientY;
    startDrag = event.clientX;
    touch_grabber = true;
  }
});

var dragger = function(draggerX,draggerY,draggerPoint,draggerSpeed) {

  if (!$bodyClass.contains(dragging_Class)) $bodyClass.add(dragging_Class);
  (horizontal) ? scroll_Position_X -= ( draggerPoint - draggerX ) / 10 * draggerSpeed : scroll_Position_Y -= ( draggerPoint - draggerY ) / 10 * draggerSpeed;

};

var touch_grabbing = function(grabX,grabY) {

  if (!$bodyClass.contains(bar_Dragging_Class)) $bodyClass.add(bar_Dragging_Class);
  var grabLine = scroll_Wrap.getBoundingClientRect();
  grabX = grabX-grabLine.left;
  grabY = grabY-grabLine.top;

  (horizontal) ? scroll_Position_X = grabX / window_Width * visible_Width * -1 : scroll_Position_Y = grabY / window_Height * visible_Height * -1;

  //(horizontal) ? scroll_Position_X = grabX / window_Width * visible_Width * -1 : scroll_Position_X = grabX / window_Width * visible_Width * -1;


};

document.addEventListener('mousemove', function(event) {
  if (loaded && (dragging || scroll_Bar_Dragging || touch_grabber) && scrollAllow) {
    event.preventDefault();

    scroll_Proceeding();

    (horizontal) ? posX = event.clientX : posY = event.clientY;

    if (scroll_Bar_Dragging) {
      if (!$bodyClass.contains(bar_Dragging_Class)) $bodyClass.add(bar_Dragging_Class);
      (horizontal) ? scroll_Position_X = posX / window_Width * visible_Width * -1 : scroll_Position_Y = posY / window_Height * visible_Height * -1;
    }

    if (dragging) dragger(posX,posY,startDrag,drag_Speed);

    if (touch_grabber) touch_grabbing(posX,posY);

    limitScroll();

  }

});

document.addEventListener('mouseup', function() {
  if (loaded && (dragging || scroll_Bar_Dragging || touch_grabber)) {

    dragging = false;
    touch_grabber = false;

    $bodyClass.remove(dragging_Class);
    $bodyClass.remove(bar_Dragging_Class);

    scroll_Bar_Dragging = false;
  }
});

document.addEventListener('touchstart', function(event) {
  var ele = event.changedTouches[0].target;
  if (loaded && scroll_Wrap.contains(ele) && scrollAllow) {
    event.preventDefault();

    (horizontal) ? touch_Move = event.changedTouches[0].clientX : touch_Move = event.changedTouches[0].clientY;

    touching = true;
  }
  /*if (ele == runnerCoin && scrollAllow) {
    //console.log(scroll_Wrap.getBoundingClientRect().left);
    startDrag = event.clientX;
    touch_grabber = true;
  }*/
}, {passive: false});

document.addEventListener('touchmove', function(event) {
  touch_Object = event.changedTouches[0];

  if (loaded && touching && scrollAllow) {
    event.preventDefault();
    scroll_Proceeding();

    dragger(touch_Object.clientX,touch_Object.clientY,touch_Move,touch_Speed);

    //if (touch_grabber) touch_grabbing(touch_Object.clientX,touch_Object.clientY);

    limitScroll();

  }
}, {passive: false});

var cancel_Touch = function() {
  if (loaded && touching) {
    event.preventDefault();
    touching = false;
    touch_grabber = false;
    $bodyClass.remove(dragging_Class);
  }
};

document.addEventListener('touchend', function() {
  cancel_Touch();
}, {passive: false});

document.addEventListener('touchcancel', function() {
  cancel_Touch();
}, {passive: false});



var touched_item, touched_thumb;

document.addEventListener('mousemove', function(e) {
  var ele = e.target;

});
