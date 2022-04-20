$(document).ready(function() {
	var svg_img = $('img.svg-ico'),
		$body   = $('body');

	$('img.svg-ico').each(function(){
		var $img = $(this);
		var imgURL = $img.attr('src');

		$.get(imgURL, function(data) {
			var $svg = $(data).find('svg');

			$svg = $svg.removeAttr('xmlns:a').addClass('svg-icon');
			if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
				$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
			}

			$img.replaceWith($svg);

		}, 'xml');

	});
	$(window).scroll(function() {
		var scrTop          = $(window).scrollTop(),
			$e_phone        = $('#engage-phone', '#home-engagements'),
			wd_height       = $(window).height(),
			body_height     = $body.outerHeight(),
			body_endpoint   = body_height-wd_height-$('#main_footer').outerHeight(),
			graph           = $('#credit-graph-chart', '#home-credit'),
			parallax_object = $('.prl_obj'),
			anchor_section  = $('.anchor-section', '#main_content');

		$('body').attr('scroll-point',scrTop).attr('end-point',body_endpoint);

		//$('.anchor-section').each(function() {
		for (i=0;i<anchor_section.length;i++) {
			var $this        = anchor_section.eq(i),
				anchor_point = $this.offset().top - 120,
				anchor_range = (anchor_point + 100),
				section_id   = $this.attr('id');

			$this.attr('anchor-point',anchor_point);
			if (scrTop >= body_endpoint) {
				$('#nav_menu_list a.section_active:not([direction="#contact-us"])').addClass('passed');
				$('#nav_menu_list a[direction="#contact-us"]').addClass('section_active').removeClass('passed');
			} else {
				$('#nav_menu_list a[direction="#contact-us"]').removeClass('section_active passed');
				if (scrTop >= anchor_point) {
					$('#nav_menu_list a.section_active').not($('.section_active').last()).addClass('passed');
					$('#nav_menu_list a[href="#'+section_id+'"]').addClass('section_active').removeClass('passed');
				} else {
					$('#nav_menu_list a[href="#'+section_id+'"]').removeClass('section_active passed');
				}
			}
		}

		//$('.prl_obj').each(function() {
		for (x=0;x<parallax_object.length;x++) {
			var $this          = parallax_object.eq(x),
				move_direction = Number($this.data('move-direction')),
				move_ratio     = Number($this.data('move-ratio')),
				move_start     = Number($this.data('move-start')),
				move_sRatio    = $this.data('move-start-ratio'),
				scrollTop      = scrTop - move_start,
				xAxis          = 0,
				thisTop        = $this.offset().top,
				scrollObj      = scrTop - (thisTop - wd_height * 0.9 ),
				obj_Pos, transform_val;

			if (move_sRatio != undefined && move_sRatio != '') {
				scrollObj      = scrTop - (thisTop - wd_height * Number(move_sRatio));
				$this.addClass('triggered');
			}

			if ($this.hasClass('centered_obj')) {
				xAxis = '-50%';
			} else {
				xAxis = '0';
			}

			if ($this.hasClass('by_obj')) {
				scrollTop = scrollObj;
			} else {
				scrollTop = scrTop - move_start;
			}

			//$(this).attr('data-scroll',scrollTop).attr('scrollObj',scrollObj);

			if (scrollTop >= 0) {
				obj_Pos = scrollTop/move_ratio*move_direction,
				transform_val = 'translate3d('+xAxis+','+obj_Pos+'px,0)';
				$this.css({
					'transform':transform_val,
					'-webkit-transform':transform_val
				});
			}
		}

		var credit_phone = $('#credit-hand-phone', '#home-credit');

		//$('#credit-hand-phone').each(function() {
		for (i=0;i<credit_phone.length;i++) {
			var $this         = credit_phone.eq(i),
				parent_offset = $this.parent().offset().top - 100,
				scrParent     = scrTop - parent_offset + 450,
				rotation      = -48 + ( scrParent / 6 ),
				phone_Pos, transform_val;

			if (scrParent <= 0) { scrParent = 0; }
			if (scrParent >= 300) { scrParent = 300;}

			if (rotation <= -48) {rotation = -48;}
			if (rotation >= 0) {rotation = 0;}

			if (scrParent > 280) {
				graph.addClass('active');
			} else {
				graph.removeClass('active');
			}

			phone_Pos = scrParent*-1,
			transform_val = 'translate3d(-50%,'+phone_Pos+'px,0) rotate('+rotation+'deg)';
			/*if (rotation > 0) { rotation = 0; scrParent = 300; }*/

			//$(this).attr('touch-range',(scrParent)).attr('rotate',rotation);
			$this.css({
				'transform':transform_val,
				'-webkit-transform':transform_val
			});
		}

		if ($e_phone.length > 0) {
			var phone_off_top = $e_phone.offset().top - wd_height / 2;

			if (scrTop > phone_off_top) {
				$e_phone.addClass('triggered');
			} else {
				$e_phone.removeClass('triggered');
			}
		}

		if (scrTop > 100) {
			$body.addClass('overtop');
		} else {
			$body.removeClass('overtop');
		}

		if (scrTop > (body_endpoint/2)) {
			$body.addClass('overbody');
		} else {
			$body.removeClass('overbody');
		}
	});
	$(document).on('touchstart mousedown', '.direct_down', function() {
		$(this).children('span').remove();
		$(this).append('<span/>');
	});

	$(document).on('click', '[direction]', function() {
		var target = $(this).attr('direction');
		$body.removeClass('toggle_nav').scrollTo(target,600);
		return false;
	});

	$(document).on('click', '.nav_toggler', function() {
		$body.toggleClass('toggle_nav');
		return false;
	});

	var the_orbit   = document.getElementById('masbro-orbit_1'), // 36.5
		the_orbit_2 = document.getElementById('masbro-orbit_2'); // 18.5

	the_orbit.addEventListener("timeupdate", function() {
		var vid_dur      = the_orbit.duration,
			restart_time = 18.5,
			end_time     = 39.8;
		//console.log(the_orbit.currentTime);
		if (the_orbit.currentTime >= end_time) {
			//the_orbit.currentTime=restart_time;
			the_orbit_2.play();
			the_orbit_2.className += ' active';
		}
	});

});
