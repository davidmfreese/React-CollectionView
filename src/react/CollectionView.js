/** @jsx React.DOM */
var React = require('react/addons');
var t = require('tcomb-validation');
var tReact = require('tcomb-react');

var CollectionViewDatasource = require('./Datasource/CollectionViewDatasource');
var CollectionViewDelegate = require('./CollectionViewDelegate');
var CollectionViewLayout = require('./Layout/CollectionViewLayout');
var ScrollViewDelegate = require('./ScrollView/ScrollViewDelegate');
var ScrollView = require('./ScrollView/ScrollView');
var Enums = require('./Enums/Enums');
var Utils = require('./Utils/Utils');

var Geometry = require('JSCoreGraphics').CoreGraphics.Geometry;
var Foundation = require('JSCoreGraphics').Foundation;

var collectionViewProps = t.struct({
    collectionViewDatasource: CollectionViewDatasource.Protocol,
    frame: Geometry.DataTypes.Rect,
    collectionViewDelegate: CollectionViewDelegate.Protocol,
    collectionViewLayout: CollectionViewLayout.Protocol,
    scrollViewDelegate: t.maybe(ScrollViewDelegate.Protocol),
    preloadPageCount: t.maybe(t.Num),
    invalidateLayout: t.maybe(t.Bool),
    resetScroll: t.maybe(t.Bool),
    paging: t.maybe(t.Bool),
    pagingDirection: t.maybe(Enums.ScrollDirectionType),

    insertItemsAtIndexPaths: t.maybe(t.list(Foundation.DataTypes.IndexPath)),
    moveItemAtIndexPathToIndexPath: t.maybe(t.struct({
        currentIndexPath: Foundation.DataTypes.IndexPath,
        newIndexPath: Foundation.DataTypes.IndexPath
    })),
    deleteItemsAtIndexPaths: t.maybe(t.list(Foundation.DataTypes.IndexPath)),

    allowsSelection: t.maybe(t.Bool),
    allowsMultipleSelection: t.maybe(t.Bool),
    selectItemAtIndexPath: t.maybe(t.struct({
        indexPath: Foundation.DataTypes.IndexPath,
        animated: t.Bool,
        scrollPositionType: Enums.ScrollPositionType
    })),
    deselectItemAtIndexPath: t.maybe(t.struct({
        indexPath: Foundation.DataTypes.IndexPath,
        animated: t.Bool
    })),

    scrollToItemAtIndexPath: t.maybe(t.struct({
        indexPath: Foundation.DataTypes.IndexPath,
        animated: t.Bool,
        scrollPositionType: Enums.ScrollPositionType
    }))


}, 'CollectionViewProps');

var scrollDirType = {
    None: 0,
    Left: 1,
    Up: 2,
    Right: 3,
    Down: 4
};

var debugScroll = Utils.Query.getQueryParamValue(document.location.search, 'debugScroll');

var CollectionView = React.createClass({
    propTypes: tReact.react.toPropTypes(collectionViewProps),
    getInitialState: function() {
        return {
            collectionViewContentSize: Geometry.Constants.sizeZero,
            currentLoadedRect: Geometry.Constants.rectZero,
            defaultBlockSize: Geometry.Constants.sizeZero,
            frame: Geometry.Constants.rectZero,
            layoutAttributes: []
        };
    },
    componentDidMount: function() {
        console.log('isTypeSafe<-->CollectionViewDatasource: ' + CollectionViewDatasource.Protocol.is(this.props.collectionViewDatasource));
        if (this.props.frame) {
            console.log('isTypeSafe<-->Frame: ' + Geometry.DataTypes.Rect.is(this.props.frame));
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
        var currentLoadedRect = this.getRectForScrollPosition(Geometry.Constants.pointZero, defaultBlockSize);
        var layoutAttributes = this.props.collectionViewLayout.layoutAttributesForElementsInRect(currentLoadedRect);

        var self = this;
        console.log('preparingLayout');
        this.props.collectionViewLayout.prepareLayout.call(this, function(success) {
            var contentSize = self.props.collectionViewLayout.getCollectionViewContentSize.call(self, null);
            if (contentSize && contentSize.height && contentSize.width) {

            } else {
                contentSize = Geometry.Constants.sizeZero;
            }

            self.setState({collectionViewContentSize: contentSize,
                currentLoadedRect: currentLoadedRect,
                defaultBlockSize: defaultBlockSize,
                currentLoadedRect: currentLoadedRect,
                layoutAttributes: layoutAttributes,
                collectionViewContentSize: contentSize});
            self.setStateFromScrollPosition(Geometry.Constants.pointZero, true);
            console.log('prepareLayout completed');
        });
    },
    shouldComponentUpdate: function(nextProps, nextState) {
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
                var scrollPostion = self.refs["scrollView"].state.scrollPosition;

                var resetScroll = nextProps.resetScroll;
                if(resetScroll) {
                    scrollPostion = Geometry.Constants.pointZero;
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
        } else if (oldContentSize.width != newContentSize.width || oldContentSize.height != newContentSize.height) {
            shouldUpdate = true;
        } else if(newLayouts && newLayouts.length != oldLayouts.length) {
            shouldUpdate = true;
        } else if (!oldLoadedRect || !oldLoadedRect.size) {
            shouldUpdate = true;
        } else if (oldLoadedRect.origin.x != newLoadedRect.origin.x) {
            shouldUpdate = true;
        } else if(oldLoadedRect.origin.y != newLoadedRect.origin.y) {
            shouldUpdate = true;
        } else if(this.refs["scrollView"].state.animatingToScrollPosition) {
            shouldUpdate = false;
        }

        return shouldUpdate;
    },
    render: function() {
        var children = [];
        var layoutAttributes = this.state.layoutAttributes;
        for(var i = 0; i < layoutAttributes.length; i++) {
            var attributes = layoutAttributes[i];
            var category = attributes.representedElementCategory.call(this, null);
            if(category == "CollectionElementTypeSupplementaryView") {
                var kind = attributes.representedElementKind.call(this, null);
                var view = this.props.collectionViewDatasource.viewForSupplementaryElementOfKind.call(this, kind, attributes.indexPath);
                view.applyLayoutAttributes(attributes);
                var ViewContent = view.getContentView();
                children.push(ViewContent);
            } else { //for now default to cell
                var cell = this.props.collectionViewDatasource.cellForItemAtIndexPath(attributes.indexPath);
                cell.applyLayoutAttributes(attributes);
                var CellContentView = cell.getContentView();
                children.push(CellContentView);
            }
        }

        if(children.length == 0) {
            children.push(React.DOM.div());
        }
        var that = this;
        var scrollViewProps = {
            ref: "scrollView",
            content: children,
            scrollViewDelegate: that,
            frame: this.props.frame,
            contentSize: this.state.collectionViewContentSize,
            scrollTimeout: 100,
            shouldUpdate: true,
            paging: this.props.paging ? this.props.paging : false,
            pagingDirection: this.props.pagingDirection ? this.props.pagingDirection : "ScrollDirectionTypeHorizontal",
            debugScroll: debugScroll
        };

        return React.createElement(ScrollView, scrollViewProps);

    },

    scrollViewDidScroll: function(scrollPosition) {
        if(this.props.scrollViewDelegate != null && this.props.scrollViewDelegate.scrollViewDidScroll != null) {
            this.props.scrollViewDelegate.scrollViewDidScroll(scrollPosition);
        }
        this.handleScroll(scrollPosition);
    },
    scrollViewDidScrollToTop: function(scrollView) {
        if(this.props.scrollViewDelegate && this.props.scrollViewDelegate.scrollViewDidScrollToTop) {
            this.props.scrollViewDelegate.scrollViewDidScrollToTop(scrollView);
        }
    },
    scrollViewDidEndScrollingAnimation: function(scrollView) {
        var scrollPosition = this.refs["scrollView"].state.scrollPosition;
        if(this.props.scrollViewDelegate && this.props.scrollViewDelegate.scrollViewDidEndScrollingAnimation) {
            this.props.scrollViewDelegate.scrollViewDidEndScrollingAnimation(scrollView);
        }

        this.setStateFromScrollPosition(scrollPosition, true);
    },
    scrollViewDidEndDecelerating: function(scrollView) {
        if(this.props.scrollViewDelegate && this.props.scrollViewDelegate.scrollViewDidEndDecelerating) {
            this.props.scrollViewDelegate.scrollViewDidEndDecelerating(scrollView);
        }

        if(this.props.paging) { //paging handled by scrollview
            return;
        }

        var scrollPosition = scrollView.state.scrollPosition;
        var collectionViewLayout = this.props.collectionViewLayout;
        if(collectionViewLayout.targetContentOffsetForProposedContentOffset) {
            var contentOffset = collectionViewLayout.targetContentOffsetForProposedContentOffset(scrollPosition);
            if(contentOffset && (contentOffset.x != scrollPosition.x || contentOffset.y != scrollPosition.y)) {
                scrollView.scrollTo(contentOffset, true);
            }
        }
        //var contentOffset = new Geometry.DataTypes.Point({x: scrollPosition.x, y: scrollPosition.y - 200}); that.scrollTo(contentOffset, true);
    },

    handleScroll: function(scrollPosition) {
        this.setStateFromScrollPosition(scrollPosition);
    },
    setStateFromScrollPosition: function(scrollPosition, force) {
        var newRect = this.getRectForScrollPosition(scrollPosition);
        var previousLoadedRect = this.state.currentLoadedRect;
        var scrollDirections = this.refs["scrollView"].state.scrollDirections;
        var redraw = this.shouldRedrawFromScrolling(scrollDirections, scrollPosition, previousLoadedRect, newRect);
        if(redraw || force) {
            var layoutAttributes = this.props.collectionViewLayout.layoutAttributesForElementsInRect(newRect);
            var collectionViewContentSize = this.props.collectionViewLayout.getCollectionViewContentSize(null);
            this.setState({
                currentLoadedRect: newRect,
                layoutAttributes: layoutAttributes,
                collectionViewContentSize: collectionViewContentSize
            });
        }
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

        var rect = new Geometry.DataTypes.Rect({
            origin: new Geometry.DataTypes.Point({x: currentX, y: currentY}),
            size: new Geometry.DataTypes.Size({width: width, height: height})
        });

        return rect;
    },
    shouldRedrawFromScrolling: function(scrollDirections, scrollPosition, previousLoadedRect, newLoadedRect) {
        var frame = this.props.frame;
        var preloadPageCount = this.getPreloadPageCount();
        var scrollUpThreshold = previousLoadedRect.origin.y + frame.size.height*preloadPageCount;
        var scrollDownThreshold = Geometry.rectGetMaxY(previousLoadedRect) - frame.size.height*preloadPageCount;
        var scrollLeftThreshold = previousLoadedRect.origin.x + frame.size.width;
        var scrollRightThreshold = Geometry.rectGetMaxX(previousLoadedRect) - frame.size.width*preloadPageCount;

        var redraw = false;
        if(scrollDirections.indexOf(scrollDirType.Up) != -1 && scrollPosition.y < scrollUpThreshold) {
            redraw = true;
        } else if(scrollDirections.indexOf(scrollDirType.Down) != -1  && scrollPosition.y > scrollDownThreshold) {
            redraw = true;
        } else if(scrollDirections.indexOf(scrollDirType.Left) != -1  && scrollPosition.x < scrollLeftThreshold) {
            redraw = true;
        } else if(scrollDirections.indexOf(scrollDirType.Right) != -1  && scrollPosition.x > scrollRightThreshold) {
            redraw = true;
        }

        return redraw;
    },
    getPreloadPageCount: function() {
        var preloadPageCount = this.props.preloadPageCount;
        if(!preloadPageCount) {
            preloadPageCount = 1.0; //per direction
        }

        return preloadPageCount;
    },
    indexPathsForVisibleItems: function() {
        var currentLayoutAttributes = this.state.layoutAttributes;
        var frame = this.props.frame;
        var scrollPosition = this.refs["scrollView"].state.scrollPosition;
        var origin = new Geometry.DataTypes.Point({
            x: scrollPosition.x,
            y: scrollPosition.y
        });
        var currentView = new Geometry.DataTypes.Rect({
            origin: origin,
            size: frame.size
        });

        var indexPathsForVisibleItemsArray = [];
        for(var i = 0; i < currentLayoutAttributes.length; i++) {
            var attributes = currentLayoutAttributes[i];
            if(Geometry.rectIntersectsRect(currentView, attributes.frame)) {
                indexPathsForVisibleItemsArray.push(attributes);
            } else if(Geometry.rectIntersectsRect(attributes.frame, currentView)) {
                indexPathsForVisibleItemsArray.push(attributes);
            }
        }

        if(debugScroll) {
            console.log(JSON.stringify(indexPathsForVisibleItemsArray, null, 4));
        }

        return indexPathsForVisibleItemsArray;
    }
});

module.exports.View = CollectionView;