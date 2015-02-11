var t = require('tcomb');

var Models = require('../Model/Models');
var Enums = require('../Enums/Enums');
var CollectionViewDatasource = require('./CollectionViewLayout');
var CollectionViewLayout = require('./CollectionViewLayout');
var CollectionViewLayoutDelegate = require('./CollectionViewLayoutDelegate');
var CollectionViewLayoutAttributes = require('./CollectionViewLayoutAttributes');

var VerticalSectionLayoutDetails = t.struct({
    Frame: Models.Rect,
    NumberItems: t.Num,
    NumberOfTotalRows: t.Num,
    ItemTotalWidth: t.Num,
    NumberOfColumns: t.Num,
    ActualInteritemSpacing: t.Num,
    MinimumLineSpacing: t.Num,
    RowHeight: t.Num,
    SectionInsets: Models.EdgeInsets,
    HeaderReferenceSize:Models.Size,
    FooterReferenceSize:Models.Size
}, 'SectionLayoutDetails');

VerticalSectionLayoutDetails.prototype.getEstimatedRowForPoint = function(point) {
    //zero based
    return Math.max(0, Math.floor((point.y - this.Frame.origin.y + this.MinimumLineSpacing)/(this.RowHeight + this.MinimumLineSpacing)));
};

VerticalSectionLayoutDetails.prototype.getStartingIndexForRow = function(row) {
    //zero based
    return Math.max(0, row*this.NumberOfColumns - this.NumberOfColumns);
};

VerticalSectionLayoutDetails.prototype.getRowForIndex = function(indexPath) {
    //zero based
    return Math.floor(indexPath.row/this.NumberOfColumns);
};

var FlowLayoutOptions = t.struct({
    flowDirection: Enums.ScrollDirectionType,
    width: t.Num,
    height: t.Num,
    minimumLineSpacing: t.maybe(t.Num),
    minimumInteritemSpacing: t.maybe(t.Num),
    sectionInsets: t.maybe(Models.EdgeInsets),
    itemSize: t.maybe(Models.Size),
    headerReferenceSize: t.maybe(Models.Size),
    footerReferenceSize: t.maybe(Models.Size)
},' FlowLayoutOptions');

function CollectionViewFlowLayoutFactory(layoutDelegate, opts) {
    CollectionViewLayoutDelegate.Protocol.is(layoutDelegate);
    FlowLayoutOptions.is(opts);

    var _constrainedHeightOrWidth = 0;
    var _itemSize = Models.Geometry.getSizeZero();
    var _sectionInsets = Models.Geometry.getInsetsZero();
    var _totalContentSize = Models.Geometry.getSizeZero();
    var _sectionLayoutDetails = [];
    var _minInteritemSpacing = 0;
    var _minLineSpacing = 0;
    var _headerReferenceSize = Models.Geometry.getSizeZero();
    var _footerReferenceSize = Models.Geometry.getSizeZero();

    if(opts.flowDirection != "ScrollDirectionTypeVertical") {
        //TODO: Horizontal Scrolling
        throw "Horizontal Scrolling not implemented.";
    }
    if(!opts.itemSize || Models.Geometry.isSizeZero(opts.itemSize)) {
        throw "Non uniform item size is not implemented."
    }
    if(opts.itemSize) {
        Models.Size.is(opts.itemSize);
        _itemSize = opts.itemSize;
    }
    if(opts.sectionInsets) {
        Models.EdgeInsets.is(opts.sectionInsets);
        _sectionInsets = opts.sectionInsets;
    }
    if(opts.flowDirection == "ScrollDirectionTypeVertical") {
        _constrainedHeightOrWidth = opts.width;
    }
    if(opts.minimumInteritemSpacing) {
        _minInteritemSpacing = opts.minimumInteritemSpacing;
    }
    if(opts.minimumLineSpacing) {
        _minLineSpacing = opts.minimumLineSpacing;
    }
    if(opts.headerReferenceSize && Models.Size.is(opts.headerReferenceSize)) {
        _headerReferenceSize = opts.headerReferenceSize;
    }
    if(opts.footerReferenceSize && Models.Size.is(opts.footerReferenceSize)) {
        _footerReferenceSize = opts.footerReferenceSize;
    }

    var setLayoutForVerticalSection = function(indexPath) {
        if(!_sectionLayoutDetails) {
            _sectionLayoutDetails = [];
        }

        var numberItems = layoutDelegate.numberItemsInSection(indexPath);
        var availableWidth = _constrainedHeightOrWidth - _sectionInsets.left - _sectionInsets.right;
        var numberOfColumns =  Math.floor((availableWidth - _itemSize.width)/(_itemSize.width + _minInteritemSpacing)) + 1;
        var actualInteritemSpacing = Math.floor((availableWidth - _itemSize.width*numberOfColumns)/(numberOfColumns - 1));
        var itemTotalWidth = _itemSize.width;
        var rowHeight = _itemSize.height;
        var numberOfTotalRows = Math.ceil(numberItems/numberOfColumns);
        var totalHeight = numberOfTotalRows*rowHeight + (numberOfTotalRows - 1)*_minLineSpacing;
        totalHeight += _headerReferenceSize.height + _footerReferenceSize.height;
        totalHeight += _sectionInsets.top + _sectionInsets.bottom;
        var sectionSize = Models.Size({width: _constrainedHeightOrWidth, height: totalHeight});

        var startY = 0;
        var previousSection = indexPath.section - 1;
        if(previousSection < 0 ) {
            previousSection = 0;
        }
        if(_sectionLayoutDetails && _sectionLayoutDetails[previousSection]) {
            for (var i = 0; i <= indexPath.section - 1; i++) {
                startY += _sectionLayoutDetails[i].Frame.size.height;
            }
        }

        var sectionLayout = new VerticalSectionLayoutDetails({
            Frame: new Models.Rect({
                origin: new Models.Point({x: 0, y: startY}),
                size: sectionSize
            }),
            NumberItems: numberItems,
            NumberOfTotalRows: numberOfTotalRows,
            ItemTotalWidth: itemTotalWidth,
            NumberOfColumns: numberOfColumns,
            RowHeight: rowHeight,
            ActualInteritemSpacing: actualInteritemSpacing,
            MinimumLineSpacing: _minLineSpacing,
            SectionInsets: _sectionInsets,
            HeaderReferenceSize:_headerReferenceSize,
            FooterReferenceSize:_footerReferenceSize

        });

        _totalContentSize = new Models.Size({ width: _constrainedHeightOrWidth, height: startY + sectionSize.height});
        _sectionLayoutDetails[indexPath.section] = sectionLayout;
    };

    var prepareLayout = function() {
        if(opts.flowDirection == "ScrollDirectionTypeVertical") {
            _sectionLayoutDetails = [];
            _totalContentSize = Models.Geometry.getSizeZero();
            var numberOfSections = layoutDelegate.numberOfSectionsInCollectionView.call(this, null);
            var totalHeight = 0;
            for (var i = 0; i < numberOfSections; i++) {
                var indexPath = new Models.IndexPath({row: 0, section: i});
                setLayoutForVerticalSection(indexPath);
                var section = _sectionLayoutDetails[indexPath.section];
                totalHeight += section.Frame.size.height;
            }

            _totalContentSize = new Models.Size({height: totalHeight, width: _constrainedHeightOrWidth});
        }
        //TODO: horizontal scrolling
    };

    var getSections = function(rect) {
        var sections = [];
        var startSection = -1;
        var endSection = -1;

        if(!_sectionLayoutDetails) {
            prepareLayout();
        }
        var numberOfSections = layoutDelegate.numberOfSectionsInCollectionView.call(this, null);
        for(var i = 0; i < numberOfSections; i++) {
            var layout = _sectionLayoutDetails[i];
            var topSectionHigherThanTopRect = layout.Frame.origin.y <= rect.origin.y;
            var topSectionLowerThanTopRect = layout.Frame.origin.y + layout.Frame.size.height >= rect.origin.y;

            var topSectionHigherThanBotRect = layout.Frame.origin.y <= rect.origin.y + rect.size.height;
            var botSectionLowerThanBotRect = layout.Frame.origin.y + layout.Frame.size.height >= rect.origin.y + rect.size.height;

            if(startSection <= 0 && topSectionHigherThanTopRect && topSectionLowerThanTopRect) {
                startSection = i;
            }

            if(endSection <= 0 && topSectionHigherThanBotRect && botSectionLowerThanBotRect) {
                endSection = i;
            }
        }

        if(endSection == -1) {
            endSection = startSection;
        }

        for(var i = startSection; i <= endSection; i++) {
            sections.push(i);
        }

        return sections;
    };

    var layoutAttributesForItemAtIndexPathVertical = function(indexPath) {

        if(opts.flowDirection != "ScrollDirectionTypeVertical") {
            return null;
        }

        Models.IndexPath.is(indexPath);
        var section = _sectionLayoutDetails[indexPath.section];

        var row = section.getRowForIndex(indexPath);
        var y = section.Frame.origin.y + row * section.RowHeight + section.MinimumLineSpacing * (row) + section.HeaderReferenceSize.height + section.SectionInsets.top;
        var column = indexPath.row % section.NumberOfColumns;
        var x = column * section.ItemTotalWidth + column * section.ActualInteritemSpacing + section.SectionInsets.left;
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
    };

    var CollectionViewFlowLayout = new CollectionViewLayout.Protocol({
        "layoutDelegate": layoutDelegate,
        "getCollectionViewContentSize": function() {
            if(_totalContentSize && _totalContentSize.width > 0) {
                return _totalContentSize;
            }

            var numberOfSections = layoutDelegate.numberOfSectionsInCollectionView.call(this, null);
            if(_sectionLayoutDetails && _sectionLayoutDetails[numberOfSections - 1]){
                var height = 0;
                for(var i = 0; i < numberOfSections; i++) {
                    height += _sectionLayoutDetails[i].Frame.size.height;
                }

                if(height > 0) {
                    _totalContentSize = new Models.Size({ width: _width, height: height});
                } else {
                    _totalContentSize = Models.Geometry.getSizeZero();
                }
            } else {
                _totalContentSize = Models.Geometry.getSizeZero();
            }
            return _totalContentSize;
        },
        "prepareLayout": function() {
            prepareLayout();
        },
        "layoutAttributesForElementsInRect": function(rect) {
            var layoutAttributesInRect = [];

            if(Models.Geometry.isRectZero(rect)) {
                return layoutAttributesInRect;
            }
            if(opts.flowDirection == "ScrollDirectionTypeVertical") {

                var sections = getSections(rect);
                var firstSection = _sectionLayoutDetails[sections[0]];
                var currentY = firstSection.Frame.origin.y;
                for (var j = 0; j < sections.length; j++) {
                    var sectionNum = sections[j];
                    var indexPath = new Models.IndexPath({row: 0, section: sectionNum});
                    var numberItemsInSection = this.layoutDelegate.numberItemsInSection(indexPath);
                    var currentSection = _sectionLayoutDetails[sectionNum];
                    if (currentSection.Frame.origin.y > rect.origin.y + rect.size.height) {
                        break;
                    }

                    var startRow = currentSection.getEstimatedRowForPoint(rect.origin);
                    var startIndex = currentSection.getStartingIndexForRow(startRow);

                    for (var i = startIndex; i < numberItemsInSection; i++) {
                        var indexPath = new Models.IndexPath({row: i, section: sectionNum});
                        var layoutAttributes = this.layoutAttributesForItemAtIndexPath(indexPath);
                        if (layoutAttributes.frame.origin.y + layoutAttributes.size.height < rect.origin.y) {
                            continue;
                        }
                        if (layoutAttributes.frame.origin.y > rect.origin.y + rect.size.height) {
                            break;
                        }
                        if (Models.Geometry.rectIntersects(layoutAttributes.frame, rect)) {
                            layoutAttributesInRect.push(layoutAttributes);
                        } else {
                            //console.log("no intersection");
                        }
                    }
                }
            }

            return new CollectionViewLayout.Model.ArrayOfLayoutAttributes(layoutAttributesInRect);
        },
        "layoutAttributesForItemAtIndexPath": function(indexPath) {

            if((opts.flowDirection == "ScrollDirectionTypeVertical")) {
                var attributes = layoutAttributesForItemAtIndexPathVertical(indexPath);
                return attributes;
            }
        },
        "prepareForCollectionViewUpdates": function() {

        },
        "invalidateLayout": function() {
            prepareLayout();
        }
    });

    return CollectionViewFlowLayout;
}

module.exports = CollectionViewFlowLayoutFactory;
