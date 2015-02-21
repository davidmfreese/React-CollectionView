//TODO: better RAF implementation
var _requestAnimationFrame = function(win, t) {
    return win["webkitR" + t] || win["r" + t] || win["mozR" + t]
        || win["msR" + t] || function(fn) { setTimeout(fn, 60) }
}(window, "requestAnimationFrame");

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

function getRate(t) {
    return 1 - t;
}

function easelinear(t) { return t }

function easeOutQuad(t) { return t*(2-t) }

function easeInOutCubic(t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }

//taken from http://www.sitepoint.com/simple-animations-using-requestanimationframe/
function animateScroll(duration, easingType, stepFunction, success) {
    var end = Date.now() + duration;
    var step = function() {

        var current = Date.now();
        var remaining = end - current;
        var tScaled = remaining/duration;

        if(remaining < 16) {
            stepFunction(1);
            success('success');
            return;
        } else {
            var rate = 0;
            var t = 0;
            if(!easingType || easingType == 'linear') {
                //console.log('linear');
                var t = easelinear(tScaled);
                rate = getRate(t);
            } else if(easingType == 'outQuad') {
                //console.log('outQuad');
                var t = easeOutQuad(tScaled);
                rate = getRate(t);
            } else if(easingType == 'inOutCubic') {
                //console.log('inOutCubic');
                var t = easeInOutCubic(tScaled);
                rate = getRate(t);
            }
            stepFunction(rate);
        }

        _requestAnimationFrame(step);
    }
    step();
}

module.exports.animateScroll = animateScroll;


