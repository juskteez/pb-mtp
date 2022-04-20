var theBody = document.body,
  bodyClass = theBody.classList,
  theHTML = document.documentElement,
  event_catcher = false,
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

var allLayers = document.querySelectorAll('.slider_layer');

function moveSlideLayers(mouseX,mouseY) {
  if (allLayers.length > 0) {
    for (i=0;i<allLayers.length;i++) {
      var thisLayer = allLayers[i],
        thisOffsetX = Number(thisLayer.getAttribute('x-offset')),
        thisOffsetY = Number(thisLayer.getAttribute('y-offset')),
        mousePosX = mouseX - window.innerWidth / 2,
        mousePosY = mouseY - window.innerHeight / 2;
      //thisLayer.style.transform = 'translate3d('+(mousePosX/60/thisOffsetX)+'px,'+(mousePosY/30/thisOffsetY)+'px,0)';
      thisLayer.style.left = (mousePosX/60/thisOffsetX)+'px';
      thisLayer.style.top = (mousePosY/30/thisOffsetY)+'px';
    }
  }
}

// Mouse Move
document.addEventListener('mousemove', function(event) {
  var ele = event.target;

  var pointerX = event.clientX,
    pointerY = event.clientY;

  if (window.innerWidth > 720) moveSlideLayers(pointerX,pointerY);

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
  deferScrolled,
  storyline = document.getElementById('storyline'),
  storyline_content = document.getElementById('storyline_content'),
  allStories = document.getElementsByClassName('storyline_single'),
  allPags = document.getElementsByClassName('storyline_pag_single'),
  allStoriesIndex = allStories.length-1,
  inStory = false,
  slidePos = 0,
  autoHero;

autoHero = setInterval(function() {
  //autoSectionHero();
}, 8000);

window.scrollHero = function(scrollDirection) {
  //console.log(scrollDirection);
  clearInterval(autoHero);
  (scrollDirection == 'next') ? slidePos++ : slidePos--;
  if (slidePos >= allStoriesIndex) slidePos = allStoriesIndex;
  if (slidePos < 0 ) slidePos = 0;
  var newStory = allStories[slidePos],
    newStoryWrap = allStories[slidePos].getElementsByClassName('storyline_wrapper')[0],
    newStoryX = (newStory.offsetLeft + newStoryWrap.offsetLeft) * -1;
  storyline_content.setAttribute('story',slidePos);
  document.querySelector('.storyline_single.active').classList.remove('active');
  document.querySelector('.storyline_pag_single.active').classList.remove('active');
  allPags[slidePos].classList.add('active');
  allStories[slidePos].classList.add('active');
  //storyline_content.style['transform'] = 'translate3d('+newStoryX+'px,0,0)';

  autoHero = setInterval(function() {
    //autoSectionHero();
  }, 8000);

};

function autoSectionHero() {
  $(document).ready(function() {
    var all_hero = $('.storyline_pag_single'),
      active_hero = $('.storyline_pag_single.active');
    if (active_hero.index() < (all_hero.length-1)) {
      $('.storyline_pag_single.active').next('.storyline_pag_single').click();
    } else {
      $('.storyline_pag_single:first-child').click();
    }
  });
}


var scrollHeroPag = function(scrollIndex) {
  slidePos = scrollIndex;
  var newStory = allStories[scrollIndex],
    newStoryWrap = allStories[scrollIndex].getElementsByClassName('storyline_wrapper')[0],
    newStoryX = (newStory.offsetLeft + newStoryWrap.offsetLeft) * -1;
  storyline_content.setAttribute('story',scrollIndex);
  document.querySelector('.storyline_pag_single.active').classList.remove('active');
  document.querySelector('.storyline_single.active').classList.remove('active');
  allPags[scrollIndex].classList.add('active');
  allStories[scrollIndex].classList.add('active');
  //storyline_content.style['transform'] = 'translate3d('+newStoryX+'px,0,0)';
};

function scrollBenefit(scrollDir) {
  $(document).ready(function() {
    var all_bens = $('.section.scroll_section'),
      active_ben = $('.section.scroll_section.active'),
      main_nav = $('.main_header');
      if (scrollDir == 'next') {
        var next_ben = active_ben.next();
        if (next_ben.length > 0) {
          var next_pos = next_ben.offset().top;
          active_ben.removeClass('active');
          next_ben.addClass('active');
          $('html,body').animate({
            scrollTop: next_pos - $('#ben_spaced').outerHeight()
          },600);
        }
      } else {
        var prev_ben = active_ben.prev();
        if (prev_ben.length > 0) {
          var prev_pos = prev_ben.offset().top;
          active_ben.removeClass('active');
          prev_ben.addClass('active');
          $('html,body').animate({
            scrollTop: prev_pos - $('#ben_spaced').outerHeight()
          },600);
        }
      }
  });
}

function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
     var pair = vars[i].split("=");
     if(pair[0] == variable) return pair[1];
   }
   return(false);
}

function checkBenefit() {
  $(document).ready(function() {
    var active_param = getQueryVariable('section');
    if (active_param != null && active_param != false) {
      var active_section = $('#'+active_param);
      if (active_section.length > 0) {
        var active_offset = active_section.offset().top;
        $('.scroll_section.active').removeClass('active');
        active_section.addClass('active');
        $('html,body').animate({
          scrollTop: active_offset - 64
        },0);
      }
    }
  });
}

setTimeout(function() {
  checkBenefit();
},1000);

function checkSection() {
  $(document).ready(function() {
    var active_param = getQueryVariable('coming');
    if (active_param != null && active_param != false) {
      var active_section = $('#'+active_param);
      if (active_section.length > 0) {
        var active_map = active_section.attr('active-map');
        $('.section_map_single.active').removeClass('active');
        $('.section_map_single#'+active_param).addClass('active');
        $('.section_map_single_info.active').removeClass('active');
        $('.section_map_single_info.'+active_map).addClass('active');
      }
    }
  });
} checkSection();



// Mouse Wheel
document.addEventListener('wheel', function(event) {
  var scrollDirectionY,
    scrollDirectionX,
    scrollDirection;

  var newDeltaY = event.deltaY,
    newDeltaX = event.deltaX,
    theTarget = event.target;

  if (storyline) {
    if (theTarget.id == 'storyline' || storyline.contains(theTarget)) {
      event.preventDefault();
      inStory = true;
    } else {
      inStory = false;
    }
  }

  if (event.deltaY < 0) newDeltaY = event.deltaY * -1;
  if (event.deltaX < 0) newDeltaX = event.deltaX * -1;

  if (newDeltaY > 0 && !scrolled) {
    scrolled = true;
    clearTimeout(deferScrolled);
    //console.log('new scroll');

    if (event.deltaY > 0) {
      scrollDirectionY = 'down';
    } else if (event.deltaY < 0) {
      scrollDirectionY = 'up';
    }

    if (event.deltaX > 0) {
      scrollDirectionX = 'right';
    } else if (event.deltaX < 0) {
      scrollDirectionX = 'left';
    }

    //console.log(scrollDirectionY);

    if (event.deltaY != 0 || event.deltaX != 0) {
      if (scrollDirectionY == 'down' || scrollDirectionX == 'right') {
        scrollDirection = 'next';
      } else {
        scrollDirection = 'prev';
      }
      if (inStory) window.scrollHero(scrollDirection);
      if (bodyClass.contains('page_benefit')) scrollBenefit(scrollDirection);
    }

    deferScrolled = setTimeout(function() {
      scrolled = false;
    },1200);
  }

  /*if (newDeltaY > lastDelta && !scrolled) {
    scrolled = true;
    clearTimeout(deferScrolled);
    //console.log('new scroll');

    if (event.deltaY > 0) {
      scrollDirectionY = 'down';
    } else if (event.deltaY < 0) {
      scrollDirectionY = 'up';
    }

    if (event.deltaX > 0) {
      scrollDirectionX = 'right';
    } else if (event.deltaX < 0) {
      scrollDirectionX = 'left';
    }

    if (event.deltaY != 0 || event.deltaX != 0) {
      if (scrollDirectionY == 'down' || scrollDirectionX == 'right') {
        scrollDirection = 'next';
      } else {
        scrollDirection = 'prev';
      }
      if (inStory) window.scrollHero(scrollDirection);
      if (bodyClass.contains('page_benefit')) scrollBenefit(scrollDirection);
    }

    deferScrolled = setTimeout(function() {
      scrolled = false;
    },600);
  }*/

  lastDelta = newDeltaY;

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
  scrollPos = 0;

// Scroll Events
function scrollCheck(sType) {
  var scrTop = window.pageYOffset,
    wH = window.innerHeight,
    wW = window.innerWidth;

  if (scrTop > 0) {
    bodyClass.add('overtop');
  } else {
    bodyClass.remove('overtop');
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

var continueSlide,
  problem_2 = document.getElementById('problem_2');

// On Swipe
function Swiper(event,ele,direction,xTouch,yTouch) {
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

  /*$.ajax({
    dataType: "json",
    url: "js/settings.json",
    success:function(data) {
      var social_items = data.query.social;
      $('#footer_socials').empty();
      for (i=0;i<social_items.length;i++) {
        var social_item = social_items[i];
        $('#footer_socials').append('<li><a href="'+social_item.url+'" class="footer_social '+social_item.slug+'" target="_blank" rel="nofollow">'+social_item.svg+'</a></li>');
      }
    }
  });*/


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

  $('.menu_toggler').click(function(e) {
    $body.toggleClass('active_menu');
    $(this).toggleClass('active');
    $('.allow_parent').removeClass('allow_parent');
    return false;
  });

  $(document).on('touchstart','.main_menu > li', function(e) {
    var $this = $(this);
    $('.allow_parent').not(this).removeClass('allow_parent');
    setTimeout(function() {
      $this.addClass('allow_parent');
    },200);
  });

  $('.menu_toggler').append('<span></span>');

  $body.append('<a href="javascript:;" class="menu_closer" id="menu_closer"></a>');

  $(document).on('click','.menu_closer', function(e) {
    $body.removeClass('active_menu');
    $('.menu_toggler').removeClass('active');
    $('.allow_parent').removeClass('allow_parent');
    return false;
  });

  $('[toggle][active]').click(function() {
    var $this = $(this),
      allToggles = $this.attr('toggle'),
      targetToggle = $this.attr('active');

    $(allToggles).not(targetToggle).removeClass('active');
    $('[toggle="'+allToggles+'"]').removeClass('active');

    return false;
  });

  $('[active]').click(function() {
    var $this = $(this),
      targetToggle = $this.attr('active');

    $(targetToggle).addClass('active');
    $this.addClass('active');

    $('.pre-active').removeClass('pre-active');

    return false;
  });

  $('.share_box_trigger').click(function() {
    var $this = $(this);

    $this.toggleClass('active');

    return false;
  });

  var reset_trigger = false;
  window.onpoint = false;
  window.return_trigger = false,
  from_outside = false;

  document.addEventListener('wheel', function(event) {

    var theTarget = event.target;

    (inStory) ? window.onpoint = true : window.onpoint = false;

    if (window.onpoint && from_outside) {
      //console.log('scroll to story');
      //window.return_trigger = true;
      $('html,body').animate({
        scrollTop: 0
      },600);
    }

    (inStory) ? from_outside = false : from_outside = true;


  });

  $('.storyline_pag_single').click(function() {
    var thisIndex = $(this).index();
    scrollHeroPag(thisIndex);
    return false;
  });

  $('.section_map_single').mouseover(function() {
    var $this = $(this),
      thisIndex = $this.index(),
      currentInfo = $('.section_map_single_info.active');

    $('.section_map_single').not(this).removeClass('active');
    $this.addClass('active');

    if (currentInfo.index() != thisIndex) {
      currentInfo.removeClass('active');
      $('.section_map_single_info').eq(thisIndex).addClass('active');
    }
    return false;
  });

  $('.benefit_slide_pag_single').click(function() {
    var $this = $(this),
      thisSlide = $this.parent().prev('.benefit_slide');
      thisBen = $this.attr('data-ben'),
      currentPag = $this.parent().find('.benefit_slide_pag_single.active'),
      currentIndex = currentPag.index(),
      thisIndex = $this.index();

    currentPag.not(this).removeClass('active');
    $this.addClass('active');

    thisSlide.attr('data-ben',thisBen);
    return false;
  });

  /*$('.benefit_slide_wrap > .benefit_slide_ctrls .benefit_slide_ctrl').click(function() {
    var $this = $(this),
      thisSlide = $this.parent().parent('.benefit_slide_wrap').find('.benefit_slide'),
      thisPag = $this.parent().parent('.benefit_slide_wrap').find('.benefit_slide_pag'),
      currentPag = thisPag.find('.benefit_slide_pag_single.active'),
      currentSlide = thisSlide.find('.benefit_slide_single.active'),
      currentIndex = Number(thisSlide.attr('data-ben')),
      targetIndex = currentIndex+1,
      targetSlide = currentSlide.next();

    if ($this.hasClass('prev')) {
      targetIndex = currentIndex-1;
      targetSlide = currentSlide.prev();
    }

    if (targetSlide.length > 0) {
      thisSlide.attr('data-ben',targetIndex);
      currentSlide.removeClass('active');
      thisSlide.find('.benefit_slide_single').eq(targetIndex).addClass('active');
      currentPag.removeClass('active');
      thisPag.find('.benefit_slide_pag_single').eq(targetIndex).addClass('active');
    }
    return false;
  });*/

  $('.benefit_slide_pag .benefit_slide_ctrl').click(function() {
    var $this = $(this),
      thisSlide = $this.parent().parent().parent().find('.benefit_slide'),
      thisPag = $this.parent().parent('.benefit_slide_pag'),
      currentPag = thisPag.find('.benefit_slide_pag_single.active'),
      currentSlide = thisSlide.find('.benefit_slide_single.active'),
      currentIndex = Number(thisSlide.attr('data-ben')),
      targetIndex = currentIndex+1,
      targetSlide = currentSlide.next();

    if ($this.hasClass('prev')) {
      targetIndex = currentIndex-1;
      targetSlide = currentSlide.prev();
    }

    if (targetSlide.length > 0) {
      thisSlide.attr('data-ben',targetIndex);
      currentSlide.removeClass('active');
      thisSlide.find('.benefit_slide_single').eq(targetIndex).addClass('active');
      currentPag.removeClass('active');
      thisPag.find('.benefit_slide_pag_single').eq(targetIndex).addClass('active');
    }
    return false;
  });

  var theViewer = $('#viewer_wrap');

  $('.image_view_toggle').click(function() {
    var $this = $(this),
      imgURL = $this.data('image');

    theViewer.html('<img src="'+imgURL+'" alt="" />');
    $('#image_viewer').addClass('active');

    return false;

  });

  /*$('.page_popup_close,.page_overlayer').click(function() {
    $('.page_popup.active').removeClass('active');
    setTimeout(function() {
      theViewer.empty();
    },300);
  });*/



  var video_box = $('.video_box'),
    video_content = $('#video_box_content');

  $(document).on('click', '[data-youtube]', function(e) {
    var youtube_id = $(this).data('youtube');
    video_box.addClass('active');
    video_content.append('<iframe id="ytplayer" type="text/html" width="720" height="405" src="https://www.youtube.com/embed/'+youtube_id+'?autoplay=1&enablejsapi=1&rel=0&showinfo=0" frameborder="0" allowfullscreen>');
    return false;
  });

  $(document).on('click', '.page_popup_close,.page_overlayer,.video_box_closer', function(e) {
    $('.page_popup.active').removeClass('active');
    video_box.removeClass('active');
    video_content.empty();
    setTimeout(function() {
      theViewer.empty();
    },300);
    return false;
  });

  $(document).on('click', '.storyline_controll', function() {
    if ($(this).hasClass('next')) {
      window.scrollHero('next');
    } else {
      window.scrollHero('prev');
    }
  });


});
