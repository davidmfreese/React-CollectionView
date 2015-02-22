var t = require('tcomb');
var _ = require('underscore')

var Models = require('../Model/Models');
var GestureRecognizer = require('./GestureRecognizer');

function PanGestureRecognizerFactory() {
    var maxTouches = minTouches = 1;
    var state = "None";
    var minDistanceToPan = 5;

    function restart() {
        state = "None";
    }

    var PanGestureRecognizer = {
        getState: function () {
            if(state == "Ended") {
                restart();
            }

            var touches = this.getTouches();
            var translation = this.translation();
            if (touches && touches.length == 1) {
                var touch = touches[0];
                var distanceMoved = Math.sqrt(translation.x * translation.x + translation.y + translation.y);
                if (touch.touchEndTime) {
                    if(state == "Began" || state == "Changed") {
                        state = "Ended";
                    } else {
                        state = "Failed";
                    }
                } else if ( distanceMoved < minDistanceToPan) {
                    state = "Possible";
                } else if (state == "None" || state == "Possible") {
                    state = "Began";
                }
                else {
                    state = "Changed";
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

    return _.extend({}, new GestureRecognizer.GestureRecognizerBase(), PanGestureRecognizer);
}

module.exports = PanGestureRecognizerFactory;
