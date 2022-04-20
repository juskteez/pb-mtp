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

function wrap(el, wrapper) {
  if (el) {
    for (var i=0;i<el.length;i++) {
      var newWrapper = document.createElement(wrapper);
      newWrapper.innerHTML = el[i].innerHTML;
      //el[i].parentNode.insertBefore(newWrapper, el[i]);
      el[i].innerHTML = '';
      el[i].appendChild(newWrapper);
    }
  }
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

    // reset values
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

var windowLoad = function() {
  bodyClass.add('loaded');
};

addEvent(window, 'load', windowLoad, 0);

var windowScrolling = false,
  deferScroll,
  scrollPos = 0,
  normalRevealers = document.querySelectorAll('.text_reveal');

// Scroll Events
function scrollCheck(sType) {
  var scrTop = window.pageYOffset,
    wH = window.innerHeight,
    wW = window.innerWidth,
    viewFactor = wH + scrTop;

  /*if (scrTop > 0) {
    bodyClass.add('overtop');
  } else {
    bodyClass.remove('overtop');
  }*/

  for (var i=0;i<normalRevealers.length;i++) {
    var thisRevealer = normalRevealers[i],
      revealOffset = thisRevealer.getBoundingClientRect().top;

    //console.log('Alo');

    if (viewFactor >= revealOffset) {
      thisRevealer.classList.add('pass');
    } else {
      thisRevealer.classList.remove('pass');
    }
  }

}

window.addEventListener('scroll', function() {
  scrollCheck('onscroll');
  //console.log('Belo');
});

var lastDisplay = '',
  ranDee = [20,-6,12,-24,12,-6];

/*function ranDee() {
  return Math.floor(Math.random() * (60 - (20*-1) + 1)) + (20*-1);
}*/

var articlesPage = document.getElementById('articles_page'),
  articleContent = document.getElementById('articles_list');


/*if (articlesPage && articleContent) {

  document.addEventListener('mousemove', function(event) {
    var ele = event.target;

    var pointerX = event.clientX,
      pointerY = event.clientY,
      currentWW = window.innerWidth - 120,
      contentW = articleContent.offsetWidth - currentWW,
      pointerProgress = (pointerX-60)/currentWW;

    articleContent.style['transform'] = 'translate3d('+(contentW*pointerProgress*-1)+'px,0,0)';

  });
}*/

var allFragments = document.querySelectorAll('.single_fragment');

function pageInit(fromPage,revealDelay) {

  console.log('Page Init');

  if (!revealDelay || typeof revealDelay !== 'number' ) revealDelay = 0;

  // Article Init
  articlesPage = document.getElementById('articles_page'),
  articleContent = document.getElementById('articles_list');

  allFragments = document.querySelectorAll('.single_fragment');

  if (allFragments) {

    document.addEventListener('mousemove', function(event) {
      var ele = event.target;

      var pointerX = event.clientX,
        pointerY = event.clientY;

      for (var i=0;i<allFragments.length;i++) {
        var thisFragment = allFragments[i],
          thisRatio = thisFragment.getAttribute('pratio');

        //console.log(thisRatio);
        thisFragment.style['transform'] = 'translate3d(-50%,-50%,0) translate3d('+(pointerX/30*thisRatio)+'px,'+(pointerY/50*thisRatio)+'px,0)';
      }

    });
  }

  window.windowLoad('by redirect');

  // Service Init
  var serviceContent = document.getElementById('service_content'),
    allServices = document.querySelectorAll('.service_section');

  if (serviceContent) {
    var allServices = document.querySelectorAll('.service_section');

    serviceContent.addEventListener('scroll', function(event) {
      var scrTop = this.scrollTop,
          wH = window.innerHeight,
          wW = window.innerWidth;

      for (var i=0;i<allServices.length;i++) {
        var thisService = allServices[i],
          svTop = thisService.offsetTop - (wH*0.33),
          svID = allServices[i].id,
          thisServiceClass = thisService.classList,
          serviceImage = thisService.querySelector('.servi_img'),
          sScrollTop = scrTop - svTop;

        //if (i > 0) defaultDegree = 20;

        serviceImage.style['transform'] = 'translate3d(0,-75%,0) translate3d(0,'+(sScrollTop/4*-1)+'px,0) rotate('+(sScrollTop/60*-1+ranDee[i])+'deg)';
        
        if (scrTop >= svTop) {
          thisServiceClass.add('pass');
        } else {
          thisServiceClass.remove('pass');
        }

        if (lastDisplay == svID) {
          document.querySelector('.service_menu-item[service_anchor="#'+svID+'"]').classList.add('active');
        } else {
          document.querySelector('.service_menu-item[service_anchor="#'+svID+'"]').classList.remove('active');
        }
      }

      var allPassServices = document.querySelectorAll('.service_section.pass');

      lastDisplay = allPassServices[allPassServices.length-1].id;
    });
  }

  // Text Reveal Init
  wrap(document.querySelectorAll('.text_revealer span'), 'B');
  wrap(document.querySelectorAll('.text_reveal span'), 'B');

  normalRevealers = document.querySelectorAll('.text_reveal');
  setTimeout(function() {
    scrollCheck('init');
  },revealDelay);

  // Scroll Reveal Init
  if (typeof ScrollReveal === 'function') {

    window.sr = ScrollReveal();

    window.sReveal = function(rset,duratn,orign,distn,scle,delayTime,easng,vFactor,containr,opacty) {
      var the_settings = {
        reset: rset,
        duration: duratn || 600,
        origin: orign || 'bottom',
        distance: distn || '20vw',
        delay: delayTime || 0,
        scale: scle || 1,
        easing: easng || 'cubic-bezier(.3,.15,.15,1)',
        viewFactor: vFactor || 0.2,
        container: containr || window.document.documentElement,
        opacity: opacty || 0
      };

      return the_settings;
    }

    if (window.sr) {

      sr.reveal('.parag_reveal > p', sReveal(false,600,'','16px','',(600+revealDelay),'ease'),50);
      sr.reveal('.partners_list img', sReveal(false,600,'','16px','',(100+revealDelay),'ease'),50);
      sr.reveal('.grid', sReveal(false,600,'','32px',0.96,(600+revealDelay)),100);
      sr.reveal('.contact_section', sReveal(false,600,'','32px','',(600+revealDelay),'ease'),100);

      sr.reveal('.service_sidebar', sReveal(false,800,'right','100%','',(100+revealDelay),'','','',1),100);
      sr.reveal('.service_content', sReveal(false,800,'left','100%','',(0+revealDelay),'','','',1),100);
      sr.reveal('.service_menu > li', sReveal(false,600,'','16px','',(600+revealDelay),'ease'),100);
      sr.reveal('.service_section', sReveal(false,600,'','48px','',(800+revealDelay),'ease'),100);

      sr.reveal('.blog_content .blog_item', sReveal(false,600,'','24px','',(300+revealDelay),'ease'),50);
      sr.reveal('.blog_sidebar', sReveal(false,800,'right','100%','',(100+revealDelay),'','','',1),100);

      sr.reveal('.single_title', sReveal(false,600,'','24px','',(100+revealDelay),'ease'),50);
      sr.reveal('.single_meta', sReveal(false,600,'','24px','',(200+revealDelay),'ease'),50);
      sr.reveal('.single_entry', sReveal(false,600,'','24px','',(300+revealDelay),'ease'),50);
      sr.reveal('.single_tags', sReveal(false,600,'','24px','',(400+revealDelay),'ease'),50);
      sr.reveal('.single_related', sReveal(false,600,'','24px','',(500+revealDelay),'ease'),50);

      sr.reveal('.related_list .blog_item', sReveal(false,600,'','24px','',(revealDelay),'ease'),50);

    }

  }

}


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

var main_menu = document.getElementById('main_menu'),
  jiggle_divide = 30;

// Mouse Move
function mouseMoving(event,ele,pX,pY) {
  var cpX = pX - window.innerWidth / 2,
    cpY = pY - window.innerHeight / 2;
  if (event_catcher) console.log('mouse moving');
  if (bodyClass.contains('onnav')) {
    main_menu.style['transform'] = 'perspective(1000px) translate3d(0,-50%,0) translate3d('+(cpX/jiggle_divide*-1)+'px,'+(cpY/jiggle_divide*-1)+'px,0) rotateX('+(cpY/(jiggle_divide)*-1)+'deg) rotateY('+(cpX/(jiggle_divide))+'deg)';
  }
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

var nav_trigger = document.getElementById('main_navigation-toggler'),
  active_trigger = true,
  count_active;

if (nav_trigger) {
  nav_trigger.addEventListener('click', function(e) {
    var thisClass = this.classList;
    if (active_trigger) {
      active_trigger = false;
      clearTimeout(count_active);
      //console.log('Trigger Disable');
      if (thisClass.contains('active')) {
        thisClass.remove('active');
        bodyClass.remove('onnav');
      } else {
        thisClass.add('active');
        bodyClass.add('onnav');
      }
      count_active = setTimeout(function() {
        active_trigger = true;
        //console.log('Trigger Enable');
      },1200);
    }
  });
}

/*********************************
// JQUERY
*********************************/
(function($) {
  $(document).ready(function() {
    var $body = $('body');

    var slider_pags = $('.home_slider-control_pag'),
      sliders = $('.home_slider-single'),
      vanish_slider,
      auto_home_slider,
      slider_duration = 6000; // milisecond

    function home_slider_next(ele,pag_ele) {
      var currentEle = $(ele+'.active'),
        nextEle = currentEle.next();

      if (nextEle.length < 1 && nextEle != undefined) {
        nextEle = $(ele).eq(0);
        //console.log('back to first Ele');
      } else {
        //console.log('Next Ele');
      }

      nextEle.addClass('active');
      currentEle.removeClass('active');
      $(pag_ele+'.active').removeClass('active');
      $(pag_ele).eq(nextEle.index()).addClass('active');
    }

    function home_slider_prev(ele,pag_ele) {
      var currentEle = $(ele+'.active'),
        nextEle = currentEle.prev();

      if (nextEle.length < 1 && nextEle != undefined) {
        nextEle = $(ele+':last-child');
        //console.log('back to first Ele');
      } else {
        //console.log('Next Ele');
      }

      nextEle.addClass('active');
      currentEle.removeClass('active');
      $(pag_ele+'.active').removeClass('active');
      $(pag_ele).eq(nextEle.index()).addClass('active');
    }

    $(document).on('click', '.home_slider-control_pag', function() {
      var $this = $(this),
        currentPos = $this.index();

      clearInterval(auto_home_slider);
      $body.removeClass('first_load');

      $('.home_slider-single.active, .home_slider-control_pag.active').removeClass('active');
      sliders.eq(currentPos).addClass('active');
      $this.addClass('active');

      auto_home_slider = setInterval(function() {
        home_slider_next('.home_slider-single','.home_slider-control_pag');
      },slider_duration);

      return false;

    });

    var firstLoad = function() {

      if (slider_pags.length > 0) {
        clearInterval(auto_home_slider);

        auto_home_slider = setInterval(function() {
          home_slider_next('.home_slider-single','.home_slider-control_pag');
        },slider_duration);
      }

      setTimeout(function() {
        $body.removeClass('first_load');
      },slider_duration);

    }

    addEvent(window, 'load', firstLoad, 0);

    function totalInits(page_title,revealDelay) {

      // Init home slider
      slider_pags = $('.home_slider-control_pag');
      sliders = $('.home_slider-single');

      if (slider_duration && slider_pags.length > 0) slider_pags.find('i').css('animation-duration',(slider_duration/1000)+'s');

      homeSlider = document.getElementById('home_slider');

      firstLoad();

      pageInit(page_title,revealDelay);

    }

    totalInits();
    

    $(document).on('click', '[direction]', function() {
      var target = $(this).attr('direction');
      $body.scrollTo(target,600);
      return false;
    });
    

    $(document).on('click', '[indirection]', function() {
      var target = $(this).attr('indirection');
      setTimeout(function() {
        $('.service_content').scrollTo(target,400);
        console.log('startScroll to ' +target);
      },600);
    });

    $(document).on('click', '[active]', function() {
      var $this = $(this),
        targetToggle = $this.attr('active');

      $(targetToggle).addClass('active');

      $('.pre-active').removeClass('pre-active');

      return false;
    });

    $(document).on('click', '[toggle]', function() {
      var $this = $(this),
        targetToggle = $this.attr('toggle');

      $(targetToggle).toggleClass('active');

      return false;
    });

    $(document).on('click', '[deactive]', function() {
      var $this = $(this),
        targetToggle = $this.attr('deactive');

      $(targetToggle).removeClass('active');

      return false;
    });

    $(document).on('click', '[data-service]', function() {
      var $this = $(this),
        targetToggle = $this.attr('data-service');

      $('#in_service').val(targetToggle);

      return false;
    });
    

    $(document).on('click', '[service_anchor]', function() {
      var target = $(this).attr('service_anchor');
      $('.service_content').scrollTo(target,600);
      return false;
    });

    var videoFrame = $('#overlay_video--frame');

    $(document).on('click', '[youtube]', function() {
      var thisTrigger = $(this),
        videoURL = thisTrigger.attr('youtube');

      console.log('open youtube');

      if (videoURL != undefined && videoURL != '') {
        $body.addClass('video_open');
        videoFrame.html('<iframe class="youtube_object" type="text/html" width="100%" height="100%" src="//www.youtube.com/embed/'+videoURL+'?&amp;wmode=transparent&amp;rel=0&amp;showinfo=0&amp;autoplay=1" allowfullscreen="" frameborder="0"></iframe>');
      }
      return false;
    });

    $(document).on('click', '.overlay_video--close', function() {

      $body.removeClass('video_open');
      videoFrame.empty();

      return false;
    });

    var jQswiping = false,
      jQtouching = false,
      homeSlider = document.getElementById('home_slider');

    function swipeDetectjQ(event,ele,pX,pY) {
      if (jQswiping) {
        if ( ! xDown ) return;
        var xDiff = xDown - pX;
        var yDiff = yDown - pY;

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
          if ( xDiff > 0 ) {
            /* left swipe */
            SwiperjQ(event,ele,'left',xDiff,yDiff);
          } else {
            /* right swipe */
            SwiperjQ(event,ele,'right',xDiff,yDiff);
          }
        }

        jQswiping = false;
      }
    }

    // Touch Down
    document.addEventListener('touchstart', function(event) {
      if (!jQtouching) {
        var ele = event.target;

        xDown = event.touches[0].clientX;
        yDown = event.touches[0].clientY;
        mouseDownX = xDown,
        mouseDownY = yDown;
        jQtouching = true;
        jQswiping = true;

      Touched(event,ele);

      }
    }, {passive: false});

    // Touch Move
    document.addEventListener('touchmove', function(event) {

      if (jQtouching) {
        var ele = event.target;

        var xUp = event.touches[0].clientX;
        var yUp = event.touches[0].clientY;

        swipeDetectjQ(event,ele,xUp,yUp);

      }
    }, {passive: false});

    // Touch Up
    document.addEventListener('touchend', function(event) {
      var ele = event.target;
      if (jQtouching) {

        jQtouching = false;

        Released(event,ele);

        // reset values
        xDown = null;
        yDown = null;

      }
    }, {passive: false});

    // On Swipe
    function SwiperjQ(event,ele,direction,pX,pY) {
      //console.log('swiped '+direction+' on '+ele);
      if (homeSlider.contains(ele)) {
        clearInterval(auto_home_slider);
        if (direction == 'left') {
          home_slider_next('.home_slider-single','.home_slider-control_pag');
        } else {
          home_slider_prev('.home_slider-single','.home_slider-control_pag');
        }
        auto_home_slider = setInterval(function() {
          home_slider_next('.home_slider-single','.home_slider-control_pag');
        },slider_duration);
      }
    }

    var mainContent = $('#main_content');

    function worker(the_url,the_title) {
      var file_url = the_url+'.html';

      bodyClass.remove('page_loaded');
      bodyClass.add('page_loading');

      $.ajax({
        url: file_url,
          success: function(data) {
            var loadedContent = $(data).find('#main_content');
            /*$body.addClass('redirecting redirected');
            $innerBody.removeClass('home about projects');
            $nav_item.not('[href="'+the_url+'"]').removeClass('active');
            $('.require_page[href="'+the_url+'"]','#nav_list').addClass('active');*/
            window.history.pushState(the_url, the_title, the_url);
            document.title = the_title;

            mainContent.html(loadedContent.html());
            nav_trigger.classList.remove('active');
            bodyClass.remove('onnav');

            // re-declare variables
            totalInits(the_title,1000);
            
          },
          complete: function() {
            console.log('Request complete');
            bodyClass.remove('page_loading');
            bodyClass.add('page_loaded');
            setTimeout(function() {
              bodyClass.remove('page_loaded');
            },600);
            // Schedule the next request when the current one's complete
            //setTimeout(worker, 5000);
        }
      });
    };

    $(document).on('click', '.main_menu a', function() {
      var the_url   = $(this).attr('href'),
        the_title = $(this).data('title');
      worker(the_url,the_title);

      return false;
    });


  });

})(jQuery);