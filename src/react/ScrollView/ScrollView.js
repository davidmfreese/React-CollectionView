var React = require('react/addons');
var t = require('tcomb-validation');
var tReact = require('React-ScrollView')['tcomb-react'];

var CAAnimation = require("../Animations/CAAnimation");
var ScrollViewDelegate = require('./ScrollViewDelegate');
var Geometry = require('JSCoreGraphics').CoreGraphics.Geometry;
var Enums = require('../Enums/Enums');

var Utils = require('../Utils/Utils');

var scrollViewProps = t.struct({
    content: t.Arr,
    frame: Geometry.DataTypes.Rect,
    contentSize: Geometry.DataTypes.Size,
    scrollViewDelegate: t.Obj,
    scrollTimeout: t.Num,
    shouldUpdate: t.Bool,
    paging: t.Bool,
    pagingDirection: Enums.ScrollDirectionType,
    debugScroll: t.maybe(t.Bool)
}, 'ScrollViewProps');

var GestureRecognizerMixin = require('React-GestureRecognizer').GestureRecognizerMixin;
var PanGestureRecognizer = require('React-GestureRecognizer').Recognizers.PanGestureRecognizer;

var scrollDirType = {
    None: 0,
    Left: 1,
    Up: 2,
    Right: 3,
    Down: 4
};

//enable touch events
React.initializeTouchEvents(true);

var debugEvents = Utils.Query.getQueryParamValue(document.location.search, 'debugEvents');
var ScrollView = React.createClass({
    mixins: [GestureRecognizerMixin],
    propTypes: tReact.react.toPropTypes(scrollViewProps),
    scrollPositionOnMouseDown: undefined,
    getInitialState: function() {
        return {
            scrollPosition: Geometry.Constants.pointZero,
            scrollTimeout: undefined,
            isScrolling: false,
            animatingToScrollPosition: false,
            velocity: 0,
            scrollDirections: [scrollDirType.None]
        };
    },
    componentWillMount: function() {
        this.gestureRecognizers = [];
    },
    componentDidMount: function() {
        if (this.props.contentSize) {
            console.log('isTypeSafe<-->ContentSize: ' + Geometry.DataTypes.Size.is(this.props.contentSize));
        }
        if (this.props.scrollViewDelegate) {
            console.log('isTypeSafe<-->CollectionViewDelegate: ' + ScrollViewDelegate.Protocol.is(this.props.scrollViewDelegate));
        }

        if(this.refs["scrollable"] == null || this.refs["scrollable"].getDOMNode() == null) {
            console.error("No scrollable scroll ref available");
        }

        var panGesture = PanGestureRecognizer();
        panGesture.addTargetForCallback(this.getDOMNode(), this.handlePanGesture);
        this.gestureRecognizers.push(panGesture);
        if(this.props.paging) {
            this.shouldHandleTouchGestures = true;
        }
        this.shouldHandleMouseGestures = true;
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        var newScrollPosition = nextState.scrollPosition;
        var oldScrollPosition = this.state.scrollPosition;
        if(this.props.debugScroll) {
            console.log('new scrollPosition: ' + JSON.stringify(newScrollPosition, null) + ", old scrollPosition: " + JSON.stringify(oldScrollPosition, null));
        }

        return nextProps.shouldUpdate;
    },
    render: function() {
        var frame = this.props.frame;
        var scrollableStyle = {
            height: frame.size.height,
            width: frame.size.width,
            overflowX: 'scroll',
            overflowY: 'scroll',
            position: 'absolute'
        };

        if(this.props.paging) {
            scrollableStyle.overflowX = 'hidden';
            scrollableStyle.overflowY = 'hidden';
        }

        var clearStyle = {
            clear:"both"
        };

        var contentSize = this.props.contentSize;
        if(!contentSize) {
            contentSize = new Geometry.DataTypes.Size({height:0, width:0});
        }
        var wrapperStyle = {
            width:contentSize.width,
            height:contentSize.height
        };
        var containerProps = {
            className: "'scroll-container'",
            ref: "scrollable",
            style: scrollableStyle,
            onScroll: this.onScroll
        };

        var scrollingWrapperProps = {
            ref:"smoothScrollingWrapper",
            style: wrapperStyle
        }

        var scrollingWrapper = React.DOM.div(scrollingWrapperProps, this.props.content);
        var container = React.DOM.div(containerProps, scrollingWrapper);

        return container;
    },
    handlePanGesture: function(gestureRecognizer) {
        var state = gestureRecognizer.getState();
        var touches = gestureRecognizer.getTouches();
        if(touches && touches.length == 1) {
            var touch = touches[0];
            var translation = touch.getCurrentTranslation();
            if(debugEvents) {
                console.log("PanState: " + state + ", translation: " + translation.x + ", " + translation.y);
            }
            if (state == "Began") {
                this.scrollPositionOnMouseDown = new Geometry.DataTypes.Point({
                    x: this.refs["scrollable"].getDOMNode().scrollLeft,
                    y: this.refs["scrollable"].getDOMNode().scrollTop

                });
            } else if(state == "Changed" && this.scrollPositionOnMouseDown) {

                var x = this.scrollPositionOnMouseDown.x - translation.x;
                var y = this.scrollPositionOnMouseDown.y - translation.y;
                this.scrollTo(new Geometry.DataTypes.Point({
                    x: x,
                    y: y
                }), false)
            } else if(state == "Ended") {
                if (this.props.paging) {
                    this.handlePaging(this.state.scrollPosition);
                }

            } else {
                this.scrollPositionOnMouseDown = undefined;
            }
        }


    },
    onScroll: function(e) {
        if(this.state.animatingToScrollPosition || this.state.mouseDown) {
            return;
        }
        var scrollPosition = new Geometry.DataTypes.Point({x: e.target.scrollLeft, y: e.target.scrollTop});
        if(this.props.scrollViewDelegate != null && this.props.scrollViewDelegate.scrollViewDidScroll != null) {
            this.props.scrollViewDelegate.scrollViewDidScroll(scrollPosition);
        }
        this.handleScroll(scrollPosition);
    },
    handleScroll: function(scrollPosition) {
        var that = this;
        this.manageScrollTimeouts();

        var scrollDirections = this.getScrollDirection(scrollPosition);
        this.setState({
            scrollPosition: scrollPosition,
            scrollDirections: scrollDirections
        });
    },
    getScrollDirection: function(scrollPosition) {
        var previousScrollPosition = this.state.scrollPosition;
        var scrollDirections = [];

        if (scrollPosition.y < previousScrollPosition.y) {
            scrollDirections.push(scrollDirType.Up);
        } else if (scrollPosition.y > previousScrollPosition.y) {
            scrollDirections.push(scrollDirType.Down);
        } else if(scrollPosition.x < previousScrollPosition.x) {
            scrollDirections.push(scrollDirType.Left);
        } else if (scrollPosition.x > previousScrollPosition.x) {
            scrollDirections.push(scrollDirType.Right);
        }

        return scrollDirections;
    },
    getVisibileContentFrame: function(scrollPosition) {
        var rect = new Geometry.DataTypes.Rect({
            origin: scrollPosition,
            size: this.props.frame.size
        });

        return rect;
    },
    manageScrollTimeouts: function() {
        if (this.state.scrollTimeout) {
            clearTimeout(this.state.scrollTimeout);
        }

        var that = this;
        var scrollTimeout = setTimeout(function() {
            if(that.props.scrollViewDelegate && that.props.scrollViewDelegate.scrollViewDidEndDecelerating) {
                that.props.scrollViewDelegate.scrollViewDidEndDecelerating(that);
            }
            that.setState({
                isScrolling: false,
                scrollTimeout: undefined
            })

         }, that.props.scrollTimeout);

        this.setState({
            isScrolling: true,
            scrollTimeout: scrollTimeout
        });
    },
    scrollTo: function(toScrollPosition, animated) {
        if(this.state.animatingToScrollPosition) {
            return;
        }

        var that = this;
        var domElement = that.refs["scrollable"].getDOMNode();

        if(animated) {
            this.setState({
                    animatingToScrollPosition: true
                },
                function () {

                    var currentTop = domElement.scrollTop;
                    var newTop = toScrollPosition.y;

                    var currentLeft = domElement.scrollLeft;
                    var newLeft = toScrollPosition.x;

                    var stepFunction = function (rate) {
                        domElement.scrollTop = currentTop - rate * (currentTop - newTop);
                        domElement.scrollLeft = currentLeft - rate * (currentLeft - newLeft);
                    };

                    CAAnimation.animateScroll(200, 'linear', stepFunction, function (success) {
                        if (that.props.scrollViewDelegate && that.props.scrollViewDelegate.scrollViewDidEndScrollingAnimation) {
                            that.props.scrollViewDelegate.scrollViewDidEndScrollingAnimation(this);
                        }

                        that.setState({
                            animatingToScrollPosition: false
                        });

                    });
                });
        } else {
            domElement.scrollTop = toScrollPosition.y;
            domElement.scrollLeft = toScrollPosition.x;
            var scrollDirections = this.getScrollDirection(toScrollPosition);
            var that = this;
            this.setState({
                scrollPosition: toScrollPosition,
                scrollDirections: scrollDirections
            }, function() {
                if(that.props.scrollViewDelegate != null && that.props.scrollViewDelegate.scrollViewDidScroll != null) {
                    that.props.scrollViewDelegate.scrollViewDidScroll(toScrollPosition);
                }
            })
        }
    },
    handlePaging: function(scrollPosition) {
        if(this.props.pagingDirection === "ScrollDirectionTypeVertical") {
            var remainder = scrollPosition.y % this.props.frame.size.height;
            var page = Math.floor(scrollPosition.y / this.props.frame.size.height);
            if (remainder > this.props.frame.size.height / 2) {
                page++;
            }
            this.scrollTo(new Geometry.DataTypes.Point({
                x: 0,
                y: (page) * this.props.frame.size.height
            }), true);
        } else { //Horizontal
            var remainder = scrollPosition.x % this.props.frame.size.width;
            var page = Math.floor(scrollPosition.x / this.props.frame.size.width);
            if (remainder > this.props.frame.size.width / 2) {
                page++;
            }
            this.scrollTo(new Geometry.DataTypes.Point({
                x: (page) * this.props.frame.size.width,
                y: 0
            }), true);
        }
    }
});

module.exports = ScrollView;