var rCV = ReactCollectionView;
var React = rCV.React;
var Geometry = rCV.JSCoreGraphics.CoreGraphics.Geometry;
var Models = Geometry.DataTypes;
var EdgeInsets = rCV.JSCoreGraphics.Kit.DataTypes.EdgeInsets;
var IndexPath = rCV.JSCoreGraphics.Foundation.DataTypes.IndexPath;

var innerWidth = window.innerWidth;
var cellWidth = Math.floor(innerWidth / 3);
var collectionViewSize = new Models.Size({height: window.innerHeight, width:3*cellWidth});
var cellSize = new Models.Size({height: cellWidth, width: cellWidth});


//Data
var datasource = [];
for(var i = 0; i < 10000; i++) {
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

var insets = new EdgeInsets({top:0, left:0, bottom:0, right:0});
var layoutDelegate = new rCV.CollectionViewLayoutDelegate.Protocol({
    numberItemsInSection: function(indexPath) { return datasource.length; },
    numberOfSectionsInCollectionView: function() { return 1; },
    sizeForItemAtIndexPath: function(indexPath) { return itemSize; },
    insetForSectionAtIndex: function(indexPath) { return insets; },
    minimumLineSpacingForSectionAtIndex: function(indexPath) { return 0; }
});

var collectionViewDelegate = new rCV.CollectionViewDelegate.Protocol({
    shouldSelectItemAtIndexPath: function (indexPath) { return true; },
    didSelectItemAtIndexPath: function (indexPath) { },
    shouldDeselectItemAtIndexPath: function (indexPath) { return true; },
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

var frame = new Geometry.DataTypes.Rect({
    origin: new Geometry.DataTypes.Point({x:0, y:0}),
    size: collectionViewSize
});
var props = {
    collectionViewDatasource: datasourceDelegate,
    frame: frame,
    collectionViewDelegate: collectionViewDelegate,
    collectionViewLayout: flowLayout
};

function render() {
    var collectionView = React.createElement(rCV.CollectionView.View, props);
    React.render(collectionView, document.getElementById("reactContainer"));
}

render();

function onScrollToIndex() {
    props.scrollToItemAtIndexPath = {
        indexPath: new IndexPath({
            row: Number(document.getElementById("nextIndexRow").value),
            section: 0
        }),
        animated: document.getElementById("shouldAnimate").checked,
        scrollPositionType: "CenteredVertically"
    }

    render();
}

document.getElementById("scrollToIndex").addEventListener("click", onScrollToIndex);
