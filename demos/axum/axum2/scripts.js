//setSmoothScrollbarEnabled(true);

var date  = new Date();
var cDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);

var c_date   = cDate.getDate(),
  c_month  = cDate.getMonth(),
  c_year   = cDate.getFullYear(),
  c_hours  = cDate.getHours(),
  c_mins   = cDate.getMinutes();

var h=60,
  d=1440,
  m=43200,
  y=518400,
  cy=y*c_year,
  cm=m*c_month,
  cd=d*c_date,
  cmn= (c_hours*h) + c_mins,

  ct=cy+cm+cd+cmn,
  st=ct-1045838010, // 1045838010 is the Base time (by minutes)

  cn=3496, // Base value
  mtp=4, // Increase value
  dl=20, // Increase interval (minutes)
  mtpr=mtp/dl,

  //nn=cn+Math.round(st*mtpr),
  nn=24995,
  nb=0,
  sf=true;

//var $body = document.body;

$(document).ready(function() {
  var theBody = $('body');
  $(window).scroll(function() {
    var $window = $(window),
      halfHeight = $window.height()*0.6,
      scrTop = $window.scrollTop(),
      ctOffset = $('#section-tribe').offset().top;

    if (scrTop > (ctOffset-halfHeight) && sf == true) {
      sf = false;
      var the_raiser = setInterval(function() {
        if (nb < nn) {
          nb=nb+(Math.round(nn/100));
          document.getElementById('tribe-number').innerHTML=nb;
        } else {
          clearInterval(the_raiser);
          document.getElementById('tribe-number').innerHTML=nn;
        }
      },25);
    }

    if (scrTop > halfHeight) {
      theBody.addClass('scrolled');
    } else {
      theBody.removeClass('scrolled');
    }
  });
  $(document).on('click', '[direction]', function() {
    var target = $(this).attr('direction');
    $('body').scrollTo(target,600);
    return false;
  });
  /*$(document).on('click','.feature_title',function() {
    $('.feature_title').not(this).removeClass('active').next('.feature_content').slideUp('fast');
    if ($(this).hasClass('active')) {
      $(this).removeClass('active').next('.feature_content').slideUp('fast');
    } else {
      $(this).addClass('active').next('.feature_content').slideDown('fast');
    }
    return false;
  });*/
  var og_url = $('#youtube_object').data('src');
  $(document).on('click', '.show_video', function() {
    $('#body').addClass('showing_video');
    $('#youtube_object').attr('src',og_url);
    return false;
  });
  $(document).on('click', '#youtube_object_close', function() {
    $('#body').removeClass('showing_video');
    $('#youtube_object').removeAttr('src');
    return false;
  });
});
