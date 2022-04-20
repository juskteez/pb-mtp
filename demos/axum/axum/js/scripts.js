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
  lastDelta = 0;

if (bodyClass.contains('page_scroll')) {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }
}

var scrolled = false,
  deferScrolled;


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
      //console.log(scrollDirection);
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

var windowScrolling = false,
  deferScroll,
  scrollPos = 0,
  main_header = document.getElementById('start');

// Scroll Events
function scrollCheck(sType) {
  var scrTop = window.pageYOffset,
    wH = window.innerHeight,
    wW = window.innerWidth;

  /*if (scrTop > 0) {
    bodyClass.add('overtop');
  } else {
    bodyClass.remove('overtop');
  }*/
  if (main_header) {
    if (scrTop >= main_header.offsetHeight) {
      bodyClass.add('overhead');
    } else {
      bodyClass.remove('overhead');
    }
  }

} scrollCheck('onload');

window.addEventListener('scroll', function() {
  scrollCheck('onscroll');
});


document.addEventListener('mouseover', function(event) {
  var ele = event.target;
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

// Touch Down
function Touched(event,ele) {
  if (event_catcher) console.log('touch down');
}

// Touch Move
function TouchMoving(event,ele,xUp,yUp) {
  if (event_catcher) console.log('touch move');
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

  $(window).resize(function() {
  });

  $(window).on("load", function (e) {
    $('#section_tabs_content').height($('.section_tab_single.active').outerHeight()).addClass('set');
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

  $('.user_menu_mobile_trigger').click(function(e) {
    $(this).toggleClass('active');
    return false;
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

  $('[toggle][active]').click(function() {
    var $this = $(this),
      allToggles = $this.attr('toggle'),
      targetToggle = $this.attr('active');

    $(allToggles).not(targetToggle).removeClass('active');

    return false;
  });

  $('[active]').click(function() {
    var $this = $(this),
      targetToggle = $this.attr('active');

    $(targetToggle).addClass('active');

    $('.pre-active').removeClass('pre-active');

    return false;
  });

  $('.section_tab').click(function() {
    var $this = $(this),
      targetToggle = $this.attr('active');

    $('#section_tabs_content').height($(targetToggle).outerHeight());

    return false;
  });

  $('.section_tab').click(function() {
    $('.section_tab.active').not(this).removeClass('active');
    $(this).addClass('active');
  });

  $('.social_input_selected').click(function() {
    $(this).toggleClass('active');
    //return false;
  });

  $('.social_input_selector').click(function() {
    var the_selected = $(this).parent().prev('.social_input_selected'),
      the_label = $(this).parent().attr('for');
    the_selected.html($(this).html());
    the_selected.removeClass('active');
    $('label[for="'+the_label+'"]').text($(this).text());
    //return false;
  });

  $(document).on('click', function(e) {
    if (!$(e.target).hasClass('social_input_selected') && !$(e.target).hasClass('social_input_selector')) {
      $('.social_input_selected').removeClass('active');
    }
    if (!$(e.target).hasClass('user_menu') && $('.user_menu').has(e.target).length == 0) {
      $('.user_menu_mobile_trigger').removeClass('active');
    }

  });

  function insert_tag(the_input,the_value,the_target) {
    the_target.append('<span class="input_tag">'+the_value.replace(',','')+'<a href="javascript:;"></a></span>');
    the_input.empty();
  }

  $('.input_tag_typer').keyup(function(e) {
    var $this = $(this),
      place = $this.prev('.input_tag_list'),
      thisValue = $this.text();

    if (thisValue.indexOf(',') > -1) {
      insert_tag($this,thisValue,place);
    }
  });

  $('.input_tag_typer').bind("enterKey",function(e){
    var $this = $(this),
      place = $this.prev('.input_tag_list'),
      thisValue = $this.text();
    if (thisValue != '') insert_tag($this,thisValue,place);
    return false;
  });
  $('.input_tag_typer').keyup(function(e){
    if(e.keyCode == 13) $(this).trigger("enterKey");
    if ($(this).text() == '') $(this).empty();
  });

  $(document).on('click', '.input_tag a', function(e) {
    $(this).parent('.input_tag').remove();
  });

  $('.tag_input').click(function() {
    $(this).find('.input_tag_typer').focus();
  });

  $('.cancel_popup, .page_popup_overlay, .submit_popup').click(function() {
    $('.page_popup.active').removeClass('active');
    return false;
  });

  $body.append('<a href="javascript:;" class="menu_closer"></a>');

  $('.brand_works_control').click(function() {
    var $this = $(this),
      brand_works = $('#'+$this.attr('workid')),
      current_work = Number(brand_works.attr('brand-work')),
      max_work = Number(brand_works.attr('max-work')),
      new_work = current_work + 1;
      if (new_work > max_work) new_work = max_work;
    if ($this.hasClass('prev')) {
      new_work = current_work - 1;
      if (new_work <= 0) new_work = 0;
    }
    brand_works.attr('brand-work',new_work);

    return false;
  });

  $('#preview_expertise').submit(function() {
    $('.details_popup').addClass('active');
    return false;
  });

  $('.details_popup_close').click(function() {
    $('.details_popup').removeClass('active');
    return false;
  });
  $('.close_ribbon').click(function() {
    $('.top_ribbon').slideUp('fast');
    return false;
  });

});
