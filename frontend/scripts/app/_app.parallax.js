let app = app || {};

((body => {
    "use strict";

    app.parallax = {
        items: [],
        params: {},

        calculate (timeout, callback) {
            const _this = this;

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
                            callback();
                        }
                    });
                }
            }, timeout);
        },

        animate (posX) {
            const _this = this;
            const width = this.params.width;
            const window = this.params.window;

            const viewport = posX + width;
            const division = posX % width;
            const prepared = division / 2;

            const tl = new TimelineMax({});

            _this.items.forEach((item, index) => {
                const offset = item.offset;
                const endPosition = offset + item.width;

                if (viewport >= offset && endPosition >= posX) {
                    tl.to(item.element, 0.7, { x: Math.ceil(prepared * item.speed) }, 0);
                }
            });
        },

        scroller () {
            const _this = this;

            $(window).on('mousewheel', (e, d) => {
                e.preventDefault();
                const x = $(window).scrollLeft();
                $(window).scrollLeft(x - (d * 10));
            });

            let timer;
            let timestamp = new Date().getTime();

            $(window).on('scroll', function(e, d) {
                const current = new Date().getTime();
                const scrollPosX = $(window).scrollLeft();

                if ((current - timestamp) >= 50) {
                    clearTimeout(timer);

                    _this.animate(scrollPosX);

                    timer = setTimeout(() => {
                        _this.animate(scrollPosX);
                    }, 20);

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
            const _this = this;

            _this.calculate(1000, () => {
                _this.navigation();
                _this.scroller();
            });
        }

    };

}))(document.body);
