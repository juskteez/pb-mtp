(function (definition) {
  if (typeof exports === "object") {
    module.exports = definition();
  }
  else if (typeof window.define === 'function' && window.define.amd) {
    window.define([], definition);
  } else {
    window.BezierEasing = definition();
  }
}(function () {

  /**
  * BezierEasing - use bezier curve for transition easing function
  * is inspired from Firefox's nsSMILKeySpline.cpp
  * Usage:
  * var spline = new BezierEasing(0.25, 0.1, 0.25, 1.0)
  * spline(x) => returns the easing value | x must be in [0, 1] range
  */
  function BezierEasing (mX1, mY1, mX2, mY2) {
    if (!(this instanceof BezierEasing)) return new BezierEasing(mX1, mY1, mX2, mY2);
   
    function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C(aA1)      { return 3.0 * aA1; }
   
    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function CalcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
    }
   
    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function GetSlope(aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }
   
    function GetTForX(aX) {
      // Newton raphson iteration
      var aGuessT = aX;
      for (var i = 0; i < 4; ++i) {
        var currentSlope = GetSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) return aGuessT;
        var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }

    return function (aX) {
      if (mX1 === mY1 && mX2 === mY2) return aX; // linear
      return CalcBezier(GetTForX(aX), mY1, mY2);
    };
  }

  // CSS mapping
  BezierEasing.css = {
    "ease":        BezierEasing(0.25, 0.1, 0.25, 1.0), 
    "linear":      BezierEasing(0.00, 0.0, 1.00, 1.0),
    "ease-in":     BezierEasing(0.42, 0.0, 1.00, 1.0),
    "ease-out":    BezierEasing(0.00, 0.0, 0.58, 1.0),
    "ease-in-out": BezierEasing(0.42, 0.0, 0.58, 1.0)
  };

  return BezierEasing;

}));

var animateWall = false;

function animate (render, duration, easing, morphData) {
  animateWall = true;
  var start = Date.now();
  (function loop () {
    var p = (Date.now()-start)/duration;
    if (p > 1) {
      render(1, morphData);
    }
    else {
      requestAnimationFrame(loop);
      render(easing(p), morphData);
    }
  }());
}

document.body.classList.add('cursoring');

let cursorSmall  = document.getElementById('cursor--small');
let cursorCircle = document.getElementById('cursor--circle');
let wigglers     = document.querySelectorAll('.wiggler');

var currentWig   = null,
    cursorState  = false,
    cursorX      = 0,
    cursorY      = 0;


function smallCursor() {

  if (window.innerWidth >= 768) cursorSmall.style['transform'] = 'translate3d('+cursorX+'px,'+cursorY+'px,0)';

  requestAnimationFrame(smallCursor);
} smallCursor();


var jx   = void 0,
    jy   = void 0,
    jdx  = void 0,
    jdy  = void 0,
    jtx  = 0,
    jty  = 0,
    jkey = -1;

var morphing = false;
var cursorRadius = 24;

var animateOut = false,
    animateTimeOut,
    lastWig = null;

function circleCursor() {

  if(!jx || !jy) {
    jx = cursorX;
    jy = cursorY;
  } else {
    jdx = (cursorX - jx) * 0.125;
    jdy = (cursorY - jy) * 0.125;
    if(Math.abs(jdx) + Math.abs(jdy) < 0.1) {
      jx = cursorX;
      jy = cursorY;
    } else {
      jx += jdx;
      jy += jdy;
    }
  }

  if (currentWig != null) {
    //cursorCircle.classList.add('wiggling');

    var shapeX = currentWig[0].getBoundingClientRect().left + currentWig[1] / 2,
        shapeY = currentWig[0].getBoundingClientRect().top + currentWig[2] / 2;

    if (cursorState === true) {
      var wigData = [
            currentWig[0],
            cursorRadius,
            cursorRadius,
            currentWig[1],
            currentWig[2],
            cursorX,
            cursorY,
            shapeX,
            shapeY
          ];
    } else {
      var wigData = [
            currentWig[0],
            cursorRadius,
            cursorRadius,
            cursorRadius,
            cursorRadius,
            cursorX,
            cursorY,
            shapeX,
            shapeY
          ];
    }

      if (morphing == false && animateWall == false) {
        animate(
          cursorMorph,
          300,
          BezierEasing(0.25, 0.1, 0.0, 1.0),
          wigData);
      }
  } else {

    if (animateOut == true && animateWall == false) {
      var wigData = [
            lastWig,
            lastWig[1],
            lastWig[2],
            cursorRadius,
            cursorRadius,
            jx,
            jy,
            null,
            null
          ];

      //animateWall = true;

      animate(
        cursorMorph,
        300,
        BezierEasing(0.25, 0.1, 0.0, 1.0),
        wigData);

      animateTimeOut = setTimeout(function() {
        animateOut = false;
        animateWall = false;
      },300);
    } else {
      if (lastWig == null) {
        cursorCircle.style.width  = (cursorRadius) + 'px';
        cursorCircle.style.height = (cursorRadius) + 'px';
      }
    }
    if (window.innerWidth >= 768) cursorCircle.style['transform'] = 'translate(-50%,-50%) translate3d('+jx+'px,'+jy+'px,0)';
  }

  requestAnimationFrame(circleCursor);
} circleCursor();

function cursorMorph(p, morphData) {
  var startWidth  = morphData[1],
      startHeight = morphData[2],
      endWidth    = morphData[3]-startWidth,
      endHeight   = morphData[4]-startHeight,
      startX      = morphData[5],
      startY      = morphData[6],
      endX        = morphData[7]-startX,
      endY        = morphData[8]-startY;

  var animatePX   = (startX+endX*p),
      animatePY   = (startY+endY*p);

  if (morphData[7] == null) animatePX = jx;
  if (morphData[8] == null) animatePY = jy;

  cursorCircle.style.width = (startWidth+endWidth*p) + 'px';
  cursorCircle.style.height = (startHeight+endHeight*p) + 'px';

  cursorCircle.style['transform'] = 'translate(-50%,-50%) translate3d('+animatePX+'px,'+animatePY+'px,0)';

  if (p >= 1) {
    morphing = false;
  } else {
    if (morphing == false) morphing = true;
  }
}


document.addEventListener('mousemove', function(event) {

  cursorX = event.clientX;
  cursorY = event.clientY;
  // if (document.body.classList.contains('hide-cursor')) {
  //     document.body.classList.remove('hide-cursor')
  // }

});

for (var i = 0 ;i<wigglers.length;i++) {
  wigglers[i].addEventListener('mouseenter', function() {
    currentWig = [this,this.offsetWidth,this.offsetHeight,this.getBoundingClientRect().left,this.getBoundingClientRect().top];
    clearTimeout(animateTimeOut);
    animateWall = false;

    if (this.classList.contains('wiggler-btn')) cursorState = true;
  });

  wigglers[i].addEventListener('mouseleave', function() {
    if (this.classList.contains('wiggler-btn')) {
      animateOut = true;
      lastWig = currentWig;
    } else {
      lastWig = null;
    }

    currentWig  = null;
    cursorState = false;
    animateWall = false;
  });
}

let wigglerBlocks = document.querySelectorAll('.wiggler-block');

if (wigglerBlocks && wigglerBlocks.length > 0) {
  for (var i = 0;i<wigglerBlocks.length;i++) {
    wigglerBlocks[i].addEventListener('mouseenter', function() {

      if (!theBody.classList.contains('wiggling-block')) theBody.classList.add('wiggling-block');

    });
    wigglerBlocks[i].addEventListener('mouseleave', function() {

      if (theBody.classList.contains('wiggling-block')) theBody.classList.remove('wiggling-block');

    });
  }
}