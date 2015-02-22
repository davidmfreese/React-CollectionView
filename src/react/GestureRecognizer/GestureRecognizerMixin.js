var _ = require('underscore');

var Models = require('../Model/Models');
var touches = require('./Touch');


var ReactGestureRecognizerMixin = {
    componentWillMount: function() {
        this.gestureRecognizerIsActive = false;
    },

    componentDidMount: function() {
        var node = this.getDOMNode();
        
        node.addEventListener('mousedown', this.gestureRecognizerOnMouseDown)
        document.addEventListener('mousemove', this.gestureRecognizerOnMouseMove);
        document.addEventListener('mouseup', this.gestureRecognizerOnMouseUp);

        node.addEventListener('touchstart', this.gestureRecognizerOnTouchStart);
        document.addEventListener('touchmove', this.gestureRecognizerOnTouchMove);
        document.addEventListener('touchend', this.gestureRecognizerOnTouchEnd);
    },

    componentWillUnmount: function() {
        var node = this.getDOMNode();

        node.removeEventListener('mousedown', this.gestureRecognizerOnMouseDown);
        document.removeEventListener('mousemove', this.gestureRecognizerOnMouseMove);
        document.removeEventListener('mouseup', this.gestureRecognizerOnMouseUp);

        node.removeEventListener('touchstart', this.gestureRecognizerOnTouchStart);
        document.removeEventListener('touchmove', this.gestureRecognizerOnTouchMove);
        document.removeEventListener('touchend', this.gestureRecognizerOnTouchEnd);
    },

    //gestureRecognizerOnMouseClick: function(e) {
    //    var point = new Models.Point({x: e.pageX, y: e.pageY});
    //    var that = this;
    //    var touch = new touches(1, point, e.relatedTarget);
    //    this.gestureRecognizerOnGestureDown(touch);
    //    setTimeout(function() {
    //        that.gestureRecognizerOnGestureUp(touch);
    //    }, 1);
    //},

    gestureRecognizerOnMouseDown: function(e) {
        // only left mouse button
        if (e.button !== 0) return;

        e.preventDefault();

        var point = new Models.Point({x: e.pageX, y: e.pageY});
        var touch = new touches(1, point, e.relatedTarget);
        this.gestureRecognizerOnGestureDown(touch);
    },

    gestureRecognizerOnMouseUp: function(e) {
        this.gestureRecognizerIsActive = false;
        e.preventDefault();

        var point = new Models.Point({x: e.pageX, y: e.pageY});
        var touch = new touches(1, point, e.relatedTarget);
        this.gestureRecognizerOnGestureUp(touch);
    },

    gestureRecognizerOnMouseMove: function(e) {
        //console.log("mouse move: " + e.pageX + ", " + e.pageY);
        e.preventDefault();

        var point = new Models.Point({x: e.pageX, y: e.pageY});
        var touch = new touches(1, point, e.relatedTarget);
        this.gestureRecognizerOnGestureMove(touch);
    },

    gestureRecognizerOnTouchStart: function(e) {
        e.preventDefault();

        var touches = [];
        for(var i = 0; i < e.changedTouches.length; i++) {
            var point = new Models.Point({x: e.changedTouches[i].pageX, y: e.changedTouches[i].pageY});
            var touch = new touches(e.changedTouches[i].identifier, point, e.changedTouches.target);

            touches.push(touches);
        }

        this.gestureRecognizerOnGestureDown(touches);
    },

    gestureRecognizerOnTouchEnd: function(e) {
        e.preventDefault();

        //All touches are removed
        if(e.changedTouches.length == e.touches.length) {
            this.gestureRecognizerIsActive = false;
        }

        var touches = [];
        for(var i = 0; i < e.changedTouches.length; i++) {
            var point = new Models.Point({x: e.changedTouches[i].pageX, y: e.changedTouches[i].pageY});
            var touch = new touches(e.changedTouches[i].identifier, point, e.changedTouches.target);

            touches.push(touches);
        }

        this.gestureRecognizerOnGestureUp(touches);
    },

    gestureRecognizerOnTouchMove: function(e) {
        e.preventDefault();

        var touches = [];
        for(var i = 0; i < e.changedTouches.length; i++) {
            var point = new Models.Point({x: e.changedTouches[i].pageX, y: e.changedTouches[i].pageY});
            var touch = new touches(e.changedTouches[i].identifier, point, e.changedTouches.target);

            touches.push(touches);
        }

        this.gestureRecognizerOnGestureMove(touches);
    },

    gestureRecognizerOnGestureDown: function(touches) {
        this.gestureRecognizerIsActive = true;
        if(!_.isArray(touches)) {
            touches = [touches];
        }
        for(var i = 0; i < this.gestureRecognizers.length; i++) {
            this.gestureRecognizers[i].onGestureDown(touches);
        }
    },

    gestureRecognizerOnGestureMove: function(touches) {
        if(this.gestureRecognizerIsActive) {
            if (!_.isArray(touches)) {
                touches = [touches];
            }

            for (var i = 0; i < this.gestureRecognizers.length; i++) {
                this.gestureRecognizers[i].onGestureMove(touches);
            }
        }
    },

    gestureRecognizerOnGestureUp: function(touches) {
        if(!_.isArray(touches)) {
            touches = [touches];
        }

        for(var i = 0; i < this.gestureRecognizers.length; i++) {
            this.gestureRecognizers[i].onGestureUp(touches);
        }
    }
};

module.exports = ReactGestureRecognizerMixin;