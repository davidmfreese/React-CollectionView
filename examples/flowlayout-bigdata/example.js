var rCV = ReactCollectionView;
var React = rCV.React;

var collectionViewSize = new rCV.Models.Size({height: window.innerHeight, width:window.innerWidth});
var cellSize = new rCV.Models.Size({height: 100, width:100});
var sectionInsets = new rCV.Models.EdgeInsets({top:10, left:10, bottom:10, right:10});

//Data
var datasource = [];
for(var i = 1; i <= 1000000; i++) {
    datasource.push("Item: " + i);
}

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
    minimumInteritemSpacing: 0,
    itemSize: cellSize
};
var flowLayout = rCV.CollectionViewFlowLayout.Layout(layoutDelegate, flowLayoutOptions);

var frame = new rCV.Models.Rect({
    origin: new rCV.Models.Point({x:0, y:0}),
    size: collectionViewSize
});
var props = {
    collectionViewDatasource: datasourceDelegate,
    frame: frame,
    collectionViewDelegate: collectionViewDelegate,
    collectionViewLayout: flowLayout
};

var collectionView = React.createElement(rCV.CollectionView.View, props);
React.render(collectionView, document.getElementById('reactContainer'));