
// ------------------------------------------
// Rellax.js - v1.0.0
// Buttery smooth parallax library
// Copyright (c) 2016 Moe Amaya (@moeamaya)
// MIT license
//
// Thanks to Paraxify.js and Jaime Cabllero
// for parallax concepts
// ------------------------------------------

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Rellax = factory();
    }
}(this, function () {
    var Rellax = function(el, options){
        "use strict";

        var self = Object.create(Rellax.prototype);

        var posX = 0; // set it to -1 so the animate function gets called at least once
        var screenX = 0;
        var blocks = [];
        var pause = false;

        // check what requestAnimationFrame to use, and if
        // it's not supported, use the onscroll event
        var loop = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function(callback){ setTimeout(callback, 1000 / 60); };

        // check which transform property to use
        var transformProp = window.transformProp || (function(){
            var testEl = document.createElement('div');

            if (testEl.style.transform == null) {
                var vendors = ['Webkit', 'Moz', 'ms'];

                for (var vendor in vendors) {
                    if (testEl.style[ vendors[vendor] + 'Transform' ] !== undefined) {
                        return vendors[vendor] + 'Transform';
                    }
                }
            }

            return 'transform';
        })();

        // limit the given number in the range [min, max]
        var clamp = function(num, min, max) {
            return (num <= min) ? min : ((num >= max) ? max : num);
        };

        // Default Settings
        self.options = {
            speed: -2,
            center: false,
            round: true,
            callback: function() {},
        };

        // User defined options (might have more in the future)
        if (options){
            Object.keys(options).forEach(function(key){
                self.options[key] = options[key];
            });
        }

        // If some clown tries to crank speed, limit them to +-10
        self.options.speed = clamp(self.options.speed, -10, 10);

        // By default, rellax class
        if (!el) {
            el = '.rellax';
        }

        var elements = document.querySelectorAll(el);

        // Now query selector
        if (elements.length > 0) {
            self.elems = elements;
        }
        // The elements don't exist
        else {
            throw new Error("The elements you're trying to select don't exist.");
        }

        // Let's kick this script off
        // Build array for cached element values
        // Bind scroll and resize to animate method
        var init = function() {
            screenX = window.innerWidth;
            setPosition();

            // Get and cache initial position of all elements
            for (var i = 0; i < self.elems.length; i++){
                var block = createBlock(self.elems[i]);
                blocks.push(block);
            }

            window.addEventListener('resize', function(){
                animate();
            });

            // Start the loop
            update();

            // The loop does nothing if the scrollPosition did not change
            // so call animate to make sure every element has their transforms
            animate();
        };

        // We want to cache the parallax blocks'
        // values: base, left, width, speed
        // el: is dom object, return: el cache values
        var createBlock = function(el) {
            var dataPercentage = el.getAttribute( 'data-rellax-percentage' );
            var dataSpeed = el.getAttribute( 'data-rellax-speed' );
            var dataZindex = el.getAttribute( 'data-rellax-zindex' ) || 0;

            // initializing at scrollX = 0 (left of browser)
            // ensures elements are positioned based on HTML layout.
            //
            // If the element has the percentage attribute, the posX needs to be
            // the current scroll position's value, so that the elements are still positioned based on HTML layout
            var posX = dataPercentage || self.options.center ? (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft) : 0;

            var blockLeft = posX + el.getBoundingClientRect().left;
            var blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth;

            // apparently parallax equation everyone uses
            var percentage = dataPercentage ? dataPercentage : (posX - blockLeft + screenX) / (blockWidth + screenX);
            if(self.options.center){ percentage = 0.5; }

            // Optional individual block speed as data attr, otherwise global speed
            // Check if has percentage attr, and limit speed to 5, else limit it to 10
            var speed = dataSpeed ? clamp(dataSpeed, -10, 10) : self.options.speed;
            if (dataPercentage || self.options.center) {
                speed = clamp(dataSpeed || self.options.speed, -5, 5);
            }

            var base = updatePosition(percentage, speed);

            // ~~Store non-translate3d transforms~~
            // Store inline styles and extract transforms
            var style = el.style.cssText;
            var transform = '';

            // Check if there's an inline styled transform
            if (style.indexOf('transform') >= 0) {
                // Get the index of the transform
                var index = style.indexOf('transform');

                // Trim the style to the transform point and get the following semi-colon index
                var trimmedStyle = style.slice(index);
                var delimiter = trimmedStyle.indexOf(';');

                // Remove "transform" string and save the attribute
                if (delimiter) {
                    transform = " " + trimmedStyle.slice(11, delimiter).replace(/\s/g,'');
                } else {
                    transform = " " + trimmedStyle.slice(11).replace(/\s/g,'');
                }
            }

            return {
                base: base,
                left: blockLeft,
                width: blockWidth,
                speed: speed,
                style: style,
                transform: transform,
                zindex: dataZindex
            };
        };

        // set scroll position (posX)
        // side effect method is not ideal, but okay for now
        // returns true if the scroll changed, false if nothing happened
        var setPosition = function() {
            var oldX = posX;

            if (window.pageXOffset !== undefined) {
                posX = window.pageXOffset;
            } else {
                posX = (document.documentElement || document.body.parentNode || document.body).scrollLeft;
            }

            if (oldX != posX) {
                // scroll changed, return true
                return true;
            }

            // scroll did not change
            return false;
        };

        // Ahh a pure function, gets new transform value
        // based on scrollPostion and speed
        // Allow for decimal pixel values
        var updatePosition = function(percentage, speed) {
            var value = (speed * (100 * (1 - percentage)));
            return self.options.round ? Math.round(value * 10) / 10 : value;
        };

        //
        var update = function() {
            if (setPosition() && pause === false) {
                animate();
            }

            // loop again
            loop(update);
        };

        // Transform3d on parallax element
        var animate = function(x, touch) {

            let coefficient = 0.5;

            if (!touch) {
                x = posX;
                coefficient = 1.1;
            }

            for (var i = 0; i < self.elems.length; i++){
                var percentage = ((x - blocks[i].left + screenX) / (blocks[i].width + screenX));

                // Subtracting initialize value, so element stays in same spot as HTML
                var position = updatePosition(percentage, blocks[i].speed * coefficient) - blocks[i].base;

                // TweenMax.to(self.elems[i], 1.5, { x: position, ease: Sine.easeOut }, 0);
                TweenMax.to(self.elems[i], 1.5, { x: position, ease: Sine.easeOut }, 0);
            }

            self.options.callback(position);
        };

        self.change = function(x, touch) {
            animate(x, touch);
        };

        self.destroy = function() {
            for (var i = 0; i < self.elems.length; i++){
                self.elems[i].style.cssText = blocks[i].style;
            }

            pause = true;
        };

        init();
        return self;
    };

    return Rellax;
}));
