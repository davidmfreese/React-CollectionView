var t = require('tcomb');

var Models = require('../Model/Models');
var CollectionViewDatasource = require('./CollectionViewLayout');
var CollectionViewLayout = require('./CollectionViewLayout');
var CollectionViewLayoutDelegate = require('./CollectionViewLayoutDelegate');
var CollectionViewLayoutAttributes = require('./CollectionViewLayoutAttributes');

function CollectionViewFlowLayoutFactory(width, layoutDelegate, itemSize, insets) {
    CollectionViewLayoutDelegate.Protocol.is(layoutDelegate);

    var _width = width;

    var _itemSize = Models.Geometry.getSizeZero();
    if(itemSize) {
        Models.Size.is(itemSize);
        _itemSize = itemSize;
    }

    var _requestedInsets = Models.Geometry.getInsetsZero();
    var _actualInsets = _requestedInsets;
    if(insets) {
        Models.EdgeInsets.is(insets);
        _requestedInsets = insets;
        _actualInsets = _requestedInsets;
    }

    var _numberRows;
    var _itemTotalWidth;
    var _numberOfColumns;
    var _columnSpacing;
    var _availableSpacing;
    var _rowHeight;
    var _numberOfTotalRows;
    var _contentSize;
    var _horizontalMargin;

    var prepareLayout = function() {
        if(!_requestedInsets) {
            _requestedInsets = Models.Geometry.getInsetsZero();
        }

        var numberItems = layoutDelegate.numberItemsInSection(0);
        var requestedItemWidth = _itemSize.width + _requestedInsets.left + _requestedInsets.right;
        _numberOfColumns = Math.floor(_width/requestedItemWidth);
        _availableSpacing = Math.floor(_width/_numberOfColumns);
        _horizontalMargin = Math.floor(_availableSpacing/(_numberOfColumns*2));
        var ratio = (_horizontalMargin)/(_requestedInsets.left + _requestedInsets.right);
        //console.log("requested to actual insets ratio: " + ratio);
        _actualInsets = new Models.EdgeInsets({top: _requestedInsets.top, bottom: _requestedInsets.bottom, left: Math.floor(_requestedInsets.left*ratio), right: Math.floor(_requestedInsets.right*ratio)});
        _itemTotalWidth = _itemSize.width + _actualInsets.left + _actualInsets.right;
        _rowHeight = _itemSize.height + _requestedInsets.top + _requestedInsets.bottom;
        _numberOfTotalRows = Math.ceil(numberItems/_numberOfColumns);
    };

    var setContentSize = function() {
        if(Models.Geometry.isSizeZero(_itemSize)) {
            console.log('no item size set');
        }

        if(!_numberRows) {
            prepareLayout();
        }

       _contentSize = Models.Size({height:_numberOfTotalRows*_rowHeight, width: _itemTotalWidth});
    };

    //setContentSize();

    var CollectionViewFlowLayout = new CollectionViewLayout.Protocol({
        "layoutDelegate": layoutDelegate,
        "getCollectionViewContentSize": function() {
            if(_numberOfTotalRows) {
                _contentSize = Models.Size({height: _numberOfTotalRows * _rowHeight, width: _itemTotalWidth});
            }
            else {
                _contentSize = Models.Geometry.getSizeZero();
            }
            return _contentSize;
        },
        "prepareLayout": function() {
            prepareLayout();
            //setContentSize();
        },
        "layoutAttributesForElementsInRect": function(rect) {
            var layoutAttributesInRect = [];
            var numberItems = this.layoutDelegate.numberItemsInSection(0);

            var topRow = Math.floor(rect.origin.y/_rowHeight);
            var bottomRow = Math.ceil((rect.origin.y + rect.size.height)/_rowHeight);

            if(bottomRow > _numberOfTotalRows) {
                bottomRow = _numberOfTotalRows;
            }

            var firstIndex = Math.max(topRow - 1, 0)*_numberOfColumns;
            var lastIndex = Math.min(numberItems - 1, bottomRow*_numberOfColumns - 1);

            for(var i = firstIndex; i <= lastIndex; i++) {
                var indexPath = new Models.IndexPath({row: i, section: 0});
                var layoutAttributes = this.layoutAttributesForItemAtIndexPath(indexPath);

                layoutAttributesInRect.push(layoutAttributes)
            }

            return new CollectionViewLayout.Model.ArrayOfLayoutAttributes(layoutAttributesInRect);
        },
        "layoutAttributesForItemAtIndexPath": function(indexPath) {
            Models.IndexPath.is(indexPath);

            var row = Math.floor(indexPath.row/_numberOfColumns);
            var y = row*_rowHeight + _actualInsets.top;
            var column = indexPath.row % _numberOfColumns;
            var x = column*_itemTotalWidth  +  _actualInsets.left - Math.floor(_actualInsets.left/2);
            var origin = new Models.Point({x: x, y: y});
            var size = new Models.Size({height: _itemSize.height, width: _itemSize.width});
            var frame = new Models.Rect({origin: origin, size: size});

            var layoutAttributes = new CollectionViewLayoutAttributes.Protocol({
                "indexPath": indexPath,
                "representedElementCategory": function(){
                    return "CollectionElementTypeCell";
                },
                "representedElementKind": function(){
                    return "default"
                },
                "frame": frame,
                "size": size,
                "hidden": false
            });

            return layoutAttributes;
        },
        "prepareForCollectionViewUpdates": function() {

        },
        "invalidateLayout": function() {


        }, "setItemSize": function(size) {
            _itemSize = size;
            this.invalidateLayout();
        },
        "getItemSize": function() {
            return _itemSize;
        },
        "setInsets": function(insets) {
            _requestedInsets = insets;
            this.invalidateLayout();
        },
        "getInsets": function() {
            return _insets;
        },
        "setWidth": function(newWidth) {
            _width = newWidth;
            this.invalidateLayout();
        }
    });

    return CollectionViewFlowLayout;
}

module.exports = CollectionViewFlowLayoutFactory;
