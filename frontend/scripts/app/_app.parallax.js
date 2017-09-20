let app = app || {};

((body => {
    "use strict";

    app.parallax = {
        params: {},

        calculate () {
            this.params.width = $(window).width();
        },

        scroller () {
            $('html, body').mousewheel(function(event, delta) {
                this.scrollLeft -= (delta * 2);
                event.preventDefault();
            });
        },

        getCurrent (width, scroll) {
            return (4 - Math.ceil(((width * 4) - scroll) / width));
        },

        changeCurrent (index) {
            $('.j-navigation-link').removeClass('navigation__link--current');
            $('.j-navigation').eq(index).find('.j-navigation-link').addClass('navigation__link--current');
        },

        setCurrent (index, width) {
            $('html, body').animate({
                scrollLeft: (index * width) + 'px'
            }, 'fast');

            this.changeCurrent(index);
        },

        navigation () {
            this.calculate();

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

            $('body').on('click', '.j-navigation-link', function(e) {
                e.preventDefault();

                const index = $(this).closest('.j-navigation').index();

                _this.setCurrent(index, width);
            });
        },

        parallax () {
            // var rellax = new Rellax('.rellax', {
            //     speed: -2,
            //     center: false,
            //     round: true,
            //     callback: function(position) {
            //         console.log(position);
            //     }
            // });
            /*
            (function(){

                var $win = $(window);
                var $doc = $(document);
                var $body = $("body");

                var bgHeight = 1200;       //height of the background image;

                var docHeight, winHeight, maxScroll;

                function onResize(){
                    docHeight = $doc.height();
                    winHeight = $win.height();
                    maxScroll = docHeight - winHeight;
                    moveParallax();
                }

                function moveParallax(){

                    var bgYPos = -(bgHeight-winHeight)* ($win.scrollTop() / maxScroll);

                    TweenLite.to($body, 0.1, {backgroundPosition: "50% " + bgYPos + "px"});
                }

                $win.on("scroll", moveParallax).on("resize", onResize).resize();
            });
            */
        },

        init() {
            this.scroller();
            this.parallax();
            this.navigation();
        }

    };

}))(document.body);
