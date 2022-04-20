// window.onload = function() {
// 	setTimeout(function () {
// 		document.querySelector('#the_sound').play()
// 	}, 4000)
// }


var ec = function(ele) {
  if (typeof(ele) != 'undefined' && ele != null) {
    return true;
  } else {
    return false;
  }
}

var theBody        = document.body,
    topBar         = document.getElementById('topbar'),
    allscreens     = document.querySelectorAll('#content .screen'),
    activeScreen   = document.querySelector('#content .screen.active'),
    screenWrap     = document.getElementById('content'),
    allMScreen     = document.querySelectorAll('#mini_screens .mini_screen'),
    msList         = Array.prototype.slice.call(allMScreen),
    activeMScreen  = allMScreen[0],
    allMSPag       = document.querySelectorAll('#mini_screens-pag a'),
    msPList        = Array.prototype.slice.call(allMSPag),
    screenOut      = document.createElement('DIV'),
    scrollable     = true,
    msScrollable   = false,
    activeMPag     = 0,
    multiScreening = false;

screenOut.classList.add('screen-out');
if (allMScreen.length < 1) {
  theBody.classList.add('page-in');
  setTimeout(function() {
    theBody.classList.remove('page-in');
  },1550);
}
theBody.appendChild(screenOut);

function multiScreenTimes(screenTimes, screeningGap, screenDirection) {

  multiScreening = true;

  var absoluteTimes    = Math.abs(screenTimes),
      screenTimeoutDur = screeningGap / screenTimes;

  //console.log('going ',screenDirection);

  for (var i = 0;i<screenTimes;i++) {
    //console.log('multi screen time ' + (i+1) + ' with ' + (screenTimeoutDur*i) + 'ms delay');
    setTimeout(function() {
      screening(screenDirection);
      //console.log('boom');
    },screenTimeoutDur*i);
  }

  setTimeout(function() {
    multiScreening = false;
    //console.log('done '+(screeningGap+550)+'ms',multiScreening);
    //console.log('activeMPag',activeMPag);
  },(screeningGap + 250)); // 250ms is extra delay for screen transition
}

for (var i = 0; i < allMSPag.length; i++) {
  allMSPag[i].addEventListener('click', function() {
    var targetPag  = msPList.indexOf(this),
        currentPag = Math.abs(activeMPag - targetPag),
        screenDirection = true;

    //console.log('going to ' + targetPag + ' would take ' + Math.abs(currentPag) + ' step(s)');

    if (multiScreening == false) {
      if (targetPag < activeMPag) screenDirection = false;
      multiScreenTimes(currentPag, 500, screenDirection);
      activeMPag = targetPag;
    }

    return false;
  });
}

function miniScreening(msCommand) {
  var targetScreen = null;

  if (msCommand == true) {
    if (activeMScreen) {
      targetScreen = activeMScreen.nextElementSibling;
    }

  } else {
    if (activeMScreen) {
      targetScreen = activeMScreen.previousElementSibling;
    }
  }

  //console.log('go for mini slide');

  if (targetScreen && msScrollable) {
    targetScreen.classList.add('active');
    activeMScreen.classList.remove('active');

    document.querySelector('#mini_screens-pag a.active').classList.remove('active');
    allMSPag[msList.indexOf(targetScreen)].classList.add('active');

    screenWrap.setAttribute('active-mscreen',targetScreen.id);

    activeMScreen = targetScreen;
    activeMPag    = msList.indexOf(targetScreen);
  }

  if (!targetScreen && msScrollable) {
    msScrollable = false;
    scrollable = true;
  }
}

function moveScreen(targetScreen) {
  if (targetScreen && scrollable) {
    targetScreen.classList.add('active');
    screenWrap.setAttribute('active-screen',targetScreen.id);

    checkFirstScreen();
    checkThirdScreen();

    if (targetScreen.id != 'screen-1') {
      if (theBody.classList.contains('aiming')) theBody.classList.remove('aiming');
    }

    if (activeScreen.id == 'screen-2') {
      titleSplitter('.raiser-text-s2',true);
    } else if (targetScreen.id == 'screen-2') {
      titleSplitter('.raiser-text-s2',false);
    }

    if (activeScreen.id == 'screen-3') {
      titleSplitter('.raiser-text-s3',true);
    } else if (targetScreen.id == 'screen-3') {
      titleSplitter('.raiser-text-s3',false);
    }

    if (activeScreen.id == 'screen-4') {
      titleSplitter('.raiser-text-s4',true);
    } else if (targetScreen.id == 'screen-4') {
      titleSplitter('.raiser-text-s4',false);
    }

    activeScreen.classList.remove('active');
    activeScreen = targetScreen;

    if (targetScreen.id == 'screen-3') {
      setTimeout(function() {
        window.jmoothTerminate = false;
      },1000);
    }
  }
}

var jmoothScrollBar = document.getElementById('jmooth_scrollprogress'),
    menu_state = false;

function screening(screenCommand) {
  var targetScreen = null;

  if (screenCommand == true) {
    if (activeScreen) {
      targetScreen = activeScreen.nextElementSibling;
    }

  } else {
    if (activeScreen) {
      targetScreen = activeScreen.previousElementSibling;
    }
  }

  if (menu_state === false && ec(targetScreen) === true) {

    if (activeScreen.id == "screen-2") {
      scrollable = false;
      msScrollable = true;
      miniScreening(screenCommand);
      window.jmoothTerminate = true;
    }

    if (activeScreen.id == "screen-3") {
      if (screenCommand == true) {
        if (jmoothScrollBar.offsetHeight >= 100) {
          scrollable = true;
          window.jmoothTerminate = true;
        } else {
          scrollable = false;
        }
      } else {
        if (jmoothScrollBar.offsetHeight < 0.5) {
          scrollable = true;
          window.jmoothTerminate = true;
        } else {
          scrollable = false;
        }
      }

    }

    moveScreen(targetScreen);

  }
}

// Mouse Wheel
var scrolled = false,
    clearScroll;

document.addEventListener('wheel', function(event) {

  var eventDelta = (event.deltaY + event.deltaX),
      scrollDirection;

  if (window.innerWidth >= 768) {

    if (eventDelta > 0) scrollDirection = true;

    if (eventDelta < 0) scrollDirection = false;

    if (eventDelta < 0) eventDelta = (event.deltaY + event.deltaX) * -1;

    if (!scrolled && eventDelta > 30) {
      scrolled = true;
      clearTimeout(clearScroll);

      //(scrollDirection) ? move_offer() : move_offer(true);
      if (scrollDirection) {
        screening(true);
      } else {
        screening();
      }

      clearScroll = setTimeout(function () {
        scrolled = false;
      }, 800);
    }

  }

});

var menuTrigger = document.getElementById('menu_trigger');

menuTrigger.addEventListener('click', function() {
  if (theBody.classList.contains('menu-on')) {
    menu_state = false;
    theBody.classList.remove('menu-remove-delay');
    theBody.classList.remove('menu-on');
  } else {
    menu_state = true;
    theBody.classList.add('menu-on');
    setTimeout(function () {
      //console.log(12345)
      theBody.classList.add('menu-remove-delay');
    }, 300);
  }

  return false;
});

// var theSound     = document.getElementById('the_sound'),
//     soundControl = document.getElementById('sound_control');
//
// if (localStorage.getItem('soundMuted') === 'true') {
//   theSound.muted = !theSound.muted;
//   if (theSound.muted) {
//     soundControl.classList.add('disabled');
//   } else {
//     soundControl.classList.remove('disabled');
//   }
// } else {
//   theSound.muted = true;
// }
//
// soundControl.addEventListener('click', function() {
//   // theSound.muted = !theSound.muted;
//   if (theSound.muted) {
//     soundControl.classList.add('disabled');
//     // localStorage.setItem('soundMuted', true)
//   } else {
//     soundControl.classList.remove('disabled');
//     // localStorage.setItem('soundMuted', false)
//   }
// });

function titleSplitter(titleSelector,splitterDirection) {

    if (window.isMobile()) return

  var allSplitters = document.querySelectorAll(titleSelector);

  for (var i = 0; i < allSplitters.length; i++) {
    var thisTitle    = allSplitters[i],
        getBlockLine = thisTitle.querySelectorAll('span'),
        breakTimes   = (allSplitters[i].textContent.match(/\n/g)||[]).length,
        splittedText = allSplitters[i].textContent.split(''),
        newText      = '';

    if (!thisTitle.classList.contains('raised')) {
      if (breakTimes > 0) {
        newText = allSplitters[i].textContent.split(/\r\n|\r|\n/g).map(function(c){
          var innerText = c.trim();

          if (innerText != '') {
            var innerTextSplit = innerText.split('').map(function(c){
              if (c == " ") c = "&nbsp;";
              return '<i c="' + c + '">' + c + '</i>';

            }).join('');

            return '<span>' + innerTextSplit + '</span>';
          }
        }).join('');

      } else {
        newText = splittedText.map(function(c){
          if (c == " ") c = "&nbsp;";
          return '<i c="' + c + '">' + c + '</i>';

        }).join('');
      }

      thisTitle.innerHTML = newText;
      thisTitle.classList.add('raised');
    } else {
      if (splitterDirection) {
        if (!thisTitle.classList.contains('raise-out')) thisTitle.classList.add('raise-out');
      } else {
        if (thisTitle.classList.contains('raise-out')) thisTitle.classList.remove('raise-out');
      }
    }
  }

  //if (this.nodeType === 1) titleSplitter(thisTitle);
}

var firstLoadCheck = setInterval(function() {
  if (theBody.classList.contains('pace-done') || theBody.classList.contains('sub-page')) {
    titleSplitter('.raiser-text-s1');
    clearInterval(firstLoadCheck);
  }
}, 400);

// Add class to body when first section active
function checkFirstScreen() {
  var screenString = screenWrap.getAttribute('active-screen');
  if (screenString === 'screen-1') {
    theBody.classList.add('screen-1-activate');
  } else {
    theBody.classList.remove('screen-1-activate');
  }
}
if (screenWrap) {
  checkFirstScreen();
}

// Add class to body when third or fourth section active
function checkThirdScreen() {
  var screenString = screenWrap.getAttribute('active-screen');
  if (screenString === 'screen-3' || screenString === 'screen-4') {
    theBody.classList.add('screen-3-activate');
  } else {
    theBody.classList.remove('screen-3-activate');
  }
  if (screenString === 'screen-4') {
    theBody.classList.add('screen-4-activate');
  } else {
    theBody.classList.remove('screen-4-activate');
  }
}
if (screenWrap) {
  checkThirdScreen();
}

var screenJumps = document.querySelectorAll('[screen-jump]');

function resetScreening() {
  //Reset all screening position & state ()
}

if (screenJumps && screenJumps.length > 0) {
  for (var i = 0;i<screenJumps.length;i++) {
    screenJumps[i].addEventListener('click', function() {
      var targetId = this.getAttribute('screen-jump');
      if (targetId && targetId != '') {
        var targetScreen = document.getElementById(targetId);
        if (targetScreen != activeScreen) moveScreen(targetScreen);
      }
    });
  }
}

//Play audio when loaded & able to

// if (theSound) {
//
//   var promise = theSound.play();
//   var theSoundTrigger = document.getElementById('the_sound-trigger');
//
//   theSoundTrigger.addEventListener('click', function() {
//   	console.log(theSound)
//     theSound.play();
//   });
//
//   if (promise !== undefined) {
//     promise.then(_ => {
//       // Autoplay started!
//     }).catch(error => {
//       // Autoplay was prevented.
//       // Show a "Play" button so that user can start playback.
//       // Auto simulate the click.
//       // theSound.pause();
//       setTimeout(function() {
//         theSoundTrigger.click();
//       },2000);
//     });
//   }
// }


var jactivators = document.querySelectorAll('[jactivator]');

if (jactivators && jactivators.length > 0) {
  for (var i = 0;i < jactivators.length;i++) {
    jactivators[i].addEventListener('click', function() {
      var activeTarget = this.getAttribute('jactivator');

      if (activeTarget && activeTarget != '') {
        document.getElementById(activeTarget).classList.add('active');
      }
    });
  }
}

var popups = document.querySelectorAll('.popup');

if (popups && popups.length > 0) {
  for (var i = 0;i < popups.length;i++) {
    var theCloser = popups[i].querySelector('.popup-closer'),
        currentPopup = popups[i];

    if (theCloser) {
      theCloser.addEventListener('click', function() {
        if (currentPopup.classList.contains('active')) currentPopup.classList.remove('active');
      });
    }
  }
}

const s1Wrap       = document.getElementById('s1-graphics');
const circleRadius = 101;

let aScope         = document.getElementById('a-scope');
let layer          = document.getElementById('as-true');
let scopePoint     = document.getElementById('scope-rate-point');

var s1Radius = 0,
    s1MouseX = 0,
    s1MouseY = 0,
    s1Scaler = 0,
    s1ScopeX = 0,
    s1ScopeY = 0;

if (s1Wrap) {
  s1Wrap.addEventListener('mousemove', function(event) {
    var scopeX = event.clientX - this.getBoundingClientRect().left - (aScope.offsetWidth / 2),
      scopeY = event.clientY - this.getBoundingClientRect().top - (aScope.offsetHeight / 2),
      mouseX  = event.clientX - layer.getBoundingClientRect().left,
      mouseY  = event.clientY - layer.getBoundingClientRect().top,
      offsetX = layer.offsetWidth - mouseX,
      offsetY = layer.offsetHeight - mouseY,
      radius  = mouseY;

    if (mouseX < mouseY) radius = mouseX;

    if (offsetY < circleRadius && offsetY < offsetX) {
      (mouseX < circleRadius && mouseX < offsetY) ? radius = mouseX : radius = offsetY;

    } else if (offsetX < circleRadius && offsetX < offsetY) {
      (mouseY < circleRadius && mouseY < offsetX) ? radius = mouseY : radius = offsetX;

    }

    if (radius > circleRadius) radius = circleRadius;

    var scaler = radius/circleRadius;

    if (scaler > 1) scaler = 1;
    if (scaler < 0) scaler = 0;
    if (scaler < 0.7) {
      theBody.classList.remove('aiming');
    } else {
      if (activeScreen.id != 'screen-1') {
        theBody.classList.remove('aiming');
      } else {
        if (!theBody.classList.contains('recruit-process')) theBody.classList.add('aiming');
      }
    }

    s1Radius = radius;
    s1MouseX = mouseX;
    s1MouseY = mouseY;
    s1Scaler = scaler;
    s1ScopeX = scopeX;
    s1ScopeY = scopeY;

  });
}

var x   = void 0,
    y   = void 0,
    dx  = void 0,
    dy  = void 0,
    tx  = 0,
    ty  = 0,
    key = -1;

function clipper() {
  
  if(!x || !y) {
    x = s1ScopeX;
    y = s1ScopeY;
  } else {
    dx = (s1ScopeX - x) * 0.125;
    dy = (s1ScopeY - y) * 0.125;
    if(Math.abs(dx) + Math.abs(dy) < 0.1) {
      x = s1ScopeX;
      y = s1ScopeY;
    } else {
      x += dx;
      y += dy;
    }
  }

  var clipPath = 'circle('+s1Radius+'px at '+(x+circleRadius)+'px '+(y+circleRadius)+'px)';

  if (layer && !theBody.classList.contains('recruit-process')) {
    layer.setAttribute('style', 'clip-path: ' + clipPath + ';opacity: ' + s1Scaler);
    aScope.style['transform'] = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + s1Scaler + ')';
  }

  requestAnimationFrame(clipper);
} clipper();


let a2Guy     = document.getElementById('a2-true');
let trueMans  = document.querySelectorAll('.true-man');
let scopeRate = document.getElementById('a-scrope-rate');
let theUFO    = document.getElementById('ufo_syncing');

var pointIncreasement;

if (!theBody.classList.contains('recruit-process')) {
  for (var i = 0; i < trueMans.length; i++) {

    trueMans[i].addEventListener('mouseenter', function () {
      var manPoint = this.getAttribute('data-scope-point');

      if (!theBody.classList.contains('rumble')) theBody.classList.add('rumble');

      var incr = 0;

      pointIncreasement = setInterval(function () {
        if (incr < manPoint) {
          scopeRate.setAttribute('data-rate', Math.round(incr) + '%');
          scopePoint.setAttribute('stroke-dasharray', Math.round(incr / 100 * 47 * 3.14) + ',9999')
        }
        incr = incr + 1.2;
      }, 5);

      s1Wrap.setAttribute('active-man', manPoint);

    });

    trueMans[i].addEventListener('mouseleave', function () {
      if (theBody.classList.contains('rumble')) theBody.classList.remove('rumble');
      s1Wrap.setAttribute('active-man', 0);
    });
  }
}

var resetRecruitDelay;

function resetRecruit(delayTime) {
  if (theBody.classList.contains('recruit-process')) {
    resetRecruitDelay = setTimeout(function() {
      theBody.classList.remove('recruit-process');
      theBody.classList.add('recruit-again');
    }, delayTime);
  }
}

if (a2Guy) {
  a2Guy.addEventListener('click', function() {
    (!theBody.classList.contains('recruit-process')) ? theBody.classList.add('recruit-process') :  theBody.classList.remove('recruit-process');
    if (theBody.classList.contains('recruit-again')) theBody.classList.remove('recruit-again');
    setTimeout(function() {
      screening(true);
      resetRecruit(1000);
    },1600);
  });
}

let allCircles = document.querySelectorAll('.ai-circle');

if (allCircles && allCircles.length > 0) {
  for (var i = 0;i<allCircles.length;i++) {
    allCircles[i].addEventListener('mouseenter', function() {
      var aiId = this.getAttribute('ai-id');

      if (!this.classList.contains('active')) {
        document.querySelector('.ai-circle.active').classList.remove('active');
        document.querySelector('.ai-content.active').classList.remove('active');
        this.classList.add('active');
        document.getElementById(aiId).classList.add('active');
      }
    });
  }
}


window.isMobile = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};


function openChatbot() {

  if (typeof jQuery !== 'undefined') {
    var trigger = $('.chatbot_trigger')

    // Open chat window
    trigger.click(function (e) {
      e.preventDefault()
      $('body').addClass('open-chat')
    })

    // Close chat window
    $('.chatbot-header__close').click(function (e) {
      e.preventDefault()
      $('body').removeClass('open-chat')
    })

    if (location.href.includes('#meetgenius')) {
      setTimeout(function () {
        trigger.trigger('click')
      }, 2000)
    }
  }
}
openChatbot()


var allLinks =  document.getElementsByTagName('A');

function redirectDelay (URL) {
  setTimeout( function() { window.location = URL }, 1550 );
}

for (var i = 0;i<allLinks.length;i++) {
  allLinks[i].addEventListener('click', function(event) {
    if (this.href != '' && this.href != 'javascript:;' && this.href.substr(0, 1 ) === '#') {
      event.preventDefault();
      redirectDelay(this.href);
      theBody.classList.add('page-out');
      return false;
    }
  });
}

function openSidebar() {

  if (typeof jQuery !== 'undefined') {
    var trigger = $('.open-sidebar')

    // Open chat window
    trigger.click(function (e) {
      e.preventDefault()
      $('body').addClass('open-sidebar')
    })

    // Close chat window
    $('.sidebar-header__close').click(function (e) {
      e.preventDefault()
      $('body').removeClass('open-sidebar')
    })
  }
}
openSidebar()

let anchorBar   = document.getElementById('section-anchor-nav'),
    mainContent = document.querySelector('.main-content.sections-content > .section'),
    anchorY     = 0;

if (anchorBar && mainContent) {
  window.addEventListener('scroll', function(event) {
    anchorY = window.scrollY;
  });

  let anchorContent = document.getElementById('section-anchor-content'),
      anchorPoints  = document.querySelectorAll('.section-content--list'),
      allAnchors    = anchorBar.querySelectorAll('li a'),
      lastAnchor    = undefined;

  if (typeof animate !== "undefined") {

    for (var i = 0;i<allAnchors.length;i++) {
      let thisIndex = i;

      allAnchors[i].addEventListener('click', function(event) {
        let targetAnchor   = anchorPoints[thisIndex],
            targetPosition = targetAnchor.offsetTop + mainContent.offsetTop;
            scrollLength   = (targetPosition - anchorY);

        let anchorData = [
          anchorY,
          scrollLength
        ]

        event.preventDefault();

        animate(scrollToAnchor, 600, BezierEasing(0.25, 0.1, 0.0, 1.0), anchorData);

        return false;

      });
    }

    function scrollToAnchor (p, anchorData) { // p move from 0 to 1
      var startPoint = anchorData[0],
          endPoint   = anchorData[1];

      window.scrollTo(0, (startPoint+endPoint*p));

    }
  }


  function sectionAnchoring() {
    requestAnimationFrame(sectionAnchoring);

    if (window.innerWidth >= 768) {
      var wHeight           = window.innerHeight,
          mCOffsetTop       = mainContent.offsetTop,
          anchorContentView = anchorContent.offsetHeight + anchorContent.offsetTop - mCOffsetTop,
          anchorView        = wHeight - mCOffsetTop,
          anchorTarget      = anchorBar.offsetHeight - anchorView;

      if (anchorY >= anchorContentView) anchorY = anchorContentView;

      var anchorProgress = anchorY / anchorContentView,
          anchorTranslate = ((anchorTarget + mCOffsetTop) * anchorProgress)*-1;

      if (anchorTarget > 0 && anchorTarget > 48) anchorBar.style['transform'] = 'translate3d(0,' + anchorTranslate + 'px,0)';

      if (topBar) {
        if (anchorY > 32) {
          if (!theBody.classList.contains('overhead')) theBody.classList.add('overhead');
        } else {
          if (theBody.classList.contains('overhead')) theBody.classList.remove('overhead');
        }
      }

      for (var i = 0;i<anchorPoints.length;i++) {
        let thisAnchor = anchorPoints[i];

        if (thisAnchor.getBoundingClientRect().top < 1) lastAnchor = i+1;

      }

      var oldAnchor = anchorBar.querySelector('li a.active'),
          newAnchor = allAnchors[lastAnchor-1];

      if (oldAnchor && (oldAnchor != newAnchor || oldAnchor.classList.contains('active'))) oldAnchor.classList.remove('active');

      if (newAnchor && !newAnchor.classList.contains('active')) newAnchor.classList.add('active');
    }

  } sectionAnchoring()
}

var mouseDownX,
    mouseDownY,
    mouseDown = false,
    touching = false,
    swiping = false,
    event_catcher = false,
    xDown,
    yDown;

let aiMobile     = document.getElementById('ai-mobile'),
    mini_screens = document.getElementById('mini_screens'),
    allAiContent = aiMobile.querySelectorAll('.ai-content'),
    allAiPags    = document.querySelectorAll('.ai-pag a');

let aiPos        = 1,
    miniPos      = 1;

function Swiper(event,ele,direction) {
  if (event_catcher) console.log(direction, ele);
  if (window.innerWidth < 768) {
    if (aiMobile && allAiContent.length > 0) {
      if (aiMobile.contains(ele)) {

        (direction === 'left') ? aiPos = aiPos+1 : aiPos = aiPos-1;

        if (aiPos > allAiContent.length) aiPos = allAiContent.length;

        if (aiPos < 1) aiPos = 1;

        aiMobile.setAttribute('ai-pos',aiPos);

        document.querySelector('.ai-pag a.active').classList.remove('active');

        allAiPags[aiPos-1].classList.add('active');

      }
    }
    if (mini_screens) {
      if (mini_screens.contains(ele)) {

        (direction === 'left') ? miniPos = miniPos+1 : miniPos = miniPos-1;

        if (miniPos > allMScreen.length) miniPos = allMScreen.length;

        if (miniPos < 1) miniPos = 1;

        mini_screens.setAttribute('mini-pos',miniPos);

        document.querySelector('.inner_screen-pag a.active').classList.remove('active');

        allMSPag[miniPos-1].classList.add('active');

      }
    }
  }
}

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

// Touch Down
document.addEventListener('touchstart', function(event) {
  if (!touching) {
    var ele = event.target;

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
  var ele = event.target;
  if (touching) {

    touching = false;

    //Released(event,ele);

    // reset values
    xDown = null;
    yDown = null;

  }
}, {passive: false});


var homeThirdScreen    = document.getElementById('screen-3'),
    flowScreenPgBar    = document.getElementById('flowscreen-progress_bar'),
    flowScreenProgress = document.getElementById('flowscreen-progress');

document.addEventListener('scroll', function(event) {
  if (window.innerWidth < 768 && homeThirdScreen && flowScreenPgBar) {
    var screenTop = homeThirdScreen.getBoundingClientRect().top * -1,
        progressLength = (flowScreenPgBar.offsetHeight + flowScreenPgBar.offsetTop) * 0.9125,
        progressNumber = screenTop / progressLength;

    if (progressNumber <= 0) progressNumber = 0;
    if (progressNumber >= 1) progressNumber = 1;

    flowScreenProgress.style['transform'] = 'translate3d(0,0,0) scaleY('+progressNumber.toFixed(2).replace(/0{0,2}$/, "");+')';

    if (progressNumber >= 0.16) {
      if (!flowScreenPgBar.classList.contains('active-1')) flowScreenPgBar.classList.add('active-1');
    } else {
      if (flowScreenPgBar.classList.contains('active-1')) flowScreenPgBar.classList.remove('active-1');
    }

    if (progressNumber >= 0.35) {
      if (!flowScreenPgBar.classList.contains('active-2')) flowScreenPgBar.classList.add('active-2');
    } else {
      if (flowScreenPgBar.classList.contains('active-2')) flowScreenPgBar.classList.remove('active-2');
    }

    if (progressNumber >= 0.57) {
      if (!flowScreenPgBar.classList.contains('active-3')) flowScreenPgBar.classList.add('active-3');
    } else {
      if (flowScreenPgBar.classList.contains('active-3')) flowScreenPgBar.classList.remove('active-3');
    }

    if (progressNumber >= 0.79) {
      if (!flowScreenPgBar.classList.contains('active-4')) flowScreenPgBar.classList.add('active-4');
    } else {
      if (flowScreenPgBar.classList.contains('active-4')) flowScreenPgBar.classList.remove('active-4');
    }

    if (progressNumber >= 0.99) {
      if (!flowScreenPgBar.classList.contains('active-5')) flowScreenPgBar.classList.add('active-5');
    } else {
      if (flowScreenPgBar.classList.contains('active-5')) flowScreenPgBar.classList.remove('active-5');
    }

  } else {
    flowScreenProgress.style['height'] = '0';
  }
}, false);