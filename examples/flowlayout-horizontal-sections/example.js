var rCV = ReactCollectionView;
var React = rCV.React;

var collectionViewSize = new rCV.Models.Size({height: 360, width:500});
var cellSize = new rCV.Models.Size({height: 100, width:100});

//Data
var datasource = [];
var itemsPerSection = 34;
var numberOfSections = 5000;

for(var j =1; j <= numberOfSections; j++) {
    var sectionData = [];
    for(var i = 1; i <= itemsPerSection; i++) {
        sectionData.push("Sec:" + j + " Item:" + i);
    }

    datasource.push(sectionData);
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

//Create your cell style
function SupplementaryViewFactory(kind, indexPath) {
    var _style = {};
    var _indexPath = indexPath;
    var _kind = kind;
    var reusableView = new rCV.CollectionViewCell.Protocol({
        "reuseIdentifier": "supplementary",
        "highlighted": false,
        "selected": false,
        "prepareForReuse": function () {
            _style = null;
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
                "-webkit-transform": "rotate(-90deg)",
                "-moz-transform": "rotate(-90deg)",
                "-ms-transform": "rotate(-90deg)",
                "-o-transform": "rotate(-90deg)",
                "filter": "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)",
                "margin-top": collectionViewSize.height/2 - 10,
                "margin-right": 10
            };

            var Data = React.createElement('div', {style: cellStyle}, _kind + ": " + (_indexPath.section + 1));
            var View = React.createElement('div', {className: "suppView", style: _style}, Data);
            return View;
        }
    });

    return reusableView;
}

var datasourceDelegate = new rCV.CollectionViewDatasource.Protocol({
    numberItemsInSection: function(indexPath) {
        return datasource[indexPath.section].length;
    },
    numberOfSectionsInCollectionView: function() {
        return datasource.length;
    },
    cellForItemAtIndexPath: function(indexPath) {
        var cell = new SimpleCellFactory(datasource[indexPath.section][indexPath.row]);
        return cell;
    }, viewForSupplementaryElementOfKind: function(kind, indexPath) {
        var view = SupplementaryViewFactory(kind, indexPath);
        return view;
    }
});

var itemSize = new rCV.Models.Size({height:120, width:120});
var insets = new rCV.Models.EdgeInsets({top:10, left:10, bottom:10, right:10});
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

var flowLayoutOptions = {
    flowDirection: "ScrollDirectionTypeHorizontal",
    width: collectionViewSize.width,
    height: collectionViewSize.height,
    minimumLineSpacing: 0,
    minimumInteritemSpacing: 0,
    itemSize: itemSize,
    sectionInsets: new rCV.Models.EdgeInsets({top:0, left:0, bottom:0, right:0}),
    headerReferenceSize: new rCV.Models.Size({height: collectionViewSize.height, width: 60}),
    footerReferenceSize: new rCV.Models.Size({height: collectionViewSize.height, width: 60})
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
    collectionViewLayout: flowLayout,
    preloadPageCount: 2
};

var collectionView = React.createElement(rCV.CollectionView.View, props);

React.render(collectionView, document.getElementById('reactContainer'));