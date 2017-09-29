let app = app || {};

((body => {
    "use strict";

    const scroll = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback){ window.setTimeout(callback, 1000/60) };

    app.parallax = {
        items: [],
        params: {},
        scrollEvent: null,

        calculate (timeout, callback) {
            const _this = this;
            let timer;

            _this.params.width = $(window).width();
            _this.params.window = $(document).width();

            setTimeout(() => {
                if ($('.parallax').length) {
                    const count = $('.parallax').length - 1;

                    $('.parallax').each(function(index) {
                        const itemWidth = $(this).width();

                        $(this).css({ 'width': `${itemWidth}px` }).addClass('is-loaded');

                        _this.items.push({
                            element: $(this),
                            width: itemWidth,
                            offset: $(this).offset().left,
                            position: $(this).position().left,
                            speed: $(this).data('parallax-speed')
                        });

                        if (count === index) {
                            if (typeof callback === 'function') {
                                callback();
                            }
                        }
                    });
                }
            }, timeout);

            $(window).on('resize', function(e) {
                clearTimeout(timer);

                timer = setTimeout(function(){
                    _this.params.width = $(window).width();
                    _this.params.window = $(document).width();
                }, 200);
            });

        },

        animate (posX) {
            const _this = this;
            const width = this.params.width;
            const window = this.params.window;

            const viewport = posX + width;
            const division = posX % width;
            const prepared = division / 1.5;

            _this.items.forEach((item, index) => {
                const offset = item.offset;
                const endPosition = offset + item.width;

                if (viewport >= offset && endPosition >= posX) {
                    TweenMax.to(item.element, .8, { x: Math.ceil(prepared * item.speed) * 1.2, ease: Sine.easeOut }, 0);
                }
            });
        },

        scroller () {
            const _this = this;
            const width = this.params.width;
            const quad = width * 4;

            // Scrollbar.initAll({
            //     speed: 10
            // });

            // Scrollbar.initAll({ speed: 0.75 });

            const rellax = new Rellax('.parallax', {
                round: false,
                center: false
            });

            let timer;

            const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            const range = [120, 180];

            $(window).on('mousewheel', function(e) {
                let distance = e.originalEvent.deltaY;
                let absolute = Math.abs(distance);

                if (isFirefox) {
                    distance = distance * e.deltaFactor * 1.2;
                } else {
                    distance = distance * e.deltaFactor;
                }

                if (distance > 0) {
                    if (distance <= range[0]) {
                        distance = range[0];
                    }

                    if (distance >= range[1]) {
                        distance = range[1];
                    }
                }

                if (distance < 0) {
                    if (distance < 0 && absolute <= 50 && (distance <= range[0] && absolute < range[1])) {
                        distance = -range[0];
                    }

                    if (distance <= -range[1]) {
                        distance = -range[1];
                    }
                }

                distance = $(window).scrollLeft() + distance * 2.5;

                $('html, body').stop().animate({ scrollLeft: distance }, 800, 'easeOutSine');

                e.preventDefault();
            });

            $(window).on('scroll', function() {
                const x = $(window).scrollLeft();

                rellax.change(x);

                timer = setTimeout(function() {
                    _this.changeCurrent(_this.getCurrent(width, x));
                }, 20);
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
            // this.scrollEvent.scrollTo(-(index * width), 0, 500, IScroll.utils.ease.quadratic);

            $('html, body').stop().animate({
                scrollLeft: index * width
            }, 'medium');

            this.changeCurrent(index);
        },

        navigation () {
            const _this = this;

            const width = this.params.width;
            const scroll = $(window).scrollLeft();

            _this.setCurrent(_this.getCurrent(width, scroll), width);

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
            const _this = this;

            _this.calculate(1000, () => {
                _this.scroller();
                _this.navigation();
            });
        }

    };

}))(document.body);
