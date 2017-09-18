let app = app || {};

((body => {
    "use strict";

    app.placeholder = {

        change ($label) {
            const $placeholder = $label.find('.j-label-placeholder');
            const value = $label.find('.j-label-field').val();

            if (value.replace(/\s/gi, '').length) {
                $placeholder.removeClass('feedback__placeholder--visible');
            } else {
                $placeholder.addClass('feedback__placeholder--visible');
            }
        },

        bind() {
            const _this_ = this;

            $('.j-label').each(function(){
                _this_.change($(this));
            });

            $('.j-label').find('.j-label-field').on('input', function(){
                _this_.change($(this).closest('.j-label'));
            });

            $('.j-label').find('.j-label-field').on('blur', function(){
                _this_.change($(this).closest('.j-label'));
            });
        },

        init() {
            this.bind();
        }
    };

}))(document.body);