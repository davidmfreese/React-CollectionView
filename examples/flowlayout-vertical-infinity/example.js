var rCV = ReactCollectionView;
var React = rCV.React;

var Models = rCV.JSCoreGraphics.CoreGraphics.Geometry.DataTypes;
var EdgeInsets = rCV.JSCoreGraphics.Kit.DataTypes.EdgeInsets;

var exampleUtils = exampleUtils();
var sizes = exampleUtils.getCollectionViewSizes(false);
var collectionViewSize = new Models.Size({height: sizes.window.height, width:sizes.window.width});
var cellSize = new Models.Size({height: sizes.cellSize.height, width: sizes.cellSize.width});

//Data
var allData = [];
for(var i = 1; i <= 10000; i++) {
    allData.push("Item: " + i);
}
var datasource = allData.slice(0, 99);

var loadMoreInterval = null;
function loadMoreData(batchSize){
    if(loadMoreInterval) {
        return;
    }
    loadMoreInterval = setInterval(function(){
        var currentIndex = datasource.length;
        currentIndex++;
        var end = currentIndex + batchSize;
        for(var i = currentIndex; i < end && i < allData.length; i++) {
            datasource.push(allData[i]);
        }

        clearInterval(loadMoreInterval);
        loadMoreInterval = null;
        invalidateLayout();
    }, 500);
}

var insets = new EdgeInsets({top:0, left:0, bottom:0, right:0});

var frame = new Models.Rect({
    origin: new Models.Point({x:0, y:0}),
    size: collectionViewSize
});

function getProps() {
    var datasourceDelegate = new rCV.CollectionViewDatasource.Protocol({
        numberItemsInSection: function(indexPath) { return datasource.length; },
        numberOfSectionsInCollectionView: function() { return 1; },
        cellForItemAtIndexPath: function(indexPath) {
            var cell = new SimpleCellFactory(datasource[indexPath.row]);
            return cell;
        }
    });

    var layoutDelegate = new rCV.CollectionViewLayoutDelegate.Protocol({
        numberItemsInSection: function(indexPath) { return datasource.length; },
        numberOfSectionsInCollectionView: function() { return 1; },
        sizeForItemAtIndexPath: function(indexPath) { return itemSize; },
        insetForSectionAtIndex: function(indexPath) { return insets; },
        minimumLineSpacingForSectionAtIndex: function(indexPath) { return 0; },
        shouldSelectItemAtIndexPath: function(indexPath) { return false; }
    });

    var infinityLoadMoreBuffer = collectionViewSize.height*1.5;
    var previousScrollPosition = new Models.Point({x: 0, y: 0});
    var scrollViewDelegate = new rCV.ScrollViewDelegate({
        scrollViewDidScroll: function (scrollPosition) {
            var scrollTop = scrollPosition.y;
            var bottomOfContent = flowLayout.getCollectionViewContentSize.call(this, null);
            if (scrollTop > previousScrollPosition.y && scrollTop + infinityLoadMoreBuffer + collectionViewSize.height > bottomOfContent.height) {
                if (!loadMoreInterval) {
                    loadMoreData(33);
                }
            }

            previousScrollPosition = scrollPosition;
        }
    });

    var collectionViewDelegate = new rCV.CollectionViewDelegate.Protocol({
        shouldSelectItemAtIndexPath: function (indexPath) { return false; },
        didSelectItemAtIndexPath: function (indexPath) { },
        shouldDeselectItemAtIndexPath: function (indexPath) { return false; },
        shouldHighlightItemAtIndexPath: function (indexPath) { return false; },
        didHighlightItemAtIndexPath: function (indexPath) {},
        didUnhighlightItemAtIndexPath: function (indexPath) {},
        willDisplayCellForItemAtIndexPath: function (indexPath) {}
    });

    var flowLayoutOptions = {
        flowDirection: "ScrollDirectionTypeVertical",
        width: collectionViewSize.width,
        height: 0,
        minimumLineSpacing: 0,
        minimumInteritemSpacing: 0,
        itemSize: cellSize
    };
    var flowLayout = rCV.CollectionViewFlowLayout.Layout(layoutDelegate, flowLayoutOptions);

    var props = {
        collectionViewDatasource: datasourceDelegate,
        collectionViewDelegate: collectionViewDelegate,
        collectionViewLayout: flowLayout,
        scrollViewDelegate: scrollViewDelegate,
        flowLayout: flowLayout,
        frame: frame
    };

    return props;
}

var initialProps = getProps();
var collectionView = React.createElement(rCV.CollectionView.View, initialProps);
React.render(collectionView, document.getElementById('reactContainer'));

function invalidateLayout() {
    var newProps = getProps();
    newProps.invalidateLayout = true;
    collectionView = React.createElement(rCV.CollectionView.View, newProps);
    React.render(collectionView, document.getElementById('reactContainer'));
}

