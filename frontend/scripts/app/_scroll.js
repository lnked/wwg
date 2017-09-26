// const myScroll = new IScroll('#wrapper', {
//     elastic: true,
//     scrollX: true,
//     scrollY: false,
//     probeType: 3,
//     mouseWheel: true,
//     scrollbars: false,
//     useTransform: true,
//     mouseWheelSpeed: 20,
//     eventPassthrough: true
// });

// myScroll.on('scroll', function() {
//     rellax.change(Math.abs(this.x));
// });

// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

// let timer;
// let timestamp = new Date().getTime();

// const draw = function(x) {
//     const current = new Date().getTime();

//     if ((current - timestamp) >= 100) {
//         _this.animate(x);

//         clearTimeout(timer);

//         timer = setTimeout(function() {
//             _this.animate(x);
//         }, 150);

//         timestamp = current;
//     }
// }

// let lastPosition = $(window).scrollLeft();

// function loop(){
//     if (lastPosition == $(window).scrollLeft()) {
//         scroll(loop);
//         return false;
//     } else lastPosition = $(window).scrollLeft();

//     draw(lastPosition);
//     scroll(loop);
// }

// loop();

// $(window).on('mousewheel', (event) => {
//     event.preventDefault();
//     $(window).scrollLeft($(window).scrollLeft() - (event.originalEvent.wheelDeltaY));
// });
