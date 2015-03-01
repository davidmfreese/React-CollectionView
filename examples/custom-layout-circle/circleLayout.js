var rCV = ReactCollectionView;
var React = rCV.React;

function circleCellFactory() {
    var _style = {};
    var CircleCell = new rCV.CollectionViewCell.Protocol({
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

            var Circle = React.createElement('div', {className:"circleCell"});
            var Div = React.createElement('div', {style: _style}, Circle);
            return Div;
        },
        "setData": function (data) {

        }

    });

    return CircleCell;
}

function circleLayoutFactory(viewSize, itemSize, layoutDelegate) {
    rCV.Models.Point.is(viewSize);

    var _cellCount = 0;
    var _radius = Math.min(viewSize.height, viewSize.width)/2.5;
    var _itemSize = itemSize;

    var _contentSize = viewSize;
    var _center = new rCV.Models.Point({x: viewSize.width / 2.0, y: viewSize.height / 2.0});

    var prepareLayout = function(callback) {
        _cellCount = layoutDelegate.numberItemsInSection(new rCV.Models.IndexPath({row: 0, section:0}));

        if(callback) {
            callback("success");
        }
    };

    var layout = new rCV.CollectionViewLayout.Protocol({
        "layoutDelegate": layoutDelegate,
        "getCollectionViewContentSize": function() { return _contentSize},
        "prepareLayout": function(callback) {
            _contentSize =  rCV.Models.Geometry.gesizeZero();
            prepareLayout(callback);
        },
        "layoutAttributesForElementsInRect": function(rect) {
            var layoutAttributesInRect = [];

            for(var i = 0; i < _cellCount; i++) {
                var attributes = this.layoutAttributesForItemAtIndexPath(new rCV.Models.IndexPath({row: i, section:0}));
                layoutAttributesInRect.push(attributes);
            }

            return new rCV.CollectionViewLayout.Model.ArrayOfLayoutAttributes(layoutAttributesInRect);

        },
        "layoutAttributesForItemAtIndexPath": function(indexPath) {


            var layoutAttributes = null;

            var size = new rCV.Models.Size({width: _itemSize, height: _itemSize});
            var centerX = _center.x + _radius * Math.cos(2 * indexPath.row * Math.PI / _cellCount);
            var centerY = _center.y + _radius * Math.sin(2 * indexPath.row * Math.PI / _cellCount);

            var originX = centerX - _itemSize /2.5;
            var originY = centerY - _itemSize /2.5;


            var frame = new rCV.Models.Rect({
                origin: new rCV.Models.Point({x: originX, y: originY}),
                size: size
            });
            var layoutAttributes = new rCV.CollectionViewLayoutAttributes.Protocol({
                "indexPath": indexPath,
                "representedElementCategory": function () {
                    return "CollectionElementTypeCell";
                },
                "representedElementKind": function () {
                    return "default"
                },
                "frame": frame,
                "size": frame.size,
                "hidden": false
            });


            return layoutAttributes;
        },
        "prepareForCollectionViewUpdates": function() {
            this.prepareLayout(function() {

            });
        },
        "invalidateLayout": function() {
            this.prepareLayout(function() {

            });
        }
    });

    return layout;
}