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

function easingLinear(remaining, duration) {
    return 1 - remaining/duration;
}

//taken from http://www.sitepoint.com/simple-animations-using-requestanimationframe/
function animateScroll(duration, easingType, stepFunction, success) {
    var end = Date.now() + duration;
    var step = function() {

        var current = Date.now();
        var remaining = end - current;

        if(remaining < 16) {
            stepFunction(1);
            success('success');
            return;

        } else {
            var rate = 0;
            if(!easingType || easingType == "linear") {
                rate = easingLinear(remaining, duration);
            }
            stepFunction(rate);
        }

        _requestAnimationFrame(step);
    }
    step();
}

module.exports.animateScroll = animateScroll;


