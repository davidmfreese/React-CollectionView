var rCV = ReactCollectionView;
var React = rCV.React;

var collectionViewSize = new rCV.Models.Size({height: 500, width:360});
var cellSize = new rCV.Models.Size({height: 100, width:100});
var supplementaryHeight = 60;

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
            _style = null;
            _data = null;
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
            return React.createElement('div', {className:"simpleCell", style: _style}, Data);
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
                "margin-top": supplementaryHeight/2 - 8
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
    flowDirection: "ScrollDirectionTypeVertical",
    width: collectionViewSize.width,
    height: 0,
    minimumLineSpacing: 5,
    minimumInteritemSpacing: 5,
    itemSize: new rCV.Models.Size({height:100, width:100}),
    sectionInsets: new rCV.Models.EdgeInsets({top:10, left:0, bottom:10, right:0}),
    headerReferenceSize: new rCV.Models.Size({height: 60, width: collectionViewSize.width}),
    footerReferenceSize: new rCV.Models.Size({height: 60, width: collectionViewSize.width})
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