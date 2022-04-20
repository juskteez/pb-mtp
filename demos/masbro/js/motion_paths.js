$(document).ready(function() {
  function motion_path(start_axis,start_point,motion_range,motion_value,scroll_point,motion_id) {
    var path_split = motion_value.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } ),
        path_value = '',
        calcTop    = scroll_point - start_point,
        recalcTop  = 0,
        scrPerc    = 0;

    if (calcTop < 0) {
      recalcTop = 0;
    } else {
      if (calcTop >= motion_range) {
        recalcTop = motion_range;
      } else {
        recalcTop = calcTop;
      }
    }

    scrPerc  = recalcTop/motion_range*100;

    $.each( path_split, function( index, value ) {
      var axis_val   = path_split[index].split(",")[1],
          axis_point = path_split[index].split(",")[0],
          space      = axis_val-start_axis,
          pcp        = space*(scrPerc/100),
          rPcp       = pcp,
          rSpace     = space;

      if (axis_val == -0.0001 || axis_val == undefined) {
        if (axis_val == undefined) {
          path_value += ' '+ axis_point;
        } else {
          path_value += ' '+ axis_point+','+axis_val;
        }
      } else {
        path_value += ' '+ axis_point+','+(start_axis+pcp);
      }
    });

    return path_value;

  }

  $(window).scroll(function() {
    var scrTop       = $(window).scrollTop(),
        start_point  = $('#motion_paths').offset().top - $(window).height() / 1.5,
        scrStart     = start_point,
        scrComp      = 600,
        startP       = 44,
        calTop       = scrTop - scrStart,
        recalTop     = 0,
        single_dot   = $('.motion_dots .motion_single_dot'),
        motion_paths = $('svg.motion_path', '#motion_paths');

    //$('svg.motion_path').each(function() {
    for (i=0;i<motion_paths.length;i++) {
      var $this        = motion_paths.eq(i),
          $motion_path = $this.children('.the_clip_motion'),
          path_d       = $motion_path.data('target-d'),
          motion_base  = Number($this.data('motion-baseline')),
          motion_id    = $this.prop('id');
      $motion_path.attr('d',motion_path(motion_base,start_point,600,path_d,scrTop,motion_id));
    }

    if (calTop < 0) {
      recalTop = 0;
    } else {
      if (calTop >= scrComp) {
        recalTop = scrComp;
      } else {
        recalTop = scrTop - scrStart;
      }
    }

    var scrPerc  = Math.round(recalTop/scrComp*100);

    //$('.motion_dots .motion_single_dot').each(function() {
    for (i=0;i<single_dot.length;i++) {
      var $this       = single_dot.eq(i),
          og_point    = $this.data('o-cy'),
          motion_base = $this.parent().data('motion-base'),
          space       = og_point-startP,
          pcp         = space*(scrPerc/100),
          rPcp        = pcp,
          rSpace      = space;

      $this.attr('cy',startP+pcp);
    }

  });
});
