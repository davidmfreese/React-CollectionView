var rCV = ReactCollectionView;
var React = rCV.React;

var PanGestureRecognizer = rCV.PanGestureRecognizer;
var TapGestureRecognizer = rCV.TapGestureRecognizer;
var Models = rCV.Models;


var Tappable = React.createClass({
    mixins: [rCV.GestureRecognizerMixin],
    scrollPositionOnMouseDown: undefined,
    getInitialState: function() {
        return {
            top: 0,
            left: 0,
            isExpanded: false
        }
    },
    componentDidMount: function() {
        this.gestureRecognizers = [];
        var tapGesture = TapGestureRecognizer();
        tapGesture.setActionForTarget(this.handleTapGesture, this.getDOMNode());
        this.gestureRecognizers.push(tapGesture);

        var panGesture = PanGestureRecognizer();
        panGesture.setActionForTarget(this.handlePanGesture, this.getDOMNode());
        this.gestureRecognizers.push(panGesture);
    },
    render: function() {
        var draggableStyle = {
            height: 100,
            width: 100,
            "background-color": "yellow",
            position: "absolute",
            top: this.state.top,
            left: this.state.left
        }

        if(this.state.isExpanded) {
            draggableStyle.height = 250;
            draggableStyle.width = 250;
        }

        var containerStyle = {
            height: window.innerHeight,
            width: window.innerWidth
        }

        var draggable = React.createElement('div', {style: draggableStyle, ref: "draggable"});
        return React.createElement('div', { style: containerStyle}, draggable);
    },
    handlePanGesture: function(gestureRecognizer) {
        var state = gestureRecognizer.getState();
        var touches = gestureRecognizer.getTouches();
        var translation = gestureRecognizer.translation();
        var domElement = this.refs["draggable"].getDOMNode();

        console.log("PanState: " + state + ", translation: " + translation.x + ", " + translation.y);

        if(touches && touches.length == 1) {
            if (state == "Began") {
                this.scrollPositionOnMouseDown = new Models.Point({
                    x: domElement.offsetLeft,
                    y: domElement.offsetTop
                });
            } else if(state == "Changed" && this.scrollPositionOnMouseDown) {

                var x = this.scrollPositionOnMouseDown.x - translation.x;
                var y = this.scrollPositionOnMouseDown.y - translation.y;
                this.setState({
                    top: y,
                    left: x
                });
            } else if(state == "Ended") {
                //NO OP
            } else {
                this.scrollPositionOnMouseDown = undefined;
            }
        }

    },
    handleTapGesture: function(gestureRecognizer) {
        var state = gestureRecognizer.getState();
        var touches = gestureRecognizer.getTouches();
        var translation = gestureRecognizer.translation();
        var domElement = this.refs["draggable"].getDOMNode();

        console.log("TapState: " + state + ", translation: " + translation.x + ", " + translation.y);

        if(state == "Began") {
            this.setState({
                isExpanded: !this.state.isExpanded
            });
        }
    }
})
var tappable = React.createElement(Tappable, {});
React.render(tappable, document.getElementById('reactContainer'));