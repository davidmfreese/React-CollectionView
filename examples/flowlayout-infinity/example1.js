var rCV = ReactCollectionView;
var React = rCV.React;

var collectionViewSize = new rCV.Models.Size({height: 500, width:360});
var cellSize = new rCV.Models.Size({height: 100, width:100});

//Data
var allData = [];
for(var i = 1; i <= 10000; i++) {
    allData.push("Item: " + i);
}

var datasource = allData.splice(0, 99);

var loadMoreInterval = null;
function loadMoreData(batchSize){
    if(loadMoreInterval) {
        return;
    }
    loadMoreInterval = setInterval(function(){
        var currentIndex = datasource.length;
        currentIndex++;
        for(var i = currentIndex; i < i + batchSize && i < allData.length; i++) {
            datasource.push(allData[i]);
        }
        setTimeout(function() {
            loadMoreInterval = null;
        }, 1000)
        invalidateLayout();
    }, 2000);
}

//Create your cell style
function SimpleCellFactory(data) {
    var _data = data;
    var SimpleCell = new rCV.CollectionViewCell.Protocol({
        "reuseIdentifier": "default",
        "highlighted": false,
        "selected": false,
        "prepareForReuse": function () {
        },
        "applyLayoutAttributes": function (attributes) {
            //TODO:
        },
        "getContentView": function () {
            var cellStyle = {
                "text-align": "center",
                "margin-top": cellSize.height/2 - 10
            }
            var Data = React.createElement('div', {style: cellStyle}, _data);
            return React.createElement('div', {className:"simpleCell"}, Data);
        },
        "setData": function (data) {
            _data = data;
        }

    });

    return SimpleCell;
}

var itemSize = new rCV.Models.Size({height:100, width:100});
var insets = new rCV.Models.EdgeInsets({top:10, left:10, bottom:10, right:10});

var infinityLoadMoreBuffer = collectionViewSize.height/2;

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

    var scrollViewDelegate = new rCV.ScrollViewDelegate.Protocol({
        "scrollViewDidScroll": function(scrollDirectionType, scrollTop, bottom){
            if(scrollTop + infinityLoadMoreBuffer > bottom) {
                if(!loadMoreInterval) {
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

    var flowLayout = rCV.CollectionViewFlowLayout(collectionViewSize.width, layoutDelegate, itemSize, insets);

    var props = {
        collectionViewDatasource: datasourceDelegate,
        collectionViewDelegate: collectionViewDelegate,
        collectionViewLayout: flowLayout,
        scrollViewDelegate: scrollViewDelegate,
        frame: frame
    }

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

