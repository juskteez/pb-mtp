var the_body = document.body,
	parallax_object = document.getElementsByClassName('prl_obj');
	svg_img = document.getElementsByClassName('svg-ico');

for (i=0;i<svg_img.length;i++) {
	console.log('Icon number '+i);
	var $img   = svg_img[i],
		xmlHttp = [];

	(function (i) {
		var imgURL = svg_img[i].getAttribute('src');
		xmlHttp[i] = new XMLHttpRequest();
		xmlHttp[i].onreadystatechange = function() {
			if (xmlHttp[i].readyState == 4 && xmlHttp[i].status == 200) {

				console.log('Replacing icon');

				var svg_item = document.createElement('span');
				svg_item.innerHTML = xmlHttp[i].responseText;
				svg_item.children[0].removeAttribute('xmlns:a');
				svg_item.children[0].classList.add('svg-icon');
				//console.log(xmlHttp);
				svg_img[i].replaceWith(svg_item.children[0]);

			}
		}
		xmlHttp[i].open("GET", imgURL, true);
		xmlHttp[i].send();
	})(i);

	/*$.get(imgURL, function(data) {
		var $svg = $(data).find('svg');

		$svg = $svg.removeAttr('xmlns:a').addClass('svg-icon');
		if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
			$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
		}

		$img.replaceWith($svg);

	}, 'xml');*/

};



document.addEventListener("scroll", function() {
	var scrTop = the_body.scrollTop,
		wd_height = window.outerHeight;
	for (i=0;i<parallax_object.length;i++) {
		requestAnimationFrame(function() {prlxObject(scrTop,wd_height);});
	}
});

function prlxObject(scrTop,wd_height) {

	for (i=0;i<parallax_object.length;i++) {
		var $this = parallax_object[i];
		prlxObjectx($this,scrTop,wd_height);
	}

}

function prlxObjectx(the_object,scrTop,wd_height) {
	var $this          = the_object,
		move_direction = Number($this.getAttribute('data-move-direction')),
		move_ratio     = Number($this.getAttribute('data-move-ratio')),
		move_start     = Number($this.getAttribute('data-move-start')),
		move_sRatio    = $this.getAttribute('move-start-ratio'),
		scrollTop      = scrTop - move_start,
		xAxis          = 0,
		thisTop        = $this.offsetTop,
		scrollObj      = scrTop - (thisTop - wd_height * 0.9 ),
		obj_Pos, transform_val;

	if (move_sRatio != undefined && move_sRatio != '') {
		scrollObj      = scrTop - (thisTop - wd_height * Number(move_sRatio));
		$this.classList.add('triggered');
	}

	if ($this.classList.contains('centered_obj')) {
		xAxis = '-50%';
	} else {
		xAxis = '0';
	}

	if ($this.classList.contains('by_obj')) {
		scrollTop = scrollObj;
	} else {
		scrollTop = scrTop - move_start;
	}

	//$(this).attr('data-scroll',scrollTop).attr('scrollObj',scrollObj);

	if (scrollTop >= 0) {
		obj_Pos = scrollTop/move_ratio*move_direction,
		transform_val = 'translate3d('+xAxis+','+obj_Pos+'px,0)';
		$this.style['-webkit-transform'] = transform_val;
		$this.style['transform'] = transform_val;
	}
}

$(document).ready(function() {
	var svg_img = $('img.svg-ico'),
		$body   = $('body');

	/*$('img.svg-ico').each(function(){
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

	});*/
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
			requestAnimationFrame(function() {prlxObject(parallax_object.eq(x),scrTop,wd_height);});
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
