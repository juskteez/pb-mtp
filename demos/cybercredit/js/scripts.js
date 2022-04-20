var theBody = document.body,
  bodyClass = theBody.classList,
  theHTML = document.documentElement,
  event_catcher = false,
  loaded = false,
  documentHeight = Math.max( theBody.scrollHeight, theBody.offsetHeight, theHTML.clientHeight, theHTML.scrollHeight, theHTML.offsetHeight );

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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var shrink_lines = document.querySelectorAll('.shrink_grid span'),
  shrink_point_mark = '<i></i>';

for (i=0;i<shrink_lines.length;i++) {
  var points = getRandomInt(3, 6),
    shrink_line = shrink_lines[i],
    shrink_line_mark = '';

  for (n=0;n<points;n++) {
    shrink_line_mark += shrink_point_mark;
    if (n== points-1) shrink_line.innerHTML = shrink_line_mark;
  }

  //shrink_line.innerHTML =
}

var shrink_points = document.querySelectorAll('.shrink_grid span i'),
  first_points = document.querySelectorAll('.shrink_grid span i:first-child'),
  second_points = document.querySelectorAll('.shrink_grid span i:nth-of-type(2)'),
  third_points = document.querySelectorAll('.shrink_grid span i:nth-of-type(3)'),
  four_points = document.querySelectorAll('.shrink_grid span i:nth-of-type(4)'),
  five_points = document.querySelectorAll('.shrink_grid span i:nth-of-type(5)'),
  six_points = document.querySelectorAll('.shrink_grid span i:nth-of-type(6)'),
  shrinks = shrink_points.length,
  shrinkScale = [];

function shrinking_points(eles,rangeStart,rangeEnd) {
  for (i=0;i<eles.length;i++) {
    var shrink_point = eles[i],
      randHeight = getRandomInt(6, 24),
      randOffset = getRandomInt(rangeStart, rangeEnd);

    shrinkScale.push(randHeight);

    shrink_point.style.height = randHeight + 'px';
    shrink_point.style.top = randOffset + '%';
    shrink_point.style['-webkit-animation-duration'] = getRandomInt(8, 20) + 's';
    shrink_point.style['animation-duration'] = getRandomInt(8, 20) + 's';
    shrink_point.style['-webkit-animation-delay'] = (getRandomInt(1, 20) / 10) + 's';
    shrink_point.style['animation-delay'] = (getRandomInt(1, 20) / 10) + 's';
  }
}

shrinking_points(first_points,15,40);
shrinking_points(second_points,100,130);
shrinking_points(third_points,180,200);
shrinking_points(four_points,240,280);
shrinking_points(five_points,320,360);
shrinking_points(six_points,400,440);

/*document.querySelector('.btn.big').onclick = function () {
  onClickFunction();
  console.log('try scroll');
  return false;
}*/

/*var allGlitchTitles = document.querySelectorAll('.glitch');

for (i=0;i<allGlitchTitles.length;i++) {
  allGlitchTitles[i].setAttribute('data-text',allGlitchTitles[i].textContent);
}*/


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

var wheelfired = false,
  wheelDefer,
  allPageSections = document.getElementsByClassName('scroll_section'),
  pageSectionParent = document.getElementsByClassName('full_sections')[0],
  scrollNodes,
  allPags = document.querySelectorAll('.page_pag#page_pag a'),
  lastDelta = 0;

if (pageSectionParent) scrollNodes = Array.prototype.slice.call( pageSectionParent.children );

if (bodyClass.contains('page_scroll')) {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }
}

var scrolled = false,
  deferScrolled,
  startIncrease,
  allProgressEle = document.querySelectorAll('.roadmap_chart_progress.rm_prg');

function scroll_fullPage(scrollDirection) {
  if (bodyClass.contains('page_scroll')) {
    var currentSection = document.querySelector('.section.scroll_section.active'),
      targetEle = currentSection.nextElementSibling;

    if (scrollDirection == 'up') targetEle = currentSection.previousElementSibling;
    //console.log(targetEle);
    if (targetEle != null) {
      var targetPos = targetEle.offsetTop - 60,
        targetIndex = scrollNodes.indexOf(targetEle);
      //console.log(scrollNodes.indexOf(targetEle));
      document.querySelector('.page_pag#page_pag a.active').classList.remove('active');
      allPags[targetIndex].classList.add('active');
      currentSection.classList.remove('active');
      targetEle.classList.add('active');
      jsAnimScroll.cubic_bezier(0.6,0.1,0.32,0.98,window, targetPos, 600);
      if (targetEle.id == 'roadmap') {
        // enter roadmap
        setTimeout(function() {
          //startIncrease = requestAnimationFrame(increaseValue);
          increaseValue();
        },1700);
      } else {
        for (i=0;i<allProgressEle.length;i++) {
          var thisProgress = allProgressEle[i];

          thisProgress.setAttribute('title','$0.0');
        }
      }
      /*if (targetEle.id == 'offering') {
        // enter roadmap
        //console.log('enter offering');
        setTimeout(function() {
          //startIncrease = requestAnimationFrame(increaseValue);
          smiling(true);
        },1700);
      } else {
        smiling(false);
      }*/
    }
  }
}

// Mouse Wheel
document.addEventListener('wheel', function(event) {
  var scrollDirection;

  var newDelta = event.deltaY;

  if (event.deltaY < 0) newDelta = event.deltaY * -1;

  if (newDelta > lastDelta && !scrolled) {
    scrolled = true;
    clearTimeout(deferScrolled);
    //console.log('new scroll');

    if (event.deltaY > 0) {
      scrollDirection = 'down';
    } else if (event.deltaY < 0) {
      scrollDirection = 'up';
    }

    if (event.deltaY != 0) {
      //scroll_fullPage(scrollDirection);
    }

    deferScrolled = setTimeout(function() {
      scrolled = false;
    },600);
  }

  lastDelta = newDelta;

});

/*document.addEventListener('keydown', function(event) {
  var key = event.which || event.keyCode || event.charCode;
  if (key == 37 || key == 38 || key == 39 || key == 40) {
    event.preventDefault();

    if (key == 38) scroll_fullPage('up');
    if (key == 40) scroll_fullPage('down');

  }
});

var prevHome = document.getElementById('prev_section'),
  nextHome = document.getElementById('next_section');

if (prevHome && nextHome) {
  prevHome.addEventListener('click', function() {
    scroll_fullPage('up');
  });

  nextHome.addEventListener('click', function() {
    scroll_fullPage('down');
  });
}*/

var gm_mouth = document.getElementById('gm_mouth'),
  smile_trigger = document.getElementById('smile'),
  smile_animate = '<animate xlink:href="#smile" animation-target="#smile" attributeName="d" attributeType="XML" values="M1,9 C1.99316406,5 7.21020053,1 12.5788836,1 C17.7849815,1 23.0043945,5 24,9;M1,1 C4.57714844,1 7.21020053,1 12.5788836,1 C17.7849815,1 20.494873,1 24,1;M1,1 C2.64897861,5.65437201 7.21020053,9 12.5788836,9 C17.7849815,9 22.2317839,5.85394177 24,1.41920182" dur="3s" repeatCount="0" />';


function smiling(state) {
  if (state) {
    smile_trigger.innerHTML = smile_animate;
  } else {
    smile_trigger.innerHTML = '';
  }
}

var startPoint = 0,
  startTime = new Date(),
  startInterval,
  intervalTime = 20,
  totalDuration = 900,
  loopTime = totalDuration/intervalTime,
  loopIncreasement = 100/loopTime;

function increaseValue() {

  startInterval = setInterval(function() {
    if (startPoint >= 100) {
      clearInterval(startInterval);
      startPoint = 0;
      //console.log(startPoint);
    } else {
      startPoint = Math.floor(startPoint + loopIncreasement);
      //console.log(startPoint);
      for (i=0;i<allProgressEle.length;i++) {
        var thisProgress = allProgressEle[i],
          targetValue = Number(thisProgress.getAttribute('target-value')),
          newValue = (targetValue / 100 * startPoint).toFixed(1);

        thisProgress.setAttribute('title','$'+newValue);
      }
    }
  },intervalTime);

}

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
  if (bodyClass.contains('page_scroll') && window.innerWidth > 1280) event.preventDefault();
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
  last_section = allSections[allSections.length-1],
  allMenuItem = document.getElementsByClassName('scrollto'),
  activePass = false;

// Active Screen Detection
function activeSection(scrTop,wH,wW,offsetRange,elements,lastSection,active_section) {
  if (elements.length>0) {
    var passed = '',
      maxheight = Math.max( theBody.scrollHeight, theBody.offsetHeight, theHTML.clientHeight, theHTML.scrollHeight, theHTML.offsetHeight ) - wH - 50;

    for (i=0;i<elements.length;i++) {
      var thisSection = elements[i],
        sectionOffset = thisSection.offsetTop-offsetRange,
        sectionId = thisSection.id;

      if (scrTop >= sectionOffset) {
        passed = sectionId;
        if (scrTop >= maxheight) passed = lastSection.id;
      }
    }

    if (lastDisplay != passed) {
      lastDisplay = passed;

      if (active_section) {
        for (i=0;i<elements.length;i++) {
          //if (elements[i].classList.contains('active')) elements[i].classList.remove('active');
          if (elements[i].id == lastDisplay) {
            elements[i].classList.add('active');
          } else {
            elements[i].classList.remove('active');
          }
          if (elements[0].classList.contains('scroll_section')) {
            if (passed == 'roadmap' && activePass == false) {
              activePass = true;
              setTimeout(function() {
                increaseValue();
              },600);
            }
          }
        }
      }

      var activeScreen = document.querySelector('.scrollto.active'),
        targetScreen = document.querySelector('.scrollto[scrollto="#'+passed+'"]');

      if (targetScreen && activeScreen) {
        var activeClass = activeScreen.classList,
          targetClass = targetScreen.classList;
        if (activeClass.contains('active')) activeClass.remove('active');
        if (!targetClass.contains('active')) targetClass.add('active');
      }
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

var shrinkFrames,
  windowScrolling = false,
  deferScroll,
  scrollPos = 0;

function translateShrink() {

  for (i=0;i<shrinks;i++) {
    var thisScale = shrinkScale[i];
    shrink_points[i].style['-webkit-transform'] = 'translate3d(0,-'+(scrollPos*0.7)+'px,0)';
    shrink_points[i].style.transform = 'translate3d(0,-'+(scrollPos*0.7)+'px,0)';
  }

}

var allICOs = document.getElementsByClassName('ico_section'),
  lastICO = allICOs[allICOs.length-1],
  allFAQs = document.getElementsByClassName('faq_section'),
  lastFAQ = allFAQs[allFAQs.length-1],
  allHome = document.getElementsByClassName('scroll_section'),
  lastHome = allHome[allHome.length-1];

// Scroll Events
function scrollCheck(sType) {
  var scrTop = window.pageYOffset,
    wH = window.innerHeight,
    wW = window.innerWidth;

  scrollPos = scrTop;

  shrinkFrames = requestAnimationFrame(translateShrink);

  if (allICOs.length > 0) activeSection(scrTop,wH,wW,60,allICOs,lastICO);

  if (allFAQs.length > 0) activeSection(scrTop,wH,wW,60,allFAQs,lastFAQ);

  if (allHome.length > 0 && wW < 1280) activeSection(scrTop,wH,wW,wH/3,allHome,lastHome,true);

} scrollCheck('onload');

window.addEventListener('scroll', function() {
  scrollCheck('onscroll');
});

var allVisions = document.querySelectorAll('.vision_content'),
  lastVision = '0';

function touchingVisions(element) {
  if (element.classList.contains('vision_single')) {
    var visionTarget = element.getAttribute('vision-id');
    if (visionTarget != lastVision) {
      document.querySelector('.vision_content.active').classList.remove('active');
      allVisions[visionTarget].classList.add('active');
      lastVision = visionTarget;
    }
  } else {
    if (lastVision != '0') {
      document.querySelector('.vision_content.active').classList.remove('active');
      allVisions[0].classList.add('active');
      lastVision = '0';
    }
  }
}

document.addEventListener('mouseover', function(event) {
  var ele = event.target;
  touchingVisions(ele);
});

/*document.addEventListener('click', function(event) {
  var ele = event.target;

  if (ele.classList.contains('section_director')) {
    event.preventDefault();
    scroll_fullPage('down');
  }
});*/

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

var touch_video = false;

// Touch Down
function Touched(event,ele) {
  if (event_catcher) console.log('touch down');
  touchingVisions(ele);
}

// Touch Move
function TouchMoving(event,ele,xUp,yUp) {
  if (event_catcher) console.log('touch move');
  if (touch_video) {
    xPos = xUp - xDown;
  }
}

// Touch Up
function Released() {
  if (event_catcher) console.log('touch released');

}

// On Drag
function Dragger() {
  if (event_catcher) console.log('dragging');
}

// On Swipe
function Swiper() {
  if (event_catcher) console.log('swiped');
}


var theClock = document.getElementById('hc_countdown'),
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
  var days_span = the_clock.querySelector('#hc_days');
  var hours_span = the_clock.querySelector('#hc_hours');
  var minutes_span = the_clock.querySelector('#hc_mins');
  var seconds_span = the_clock.querySelector('#hc_secs');

  function update_clock(){
    var t = time_remaining(endtime);

    // update the numbers in each part of the clock
    days_span.innerHTML = t.days;
    hours_span.innerHTML = ('0' + t.hours).slice(-2);
    minutes_span.innerHTML = ('0' + t.minutes).slice(-2);
    seconds_span.innerHTML = ('0' + t.seconds).slice(-2);

    if(t.total<=0){ clearInterval(timeinterval); }
  }
  update_clock();
  var timeinterval = setInterval(update_clock,1000);
}
if (theClock) run_clock(theClock,deadline);



/*********************************
// JQUERY
*********************************/

$(document).ready(function() {
  var $body = $('body');
  $('a[toggle]').click(function() {
    var toggler = $(this).attr('toggle');
    $(toggler).toggleClass('active');
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
    console.log(allPag.length);
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

    if (sOffset != undefined && sOffset != '' && $(sOffset)) {
      sObject = sObject - $(sOffset).offset().top;
    }

    $('html,body').animate({
      scrollTop: sObject
    },600);

    return false;
  });

  $('.page_pag .scrollto').click(function() {
    var sTarget = $(this).attr('scrollto');
    $('.section.scroll_section.active').removeClass('active');
    $('.page_pag .scrollto').not(this).removeClass('active');
    $('.section.scroll_section'+sTarget).addClass('active');
    $(this).addClass('active');
  });

  var all_pags = $('.page_pag#page_pag a'),
    all_progress_eles = $('.roadmap_chart_progress.rm_prg');

  function scrollFullPage(scrollDirection) {
    if ($body.hasClass('page_scroll')) {
      var currentSection = $('.section.scroll_section.active'),
        targetEle = currentSection.next();

      if (scrollDirection == 'up') targetEle = currentSection.prev();
      //console.log(targetEle);
      if (targetEle != null && targetEle != undefined && targetEle.length > 0) {
        var targetPos = targetEle.offset().top - 60,
          //targetIndex = scrollNodes.indexOf(targetEle);
          targetIndex = targetEle.index();
        //console.log(scrollNodes.indexOf(targetEle));
        $('.page_pag#page_pag a.active').removeClass('active');
        all_pags.eq(targetIndex).addClass('active');
        currentSection.removeClass('active');
        targetEle.addClass('active');
        //jsAnimScroll.cubic_bezier(0.6,0.1,0.32,0.98,window, targetPos, 600);
        $('html,body').animate({
          scrollTop: targetPos
        },600);
        if (targetEle.attr('id') == 'roadmap') {
          // enter roadmap
          setTimeout(function() {
            increaseValue();
          },1700);
        } else {
          for (i=0;i<all_progress_eles.length;i++) {
            var thisProgress = all_progress_eles.eq(i);

            thisProgress.attr('title','$0.0');
          }
        }
        if (targetEle.attr('id') == 'offering') {
          // enter roadmap
          console.log('enter offering');
          setTimeout(function() {
            smiling(true);
          },1700);
        } else {
          smiling(false);
        }
      }
    }
  }

  var jlastDelta = 0,
    jscrolled = false,
    jdeferScrolled;

  // Mouse Wheel
  document.addEventListener('wheel', function(event) {
    var scrollDirection;

    var newDelta = event.deltaY;

    if (event.deltaY < 0) newDelta = event.deltaY * -1;

    if (newDelta > jlastDelta && !jscrolled && window.innerWidth >= 1280) {
      jscrolled = true;
      clearTimeout(jdeferScrolled);
      //console.log('new scroll');

      if (event.deltaY > 0) {
        scrollDirection = 'down';
      } else if (event.deltaY < 0) {
        scrollDirection = 'up';
      }

      if (event.deltaY != 0) {
        scrollFullPage(scrollDirection);
      }

      jdeferScrolled = setTimeout(function() {
        jscrolled = false;
      },1000);
    }

    jlastDelta = newDelta;

  });

  document.addEventListener('keydown', function(event) {
    var key = event.which || event.keyCode || event.charCode;
    if (key == 37 || key == 38 || key == 39 || key == 40) {
      event.preventDefault();

      if (key == 38) scrollFullPage('up');
      if (key == 40) scrollFullPage('down');

    }
  });

  var prevHome = document.getElementById('prev_section'),
    nextHome = document.getElementById('next_section');

  if (prevHome && nextHome) {
    prevHome.addEventListener('click', function() {
      scrollFullPage('up');
    });

    nextHome.addEventListener('click', function() {
      scrollFullPage('down');
    });
  }

  document.addEventListener('click', function(event) {
    var ele = event.target;

    if (ele.classList.contains('section_director')) {
      event.preventDefault();
      scrollFullPage('down');
    }
  });

  $('.main_menu_toggler').click(function(e) {
    $body.toggleClass('active_menu');
    $(this).toggleClass('active');
    return false;
  });

  $(document).on('click','.menu_closer', function(e) {
    $body.removeClass('active_menu');
    $('.main_menu_toggler').removeClass('active');
    return false;
  });

  $('[youtube]').click(function() {
    var $this = $(this),
      youtubeId = $this.attr('youtube'),
      frameId = $this.attr('frame');

    $(frameId).addClass('active');

    $(frameId+' .section_video_content').html('<iframe class="youtube_object" type="text/html" width="100%" height="100%" src="//www.youtube.com/embed/'+youtubeId+'?&amp;wmode=transparent&amp;rel=0&amp;showinfo=0&amp;autoplay=1" allowfullscreen="" frameborder="0"></iframe>');
  });

  $('.section_video_close').click(function() {
    $(this).parent().removeClass('active');
    $(this).next().html('');
    return false;
  });

  $body.append('<a href="javascript:;" class="menu_closer"></a>');

});
