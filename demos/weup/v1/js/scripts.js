var theBody = document.body,
  bodyClass = theBody.classList,
  theHTML = document.documentElement,
  sectionHome = document.getElementById('hero'),
  sectionAbout = document.getElementById('about'),
  sectionFeature = document.getElementById('feature'),
  sectionProcess = document.getElementById('process'),
  sectionTestimonial = document.getElementById('testimonial'),
  sectionContact = document.getElementById('main_footer'),
  indicator = document.getElementById('active_indicator'),
  pastnoon = false;

var ua = navigator.userAgent.toLowerCase();

if (ua.indexOf('safari') != -1) {
  (ua.indexOf('chrome') > -1) ? theBody.classList.add('chrome') : bodyClass.add('safari');
}

function newActive(windowWidth,target_ele) {
  var target_element = document.getElementById(target_ele);

  if (!target_element.classList.contains('active')) {
    var targetWidth = target_element.offsetWidth,
      targetOffset = target_element.offsetLeft,
      targetOffsetTop = target_element.offsetTop;
    document.querySelector('.menu_url.active').classList.remove('active');
    target_element.classList.add('active');
    if (windowWidth < 768) {
      indicator.style.transform = 'translate3d(0,'+targetOffsetTop+'px,0)';
      indicator.style.width = '0px';
    } else {
      indicator.style.width = targetWidth+'px';
      indicator.style.transform = 'translate3d('+targetOffset+'px,0,0)';
    }
    //console.log('detecting active... '+target_ele);
  }
}

function scrollCheck(type) {
  var scrTop = window.pageYOffset,
    wH = window.innerHeight,
    wW = window.innerWidth,
    partH = wH/3,
    homeTop = sectionHome.offsetTop - partH,
    aboutTop = sectionAbout.offsetTop - partH,
    featureTop = sectionFeature.offsetTop - partH,
    processTop = sectionProcess.offsetTop - partH,
    testimonialTop = sectionTestimonial.offsetTop - partH,
    contactTop = sectionContact.offsetTop - partH,
    topEdge = wH,
    heroEdge = wH/5*3;

  var maxheight = Math.max( theBody.scrollHeight, theBody.offsetHeight, theHTML.clientHeight, theHTML.scrollHeight, theHTML.offsetHeight ) - wH - 50;

  if (wW < 768) {
    topEdge = wH-120;
    heroEdge = wH/2;
  }

  if (scrTop >= topEdge) {
    if (!bodyClass.contains('overtop')) bodyClass.add('overtop');
  } else {
    if (bodyClass.contains('overtop')) bodyClass.remove('overtop');
  }

  if (scrTop >= heroEdge) {
    if (!bodyClass.contains('overhero')) {
      bodyClass.add('overhero');
      if (!pastnoon) {
        setTimeout(function() {
          pastnoon = true;
          bodyClass.add('overabout');
        },1200);
      }
    }
  } else {
    //bodyClass.remove('overhero');
  }

  if (scrTop >= (sectionFeature.offsetTop - wH/5)) {
    if (!bodyClass.contains('overfeature')) {
      bodyClass.add('overfeature');
    }
  } else {
    //bodyClass.remove('overfeature');
  }

  if (scrTop >= (sectionProcess.offsetTop - wH/2)) {
    if (!bodyClass.contains('overprocess')) bodyClass.add('overprocess');
  } else {
    //bodyClass.remove('overprocess');
  }

  if (scrTop >= homeTop && scrTop < aboutTop && scrTop < featureTop && scrTop < processTop && scrTop < testimonialTop && scrTop < contactTop) {
    newActive(wW,'menu_hero');
  }
  if (scrTop > homeTop && scrTop >= aboutTop && scrTop < featureTop && scrTop < processTop && scrTop < testimonialTop && scrTop < contactTop) {
    newActive(wW,'menu_about');
  }
  if (scrTop > homeTop && scrTop > aboutTop && scrTop >= featureTop && scrTop < processTop && scrTop < testimonialTop && scrTop < contactTop) {
    newActive(wW,'menu_feature');
  }
  if (scrTop > homeTop && scrTop > aboutTop && scrTop > featureTop && scrTop >= processTop && scrTop < testimonialTop && scrTop < contactTop) {
    newActive(wW,'menu_process');
  }
  if (scrTop > homeTop && scrTop > aboutTop && scrTop > featureTop && scrTop > processTop && scrTop >= testimonialTop && scrTop < contactTop && scrTop < maxheight) {
    newActive(wW,'menu_testimonial');
  }
  if (scrTop > homeTop && scrTop > aboutTop && scrTop > featureTop && scrTop > processTop && scrTop > testimonialTop && ( scrTop >= contactTop || scrTop >= maxheight)) {
    newActive(wW,'menu_footer');
  }

}

scrollCheck('onload');

function onScrollCheck() {
  console.log('onscrolling!');
}

/*document.addEventListener('wheel', function(e) {
  scrollCheck('onscroll');
});*/

var all_process = document.getElementsByClassName('process_single'),
  all_faces = document.getElementsByClassName('face'),
  allFaces = document.querySelector('.face'),
  allTooltip = document.getElementsByClassName('feature_tooltip');

var activeTooltip = false,
  activeFaces = false,
  myrAF, facerAF;

function tooltipSer(e) {
  myrAF = requestAnimationFrame(tooltipSer);

  if (activeTooltip) {
    var pointerX = e.clientX,
      pointerY = e.clientY;

    for (n=0;n<allTooltip.length;n++) {
      allTooltip[n].style.transform = 'translate3d('+pointerX+'px,'+pointerY+'px,0px)';
    }
  } else {
    cancelAnimationFrame(myrAF);
  }
  //console.log('animating!');
}

function movingFaces(e) {
  facerAF = requestAnimationFrame(movingFaces);

  if (activeFaces) {
    var halfW = window.innerWidth / 2,
      halfH = window.innerHeight / 2,
      mouseX = (e.clientX - halfW) / halfW * 2,
      mouseY = (e.clientY - halfH) / halfH * 3;
    for (i=0;i<all_faces.length;i++) {
      all_faces[i].style.transform = 'translate3d('+mouseX+'%,'+mouseY+'%,0)';
    }
  } else {
    cancelAnimationFrame(facerAF);
  }
}

document.addEventListener('mousemove', function(e) {
  var touching_ele = e.target;

  var pointerX = e.clientX,
    pointerY = e.clientY;

  if (sectionFeature.contains(touching_ele)) {
    if (!activeTooltip) activeTooltip = true;
  } else {
    if (activeTooltip) activeTooltip = false;
  }

  if (sectionHome.contains(touching_ele) || sectionAbout.contains(touching_ele) || sectionFeature.contains(touching_ele)) {
    if (!activeFaces) activeFaces = true;
  } else {
    if (activeFaces) activeFaces = false;
  }

  (activeTooltip) ? tooltipSer(e) : cancelAnimationFrame(myrAF);

  (pastnoon && activeFaces) ? movingFaces(e) : cancelAnimationFrame(facerAF);

  if (touching_ele.classList.contains('process_single')) {
    if (!touching_ele.classList.contains('active')) {
      var channelId = touching_ele.getAttribute('channel');

      document.querySelector('.process_single.active').classList.remove('active');
      document.querySelector('.channel.active').classList.remove('active');
      touching_ele.classList.add('active');
      document.getElementById(channelId).classList.add('active');
    }
  }

});

function theSlide(the_direction) {
  var active_testi = document.querySelector('.testimonial_single.active'),
    prev_testi = active_testi.previousElementSibling,
    next_testi = active_testi.nextElementSibling;

  if (the_direction == true) {
    if (next_testi) {
      active_testi.classList.remove('active');
      active_testi.classList.add('out');
      next_testi.classList.add('active');
    }
  } else {
    if (prev_testi) {
      active_testi.classList.remove('active');
      prev_testi.classList.remove('out');
      prev_testi.classList.add('active');
    }
  }
}

document.getElementById('prev_testi').addEventListener('click', function(e) {
  theSlide(false);
});

document.getElementById('next_testi').addEventListener('click', function(e) {
  theSlide(true);
});

document.getElementById('menu_toggler').addEventListener('click', function(e) {
  if (theBody.classList.contains('active_menu')) {
    theBody.classList.remove('active_menu');
  } else {
    theBody.classList.add('active_menu');
  }
});

document.getElementById('menu_closer').addEventListener('click', function(e) {
  if (theBody.classList.contains('active_menu')) {
    theBody.classList.remove('active_menu');
  }
});

var about_ovals = document.getElementsByClassName('single_oval');

var max = 4,
  min = 2,
  maxp = 9;

for (i=0;i<about_ovals.length;i++) {
  var randnumb = Math.floor(Math.random()*(max-min+1)+min),
    randpnumb = Math.floor(Math.random()*(maxp-min+1)+min);

  about_ovals[i].style = 'animation-duration: ' + randnumb + '.' + randpnumb + 's';
}

var touching = false;
var xDown = null;

document.addEventListener('touchstart', function(event) {
  var touching_ele = event.target;
  if (!touching) {

    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
    touching = true;

  }
  if (touching_ele.classList.contains('process_single')) {
    if (!touching_ele.classList.contains('active')) {
      var channelId = touching_ele.getAttribute('channel');

      document.querySelector('.process_single.active').classList.remove('active');
      document.querySelector('.channel.active').classList.remove('active');
      touching_ele.classList.add('active');
      document.getElementById(channelId).classList.add('active');
    }
  }
}, {passive: false});

document.addEventListener('touchmove', function(event) {
  if (touching) {

    //scrollCheck('onscroll');

    if ( ! xDown ) return;
    var xUp = event.touches[0].clientX;
    var yUp = event.touches[0].clientY;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) {
            /* left swipe */
            theSlide(true);
        } else {
            /* right swipe */
            theSlide(false);
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;

    touching = false;

  }
}, {passive: false});

$(document).ready(function() {
  $('[scrollto]').click(function(event) {
    event.preventDefault();
    var sTarget = $(this).attr('scrollto'),
      sObject = $(sTarget).offset().top,
      startInterval,
      intervalCount = 0;
    /*document.querySelector(sTarget).scrollIntoView({
      behavior: 'smooth'
    });*/
    $('html,body').animate({
      scrollTop: sObject
    },500);

    $('body').removeClass('active_menu');

    clearInterval(startInterval);

    startInterval = setInterval(function() {
      (intervalCount < 10) ? scrollCheck('onscroll') : clearInterval(startInterval);
      intervalCount++;
    },50);

    return false;
  });
});
