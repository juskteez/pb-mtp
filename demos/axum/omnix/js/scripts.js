var theBody = document.body,
  bodyClass = theBody.classList,
  theHTML = document.documentElement,
  event_catcher = false;

var ua = navigator.userAgent.toLowerCase();

if (ua.indexOf('safari') != -1) {
  (ua.indexOf('chrome') > -1) ? theBody.classList.add('chrome') : bodyClass.add('safari');
}

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

var mouseDownX,
  mouseDownY,
  mouseDown = false,
  touching = false,
  swiping = false,
  xDown,
  yDown;

// Mouse Down
document.addEventListener('mousedown', function(event) {
  var ele = event.target;

  mouseDownX = event.clientX,
  mouseDownY = event.clientY;
  xDown = mouseDownX,
  yDown = mouseDownY;
  mouseDown = true;
  swiping = true;

  mouseClick(event,ele);

});

function swipeDetect(event,ele,pX,pY) {
  if (swiping) {
    if ( ! xDown ) return;
    var xDiff = xDown - pX;
    var yDiff = yDown - pY;

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

// Mouse Move
document.addEventListener('mousemove', function(event) {
  var ele = event.target;

  var pointerX = event.clientX,
    pointerY = event.clientY;

  swipeDetect(event,ele,pointerX,pointerY);

  mouseMoving(event,ele,pointerX,pointerY);

});

// Mouse Up
document.addEventListener('mouseup', function(event) {
  var ele = event.target;

  var pointerX = event.clientX,
    pointerY = event.clientY;
  mouseDown = false;

  mouseClicked(event,ele,pointerX,pointerY);


});

// Touch Down
document.addEventListener('touchstart', function(event) {
  if (!touching) {
    var ele = event.target;

    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
    mouseDownX = xDown,
    mouseDownY = yDown;
    touching = true;
    swiping = true;

  Touched(event,ele);

  }
}, {passive: false});

// Touch Move
document.addEventListener('touchmove', function(event) {
  if (touching) {
    var ele = event.target;

    var xUp = event.touches[0].clientX;
    var yUp = event.touches[0].clientY;

    swipeDetect(event,ele,xUp,yUp);

    TouchMoving(event,ele,xUp,yUp);

  }
}, {passive: false});

// Touch Up
document.addEventListener('touchend', function(event) {
  var ele = event.target;
  if (touching) {

    touching = false;

    Released(event,ele);

    /* reset values */
    xDown = null;
    yDown = null;

  }
}, {passive: false});

// On Drag
document.ondragstart = function(event) {
  var ele = event.target;

  Dragger(event,ele);

};


// Detect Highest Elements
function highestDetect(detectQuery) {
  var allTargets = document.querySelectorAll(detectQuery),
    highestPoint = 0,
    highestEle;

  for (i=0;i<allTargets.length;i++) {
    var thisTarget = allTargets[i],
      thisH = thisTarget.offsetHeight;

    if (thisH > highestPoint) {
      highestPoint = thisH;
      highestEle = thisTarget;
    }
    if (i==allTargets.length-1) highestEle.classList.add('highest');
  }
}

var windowLoad = function() {};

addEvent(window, 'load', windowLoad, 0);

var lastDisplay,
  allSections = document.getElementsByClassName('section'),
  lastSection = allSections[allSections.length-1],
  allMenuItem = document.getElementsByClassName('scrollto');

// Active Screen Detection
function activeSection(scrTop,wH,wW,offsetRange) {
  var passed = '',
    maxheight = Math.max( theBody.scrollHeight, theBody.offsetHeight, theHTML.clientHeight, theHTML.scrollHeight, theHTML.offsetHeight ) - wH - 50;

  for (i=0;i<allSections.length;i++) {
    var thisSection = allSections[i],
      sectionOffset = thisSection.offsetTop-offsetRange,
      sectionId = thisSection.id;

    if (scrTop >= sectionOffset) {
      passed = sectionId;
      if (scrTop >= maxheight) passed = lastSection.id;
    }
  }

  if (lastDisplay != passed) {
    lastDisplay = passed;

    var activeScreen = document.querySelector('.scrollto.active'),
      targetScreen = document.getElementById('scrollto-'+passed),
      activeClass = activeScreen.classList,
      targetClass = targetScreen.classList;

    if (targetScreen) {
      if (activeClass.contains('active')) activeClass.remove('active');
      if (!targetClass.contains('active')) targetClass.add('active');
    }
  }

}

// Screen Visible Detection
function scrollMeet(ele,scrTop,inRange,classTitle,reverse) {
  inRange = Number(inRange);
  var offsetRange = inRange;

  if (ele && ele != '') offsetRange = ele.offsetTop - inRange;

  if (scrTop > offsetRange) {
    if (!bodyClass.contains(classTitle)) bodyClass.add(classTitle);
  } else {
    if (reverse && bodyClass.contains(classTitle)) bodyClass.remove(classTitle);
  }

}

// Scroll Events
function scrollCheck(type) {
  var scrTop = window.pageYOffset,
    wH = window.innerHeight,
    wW = window.innerWidth;

  scrollMeet('',scrTop,0,'overtop',true);

  //activeSection(scrTop,wH,wW,100);

} scrollCheck('onload');

window.addEventListener('scroll', function() {
  scrollCheck('onscroll');
});

// Mouse Down
function mouseClick() {
  if (event_catcher) console.log('mouse down');
}

// Mouse Move
function mouseMoving() {
  if (event_catcher) console.log('mouse moving');
}

// Mouse Up
function mouseClicked() {
  if (event_catcher) console.log('mouse up');
}

var touch_video = false,
  the_video = document.getElementById('float_video_popup'),
  the_opacity = 1,
  video_opacity = 1;

// Touch Down
function Touched(event,ele) {
  if (event_catcher) console.log('touch down');
  if (ele.id == 'float_video' && bodyClass.contains('overhead')) {
    touch_video = true;
    bodyClass.add('touch_video');
  }
}

// Touch Move
function TouchMoving(event,ele,xUp,yUp) {
  if (event_catcher) console.log('touch move');
  if (touch_video) {
    xPos = xUp - xDown;
    video_opacity = the_opacity + (xPos/200);
    if (video_opacity <= 0) video_opacity = 0;
    the_video.style.transform = 'translate3d('+xPos+'px,0,0)';
    the_video.style.opacity = video_opacity;
  }
}

// Touch Up
function Released() {
  if (event_catcher) console.log('touch released');
  bodyClass.remove('touch_video');
  if (the_video) {
    touch_video = false;
    if (video_opacity <= 0) {
      bodyClass.remove('overhead');
      bodyClass.remove('activevideo');
      video_opacity = 1;
    }
    the_video.removeAttribute('style');
  }
}

// On Drag
function Dragger() {
  if (event_catcher) console.log('dragging');
}

// On Swipe
function Swiper() {
  if (event_catcher) console.log('swiped');
}

var theClock = document.getElementById('comp_countdown'),
  deadline;
if (theClock) deadline = theClock.getAttribute('deadline');

function time_remaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
}
function run_clock(the_clock,endtime){

  // get spans where our clock numbers are held
  var days_span = the_clock.querySelector('.cdays');
  var hours_span = the_clock.querySelector('.chours');
  var minutes_span = the_clock.querySelector('.cminutes');
  //var seconds_span = the_clock.querySelector('.cseconds');

  function update_clock(){
    var t = time_remaining(endtime);

    // update the numbers in each part of the clock
    days_span.innerHTML = t.days;
    hours_span.innerHTML = ('0' + t.hours).slice(-2);
    minutes_span.innerHTML = ('0' + t.minutes).slice(-2);
    //seconds_span.innerHTML = ('0' + t.seconds).slice(-2);

    if(t.total<=0){ clearInterval(timeinterval); }
  }
  update_clock();
  var timeinterval = setInterval(update_clock,1000);
}
if (theClock) run_clock(theClock,deadline);

$(document).ready(function() {
  $('a[toggle]').click(function() {
    var toggler = $(this).attr('toggle');
    $(toggler).toggleClass('active');
    return false;
  });

  $('.how_overlayer,.how_details_close').click(function() {
    $('#how_details').removeClass('active');
    return false;
  });

  $('.faq_single_title').click(function() {
    $('.faq_single_title').not(this).parent().removeClass('active');
    $('.faq_single_title').not(this).next('.faq_single_content').slideUp('fast');
    $(this).parent().addClass('active');
    $(this).next('.faq_single_content').slideDown('fast');
    return false;
  });

  var allTesti = $('.testimonial_single'),
    firstSlide = $('.testimonial_single:first-child'),
    lastSlide = $('.testimonial_single:last-child'),
    testiCount = allTesti.length,
    testiList = $('.testimonial_list');

  function load_testimonial() {
    testiList.height($('.testimonial_single.active').outerHeight());
    lastSlide.addClass('inactive');
  } load_testimonial();

  $(window).resize(function() {
    testiList.height($('.testimonial_single.active').outerHeight());
  });

  $(window).on("load", function (e) {
    load_testimonial();
  });


  allTesti.each(function(e) {
    var pagString = '';
    if (e == 0) {
      pagString = '<a href="javascript:;" class="active"></a>';
    } else {
      pagString = '<a href="javascript:;"></a>';
    }
    $('.testimonial_pag').append(pagString);
  });

  var allPag = $('.testimonial_pag a');


  $(document).on('click', '.testimonial_control', function(e) {
    var $this = $(this),
      activeSlide = $('.testimonial_single.active'),
      theTarget,
      theDirection = true;

    if ($this.hasClass('prev')) {
      theTarget = activeSlide.prev();
      theDirection = false;
    } else {
      theTarget = activeSlide.next();
    }

    if (theTarget.length <= 0) {
      if (theDirection) {
        theTarget = firstSlide;
        allTesti.removeClass('inactive');
      } else {
        theTarget = lastSlide;
        allTesti.not(theTarget).addClass('inactive');
      }
    }
    var targetIndex = theTarget.index();

    activeSlide.removeClass('active');

    if (theDirection) {
      activeSlide.addClass('inactive');
      $('.testimonial_single.active ~ .testimonial_single').removeClass('inactive');
      theTarget.next().removeClass('inactive');
    } else {
      theTarget.prev().addClass('inactive');
    }
    if (targetIndex == (testiCount-1)) {
      firstSlide.removeClass('inactive');
    } else if (targetIndex == 0) {
      lastSlide.addClass('inactive');
    }
    theTarget.addClass('active').removeClass('inactive');
    testiList.height(theTarget.outerHeight());
    $('.testimonial_pag a.active').removeClass('active');
    allPag.eq(targetIndex).addClass('active');

    return false;

  });

  testiList.on('swiperight',function(){
    $('.testimonial_control.prev').click();
  });

  testiList.on('swipeleft',function(){
    $('.testimonial_control.next').click();
  });

  $(document).on('click', '.testimonial_pag a:not(.active)', function(e) {
    //console.log(allPag.length);
    var $this = $(this),
      thisPos = $this.index(),
      activeSlide = $('.testimonial_single.active'),
      activePos = activeSlide.index(),
      theTarget = allTesti.eq(thisPos);

    if (activePos < thisPos) {
      activeSlide.addClass('inactive');
    } else {
      activeSlide.removeClass('inactive');
    }

    if (thisPos == (testiCount-1)) {
      firstSlide.removeClass('inactive');
    } else if (thisPos == 0) {
      lastSlide.addClass('inactive');
    }

    activeSlide.removeClass('active');

    theTarget.prev().addClass('inactive');

    theTarget.addClass('active').removeClass('inactive');
    testiList.height(theTarget.outerHeight());
    $('.testimonial_pag a.active').removeClass('active');
    $this.addClass('active');
    return false;
  });

  $('[scrollto]').click(function(event) {
    event.preventDefault();
    var sTarget = $(this).attr('scrollto'),
      sObject = $(sTarget).offset().top,
      sOffset = $(this).attr('scrolloffset');

    if (sOffset != undefined && sOffset != '') {
      if (sOffset.startsWith('#') || sOffset.startsWith('.')) {
        sOffset = $(sOffset).offset().top;
      } else {
        sOffset = Number(sOffset);
      }
    } else {
      sOffset = 0;
    }

    if (sOffset != undefined && sOffset != '' && $(sOffset)) {
      sObject = sObject - sOffset;
    }

    $('html,body').animate({
      scrollTop: sObject
    },600);

    return false;
  });

  $('[youtube]').click(function() {
    var $this = $(this),
      youtubeId = $this.attr('youtube');

    $('.float_video_popup').addClass('active');

    $('#float_video_wrap').html('<iframe class="youtube_object" type="text/html" width="100%" height="100%" src="//www.youtube.com/embed/'+youtubeId+'?&amp;wmode=transparent&amp;rel=0&amp;showinfo=0&amp;autoplay=1" allowfullscreen="" frameborder="0"></iframe>');

    return false;
  });

  $('.float_video_close').click(function() {
    $('.float_video_popup').removeClass('active');
    $('#float_video_wrap').html('');
    return false;
  });

  $('#select_pack').on('change', function() {
    $('#order_omnix').attr('data-celery',$('#select_pack').val());
  });

});
