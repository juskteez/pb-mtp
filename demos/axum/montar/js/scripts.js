(function($) {
  $(document).ready(function() {
    var faq_trigger = $('.faq-item_trigger'),
      video_trigger = $('a[data-youtube]'),
      videoCloser = $('#video_player_close'),
      videoWrap = $('#video_player_wrap'),
      videoFrame = $('#video_player_frame', '#video_player_wrap'),
      randStock = Math.round(Math.random() * (20 - 3) + 3);

    $('.offer_cta-note').each(function() {
      $(this).html('Hurry up, <b>only '+randStock+' left</b> in stock');
    });

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
        $('body').addClass('video_open');
        videoFrame.html('<iframe class="youtube_object" type="text/html" width="100%" height="100%" src="//www.youtube.com/embed/'+videoURL+'?&amp;wmode=transparent&amp;rel=0&amp;showinfo=0&amp;autoplay=1" allowfullscreen="" frameborder="0"></iframe>');
        videoWrap.addClass('active');
      }
      return false;
    });

    videoCloser.click(function() {
      videoWrap.removeClass('active');
      videoFrame.empty();
      $('body').removeClass('video_open');
      return false;
    });
    var targetNumber = 250742,
      nb = 0,
      counter = $('#orders-number.orders-number');
    $(window).scroll(function() {
      var scrTop = $(window).scrollTop(),
        wdHeight = $(window).height();

      if (scrTop > (wdHeight/2)) {
        $('body').addClass('scrolled');
      } else {
        $('body').removeClass('scrolled');
      }

      if ((counter.offset().top - scrTop) < (wdHeight/4*3)) {
        var nCounter = setInterval(function() {
          if (nb < targetNumber) {
            nb=nb+567;
            counter.html(String(nb/1000).replace('.',','));
          } else {
            clearInterval(nCounter);
            counter.html(String(targetNumber/1000).replace('.',','));
          }
        },100);
      }
    });

    var $form = $('form#mc-embedded-subscribe-form');

    if ( $form.length > 0 ) {
      $form.submit(function () {
        register($form);
        $form.addClass('subbing');
        return false;
      });
    }
    function register($form) {
      $.ajax({
        type:       $form.attr('method'),
        url:        $form.attr('action'),
        data:       $form.serialize(),
        cache       : false,
        dataType    : 'jsonp',
        jsonp       : 'c',
        contentType : 'application/json; charset=utf-8',
        error       : function(err) { alert('Could not connect to the registration server. Please try again later.'); },
        success     : function(data) {
          if (data.result != 'success') {
            // Something went wrong, do something to notify the user. maybe alert(data.msg);
            var message = data.msg || 'Sorry. Unable to subscribe. Please try again later.';
            if (data.msg && data.msg.indexOf('already subscribed') >= 0) {
              message = 'You are already subscribed. Thank you';
            }
            alert(message);
            setTimeout(function() {$form.removeClass('subbed subbing');},500);
          } else {
            // It worked, carry on...
            //alert('Subscribe Success!');
            $form.attr('data-alert','Thanks you! Please check your inbox for confirmation email.').addClass('subbed');
            //$('#mce-EMAIL').val('');
            setTimeout(function() {$form.removeClass('subbed subbing');},4000);
          }
        }
      });
    }

/*    var max = 45,
      min = 32,
      theMin = Math.floor(Math.random() * (max - min + 1)) + min,
      theSec = Math.floor(Math.random() * (max - min + 1)) + min,
      preSec = '',
      cta_price = $('.offer_cta-price');

    var cSec = setInterval(function() {
      theSec = theSec - 1;
      if (theMin < 0) theMin = max;
      if (theSec < 0) {
        theMin = theMin - 1;
        theSec = 59;
      }
      (theSec < 10) ? preSec = '0' : preSec = '';
      cta_price.attr('timr', theMin + 'm ' + preSec + theSec + 's left');
    },1000);*/
  });
})(jQuery);
