let app = app || {};

((body => {
    "use strict";

    var loop = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback){ setTimeout(callback, 1000 / 60); };

    app.parallax = {
        items: [],
        params: {},

        calculate () {
            const _this = this;

            _this.params.window = $(document).width();
            _this.params.width = $(window).width();

            if ($('.parallax').length) {
                $('.parallax').each(function() {
                    const itemWidth = $(this).width();

                    $(this).css({
                        'width': `${itemWidth}px`
                    });

                    _this.items.push({
                        element: $(this),
                        width: itemWidth,
                        offset: $(this).offset().left,
                        position: $(this).position().left,
                        speed: $(this).data('parallax-speed')
                    });
                });
            }
        },

        animate (posX) {
            const _this = this;
            const width = this.params.width;
            const window = this.params.window;
            const modulo = posX % width;

            _this.items.forEach((item, index) => {
                const left = item.position;
                const size = left + item.width;

                if (posX >= (item.offset - size) && size >= modulo && size < width && modulo >= 0) {
                    const offset = ((modulo / 2) * item.speed);

                    TweenMax.to(item.element, .7, { css: { "transform" : `translate3d(${offset}px, 0px, 0px)` }});
                }
            });
        },

        scroller () {
            const _this = this;

            $('html, body').on('mousewheel', function(e, d) {
                this.scrollLeft -= (d * 2);
                e.preventDefault();

            });

            let timer;
            let timestamp = new Date().getTime();

            $(window).on('scroll', function(e, d) {
                const current = new Date().getTime();

                if ((current - timestamp) >= 150) {
                    clearTimeout(timer);

                    _this.animate($(window).scrollLeft());

                    timer = setTimeout(() => {
                        _this.animate($(window).scrollLeft());
                    }, 300);

                    timestamp = current;
                }
            });
        },

        getCurrent (width, scroll) {
            width = width - (width / 5);

            return (4 - Math.ceil(((width * 4) - scroll) / width));
        },

        changeCurrent (index) {
            $('.j-navigation-link').removeClass('navigation__link--current');
            $('.j-navigation').eq(index).find('.j-navigation-link').addClass('navigation__link--current');
        },

        setCurrent (index, width) {
            $('html, body').animate({
                scrollLeft: (index * width) + 'px'
            }, 'slow');

            this.changeCurrent(index);
        },

        navigation () {
            const _this = this;

            setTimeout(() => {
                _this.calculate();
            }, 1000);

            const width = this.params.width;
            const scroll = $(window).scrollLeft();

            _this.setCurrent(_this.getCurrent(width, scroll), width);

            let timer;

            $(window).on('scroll', function(e) {
                clearTimeout(timer);

                timer = setTimeout(function() {
                    _this.changeCurrent(_this.getCurrent(width, $(window).scrollLeft()));
                }, 20);
            });

            $(window).on('resize', function(e) {
                clearTimeout(timer);

                timer = setTimeout(function(){
                    _this.calculate();
                }, 200);
            });

            $('body').on('click', '.j-scrollto', function(e) {
                e.preventDefault();

                const href = $(this).attr('href');

                $('html, body').animate({
                    scrollTop: ($(`${href}`).offset().top) + 'px'
                }, 'fast');
            });

            $('body').on('click', '.j-navigation-link', function(e) {
                e.preventDefault();

                const index = $(this).closest('.j-navigation').index();

                _this.setCurrent(index, width);
            });
        },

        init() {
            this.navigation();
            this.scroller();
        }

    };

}))(document.body);
