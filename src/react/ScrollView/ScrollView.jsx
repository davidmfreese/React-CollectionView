var React = require('react/addons');
var t = require('tcomb');
var tReact = require('tcomb-react');

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

                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchCancel={this.onTouchCancel}
                onTouchEnd={this.onTouchEnd}
                onDragStart={this.onDragStart}
                onDrag={this.onDrag}
                onDragEnd={this.onDragEnd}
                onDragLeave={this.onDragLeave}>
                <div ref="smoothScrollingWrapper" style={wrapperStyle}>
                    {this.props.content}
                </div>
            </div>
        )
    },
    onTouchStart: function(e) {

    },
    onTouchMove: function(e) {

    },
    onTouchCancel: function(e) {

    },
    onTouchEnd: function(e) {

    },
    onDragStart: function(e) {

    },
    onDrag: function(e) {

    },
    onDragEnd: function(e) {

    },
    onDragLeave: function(e) {

    },
    onScroll: function(e) {
        if(this.state.animatingToScrollPosition) {
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

                    animate(200, stepFunction, function (success) {
                        if (that.props.scrollViewDelegate && that.props.scrollViewDelegate.scrollViewDidEndScrollingAnimation) {
                            that.props.scrollViewDelegate.scrollViewDidEndScrollingAnimation(this);
                        }

                        setTimeout(function () {
                            that.setState({
                                animatingToScrollPosition: false
                            });

                        }, 50);
                    });
                });
        } else {
            domElement.scrollTop = toScrollPosition.y;
            domElement.scrollLeft = toScrollPosition.x;
            this.setState({
                scrollPosition: toScrollPosition
            })
        }
    }
});

//TODO: better RAF implementation and seperate file
var _requestAnimationFrame = function(win, t) {
    return win["webkitR" + t] || win["r" + t] || win["mozR" + t]
        || win["msR" + t] || function(fn) { setTimeout(fn, 60) }
}(window, "requestAnimationFrame");

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

//taken from http://www.sitepoint.com/simple-animations-using-requestanimationframe/
function animate(duration, stepFunction, success) {
    var end = Date.now() + duration;
    var step = function() {

        var current = Date.now();
        var remaining = end - current;

        if(remaining < 16) {
            stepFunction(1);
            success('success');
            return;

        } else {
            var rate = 1 - remaining/duration;
            stepFunction(rate);
        }

        _requestAnimationFrame(step);
    }
    step();
}

module.exports = ScrollView;