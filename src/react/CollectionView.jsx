/** @jsx React.DOM */
var React = require('react/addons');
var t = require('tcomb');
var tReact = require('tcomb-react');

var CollectionViewDatasource = require('./Datasource/CollectionViewDatasource');
var CollectionViewDelegate = require('./CollectionViewDelegate');
var CollectionViewLayout = require('./Layout/CollectionViewLayout');
var CollectionViewLayoutAttributes = require('./Layout/CollectionViewLayoutAttributes');
var ScrollViewDelegate = require('./ScrollView/ScrollViewDelegate');

var Models = require('./Model/Models');
var Enums = require('./Enums/Enums');
var props = t.struct({
    collectionViewDatasource: CollectionViewDatasource.Protocol,
    frame: Models.Rect,
    collectionViewDelegate: CollectionViewDelegate.Protocol,
    collectionViewLayout: CollectionViewLayout.Protocol,
    scrollViewDelegate: t.maybe(ScrollViewDelegate.Protocol),
    preloadPageCount: t.maybe(t.Num),
    invalidateLayout: t.maybe(t.Bool),
    resetScroll: t.maybe(t.Bool),

    //insertItemsAtIndexPaths: t.maybe(t.Arr(Models.IndexPath)),
    moveItemAtIndexPathToIndexPath: t.maybe(t.struct({
        currentIndexPath: Models.IndexPath,
        newIndexPath: Models.IndexPath
    })),
    //deleteItemsAtIndexPaths: t.maybe(t.Arr(Models.IndexPath)),

    allowsSelection: t.maybe(t.Bool),
    allowsMultipleSelection: t.maybe(t.Bool),
    selectItemAtIndexPath: t.maybe(t.struct({
        indexPath: Models.IndexPath,
        animated: t.Bool,
        scrollPositionType: Enums.ScrollPositionType
    })),
    deselectItemAtIndexPath: t.maybe(t.struct({
        indexPath: Models.IndexPath,
        animated: t.Bool
    })),

    scrollToItemAtIndexPath: t.maybe(t.struct({
        indexPath: Models.IndexPath,
        animated: t.Bool,
        scrollPositionType: Enums.ScrollPositionType
    }))


}, 'CollectionViewProps');

var scrollInterval = 150;
var debugScroll = false;

var CollectionView = React.createClass({
    propTypes: tReact.react.toPropTypes(props),
    getInitialState: function() {
        return {
            scrollPosition: Models.Geometry.getPointZero(),
            collectionViewContentSize: Models.Geometry.getSizeZero(),
            scrollTimeout: undefined,
            isScrolling: false,
            currentLoadedRect: Models.Geometry.getRectZero(),
            defaultBlockSize: Models.Geometry.getSizeZero(),
            frame: Models.Geometry.getRectZero(),
            layoutAttributes: []
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
        if (this.props.scrollViewDelegate) {
            console.log('isTypeSafe<-->ScrollViewDelegate: ' + ScrollViewDelegate.Protocol.is(this.props.scrollViewDelegate));
        }

        var defaultBlockSize = this.props.frame.size;
        var currentLoadedRect = this.getRectForScrollPosition(Models.Geometry.getPointZero(), defaultBlockSize);
        var layoutAttributes = this.props.collectionViewLayout.layoutAttributesForElementsInRect(currentLoadedRect);

        var self = this;
        console.log('preparingLayout');
        this.props.collectionViewLayout.prepareLayout.call(this, function(success) {
            var contentSize = self.props.collectionViewLayout.getCollectionViewContentSize.call(self, null);
            if (contentSize && contentSize.height && contentSize.width) {

            } else {
                contentSize = Models.Geometry.getSizeZero();
            }

            self.setState({collectionViewContentSize: contentSize,
                currentLoadedRect: currentLoadedRect,
                defaultBlockSize: defaultBlockSize,
                currentLoadedRect: currentLoadedRect,
                layoutAttributes: layoutAttributes,
                scrollPosition: Models.Geometry.getPointZero(),
                collectionViewContentSize: contentSize});
            self.setStateFromScrollPosition(Models.Geometry.getPointZero(), true);
            console.log('prepareLayout completed');
        });
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        var newScrollPosition = nextState.scrollPosition;
        var oldScrollPosition = this.state.scrollPosition;
        var newLayouts = nextState.layoutAttributes;
        var oldLayouts = this.state.layoutAttributes;
        var newLoadedRect = nextState.currentLoadedRect;
        var oldLoadedRect = this.state.currentLoadedRect;
        var oldContentSize = this.state.collectionViewContentSize;
        var newContentSize = nextState.collectionViewContentSize;
        var oldIsScrolling = this.state.isScrolling;
        var newIsScrolling = nextState.isScrolling;

        var shouldUpdate = false;
        if (nextProps && nextProps.invalidateLayout && nextProps.collectionViewLayout) {
            shouldUpdate = true;
            nextProps.invalidateLayout = false; //Important or welcome to infinite drive

            var self = this;
            console.log('preparingLayout');
            nextProps.collectionViewLayout.prepareLayout.call(this, function (success) {
                var scrollPostion = self.state.scrollPosition;

                var resetScroll = nextProps.resetScroll;
                if(resetScroll) {
                    self.refs["scrollable"].getDOMNode().scrollTop = 0;
                    self.refs["scrollable"].getDOMNode().scrollLeft = 0;
                    scrollPostion = Models.Geometry.getPointZero();
                    nextProps.resetScroll = false;
                }
                var newRect = self.getRectForScrollPosition(scrollPostion);
                var layoutAttributes = nextProps.collectionViewLayout.layoutAttributesForElementsInRect(newRect);
                var collectionViewContentSize = nextProps.collectionViewLayout.getCollectionViewContentSize(null);

                if(resetScroll) {
                    self.setState({
                        scrollPosition: scrollPostion,
                        currentLoadedRect: newRect,
                        layoutAttributes: layoutAttributes,
                        collectionViewContentSize: collectionViewContentSize
                    });
                } else { //don't set the scrollPosition if not reseting as might not be valid anymore
                    self.setState({
                        currentLoadedRect: newRect,
                        layoutAttributes: layoutAttributes,
                        collectionViewContentSize: collectionViewContentSize
                    });
                }
                self.forceUpdate();
                console.log('prepareLayout completed');
            });
        } else if(nextProps && nextProps.forceUpdate) {
            shouldUpdate = true;
        }else if (oldLayouts == null && newLayouts != null) {
            shouldUpdate = true;
        } else if (Models.Geometry.isSizeZero(oldContentSize) || oldContentSize.width != newContentSize.width || oldContentSize.height != newContentSize.height) {
            shouldUpdate = true;
        } else if(newLayouts && newLayouts.length != oldLayouts.length) {
            shouldUpdate = true;
        } else if (!oldLoadedRect || !oldLoadedRect.size) {
            shouldUpdate = true;
        } else if (oldLoadedRect.origin.x != newLoadedRect.origin.x) {
            shouldUpdate = true;
        } else if(oldLoadedRect.origin.y != newLoadedRect.origin.y) {
            shouldUpdate = true;
        } else if(oldIsScrolling && !newIsScrolling) {
            //shouldUpdate = true;
        }

        if(debugScroll) {
            console.log('new scrollPosition: ' + JSON.stringify(newScrollPosition, null) + ", old scrollPosition: " + JSON.stringify(oldScrollPosition, null));
            console.log('will update: ' + shouldUpdate);
        }
        return shouldUpdate;
    },
    render: function() {
        var frame = this.props.frame;

        var children = [];
        var layoutAttributes = this.state.layoutAttributes;
        for(var i = 0; i < layoutAttributes.length; i++) {
            var attributes = layoutAttributes[i];
            var category = attributes.representedElementCategory.call(this, null);
            //console.log(category);
            if(category == "CollectionElementTypeSupplementaryView") {
                var kind = attributes.representedElementKind.call(this, null);
                var view = this.props.collectionViewDatasource.viewForSupplementaryElementOfKind.call(this, kind, attributes.indexPath);
                view.applyLayoutAttributes(attributes);
                var ViewContent = view.getContentView();
                children.push(<ViewContent/>);
            } else { //for now default to cell
                var cell = this.props.collectionViewDatasource.cellForItemAtIndexPath(attributes.indexPath);
                cell.applyLayoutAttributes(attributes);
                var CellContentView = cell.getContentView();
                children.push(<CellContentView/>);
            }
        }

        if(children.length == 0) {
            children.push(<div></div>);
        }

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

        var contentSize = this.state.collectionViewContentSize;
        if(!contentSize) {
            contentSize = new Models.Size({height:0, width:0});
        }
        var wrapperStyle = {
            width:contentSize.width,
            height:contentSize.height
        };

        return (
        <div className={this.props.className ? this.props.className + '-container' : 'scroll-container'}
            ref="scrollable"
            style={scrollableStyle}
            onScroll={this.onScroll}>
            <div ref="smoothScrollingWrapper" style={wrapperStyle}>
                {children}
            </div>
        </div>
        )
    },
    getRectForScrollPosition: function(scrollPosition, overrideDefaultBlockSize) {
        var defaultBlockSize = overrideDefaultBlockSize;
        if(!defaultBlockSize) {
            defaultBlockSize = this.state.defaultBlockSize;
        }

        var preloadPageCount = this.getPreloadPageCount();

        var currentY = scrollPosition.y - defaultBlockSize.height*preloadPageCount;
        var currentBottom = scrollPosition.y + defaultBlockSize.height*(preloadPageCount + 1);
        if(currentY < 0) {
            currentY = 0;
        }
        var height = Math.max(currentBottom - currentY, 0);

        var currentX = scrollPosition.x - defaultBlockSize.width*preloadPageCount;
        var currentRight = scrollPosition.x + defaultBlockSize.width*(preloadPageCount + 1);
        if(currentX < 0) {
            currentX = 0;
        }
        var width = Math.max(currentRight - currentX, 0);

        var rect = new Models.Rect({
            origin: new Models.Point({x: currentX, y: currentY}),
            size: new Models.Size({width: width, height: height})
        });

        return rect;
    },
    shouldRedrawFromScrolling: function(previousScrollPosition, newScrollPosition, previousLoadedRect, newLoadedRect) {
        var frame = this.props.frame;
        var preloadPageCount = this.getPreloadPageCount();

        var isScrollUp = newScrollPosition.y < previousScrollPosition.y;
        var isScrollDown = newScrollPosition.y > previousScrollPosition.y;
        var isScrollLeft = newScrollPosition.x < previousScrollPosition.x;
        var isScrollRight = newScrollPosition.x > previousScrollPosition.x;
        var scrollUpThreshold = previousLoadedRect.origin.y + frame.size.height*preloadPageCount;
        var scrollDownThreshold = Models.Geometry.rectGetMaxY(previousLoadedRect) - frame.size.height*preloadPageCount;
        var scrollLeftThreshold = previousLoadedRect.origin.x + frame.size.width;
        var scrollRightThreshold = Models.Geometry.rectGetMaxX(previousLoadedRect) - frame.size.width*preloadPageCount;

        var redraw = false;
        if(isScrollUp && newScrollPosition.y < scrollUpThreshold) {
            redraw = true;
        } else if(isScrollDown && newScrollPosition.y > scrollDownThreshold) {
            redraw = true;
        } else if(isScrollLeft && newScrollPosition.x < scrollLeftThreshold) {
            redraw = true;
        } else if(isScrollRight && newScrollPosition.x > scrollRightThreshold) {
            redraw = true;
        }

        return redraw;
    },
    onScroll: function(e) {
        var scrollPosition = new Models.Point({x: e.target.scrollLeft, y: e.target.scrollTop});
        if(this.props.scrollViewDelegate != null && this.props.scrollViewDelegate.scrollViewDidScroll != null) {
            this.props.scrollViewDelegate.scrollViewDidScroll(scrollPosition);
        }
        this.handleScroll(scrollPosition);
    },
    handleScroll: function(scrollPosition) {
        var that = this;
        this.manageScrollTimeouts();
        this.setStateFromScrollPosition(scrollPosition);
    },
    manageScrollTimeouts: function() {
        if (this.state.scrollTimeout) {
            clearTimeout(this.state.scrollTimeout);
        }

        var that = this,
            scrollTimeout = setTimeout(function() {
                //that.setStateFromScrollPosition(that.state.scrollPosition, true);
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
    setStateFromScrollPosition: function(scrollPosition, force) {
        var newRect = this.getRectForScrollPosition(scrollPosition);
        var previousLoadedRect = this.state.currentLoadedRect;
        var previousScrollPosition = this.state.scrollPosition;

        var redraw = this.shouldRedrawFromScrolling(previousScrollPosition, scrollPosition, previousLoadedRect, newRect);
        if(redraw || force) {
            var layoutAttributes = this.props.collectionViewLayout.layoutAttributesForElementsInRect(newRect);
            var collectionViewContentSize = this.props.collectionViewLayout.getCollectionViewContentSize(null);
            this.setState({
                scrollPosition: scrollPosition,
                currentLoadedRect: newRect,
                layoutAttributes: layoutAttributes,
                collectionViewContentSize: collectionViewContentSize
            });
        } else { //just update scroll position
            this.setState({
                scrollPosition: scrollPosition
            });
        }
    },
    setStateForRect: function(rect) {
        var newRect = rect;
        var layoutAttributes = this.props.collectionViewLayout.layoutAttributesForElementsInRect(rect);
        var collectionViewContentSize = this.props.collectionViewLayout.getCollectionViewContentSize(null);
        this.setState({
            currentLoadedRect: newRect,
            layoutAttributes: layoutAttributes,
            collectionViewContentSize: collectionViewContentSize
        });
    },
    getPreloadPageCount: function() {
        var preloadPageCount = this.props.preloadPageCount;
        if(!preloadPageCount) {
            preloadPageCount = 1.0; //per direction
        }

        return preloadPageCount;
    }
});

module.exports.View = CollectionView;