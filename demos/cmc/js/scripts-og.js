/*var theBody = document.body;

var popup_opener = document.querySelectorAll('a[popup]');

popup_opener.addEventListener(function() {

});*/


(function($) {
  $(document).ready(function() {
    var $body = $('body');

    $body.append('<a href="javascript:;" class="cmc_menu_overlay"></a>');

    $('.cmc_main_menu_trigger').click(function() {
      $body.toggleClass('cmc_active_menu');
      return false;
    });

    $(document).on('click','.cmc_menu_overlay', function() {
      $body.removeClass('cmc_active_menu');
      return false;
    });

    $(document).on('click','.cmc_main_menu_list li:not(.show_sub) a:not(:last-child):not(.close_sub)', function() {
      $(this).parent('li').addClass('show_sub');
      $(this).parent('li').prepend('<a href="javascript:;" class="close_sub"></a>');
      return false;
    });

    $(document).on('click','.cmc_main_menu_list li.show_sub a.close_sub', function() {
      $(this).parent('li').removeClass('show_sub');
      $(this).remove();
      return false;
    });

    $('.signup_lane a').click(function() {
      $('.signup_lane a').not(this).removeClass('active');
      $(this).addClass('active');
      return false;
    });
    $('.payment_bank').click(function() {
      $('.payment_bank').not(this).removeClass('active');
      $(this).addClass('active');
      return false;
    });
    $('.payment_title').click(function() {
      $('.payment_method.active').removeClass('active');
      $(this).parent('.payment_method').addClass('active');
      return false;
    });
    $('a[popup],button[popup]').click(function() {
      var the_popup = $(this).attr('popup');
      $(the_popup).addClass('active');
      return false;
    });
    $('.page_popup_closer,.page_overlayer').click(function() {
      $('.page_popup.active').removeClass('active');
      return false;
    });
    $(document).on('keyup', 'input.date', function(e) {
      var input_val = $(this).val(),
        key = e.keyCode;

      if (input_val.length == 2 && key != 8) $(this).val(input_val+'/');

      if (input_val.length == 2 && key == 8) $(this).val(input_val.substring(0, input_val.length - 1));
    });

    $(document).on('keydown', 'input.date', function(e) {
      var input_val = $(this).val(),
        key = e.keyCode;
      if (input_val.length == 2 && key != 8) $(this).val(input_val+'/');
      if (input_val.length > 4 && key != 8) return false;
      if ((key < 48 || key > 57) && key != 8) return false;
    });

    $('.faq_list_title').click(function() {
      $('.faq_list_title').not(this).parent().removeClass('active');
      $('.faq_list_title').not(this).next('.faq_list_content').slideUp('fast');
      $(this).parent().addClass('active');
      $(this).next('.faq_list_content').slideDown('fast');
      return false;
    });

    $('.domain_search_input').keyup(function(e) {
      var $this = $(this),
        input_val = $this.val(),
        checker = $this.attr('checker');

      if (!input_val.match(/^(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/gi) && input_val.length > 0) {
        $this.addClass('invalid');
        $this.parent().addClass('field_invalid');
        if (checker) $(checker).addClass('disabled');
      } else {
        $this.removeClass('invalid');
        $this.parent().removeClass('field_invalid');
        if (checker) $(checker).removeClass('disabled');
      }

    });
  });
})(jQuery);
