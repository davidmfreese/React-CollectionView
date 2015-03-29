var rCV = ReactCollectionView;
var React = rCV.React;
var Geometry = rCV.JSCoreGraphics.CoreGraphics.Geometry;
var Models = Geometry.DataTypes;
var EdgeInsets = rCV.JSCoreGraphics.Kit.DataTypes.EdgeInsets;

var innerWidth = window.innerWidth;
var cellWidth = Math.floor(innerWidth / 3);
var collectionViewSize = new Models.Size({height: window.innerHeight, width:3*cellWidth});
var cellSize = new Models.Size({height: cellWidth, width: cellWidth});


//Data
var datasource = [];
for(var i = 1; i <= 1000000; i++) {
    datasource.push("Item: " + i);
}

//Create your cell style
function SimpleCellFactory(data) {
    var _attributes = undefined;
    var SimpleCell = new rCV.CollectionViewCell.Protocol({
        reuseIdentifier: "default",
        highlighted: false,
        selected: false,
        prepareForReuse: function () {
            this.selected = false;
            this.highlighted = false;
            _attributes = undefined;
        },
        applyLayoutAttributes: function (attributes) {
            _attributes = attributes;
        },
        getContentView: function () {
            var positionStyle = {
                position: "absolute",
                top: _attributes.frame.origin.y,
                left: _attributes.frame.origin.x,
                height:_attributes.frame.size.height,
                width: _attributes.frame.size.width,
                backgroundColor: "white"
            };

            if(this.selected) {
                positionStyle["msTransform"] = "rotate(20deg)";
                positionStyle["WebKitTransform"] = "rotate(20deg)";
                positionStyle["transform"] = "rotate(20deg)";
                positionStyle["zIndex"] = 1000;
                positionStyle["backgroundColor"] = "yellow"
                positionStyle.left = positionStyle.left - positionStyle.width*.10;
                positionStyle.top = positionStyle.top - positionStyle.height*.10;
                positionStyle.height = positionStyle.height*1.20;
                positionStyle.width = positionStyle.width*1.20;
            }

            var cellStyle = {
                "text-align": "center",
                "margin-top": cellSize.height/2 - 10
            };

            var Data = React.createElement('div', {style: cellStyle}, data);
            var Border = React.createElement('div', {className:"simpleCell"}, Data);
            return React.createElement('div', { style: positionStyle}, Border);
        },
        setData: function (data) {
        }

    }, true); //make mutable

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

var insets = new EdgeInsets({top:0, left:0, bottom:0, right:0});
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
        return true;
    }
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

var collectionView = React.createElement(rCV.CollectionView.View, props);

React.render(collectionView, document.getElementById('reactContainer'));