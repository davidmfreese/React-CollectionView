var rCV = ReactCollectionView;
var React = rCV.React;

var collectionViewSize = new rCV.Models.Size({height: 256, width:256});
var cellSize = new rCV.Models.Size({height:256, width:256});

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
_images.push("http://files.igameu.com/app/921/2926516a43178d76ecee2547ae94236a-256.png");
_images.push("http://files.igameu.com/app/921/2926516a43178d76ecee2547ae94236a-256.png");
var _imagesIndex = 0;

var imageForCells = [];
for(var i = 0; i < datasource.length; i++) {
    if(_imagesIndex >= _images.length) {
        _imagesIndex = 0;
    }
    imageForCells.push(_images[_imagesIndex]);
    _imagesIndex++;
}
//Create your cell style
function SimpleCellFactory(data, indexPath) {
    var _indexPath = indexPath;
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

            var Img = React.createElement('img',
                {
                    src: imageForCells[_indexPath.row],
                    style:{width:"100%"}
                });

            return React.createElement('div',
                {
                    style: _style,
                    key: "section:" + _indexPath.section + ";row" + _indexPath.row,
                }, Img);

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
        var cell = new SimpleCellFactory(datasource[indexPath.row], indexPath);
        return cell;
    }
});

var itemSize = new rCV.Models.Size({height:256, width:256});
var insets = new rCV.Models.EdgeInsets({top:0, left:0, bottom:0, right:0});
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
    flowDirection: "ScrollDirectionTypeHorizontal",
    width: collectionViewSize.width,
    height: collectionViewSize.height,
    minimumLineSpacing: 0,
    minimumInteritemSpacing: 0,
    itemSize: itemSize
};

var flowLayout = rCV.CollectionViewFlowLayout.Layout(layoutDelegate, flowLayoutOptions);


var frame = new rCV.Models.Rect({
    origin: new rCV.Models.Point({x:0, y:0}),
    size: new rCV.Models.Size({height:collectionViewSize.height, width:collectionViewSize.width})
});
var props = {
    collectionViewDatasource: datasourceDelegate,
    frame: frame,
    collectionViewDelegate: collectionViewDelegate,
    collectionViewLayout: flowLayout
};

var collectionView = React.createElement(rCV.CollectionView.View, props);

React.render(collectionView, document.getElementById('reactContainer'));