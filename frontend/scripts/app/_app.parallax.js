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
            const time = 1000;
            const quad = width * 4;

            _this.scrollEvent = new IScroll('#wrapper', {
                elastic: false,
                scrollX: true,
                scrollY: false,
                probeType: 3,
                freeScroll: true,
                mouseWheel: true,
                scrollbars: false,
                useTransform: true,
                mouseWheelSpeed: 40,
                eventPassthrough: false,
                preventDefault: false
            });

            const rellax = new Rellax('.parallax', {
                center: false,
                round: false
            });

            let timer;

            _this.scrollEvent.on('scroll', function() {
                clearTimeout(timer);

                const scrollLeft = Math.abs(this.x);

                rellax.change(scrollLeft);

                timer = setTimeout(function() {
                    _this.changeCurrent(_this.getCurrent(width, scrollLeft));
                }, 20);
            });

            let scrolled = true;

            _this.scrollEvent.on('scrollStart', function(){
                setTimeout(() => {
                    scrolled = false;
                }, 100);
            });

            _this.scrollEvent.on('scrollEnd', function(){
                if (!IS_TOUCH_DEVICE && !scrolled) {

                    scrolled = true;

                    let position = Math.abs(this.x) + ((width / 3.5) * this.directionX);

                    if (position < 0) {
                        position = 0;
                    } else if (Math.abs(position) + width >= quad) {
                        position = quad - width;
                    }

                    _this.scrollEvent.scrollTo((position * -1), 0, time, IScroll.utils.ease.qubic);
                }
            });

            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
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
            this.scrollEvent.scrollTo(-(index * width), 0, 500, IScroll.utils.ease.quadratic);
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
