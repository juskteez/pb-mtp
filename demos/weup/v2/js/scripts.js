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

});

// Mouse Up
document.addEventListener('mouseup', function(event) {
  var ele = event.target;

  var pointerX = event.clientX,
    pointerY = event.clientY;
  mouseDown = false;

  mouseClicked(event,ele,pointerX,pointerY);


});



var theAudio = document.getElementById('the_audio'),
  audioPlay = document.getElementById('play'),
  audioPause = document.getElementById('pause'),
  audioPrev = document.getElementById('prevSong'),
  audioNext = document.getElementById('nextSong'),
  audioMute = document.getElementById('soundControl'),
  audioTime = document.getElementById('time'),
  audioName = document.getElementById('trackname'),
  audioArtist = document.getElementById('trackartist'),
  audioTracks = document.querySelectorAll('[data-trackid]'),
  defaultTrack = 0,
  currentTrack = defaultTrack,
  checkPlay,
  progressPlay;

String.prototype.toClock = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var onlyminutes = Math.floor(sec_num / 60); // only minute template
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  //if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (onlyminutes < 10) {onlyminutes = "0"+onlyminutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  //return hours + ':' + minutes + ':' + seconds;
  return onlyminutes + ':' + seconds; // only minute template
}

function checkPlayProgress(audioElement) {
  clearInterval(progressPlay);
  progressPlay = setInterval(function() {
    console.log('check progress');
    var audioProgress = audioElement.currentTime;
    if (audioProgress > 0) {
      audioTime.innerHTML = audioProgress.toString().toClock();
    } else {
      audioTime.innerHTML = '00:00';
    }
  },1000);
  checkPlay = setInterval(function() {
    console.log('check play');
    if (audioElement.currentTime > 0) {
      clearInterval(checkPlay);
      console.log('check audio play');
      audioPlay.classList.add('playing');
      audioPlay.classList.remove('loading');
    }
  },100);
}

function loadTrack(trackId) {
  theAudio.pause();
  audioName.innerHTML = window.tracks[trackId].name;
  audioArtist.innerHTML = window.tracks[trackId].artist;

  document.querySelector('.playing[data-trackid]').classList.remove('playing');

  theAudio.src = window.tracks[trackId].file + '.mp3';
  theAudio.play();

  document.querySelector('[data-trackid="'+window.tracks[trackId].track+'"]').classList.add('playing');

  audioPlay.classList.remove('playing');
  audioPlay.classList.add('loading');
  checkPlayProgress(theAudio);
}

audioPlay.addEventListener('click', function() {
  clearInterval(checkPlay);
  theAudio.play();
  audioPlay.classList.add('loading');
  checkPlayProgress(theAudio);
});

function pauseAudio() {
  clearInterval(checkPlay);
  clearInterval(progressPlay);
  theAudio.pause();
  audioPlay.classList.remove('playing');
}

audioPause.addEventListener('click', function() {
  pauseAudio();
});

audioMute.addEventListener('click', function() {
  theAudio.muted = !theAudio.muted;
  if (theAudio.muted) {
    audioMute.classList.add('disable');
  } else {
    audioMute.classList.remove('disable');
  }
});

audioNext.addEventListener('click', function() {
  if (theAudio) {
    if (currentTrack < audioTracks.length-1) {
      currentTrack = currentTrack+1;
      loadTrack(currentTrack);
    }
  }
});

audioPrev.addEventListener('click', function() {
  if (theAudio) {
    if (currentTrack > 0) {
      currentTrack = currentTrack-1;
      loadTrack(currentTrack);
    }
  }
});

for (var i = 0;i < audioTracks.length; i++) {
  audioTracks[i].addEventListener('click', function() {
    var trackid = this.getAttribute('data-trackid');

    loadTrack(trackid);

    return false;
  });
}

var wheelfired = false,
  wheelDefer,
  lastDelta = 0;

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
      if (window.innerWidth > 640) scroll_fullPage(scrollDirection);
      //console.log(scrollDirection);
    }

    deferScrolled = setTimeout(function() {
      scrolled = false;
    },1000);
  }

  lastDelta = newDelta;

});

var currentSection = 0,
  scrollParentElement = 'main_content',
  scrollPagers = document.querySelectorAll('.'+scrollParentElement+'-page'),
  pageScroller,
  pageScrolling = false,
  passedSection;

var scrollGuide = document.getElementById('scroll_guide');

function checkPlaySection(targetPage) {
  if (targetPage.id != 'section-quality') pauseAudio();
}

function scroll_fullPage(scrollDirection) {
  //
  if (scrollParentElement && scrollDirection && !pageScrolling) {
    var scrollParent = document.getElementById(scrollParentElement),
      scrollSection = scrollParent.querySelectorAll('.section'),
      sectionCount = scrollSection.length - 1;

    pageScrolling = true;
    clearTimeout(pageScroller);

    if ((scrollDirection == 'down' && currentSection < sectionCount) || (scrollDirection == 'up' && currentSection > 0)) {
      scrollSection[currentSection].classList.remove('active');
      scrollSection[currentSection].classList.add('inactive');
      passedSection = currentSection;
      document.querySelector('.'+scrollParentElement+'-page.active').classList.remove('active');
      bodyClass.remove('sc-first');
      bodyClass.remove('sc-section-'+currentSection);
    }

    if (scrollDirection == 'down' && currentSection < sectionCount) {
      currentSection=currentSection+1;
    } else if (scrollDirection == 'up' && currentSection > 0) {
      currentSection=currentSection-1;
    }

    if (currentSection == sectionCount) {
      scrollGuide.classList.add('last');
    } else {
      scrollGuide.classList.remove('last');
    }

    scrollPagers[currentSection].classList.add('active');
    bodyClass.add('sc-section-'+currentSection);
    scrollSection[currentSection].classList.remove('inactive');
    pageScroller = setTimeout(function() {
      scrollSection[currentSection].classList.add('active');
      scrollSection[passedSection].classList.remove('inactive');
      checkPlaySection(scrollSection[currentSection]);
      pageScrolling = false;
    },600);
    // console.log(currentSection + ' - ' + sectionCount);
  }
}

function scroll_Page(targetPage) {
  if (!pageScrolling) {
    var scrollParent = document.getElementById(scrollParentElement),
      scrollSection = scrollParent.querySelectorAll('.section');

    //console.log('currentSection: '+ currentSection + '- targetPage: '+targetPage);
    pageScrolling = true;
    clearTimeout(pageScroller);

    scrollSection[currentSection].classList.remove('active');
    scrollSection[currentSection].classList.add('inactive');
    passedSection = currentSection;
    bodyClass.remove('sc-first');
    bodyClass.remove('sc-section-'+currentSection);
    document.querySelector('.'+scrollParentElement+'-page.active').classList.remove('active');
    currentSection = targetPage;

    if (currentSection == scrollSection.length - 1) {
      scrollGuide.classList.add('last');
    } else {
      scrollGuide.classList.remove('last');
    }

    pageScroller = setTimeout(function() {
      scrollSection[currentSection].classList.add('active');
      scrollSection[passedSection].classList.remove('inactive');
      checkPlaySection(scrollSection[currentSection]);
      pageScrolling = false;
    },600);
    bodyClass.add('sc-section-'+currentSection);
    document.querySelector('.'+scrollParentElement+'-page[sc-page="'+targetPage+'"]').classList.add('active');
    return false;
  }
}

scrollGuide.addEventListener('click', function() {
  if (!scrolled) {
    scrolled = true;
    clearTimeout(deferScrolled);

    (currentSection < (scrollPagers.length -1)) ? scroll_fullPage('down') : scroll_Page(0);
    
    deferScrolled = setTimeout(function() {
      scrolled = false;
    },1000);
  }
  
});

var allPageTriggers = document.querySelectorAll('a[sc-page]');

for (var i = 0;i<allPageTriggers.length;i++) {
  allPageTriggers[i].addEventListener('click', function() {
    if (!pageScrolling) {
      var targetPage = Number(this.getAttribute('sc-page'));

      scroll_Page(targetPage);
    }
  });
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

var windowLoad = function() {
  bodyClass.add('loaded');
};

addEvent(window, 'load', windowLoad, 0);


document.addEventListener('mouseover', function(event) {
  var ele = event.target;
});

// Mouse Down
function mouseClick() {
  if (event_catcher) console.log('mouse down');
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

var nav_trigger = document.getElementById('main_header-menu_toggler'),
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
      },600);
    }
  });
}


/*new fullpage('#main_content', {
  //options here
  autoScrolling:true,
  navigation: true,
  navigationPosition: 'right',
  //scrollHorizontally: true
});*/

//methods
//fullpage_api.setAllowScrolling(false);

/*********************************
// JQUERY
*********************************/
/*(function($) {
  $(document).ready(function() {
    var $body = $('body');

    $(document).on('click', '[direction]', function() {
      var target = $(this).attr('direction');
      $body.scrollTo(target,600);
      return false;
    });


  });

})(jQuery);*/