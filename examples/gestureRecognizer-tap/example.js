var rCV = ReactCollectionView;
var React = rCV.React;

var TapGestureRecognizer = rCV.TapGestureRecognizer;

var Tappable = React.createClass({
    mixins: [rCV.GestureRecognizerMixin],
    getInitialState: function() {
        return {
            isExpanded: false
        }
    },
    componentDidMount: function() {
        this.gestureRecognizers = [];
        var tapGesture = TapGestureRecognizer();
        tapGesture.setActionForTarget(this.handleTapGesture, this.getDOMNode());
        this.gestureRecognizers.push(tapGesture);
    },
    render: function() {
        var style;

        if(this.state.isExpanded) {
            style = {
                height:500,
                width: 500,
                "background-color": "black"
            }
        } else {
            style = {
                height:100,
                width: 100,
                "background-color": "yellow"
            }
        }

        return React.createElement('div', { style: style});
    },
    handleTapGesture: function(gestureRecognizer) {
        var state = gestureRecognizer.getState();
        if(state == "Began") {
            this.setState({
               isExpanded: !this.state.isExpanded
            });
        }
    }
})
var tappable = React.createElement(Tappable, {});
React.render(tappable, document.getElementById('reactContainer'));