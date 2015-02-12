var rCV = ReactCollectionView;
var React = rCV.React;

var collectionViewSize = new rCV.Models.Size({height: 500, width:360});
var cellSize = new rCV.Models.Size({height: 100, width:100});

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
    }, 1000);
}

var itemSize = new rCV.Models.Size({height:100, width:100});
var insets = new rCV.Models.EdgeInsets({top:10, left:10, bottom:10, right:10});

var frame = new rCV.Models.Rect({
    origin: new rCV.Models.Point({x:0, y:0}),
    size: new rCV.Models.Size({height:500, width:collectionViewSize.width})
});

function getProps() {
    var datasourceDelegate = new rCV.CollectionViewDatasource.Protocol({
        numberItemsInSection: function(indexPath) {
            return datasource.length;
        },
        numberOfSectionsInCollectionView: function() {
            return 1;
        },
        cellForItemAtIndexPath: function(indexPath) {
            var cell = new SimpleCellFactory(datasource[indexPath.row]);
            return cell;
        }
    });

    var layoutDelegate = new rCV.CollectionViewLayoutDelegate.Protocol({
        numberItemsInSection: function(indexPath) {
            return datasource.length;
        },
        numberOfSectionsInCollectionView: function() {
            return 1;
        },
        sizeForItemAtIndexPath: function(indexPath) {
            return itemSize;
        },
        insetForSectionAtIndex: function(indexPath) {
            return insets;
        },
        minimumLineSpacingForSectionAtIndex: function(indexPath) {
            return 0;
        },
        shouldSelectItemAtIndexPath: function(indexPath) {
            return false;
        }
    });

    var infinityLoadMoreBuffer = collectionViewSize.height/2;
    var previousScrollPosition = new rCV.Models.Point({x: 0, y: 0});
    var scrollViewDelegate = new rCV.ScrollViewDelegate.Protocol({
        "scrollViewDidScroll": function (scrollPosition) {
            var scrollTop = scrollPosition.y;
            var bottomOfContent = flowLayout.getCollectionViewContentSize.call(this, null);
            if (scrollTop > previousScrollPosition.y && scrollTop + infinityLoadMoreBuffer + collectionViewSize.height > bottomOfContent.height) {
                if (!loadMoreInterval) {
                    loadMoreData(33);
                }
            }
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
        minimumLineSpacing: 10,
        minimumInteritemSpacing: 10,
        itemSize: itemSize
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

