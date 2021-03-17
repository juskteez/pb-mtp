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

let vue_slides = document.querySelectorAll('.VueCarousel-slide .slideshow-section__background img')

const init_slides = () => {
  let init_slides = document.querySelectorAll('.VueCarousel-slide .slideshow-section__background img')
  for (let i = 0; i < vue_slides.length; i++) {
    let the_image = vue_slides[i]
    let image_wrap = the_image.parentElement

    let new_image_1 = the_image.cloneNode(true)
    let new_image_2 = the_image.cloneNode(true)

    new_image_1.classList.add('sub_1')
    new_image_2.classList.add('sub_2')

    image_wrap.appendChild(new_image_1)
    image_wrap.appendChild(new_image_2)
    console.log(new_image_1)
  }
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