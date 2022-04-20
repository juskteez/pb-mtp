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

    }

    deferScrolled = setTimeout(function() {
      scrolled = false;
    },600);
  }

  lastDelta = newDelta;

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
  if (bodyClass.contains('page_scroll')) event.preventDefault();
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

var windowLoad = function() {};

addEvent(window, 'load', windowLoad, 0);

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


/*********************************
// JQUERY
*********************************/

$(document).ready(function() {



});
