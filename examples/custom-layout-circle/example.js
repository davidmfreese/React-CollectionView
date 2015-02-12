var rCV = ReactCollectionView;
var React = rCV.React;

var collectionViewSize = new rCV.Models.Size({height: 500, width:500});

//Data
var datasource = [[]];
for(var i = 1; i <= 50; i++) {
    datasource[0].push("Item: " + i);
}

var datasourceDelegate = new rCV.CollectionViewDatasource.Protocol({
    numberItemsInSection: function(indexPath) {
        return datasource[indexPath.section].length;
    },
    numberOfSectionsInCollectionView: function() {
        return datasource.length;
    },
    cellForItemAtIndexPath: function(indexPath) {
        var cell = new circleCellFactory();
        return cell;
    }
});

var layoutDelegate = new rCV.CollectionViewLayoutDelegate.Protocol({
    numberItemsInSection: function(indexPath) {
        return datasource[indexPath.section].length;
    },
    numberOfSectionsInCollectionView: function() {
        return datasource.length;
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

var collectionViewDelegate = new rCV.CollectionViewDelegate.Protocol({
    shouldSelectItemAtIndexPath: function (indexPath) { return false; },
    didSelectItemAtIndexPath: function (indexPath) { },
    shouldDeselectItemAtIndexPath: function (indexPath) { return false; },
    shouldHighlightItemAtIndexPath: function (indexPath) { return false; },
    didHighlightItemAtIndexPath: function (indexPath) {},
    didUnhighlightItemAtIndexPath: function (indexPath) {},
    willDisplayCellForItemAtIndexPath: function (indexPath) {}
});

var circleLayout = circleLayoutFactory(rCV.Models.Size({height: 1000, width:1000}), 50, layoutDelegate);


var frame = new rCV.Models.Rect({
    origin: new rCV.Models.Point({x:0, y:0}),
    size: new rCV.Models.Size({height:500, width:collectionViewSize.width})
});
var props = {
    collectionViewDatasource: datasourceDelegate,
    frame: frame,
    collectionViewDelegate: collectionViewDelegate,
    collectionViewLayout: circleLayout
};

var collectionView = React.createElement(rCV.CollectionView.View, props);

React.render(collectionView, document.getElementById('reactContainer'));