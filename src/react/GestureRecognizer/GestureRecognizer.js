var t = require('tcomb');

var Models = require('../Model/Models');

var GestureRecognizerState = t.enums.of("None Possible Began Changed Ended Cancelled Failed ");

var GestureRecognizerProtocol = t.struct({
    getState: t.func(t.Nil, GestureRecognizerState),
    getView: t.func(t.Nil, t.Str),
    isEnabled: t.func(t.Nil, t.Bool),
    setEnabled: t.func(t.Bool, t.Nil),
    getNumberOfTouches: t.func(t.Nil, t.Num),
    locationOfTouch: t.func(t.Num, Models.Point),
    setActionForTarget: t.Any,
    getTouches: t.Any,
    onGestureDown: t.func(t.Arr, t.Nil),
    onGestureUp: t.func(t.Arr, t.Nil),
    onGestureMove: t.func(t.Arr, t.Nil)
});

function GestureRecognizerBaseFactory() {
    var state = "None";
    var view = "";
    var touches = [];
    var enabled = false;
    var actionCallback = null;
    var allTouchesEnded = true;
    function getTouch(identifier) {
        for(var i = 0; i < touches.length; i++) {
            if(touches[i].identifier == identifier) {
                return touches[i];
            }
        }

        return null;
    }

    var GestureRecognizerBase = new GestureRecognizerProtocol({
        getState: function () {
            return state;
        },
        getView: function () {
            return view;
        },
        isEnabled: function () {
            return enabled;
        },
        setEnabled: function (isEnabled) {
            enabled = isEnabled;
        },
        getNumberOfTouches: function () {
            return touches.length;
        },
        locationOfTouch: function (touchNum) {
            return touches[touchNum].lastLocation;
        },
        setActionForTarget: function (action, forView) {
            view = forView;
            actionCallback = action;
        },
        getTouches: function () {
            return touches;
        },
        onGestureDown: function (newTouches) {
            if (allTouchesEnded) {
                touches = [];
            }
            allTouchesEnded = false;
            for (var i = 0; i < newTouches.length; i++) {
                var touch = getTouch(newTouches[i].identifier);
                if (!touch) {
                    touches.push(newTouches[i]);
                }
            }

            if (actionCallback) {
                actionCallback(this);
            }
        },
        onGestureMove: function (movedTouches) {
            if (allTouchesEnded) {
                return;
            }
            for (var i = 0; i < movedTouches.length; i++) {
                var touch = getTouch(movedTouches[i].identifier);
                touch.onMoved(movedTouches[i].startLocation);
            }

            if (actionCallback) {
                actionCallback(this);
            }
        },
        onGestureUp: function (endedTouches) {
            for (var i = 0; i < endedTouches.length; i++) {
                var touch = getTouch(endedTouches[i].identifier);
                touch.onEnded(endedTouches[i].startLocation);
            }

            allTouchesEnded = true;
            for (var i = 0; i < touches.length; i++) {
                if (!touches[i].touchEndTime) {
                    allTouchesEnded = false;
                }
            }

            if (actionCallback) {
                actionCallback(this);
            }
        }
    }, true);

    return GestureRecognizerBase
}

module.exports.GestureRecognizerState = GestureRecognizerState;
module.exports.Protocol = GestureRecognizerProtocol;
module.exports.GestureRecognizerBase = GestureRecognizerBaseFactory;



