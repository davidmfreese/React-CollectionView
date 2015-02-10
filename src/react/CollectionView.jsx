/** @jsx React.DOM */
var React = require('react/addons');
var t = require('tcomb');
var tReact = require('tcomb-react');

var CollectionViewDatasource = require('./Datasource/CollectionViewDatasource');
var CollectionViewDelegate = require('./CollectionViewDelegate');
var CollectionViewLayout = require('./Layout/CollectionViewLayout');
var CollectionViewLayoutAttributes = require('./Layout/CollectionViewLayoutAttributes');
var Models = require('./Model/Models');

var props = t.struct({
    collectionViewDatasource: CollectionViewDatasource.Protocol,
    frame: Models.Rect,
    collectionViewDelegate: CollectionViewDelegate.Protocol,
    collectionViewLayout: CollectionViewLayout.Protocol
}, 'CollectionViewProps');

var scrollInterval = 150;
var debugScroll = false;

var CollectionView = React.createClass({
    propTypes: tReact.react.toPropTypes(props),
    getInitialState: function() {
        return {
            scrollTop: 0,
            collectionViewContentSize: Models.Geometry.getSizeZero(),
            scrollTimeout: undefined,
            isScrolling: false,
            currentLoadedRect: Models.Geometry.getRectZero(),
            defaultBlockSize: Models.Geometry.getSizeZero()
        };
    },
    componentDidMount: function() {
        console.log('isTypeSafe<-->CollectionViewDatasource: ' + CollectionViewDatasource.Protocol.is(this.props.collectionViewDatasource));
        if (this.props.frame) {
            console.log('isTypeSafe<-->Frame: ' + Models.Rect.is(this.props.frame));
        }
        if (this.props.collectionViewDelegate) {
            console.log('isTypeSafe<-->CollectionViewDelegate: ' + CollectionViewDelegate.Protocol.is(this.props.collectionViewDelegate));
        }
        if (this.props.collectionViewLayout) {
            console.log('isTypeSafe<-->CollectionViewLayout: ' + CollectionViewLayout.Protocol.is(this.props.collectionViewLayout));
        }

        this.props.collectionViewLayout.prepareLayout.call(this, null);
        var contentSize = this.props.collectionViewLayout.getCollectionViewContentSize.call(this, null);
        if (contentSize && contentSize.height && contentSize.width) {

        } else {
            contentSize = Models.Geometry.getSizeZero();
        }

        var defaultBlockSize = this.props.frame.size;
        var currentLoadedRect = this.getRectForScrollTop(0, defaultBlockSize);

        this.setState({collectionViewContentSize: contentSize, currentLoadedRect: currentLoadedRect, defaultBlockSize: defaultBlockSize});

    },
    shouldComponentUpdate: function(nextProps, nextState) {
        //TODO: this should reload `blocks`...
        //TODO: I think we need to check Props here too not just state

        var newScrollTop = nextState.scrollTop;

        var currentScrollTop = this.state.scrollTop;
        var currentLoadedRect = this.state.currentLoadedRect;

        var isScrollUp = newScrollTop < currentScrollTop;

        var frame = this.props.frame;
        var threshold = Math.max(frame.size.height/2);


        var shouldUpdate = false;
        if(!currentLoadedRect || !currentLoadedRect.size) {
            shouldUpdate = true;
        }
        else if(!isScrollUp && newScrollTop > currentLoadedRect.origin.y + currentLoadedRect.size.height - frame.size.height*3 - threshold ) {
            shouldUpdate = true;
        } else if(isScrollUp && newScrollTop < currentLoadedRect.origin.y + frame.size.height + threshold) {
            shouldUpdate = true;
        }

        if(debugScroll) {
            console.log('new scrollTop: ' + newScrollTop + ", old scrollTop: " + currentScrollTop);
            console.log('will update: ' + shouldUpdate);
        }
        return shouldUpdate;
    },
    render: function() {
        var frame = this.props.frame;
        var rect = this.state.currentLoadedRect;

        //TODO:  Should this be moved out of the render function??  check perf
        var children = [];
        var layoutAttributes = this.props.collectionViewLayout.layoutAttributesForElementsInRect(rect);
        for(var i = 0; i < layoutAttributes.length; i++) {
            var attributes = layoutAttributes[i];
            var style = {
                position: "absolute",
                top: attributes.frame.origin.y,
                left: attributes.frame.origin.x,
                height:attributes.frame.size.height,
                width: attributes.frame.size.width
            };

            var Cell = this.props.collectionViewDatasource.cellForItemAtIndexPath(attributes.indexPath).getContentView();
            children.push(<div style={style}><Cell/></div>);
        }

        if(children.length == 0) {
            children.push(<div></div>);
        }

        var scrollableStyle = {
            height: frame.size.height,
            width: frame.size.width,
            overflowX: 'hidden',
            overflowY: 'scroll',
            position: 'absolute'
        }

        var clearStyle = {
            clear:"both"
        }

        var contentSize = this.state.collectionViewContentSize;
        if(!contentSize) {
            contentSize = new Models.Size({height:0, width:0});
        }
        var wrapperStyle = {
            width:frame.size.width,
            height:contentSize.height
        }

        return (
        <div className={this.props.className ? this.props.className + '-container' : 'scroll-container'}
            ref="scrollable"
            style={scrollableStyle}
            onScroll={this.onScroll}>
            <div ref="smoothScrollingWrapper" onScroll={this.onScroll} style={wrapperStyle}>
                {children}
            </div>
        </div>
        )
    },
    getRectForScrollTop: function(scrollTop, overrideDefaultBlockSize) {
        var defaultBlockSize = overrideDefaultBlockSize;
        if(!defaultBlockSize) {
            defaultBlockSize = this.state.defaultBlockSize;
        }

        var currentY = scrollTop - defaultBlockSize.height;
        var currentX = 0;
        var currentBottom = currentY + defaultBlockSize.height*3;

        if(currentY < 0) {
            currentY = 0;
        }
        var height = Math.max(currentBottom - currentY, 0);

        var rect = new Models.Rect({
            origin: new Models.Point({x: currentX, y: currentY}),
            size: new Models.Size({width: defaultBlockSize.width, height: height})
        });

        return rect;
    },
    onScroll: function(e) {
        this.handleScroll(e.target.scrollTop);
    },
    handleScroll: function(scrollTop) {
        var that = this;
        this.manageScrollTimeouts();
        this.setStateFromScrollTop(scrollTop);
    },
    nearBottom: function(scrollTop) {
        //This will be implemented to check if near bottom (and signal load more if necessary)
    },
    manageScrollTimeouts: function() {
        if (this.state.scrollTimeout) {
            clearTimeout(this.state.scrollTimeout);
        }

        var that = this,
            scrollTimeout = setTimeout(function() {
                that.setState({
                    isScrolling: false,
                    scrollTimeout: undefined
                })
            }, scrollInterval);

        this.setState({
            isScrolling: true,
            scrollTimeout: scrollTimeout
        });
    },
    setStateFromScrollTop: function(scrollTop) {
        var currentLoadedRect = this.getRectForScrollTop(scrollTop);
        this.setState({
            scrollTop: scrollTop,
            currentLoadedRect: currentLoadedRect
        });
    }
});

module.exports.View = CollectionView;