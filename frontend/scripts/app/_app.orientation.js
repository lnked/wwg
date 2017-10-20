let app = app || {};

((body => {
    "use strict";

    app.orientation = {

        orientation: function() {
            if (typeof screen.orientation !== 'undefined' && typeof screen.orientation.angle !== 'undefined') {
                return Math.abs(screen.orientation.angle);
            }

            if (typeof window.orientation !== 'undefined') {
                return Math.abs(window.orientation);
            }

            return '0xx';
        },

        init() {
            const _this_ = this;
            const $rotate = $('#rotate-block');

            $(window).on("orientationchange", function(event) {
                setTimeout(() => {
                    const width = $(window).width();
                    const height = $(window).height();

                    if (_this_.orientation() === 0) {
                        $rotate.removeClass('is-show');
                    } else if (height < 500) {
                        $rotate.addClass('is-show');
                    }
                }, 500);
            });
        }

    };

}))(document.body);
