var t = require('tcomb');
var _ = require('underscore')

var Models = require('../Model/Models');
var GestureRecognizer = require('./GestureRecognizer');

function TapGestureRecognizerFactory() {
    var maxTouches = minTouches = 1;
    var state = "None";
    var maxDistanceCanMove = 5;//total pixels
    var maxPressTime = 100;// milliseconds

    function restart() {
        state = "None";
    }

    var TapGestureRecognizer = {
        getState: function () {
            if(state == "Ended") {
                restart();
            }

            var touches = this.getTouches();
            var translation = this.translation();
            if (touches && touches.length == 1) {
                var touch = touches[0];
                var distanceMoved = Math.sqrt(translation.x * translation.x + translation.y + translation.y);
                if(touch.touchEndTime && distanceMoved < maxDistanceCanMove && touch.touchEndTime - touch.touchStartTime < maxPressTime) {
                    state = "Began";
                } else if(distanceMoved > maxDistanceCanMove) {
                    state = "Failed";
                } else if(touch.touchEndTime - touch.touchStartTime < maxPressTime) {
                    state = "Failed";
                } else if(!touch.touchEndTime) {
                    state = "Possible";
                } else {
                    state = "Failed"
                }
            } else if (touches && touches.length > 1) {
                state = "Failed";
            } else {
                state = "None";
            }

            return state;
        },
        translation: function () {
            var touches = this.getTouches();
            var translation = Models.Geometry.getPointZero();
            if (touches && touches.length == 1) {
                var touch = touches[0];
                var deltaX = touch.lastLocation.x - touch.startLocation.x;
                var deltaY = touch.lastLocation.y - touch.startLocation.y;

                translation = new Models.Point({
                    x: deltaX,
                    y: deltaY
                });
            }

            return translation;
        }
    };

    return _.extend({}, new GestureRecognizer.GestureRecognizerBase(), TapGestureRecognizer);
}

module.exports = TapGestureRecognizerFactory;
