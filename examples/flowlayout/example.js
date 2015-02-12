var rCV = ReactCollectionView;
var React = rCV.React;

var collectionViewSize = new rCV.Models.Size({height: 500, width:360});
var cellSize = new rCV.Models.Size({height: 100, width:100});

//Data
var datasource = [];
for(var i = 1; i <= 10000; i++) {
    datasource.push("Item: " + i);
}

//Create your cell style
function SimpleCellFactory(data) {
    var _data = data;
    var _style = {};
    var SimpleCell = new rCV.CollectionViewCell.Protocol({
        "reuseIdentifier": "default",
        "highlighted": false,
        "selected": false,
        "prepareForReuse": function () {
        },
        "applyLayoutAttributes": function (attributes) {
            _style = {
                position: "absolute",
                top: attributes.frame.origin.y,
                left: attributes.frame.origin.x,
                height:attributes.frame.size.height,
                width: attributes.frame.size.width
            };
        },
        "getContentView": function () {
            var cellStyle = {
                "text-align": "center",
                "margin-top": cellSize.height/2 - 10
            };
            var Data = React.createElement('div', {style: cellStyle}, _data);
            var Border = React.createElement('div', {className:"simpleCell"}, Data);
            return React.createElement('div', { style: _style}, Border);
        },
        "setData": function (data) {
            _data = data;
        }

    });

    return SimpleCell;
}

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

var itemSize = new rCV.Models.Size({height:120, width:120});
var insets = new rCV.Models.EdgeInsets({top:10, left:10, bottom:10, right:10});
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
    itemSize: itemSize
};
var flowLayout = rCV.CollectionViewFlowLayout.Layout(layoutDelegate, flowLayoutOptions);

var frame = new rCV.Models.Rect({
    origin: new rCV.Models.Point({x:0, y:0}),
    size: new rCV.Models.Size({height:500, width:collectionViewSize.width})
});
var props = {
    collectionViewDatasource: datasourceDelegate,
    frame: frame,
    collectionViewDelegate: collectionViewDelegate,
    collectionViewLayout: flowLayout
};

var collectionView = React.createElement(rCV.CollectionView.View, props);

React.render(collectionView, document.getElementById('reactContainer'));