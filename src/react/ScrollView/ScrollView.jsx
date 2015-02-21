var React = require('react/addons');
var t = require('tcomb');
var tReact = require('tcomb-react');
//var Velocity = require('velocity-animate');
var CAAnimation = require("../Animations/CAAnimation");

var ScrollViewDelegate = require('./ScrollViewDelegate');

var Models = require('../Model/Models');
var Enums = require('../Enums/Enums');

var scrollViewProps = t.struct({
    content: t.Arr,
    frame: Models.Rect,
    contentSize: Models.Size,
    scrollViewDelegate: t.Obj,
    scrollTimeout: t.Num,
    shouldUpdate: t.Bool,
    paging: t.Bool,
    pagingDirection: Enums.ScrollDirectionType,
    debugScroll: t.maybe(t.Bool)
}, 'ScrollViewProps');

var scrollDirType = {
    None: 0,
    Left: 1,
    Up: 2,
    Right: 3,
    Down: 4
};

//enable touch events
React.initializeTouchEvents(true);

var debugEvents = true;
var ScrollView = React.createClass({
    propTypes: tReact.react.toPropTypes(scrollViewProps),
    getInitialState: function() {
        return {
            scrollPosition: Models.Geometry.getPointZero(),
            scrollTimeout: undefined,
            isScrolling: false,
            animatingToScrollPosition: false,
            velocity: 0,
            scrollDirections: [scrollDirType.None]
        };
    },
    mouseDown: false,
    mouseDownPosition: Models.Geometry.getPointZero(),
    scrollPositionOnMouseDown: Models.Geometry.getPointZero(),
    componentDidMount: function() {
        if (this.props.contentSize) {
            console.log('isTypeSafe<-->ContentSize: ' + Models.Size.is(this.props.contentSize));
        }
        if (this.props.scrollViewDelegate) {
            console.log('isTypeSafe<-->CollectionViewDelegate: ' + ScrollViewDelegate.Protocol.is(this.props.scrollViewDelegate));
        }

        if(this.refs["scrollable"] == null || this.refs["scrollable"].getDOMNode() == null) {
            console.error("No scrollable scroll ref available");
        }
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
            contentSize = new Models.Size({height:0, width:0});
        }
        var wrapperStyle = {
            width:contentSize.width,
            height:contentSize.height
        };
        return (
            <div className={'scroll-container'}
                ref="scrollable"
                style={scrollableStyle}
                onScroll={this.onScroll}

                onTouchStartCapture={this.onTouchStart}
                onTouchMoveCapture={this.onTouchMove}
                onTouchCancelCapture={this.onTouchCancel}
                onTouchEndCapture={this.onTouchEnd}
                onDragStartCapture={this.onDragStart}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}>
                <div ref="smoothScrollingWrapper" style={wrapperStyle}>
                    {this.props.content}
                </div>
            </div>
        )
    },
    onTouchStart: function(e) {
        if(debugEvents) {
            console.log('touch start: ' + e.pageX + ', ' + e.pageY);
        }
        e.preventDefault()
    },
    onTouchMove: function(e) {
        if(debugEvents) {
            //console.log('touch move: ' + e.pageX + ', ' + e.pageY);
        }
        e.preventDefault()
    },
    onTouchCancel: function(e) {
        if(debugEvents) {
            //console.log('touch cancel: ' + e.pageX + ', ' + e.pageY);
        }
        e.preventDefault()
    },
    onTouchEnd: function(e) {
        if(debugEvents) {
            //console.log('touch end: ' + e.pageX + ', ' + e.pageY);
        }
        e.preventDefault();
    },
    onDragStart: function(e) {
        e.preventDefault();
        e.stopPropagation();
    },
    onMouseDown: function(e) {
        if (debugEvents) {
            console.log('mouse down: ' + e.pageX + ', ' + e.pageY);
        }

        this.mouseDown = true;
        this.mouseDownPosition = new Models.Point({x: e.pageX, y: e.pageY});
        this.scrollPositionOnMouseDown = new Models.Point({
            x: this.refs["scrollable"].getDOMNode().scrollLeft,
            y: this.refs["scrollable"].getDOMNode().scrollTop
        });

        if(this.props.paging) {
            this.scrollTo(this.scrollPositionOnMouseDown, false);
        }

        e.preventDefault();
    },
    onMouseMove: function(e) {
        if(this.mouseDown) {
            if(debugEvents) {
                console.log('mouse move: ' + e.pageX + ', ' + e.pageY);
            }

            var mouseDownOriginalPosition = this.mouseDownPosition;
            var currentScrollPosition = this.scrollPositionOnMouseDown;
            var deltaX = mouseDownOriginalPosition.x - e.pageX;
            var deltaY = mouseDownOriginalPosition.y - e.pageY;

            var x = 0;
            var y = 0;
            if(this.props.pagingDirection === "ScrollDirectionTypeVertical") {
                y =  currentScrollPosition.y + deltaY;
            } else { //horizontal
                x = currentScrollPosition.x + deltaX;
            }

            if(this.props.paging) { //only scroll if paging is enabled
                this.scrollTo(new Models.Point({
                    x: x,
                    y: y
                }), false);
            }
        }
        e.preventDefault();
    },
    onMouseUp: function(e) {
        var that = this;
        if (debugEvents) {
            console.log('mouse up: ' + e.pageX + ', ' + e.pageY);
        }

        this.mouseDown = false;
        this.mouseDownPosition = Models.Geometry.getPointZero();
        this.scrollPositionOnMouseDown = Models.Geometry.getPointZero();
        if (this.props.paging) {
            that.handlePaging(this.state.scrollPosition);
        }

        e.preventDefault();
    },
    onScroll: function(e) {
        if(this.state.animatingToScrollPosition || this.state.mouseDown) {
            return;
        }
        var scrollPosition = new Models.Point({x: e.target.scrollLeft, y: e.target.scrollTop});
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
        var rect = new Models.Rect({
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

                    CAAnimation.animateScroll(200, "linear", stepFunction, function (success) {
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
            this.setState({
                scrollPosition: toScrollPosition
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
            this.scrollTo(new Models.Point({
                x: 0,
                y: (page) * this.props.frame.size.height
            }), true);
        } else { //Horizontal
            var remainder = scrollPosition.x % this.props.frame.size.width;
            var page = Math.floor(scrollPosition.x / this.props.frame.size.width);
            if (remainder > this.props.frame.size.width / 2) {
                page++;
            }
            this.scrollTo(new Models.Point({
                x: (page) * this.props.frame.size.width,
                y: 0
            }), true);
        }
    }
});

module.exports = ScrollView;