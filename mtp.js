let main_content = document.querySelector('.default-layout')
let drop_navs = document.querySelectorAll('.site-nav--has-dropdown')
let header    = document.querySelector('.header-section')

let defer_drops

for (let i = 0; i < drop_navs.length; i++) {
  drop_navs[i].addEventListener('mouseenter', () => {
    clearTimeout(defer_drops)
    if (!header.classList.contains('show_mega')) {
      header.classList.add('show_mega')
    }
  })
  drop_navs[i].addEventListener('mouseleave', () => {
    defer_drops = setTimeout(() => {
      if (header.classList.contains('show_mega')) {
        header.classList.remove('show_mega')
      }
    }, 100);
  })
}

const init_slides = () => {
  let vue_slides = document.querySelectorAll('.section[data-id="homepage_slideshow"] .VueCarousel-slide .slideshow-section__background img')
  let first_slide = document.querySelector('.section[data-id="homepage_slideshow"] .VueCarousel-inner .VueCarousel-slide:first-child')
  if (!first_slide.classList.contains('VueCarousel-slide-active')) {
    first_slide.classList.add('VueCarousel-slide-active')
  }

  for (let i = 0; i < vue_slides.length; i++) {
    let the_image = vue_slides[i]
    let image_wrap = the_image.parentElement
    let defer_slides

    defer_slides = setInterval(() => {
      if (the_image.getAttribute('lazy') == 'loaded') {
        let new_image_1 = the_image.cloneNode(true)
        let new_image_2 = the_image.cloneNode(true)

        let new_wrap_0  = document.createElement('DIV')
        let new_wrap_1  = document.createElement('DIV')
        let new_wrap_2  = document.createElement('DIV')

        new_wrap_0.classList.add('sub_wrap-1')
        new_wrap_1.classList.add('sub_wrap-2')
        new_wrap_2.classList.add('sub_wrap-3')

        new_wrap_0.appendChild(the_image)
        new_wrap_1.appendChild(new_image_1)
        new_wrap_2.appendChild(new_image_2)

        image_wrap.appendChild(new_wrap_0)
        image_wrap.appendChild(new_wrap_1)
        image_wrap.appendChild(new_wrap_2)

        console.log('lazy_loaded')
        clearInterval(defer_slides)
      }
    }, 100);
  }
}

const main_content_observer = (mutations) => {
  console.log('Main content changed')
  let home_slider = document.querySelector('.section[data-id="homepage_slideshow"]')
  if (home_slider) {
    if (!main_content.classList.contains('mutated')) {
      main_content.classList.add('mutated')
      init_slides()
    }
  }
  let sticky_bar = document.getElementById('sticky-bar')
  if (sticky_bar) {
    if (!main_content.classList.contains('stickies')) main_content.classList.add('stickies')
  } else {
    if (main_content.classList.contains('stickies')) main_content.classList.remove('stickies')
  }
}

if (main_content) {

  let main_observer = new MutationObserver(main_content_observer)
  let options = {
    childList: true,
    subtree: true
  }

  main_observer.observe(main_content, options)
  // console.log('Observing main content')
}