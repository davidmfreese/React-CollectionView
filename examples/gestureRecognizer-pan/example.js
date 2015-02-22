var rCV = ReactCollectionView;
var React = rCV.React;

var PanGestureRecognizer = rCV.PanGestureRecognizer;
var Models = rCV.Models;


var Tappable = React.createClass({
    mixins: [rCV.GestureRecognizerMixin],
    scrollPositionOnMouseDown: undefined,
    getInitialState: function() {
        return {
            top: 0,
            left: 0
        }
    },
    componentDidMount: function() {
        this.gestureRecognizers = [];
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

    }
})
var tappable = React.createElement(Tappable, {});
React.render(tappable, document.getElementById('reactContainer'));