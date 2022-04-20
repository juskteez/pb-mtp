// GSAP
// TweenLite.to('.page-transition', 1.2, { y: -1000 }, 0)

setTimeout(function() {
    TweenLite.from('.navigators', 1, { y: 50, autoAlpha: 0 }, 0)
    TweenLite.from('.sub-logo', 0.5, { y: 50, autoAlpha: 0 }, 0)
},300);

setTimeout(function() {
  titleSplitter('.about-section-title-1')
},100);

setTimeout(function() {
    TweenLite.from('.sub-title', 1, { y: 50, autoAlpha: 0 }, 0)
},900);

setTimeout(function() {
    TweenLite.from('.mouse-wrapper', 1, { y: 50, autoAlpha: 0 }, 0)
},1200);

setTimeout(function() {
    TweenLite.from('.wave-box', 1, { y: 50, autoAlpha: 0 }, 0)
},1500);

const scrollDown = $('.mouse-wrapper')
const ourValue = $('.our-value__wrapper')

if (ourValue.length > 0) {
  const ourValueOffset = ourValue ? ourValue.offset().top : 0
  if (scrollDown) {
    scrollDown.click(function (e) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: ourValueOffset - 10
      }, 300);
    });
  }
}

const ctrl = new ScrollMagic.Controller({
    globalSceneOptions: {
        triggerHook: 'onLeave'
    }
})

const valueItemList = $('.our-value__item')
const waveBox = $('.wave-box')
if (waveBox.length > 0) {
  const waveBoxOffset = waveBox.offset().top
  function scrollMagicValueItem(valueItemList, valueItemOffset) {
    $(valueItemList).each(function(index) {
      const offset1 = valueItemOffset * 0.2
      const itemOffset = offset1 + (index * 70)
      new ScrollMagic.Scene({
        offset: itemOffset
      })
        .setTween(
          TweenLite.from(this, 1, { y: 50, autoAlpha: 0 }, 0)
        )
        .addTo(ctrl)
    })
  }

  scrollMagicValueItem(valueItemList, waveBoxOffset)

  let waveBoxWidth = 0;
  let waveOffset = 0;
  if ($(window).innerWidth() < 767) {
    waveBoxWidth = 100;
    waveOffset = waveBoxOffset
  } else {
    waveBoxWidth = 420/1320*100;
    waveOffset = waveBoxOffset * 1.5
  }
  const viewWidth = $(ourValue).innerWidth()
  const waveBoxHeight = viewWidth*waveBoxWidth/100

  function smallWave(waveOffset) {
    new ScrollMagic.Scene({
      offset: waveOffset
    })
      .setTween(
        TweenLite.to('.wave-box', 0.8, {width: waveBoxWidth + '%', height: waveBoxHeight, x: 10, y: 80, top: 0, left: 0, ease:Sine.easeOut})
      )
      .addTo(ctrl)
  }
  smallWave(waveOffset)

  function leftCol(waveOffset) {
    new ScrollMagic.Scene({
      offset: waveOffset
    })
      .setTween(
        TweenLite.to('.our-value .left-col', 0.8, {height: waveBoxHeight, ease:Sine.easeOut})
      )
      .addTo(ctrl)
  }
  leftCol(waveOffset)

  function switchToFlexRow(waveBoxOffset) {
    new ScrollMagic.Scene({
      offset: waveBoxOffset * 0.5
    })
      .setTween(
        TweenLite.to('.our-value__wrapper', 0.5, {paddingTop:120, ease:Sine.easeOut})
      )
      .addTo(ctrl)
  }
  switchToFlexRow(waveBoxOffset)
}

// create a scene

function animateTitle1 () {
  new ScrollMagic.Scene({
    offset: ($('.our-value__title').offset().top) * 0.2
  })
    .on('start', function () {
      titleSplitter('.our-value__title')
    })
    .addTo(ctrl);
}
if ($('.our-value__title').length > 0) {
  animateTitle1()
}

function animateTitle2 () {
  new ScrollMagic.Scene({
    offset: ($('.about-post__sub-title-1').offset().top) * 0.5
  })
    .on('start', function () {
      titleSplitter('.about-post__sub-title-1')
    })
    .addTo(ctrl);
}
if ($('.about-post__sub-title-1').length > 0) {
  animateTitle2()
}

function animateTitle3 () {
  new ScrollMagic.Scene({
    offset: ($('.about-post__title-1').offset().top) * 0.5
  })
    .on('start', function () {
      titleSplitter('.about-post__title-1')
    })
    .addTo(ctrl);
}
if ($('.about-post__title-1').length > 0) {
  animateTitle3()
}

function animateTitle4 () {
  new ScrollMagic.Scene({
    offset: ($('.about-post__sub-title-2').offset().top) * 0.6
  })
    .on('start', function () {
      titleSplitter('.about-post__sub-title-2')
    })
    .addTo(ctrl);
}
if ($('.about-post__sub-title-2').length > 0) {
  animateTitle4()
}

function animateTitle5 () {
  new ScrollMagic.Scene({
    offset: ($('.about-post__title-2').offset().top) * 0.6
  })
    .on('start', function () {
      titleSplitter('.about-post__title-2')
    })
    .addTo(ctrl);
}
if ($('.about-post__title-2').length > 0) {
  animateTitle5()
}

function animateTitle6 () {
  new ScrollMagic.Scene({
    offset: ($('.two-up__sub-title').offset().top) * 0.75
  })
    .on('start', function () {
      titleSplitter('.two-up__sub-title')
    })
    .addTo(ctrl);
}
if ($('.two-up__sub-title').length > 0) {
  animateTitle6()
}

function animateTitle7 () {
  new ScrollMagic.Scene({
    offset: ($('.two-up__title').offset().top) * 0.75
  })
    .on('start', function () {
      titleSplitter('.two-up__title')
    })
    .addTo(ctrl);
}
if ($('.two-up__title').length > 0) {
  animateTitle7()
}

function animateTitle8 () {
  new ScrollMagic.Scene({
    offset: ($('.about-bottom-section__title').offset().top) * 0.75
  })
    .on('start', function () {
      titleSplitter('.about-bottom-section__title')
    })
    .addTo(ctrl);
}
if ($('.about-bottom-section__title').length > 0) {
  animateTitle8()
}

function animateTitle9 () {
  new ScrollMagic.Scene({
    offset: ($('.about-bottom-section__sub-title').offset().top) * 0.75
  })
    .on('start', function () {
      titleSplitter('.about-bottom-section__sub-title')
    })
    .addTo(ctrl);
}
if ($('.about-bottom-section__sub-title').length > 0) {
  animateTitle9()
}

if ($('.product-section-1__title').length > 0) {
  titleSplitter('.product-section-1__title')
}

function animateTitle10 () {
  new ScrollMagic.Scene({
    offset: ($('.product-section-2__title').offset().top) * 0.5
  })
    .on('start', function () {
      titleSplitter('.product-section-2__title')
    })
    .addTo(ctrl);
}
if ($('.product-section-2__title').length > 0) {
  animateTitle10()
}

function animateTitle11 () {
  new ScrollMagic.Scene({
    offset: ($('.product-section-3__title').offset().top) * 0.5
  })
    .on('start', function () {
      titleSplitter('.product-section-3__title')
    })
    .addTo(ctrl);
}
if ($('.product-section-3__title').length > 0) {
  animateTitle11()
}

function animateTitle12 () {
  new ScrollMagic.Scene({
    offset: ($('.product-section-4__title').offset().top) * 0.75
  })
    .on('start', function () {
      titleSplitter('.product-section-4__title')
    })
    .addTo(ctrl);
}
if ($('.product-section-4__title').length > 0) {
  animateTitle12()
}

function animateTitle13 () {
  new ScrollMagic.Scene({
    offset: ($('.team-list__title').offset().top) * 0.75
  })
    .on('start', function () {
      titleSplitter('.team-list__title')
    })
    .addTo(ctrl);
}
if ($('.team-list__title').length > 0) {
  animateTitle13()
}

let lastScrollTop = 0
let animated = false
$(window).on('scroll', function() {
  if (ourValue.length > 0) {
    const ourValueOffset = ourValue ? ourValue.offset().top : 0
    const docViewTop = $(this).scrollTop()
    if(docViewTop > lastScrollTop && docViewTop > 50 && docViewTop < ourValueOffset && !animated) {
      $('html, body').animate({
        scrollTop: ourValueOffset
      }, 300)
      animated = true
    }
    if (docViewTop < lastScrollTop) {
      animated = false
    }
    lastScrollTop = docViewTop
  }
});
