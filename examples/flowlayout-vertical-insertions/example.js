var rCV = ReactCollectionView;
var React = rCV.React;
var Geometry = rCV.JSCoreGraphics.CoreGraphics.Geometry;
var Models = Geometry.DataTypes;
var EdgeInsets = rCV.JSCoreGraphics.Kit.DataTypes.EdgeInsets;

var exampleUtils = exampleUtils();
var sizes = exampleUtils.getCollectionViewSizes(false);
var collectionViewSize = new Models.Size({height: sizes.window.height, width:sizes.window.width});
var cellSize = new Models.Size({height: sizes.cellSize.height, width: sizes.cellSize.width});

var frame = new Models.Rect({
    origin: new Models.Point({x:0, y:0}),
    size: collectionViewSize
});

//Data
var datasource = [];
function addData() {
    var i = datasource.length + 1;
    datasource.unshift("Item: " + i);
}

var currentIndex;
for(var i = 1; i <= 10000; i++) {
    addData();
}

var loadNextInterval = null;
function loadNext(){
    if(loadNextInterval) {
        return;
    }
    loadNextInterval = setInterval(function(){
        if(!stop) {
            addData();
            create(true);
        }

        clearInterval(loadNextInterval);
        loadNextInterval = null;

        if(!stop) {
            loadNext();
        }
    }, 1000);
}

//ScrollViewDelegate
var stop = false;
var scrollViewDelegate = new rCV.ScrollViewDelegate({
    "scrollViewDidScroll": function (scrollPosition) {
        var scrollTop = scrollPosition.y;
        if (scrollTop == 0) {
            stop = false;
            if (!loadNextInterval) {
                loadNext();
            }
        } else {
            stop = true;
        }
    }
});


function create(invalidate) {
//DatasourceDelegate
    var datasourceDelegate = new rCV.CollectionViewDatasource.Protocol({
        numberItemsInSection: function (indexPath) { return datasource.length; },
        numberOfSectionsInCollectionView: function () { return 1; },
        cellForItemAtIndexPath: function (indexPath) {
            var cell = new SimpleCellFactory(datasource[indexPath.row]);
            return cell;
        }
    });

    //FlowLayoutDelegate
    var layoutDelegate = new rCV.CollectionViewLayoutDelegate.Protocol({
        numberItemsInSection: function (indexPath) { return datasource.length; },
        numberOfSectionsInCollectionView: function () { return 1; },
        sizeForItemAtIndexPath: function (indexPath) { return itemSize; },
        insetForSectionAtIndex: function (indexPath) { return insets; },
        minimumLineSpacingForSectionAtIndex: function (indexPath) { return 0; },
        shouldSelectItemAtIndexPath: function (indexPath) { return false; }
    });

//CollectionViewDelegate
    var collectionViewDelegate = new rCV.CollectionViewDelegate.Protocol({
        shouldSelectItemAtIndexPath: function (indexPath) { return false; },
        didSelectItemAtIndexPath: function (indexPath) { },
        shouldDeselectItemAtIndexPath: function (indexPath) { return false; },
        shouldHighlightItemAtIndexPath: function (indexPath) { return false; },
        didHighlightItemAtIndexPath: function (indexPath) { },
        didUnhighlightItemAtIndexPath: function (indexPath) { },
        willDisplayCellForItemAtIndexPath: function (indexPath) { }
    });

//FlowLayout new up
    var flowLayoutOptions = {
        flowDirection: "ScrollDirectionTypeVertical",
        width: collectionViewSize.width,
        height: 0,
        minimumLineSpacing: 0,
        minimumInteritemSpacing: 0,
        itemSize: cellSize
    };
    var flowLayout = new rCV.CollectionViewFlowLayout.Layout(layoutDelegate, flowLayoutOptions);

    var props = {
        collectionViewDatasource: datasourceDelegate,
        frame: frame,
        collectionViewDelegate: collectionViewDelegate,
        collectionViewLayout: flowLayout,
        scrollViewDelegate: scrollViewDelegate,
        invalidateLayout: invalidate
    };

    var collectionView = React.createElement(rCV.CollectionView.View, props);
    React.render(collectionView, document.getElementById('reactContainer'));

}

create(false);
setTimeout(function() {
    loadNext();
}, 250);