function customerForm() {
    var control = $('.cyber-form .form-control');
    var formGroup = $('.cyber-form .form-group');

    control.each(function () {
        if ($(this).val() !== '') {
            $(this).closest('.form-group').addClass('form-group-active');
        }
    })
    control.focus(function (e) {
        e.preventDefault();
        $(this).closest('.form-group').addClass('form-group-active focusing');
    })
    control.blur(function (e) {
        e.preventDefault();
        var parent = $(this).closest('.form-group');
        parent.removeClass('focusing');
        if (parent.hasClass('form-group-active') && $(this).val() === '') {
            parent.removeClass('form-group-active');
        }
    })

    // Flip form
    $('.open-form').click(function (e) {
        e.preventDefault();
        var form = $(this).attr('href')
        $('.cyber-form').removeClass('form-active');
        $(form).addClass('form-active');
    })
}
// Animate scroll
function animateScroll() {
    $('.scrollspy a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
            &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 70
                }, 500, function () {
                    // Callback after scroll
                });
            }
        }
        //
        $('.scrollspy li').removeClass('nav-active');
        $(this).parent('li').addClass('nav-active');
    });
}

// Init functions
customerForm();
animateScroll();