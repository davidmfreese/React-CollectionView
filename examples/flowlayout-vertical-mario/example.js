var rCV = ReactCollectionView;
var React = rCV.React;
var IndexPath = rCV.JSCoreGraphics.Foundation.DataTypes.IndexPath;
var Models = rCV.JSCoreGraphics.CoreGraphics.Geometry.DataTypes;
var EdgeInsets = rCV.JSCoreGraphics.Kit.DataTypes.EdgeInsets;
var exampleUtils = exampleUtils();

function throttle() {
    clearTimeout(reload.timeoutInterval);
    reload.timeoutInterval = setTimeout(function(){
        reload(true);
    }, 150);
}

window.onresize = function() {
    throttle();
};

//Data
var datasource = [];
for(var i = 1; i <= 10000; i++) {
    datasource.push("Item: " + i);
}

var _images =[];
_images.push("http://icons.iconarchive.com/icons/yellowicon/game-stars/256/Mario-icon.png");
_images.push("http://icons.iconarchive.com/icons/ph03nyx/super-mario/256/Racoon-Mario-icon.png");
_images.push("http://www.mitchelaneous.com/wp-content/uploads/2009/11/marioyoshi1.png");
_images.push("http://icons.iconarchive.com/icons/ph03nyx/super-mario/256/Shell-Red-icon.png");
_images.push("http://png-4.findicons.com/files/icons/2297/super_mario/256/question_coin.png");
var _imagesIndex = 0;

var imageForCells = [];
for(var i = 0; i < datasource.length; i++) {
    if(_imagesIndex >= _images.length) {
        _imagesIndex = 0;
    }
    imageForCells.push(_images[_imagesIndex]);
    _imagesIndex++;
}

var datasourceDelegate = new rCV.CollectionViewDatasource.Protocol({
    numberItemsInSection: function(indexPath) { return datasource.length; },
    numberOfSectionsInCollectionView: function() { return 1; },
    cellForItemAtIndexPath: function(indexPath) {
        var cell = new SimpleCellFactory(datasource[indexPath.row], indexPath);
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

function reload(invalidate) {
    var sizes = exampleUtils.getCollectionViewSizes(false);
    var collectionViewSize = new Models.Size({height: sizes.window.height, width:sizes.window.width});
    var cellSize = new Models.Size({height: sizes.cellSize.height, width: sizes.cellSize.width});
    var insets = new EdgeInsets({top:0, left:0, bottom:0, right:0});

    var flowLayoutOptions = {
        flowDirection: "ScrollDirectionTypeVertical",
        width: collectionViewSize.width,
        height: collectionViewSize.height,
        minimumLineSpacing: 0,
        minimumInteritemSpacing: 0,
        itemSize: cellSize
    };
    var flowLayout = new rCV.CollectionViewFlowLayout.Layout(layoutDelegate, flowLayoutOptions);

    var frame = new Models.Rect({
        origin: new Models.Point({x: 0, y: 0}),
        size: new Models.Size({height: collectionViewSize.height, width: collectionViewSize.width})
    });
    var props = {
        collectionViewDatasource: datasourceDelegate,
        frame: frame,
        collectionViewDelegate: collectionViewDelegate,
        collectionViewLayout: flowLayout,
        invalidateLayout: invalidate,
        resetScroll: invalidate
    };

    var collectionView = React.createElement(rCV.CollectionView.View, props);

    React.render(collectionView, document.getElementById('reactContainer'));
}

reload.timeoutInterval = null;

reload();