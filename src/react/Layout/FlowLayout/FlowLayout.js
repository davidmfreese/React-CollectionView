var t = require("tcomb-validation");

var Geometry = require("JSCoreGraphics").CoreGraphics.Geometry;
var Foundation = require("JSCoreGraphics").Foundation;
var FlowLayoutOptions = require("./FlowLayoutOptions");
var HorizontalFlowLayout = require("./HorizontalFlowLayout");
var VerticalFlowLayout = require("./VerticalFlowLayout");
var CollectionViewDatasource = require("./../CollectionViewLayout");
var CollectionViewLayout = require("./../CollectionViewLayout");
var CollectionViewLayoutDelegate = require("./../CollectionViewLayoutDelegate");

function CollectionViewFlowLayoutFactory(layoutDelegate, opts) {
    CollectionViewLayoutDelegate.Protocol.is(layoutDelegate);
    var sanitizedOpts = FlowLayoutOptions.SanitizeOptions(opts);

    var _sectionLayoutDetails = [];
    var _totalContentSize = Geometry.Constants.sizeZero;
    var _constrainedHeightOrWidth = 0;

    var setConstrainedHeightOrWidth = function () {
        if (sanitizedOpts.flowDirection == "ScrollDirectionTypeVertical") {
            _constrainedHeightOrWidth = sanitizedOpts.width;
        }
        else if (sanitizedOpts.flowDirection == "ScrollDirectionTypeHorizontal") {
            _constrainedHeightOrWidth = sanitizedOpts.height;
        }
    };
    setConstrainedHeightOrWidth();

    var prepareLayout = function () {
        _sectionLayoutDetails = [];
        _totalContentSize = Geometry.Constants.sizeZero;
        setConstrainedHeightOrWidth();

        var numberOfSections = layoutDelegate.numberOfSectionsInCollectionView.call(this, null);
        if (sanitizedOpts.flowDirection == "ScrollDirectionTypeVertical") {
            var totalHeight = 0;
            var startY = 0;
            for (var i = 0; i < numberOfSections; i++) {
                var indexPath = new Foundation.DataTypes.IndexPath({row: 0, section: i});
                var numberItemsInSection = layoutDelegate.numberItemsInSection(indexPath);
                var sectionLayoutInfo = VerticalFlowLayout.CreateLayoutDetailsForSection(indexPath, numberItemsInSection, startY, sanitizedOpts);
                _sectionLayoutDetails[i] = sectionLayoutInfo;
                totalHeight += sectionLayoutInfo.Frame.size.height;

                startY += sectionLayoutInfo.Frame.size.height;
            }

            _totalContentSize = new Geometry.DataTypes.Size({height: totalHeight, width: _constrainedHeightOrWidth});

        }
        else if (opts.flowDirection == "ScrollDirectionTypeHorizontal") {
            var totalWidth = 0;
            var startX = 0;
            for (var i = 0; i < numberOfSections; i++) {
                var indexPath = new Foundation.DataTypes.IndexPath({row: 0, section: i});
                var numberItemsInSection = layoutDelegate.numberItemsInSection(indexPath);
                var sectionLayoutInfo = HorizontalFlowLayout.CreateLayoutDetailsForSection(indexPath, numberItemsInSection, startX, sanitizedOpts);
                _sectionLayoutDetails[i] = sectionLayoutInfo;
                totalWidth += sectionLayoutInfo.Frame.size.width;

                startX += sectionLayoutInfo.Frame.size.width;
            }

            _totalContentSize = new Geometry.DataTypes.Size({height: _constrainedHeightOrWidth, width: totalWidth});
        }
    };

    var CollectionViewFlowLayout = new CollectionViewLayout.Protocol({
        layoutDelegate: layoutDelegate,
        getCollectionViewContentSize: function () {
            if (_totalContentSize && _totalContentSize.width > 0) {
                return _totalContentSize;
            }

            var numberOfSections = layoutDelegate.numberOfSectionsInCollectionView.call(this, null);
            if (_sectionLayoutDetails && _sectionLayoutDetails[numberOfSections - 1]) {
                var height = 0;
                for (var i = 0; i < numberOfSections; i++) {
                    height += _sectionLayoutDetails[i].Frame.size.height;
                }

                if (height > 0) {
                    _totalContentSize = new Geometry.DataTypes.Size({width: _width, height: height});
                }
                else {
                    _totalContentSize = Geometry.Constants.sizeZero;
                }
            }
            else {
                _totalContentSize = Geometry.Constants.sizeZero;
            }
            return _totalContentSize;
        },
        prepareLayout: function (callback) {
            prepareLayout();
            if (callback) {
                callback("success");
            }
        },
        layoutAttributesForElementsInRect: function (rect) {
            var layoutAttributesInRect = [];

            if (Geometry.isRectZero(rect)) {
                return layoutAttributesInRect;
            }
            if (opts.flowDirection == "ScrollDirectionTypeVertical") {

                var sections = VerticalFlowLayout.GetSectionsForRect(rect, _sectionLayoutDetails);
                var firstSection = _sectionLayoutDetails[sections[0]];
                if (!firstSection) {
                    return layoutAttributesInRect;
                }

                var currentY = firstSection.Frame.origin.y;
                for (var j = 0; j < sections.length; j++) {
                    var sectionNum = sections[j];
                    var indexPath = new Foundation.DataTypes.IndexPath({row: 0, section: sectionNum});
                    var numberItemsInSection = this.layoutDelegate.numberItemsInSection(indexPath);
                    var currentSection = _sectionLayoutDetails[sectionNum];
                    if (currentSection.Frame.origin.y > rect.origin.y + rect.size.height) {
                        break;
                    }

                    var header = VerticalFlowLayout.LayoutAttributesForSupplementaryView(indexPath, _sectionLayoutDetails[indexPath.section], "header");
                    if (header && !Geometry.isSizeZero(header.frame.size)) {
                        layoutAttributesInRect.push(header);
                    }

                    var startRow = currentSection.getEstimatedRowForPoint(rect.origin);
                    var startIndex = currentSection.getStartingIndexForRow(startRow);

                    for (var i = startIndex; i < numberItemsInSection; i++) {
                        var indexPath = new Foundation.DataTypes.IndexPath({row: i, section: sectionNum});
                        var layoutAttributes = this.layoutAttributesForItemAtIndexPath(indexPath);
                        if (layoutAttributes.frame.origin.y + layoutAttributes.size.height < rect.origin.y) {
                            continue;
                        }
                        if (layoutAttributes.frame.origin.y > rect.origin.y + rect.size.height) {
                            break;
                        }
                        if (Geometry.rectIntersectsRect(layoutAttributes.frame, rect)) {
                            layoutAttributesInRect.push(layoutAttributes);
                        }
                        else {
                            //console.log("no intersection");
                        }
                    }

                    var footer = VerticalFlowLayout.LayoutAttributesForSupplementaryView(indexPath, _sectionLayoutDetails[indexPath.section], "footer");
                    if (footer && !Geometry.isSizeZero(footer.frame.size)) {
                        layoutAttributesInRect.push(footer);
                    }
                }
            }
            else if (opts.flowDirection == "ScrollDirectionTypeHorizontal") {

                var sections = HorizontalFlowLayout.GetSectionsForRect(rect, _sectionLayoutDetails);
                var firstSection = _sectionLayoutDetails[sections[0]];
                if (!firstSection) {
                    return layoutAttributesInRect;
                }

                var currentX = firstSection.Frame.origin.x;
                for (var j = 0; j < sections.length; j++) {
                    var sectionNum = sections[j];
                    var indexPath = new Foundation.DataTypes.IndexPath({row: 0, section: sectionNum});
                    var numberItemsInSection = this.layoutDelegate.numberItemsInSection(indexPath);
                    var currentSection = _sectionLayoutDetails[sectionNum];
                    if (currentSection.Frame.origin.x > rect.origin.x + rect.size.width) {
                        break;
                    }

                    var header = HorizontalFlowLayout.LayoutAttributesForSupplementaryView(indexPath, _sectionLayoutDetails[indexPath.section], "header");
                    if (header && !Geometry.isSizeZero(header.frame.size)) {
                        layoutAttributesInRect.push(header);
                    }

                    var startRow = currentSection.getEstimatedColumnForPoint(rect.origin);
                    var startIndex = currentSection.getStartingIndexForColumn(startRow);

                    for (var i = startIndex; i < numberItemsInSection; i++) {
                        var indexPath = new Foundation.DataTypes.IndexPath({row: i, section: sectionNum});
                        var layoutAttributes = this.layoutAttributesForItemAtIndexPath(indexPath);
                        if (layoutAttributes.frame.origin.x + layoutAttributes.size.height < rect.origin.x) {
                            continue;
                        }
                        if (layoutAttributes.frame.origin.x > rect.origin.x + rect.size.width) {
                            break;
                        }
                        if (Geometry.rectIntersectsRect(layoutAttributes.frame, rect)) {
                            layoutAttributesInRect.push(layoutAttributes);
                        }
                        else {
                            //console.log("no intersection");
                        }
                    }

                    var footer = HorizontalFlowLayout.LayoutAttributesForSupplementaryView(indexPath, _sectionLayoutDetails[indexPath.section], "footer");
                    if (footer && !Geometry.isSizeZero(footer.frame.size)) {
                        layoutAttributesInRect.push(footer);
                    }
                }
            }


            return new CollectionViewLayout.Model.ArrayOfLayoutAttributes(layoutAttributesInRect);
        },
        layoutAttributesForItemAtIndexPath: function (indexPath) {

            if (opts.flowDirection == "ScrollDirectionTypeVertical") {
                var attributes = VerticalFlowLayout.LayoutAttributesForItemAtIndexPath(indexPath, _sectionLayoutDetails[indexPath.section], sanitizedOpts.itemSize);
                return attributes;
            }
            else if (opts.flowDirection == "ScrollDirectionTypeHorizontal") {
                var attributes = HorizontalFlowLayout.LayoutAttributesForItemAtIndexPath(indexPath, _sectionLayoutDetails[indexPath.section], sanitizedOpts.itemSize);
                return attributes;
            }
        },
        prepareForCollectionViewUpdates: function () {

        },
        invalidateLayout: function () {
            prepareLayout();
        }
    }, true);//allow this to be mutable

    return CollectionViewFlowLayout;
}

module.exports = CollectionViewFlowLayoutFactory;
