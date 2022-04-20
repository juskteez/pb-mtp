(function($) {
  $(document).ready(function() {
    var $body = $('body'),
      faq_trigger = $('.faq-item_trigger'),
      video_trigger = $('a[data-youtube]'),
      videoCloser = $('.video_frame_close'),
      videoFrame = $('.video_frame_content');

    faq_trigger.click(function() {
      var thisTrigger = $(this);
      faq_trigger.not(thisTrigger).removeClass('active');
      thisTrigger.addClass('active');
      return false;
    });

    video_trigger.click(function() {
      var thisTrigger = $(this),
        videoURL = thisTrigger.data('youtube');

      if (videoURL != undefined && videoURL != '') {
        $body.addClass('showing_video');
        videoFrame.html('<iframe class="youtube_object" type="text/html" width="100%" height="100%" src="//www.youtube.com/embed/'+videoURL+'?&amp;wmode=transparent&amp;rel=0&amp;showinfo=0&amp;autoplay=1" allowfullscreen="" frameborder="0"></iframe>');
      }
      return false;
    });

    videoCloser.click(function() {
      videoFrame.empty();
      $body.removeClass('showing_video');
      return false;
    });

    var nb = 0,
      counter = $('#stats_number'),
      targetNumber = counter.data('number');

    $(window).scroll(function() {
      var scrTop = $(window).scrollTop(),
        wdHeight = $(window).height();

      if ((counter.offset().top - scrTop) < (wdHeight/4*3)) {
        var nCounter = setInterval(function() {
          if (nb < targetNumber) {
            nb=nb+333;
            counter.html(String(nb/1000).replace('.',','));
          } else {
            clearInterval(nCounter);
            counter.html(String(targetNumber/1000).replace('.',','));
          }
        },100);
      }
    });

    $('.order_prop_list a').click(function() {
      var $this = $(this),
        pd_id = '',
        img_id = $this.attr('data-img'),
        img_c = $('.order_prop_color a.active').attr('data-imgc'),
        thePhone = $this.text();
      ($this.hasClass('dwhite')) ? pd_id = $this.data('white') : pd_id = $this.data('black');
      $('.order_prop_list a').not(this).removeClass('active');
      $(this).addClass('active');
      $('.add_to_cart').attr('data-celery',pd_id);
      $('.order_x').not('.order_img_'+img_id).removeClass('active');
      $('.order_img_'+img_id).addClass('active');
      $('.order_img_'+img_id+img_c).addClass('active');

      (thePhone == 'iPhone X') ? $('.order_prop_color').addClass('iphonex') : $('.order_prop_color').removeClass('iphonex');

      return false;
    });

    $('.order_prop_color a').click(function() {
      var $this = $(this),
        pd_id = '',
        cr_pd = $('.order_prop_list a.active'),
        img_id = cr_pd.attr('data-img'),
        img_c = $this.attr('data-imgc');
      if ($this.hasClass('white')) {
        $('.dblack').removeClass('dblack').addClass('dwhite');
        pd_id = cr_pd.data('white');
      } else {
        $('.dwhite').removeClass('dwhite').addClass('dblack');
        pd_id = cr_pd.data('black');
      }
      $('.order_prop_color a').not(this).removeClass('active');
      $(this).addClass('active');
      $('.add_to_cart').attr('data-celery',pd_id);
      $('.order_x').not('.order_img_'+img_id+img_c).removeClass('active');
      $('.order_img_'+img_id+img_c).addClass('active');
      return false;
    });

    $('[scrollto]').click(function(event) {
      event.preventDefault();
      var sTarget = $(this).attr('scrollto'),
        sObject = $(sTarget).offset().top;
      /*document.querySelector(sTarget).scrollIntoView({
        behavior: 'smooth'
      });*/
      $('html,body').animate({
        scrollTop: sObject
      },500);
      return false;
    });

    $('.close_ribbon').click(function() {
      $('.topaz_ribbon').slideUp('fast');
      return false;
    });

  });
})(jQuery);
