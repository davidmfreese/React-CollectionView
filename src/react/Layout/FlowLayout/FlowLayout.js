var t = require('tcomb');

var Models = require('../../Model/Models');
var Enums = require('../../Enums/Enums');
var FlowLayoutOptions = require('./FlowLayoutOptions');
//var HorizontalFlowLayout = require('./HorizontalFlowLayout');
var VerticalFlowLayout = require('./VerticalFlowLayout');
var CollectionViewDatasource = require('./../CollectionViewLayout');
var CollectionViewLayout = require('./../CollectionViewLayout');
var CollectionViewLayoutDelegate = require('./../CollectionViewLayoutDelegate');
var CollectionViewLayoutAttributes = require('./../CollectionViewLayoutAttributes');

function CollectionViewFlowLayoutFactory(layoutDelegate, opts) {
    CollectionViewLayoutDelegate.Protocol.is(layoutDelegate);
    var sanitizedOpts = FlowLayoutOptions.SanitizeOptions(opts);

    var _sectionLayoutDetails = [];
    var _totalContentSize = Models.Geometry.getSizeZero();
    var _constrainedHeightOrWidth = 0;

    var setConstrainedHeightOrWidth = function() {
        if(sanitizedOpts.flowDirection == "ScrollDirectionTypeVertical") {
            _constrainedHeightOrWidth = sanitizedOpts.width;
        } else if(sanitizedOpts.flowDirection == "ScrollDirectionTypeHorizontal") {
            _constrainedHeightOrWidth = sanitizedOpts.height;
        }
    };

    setConstrainedHeightOrWidth();

    var prepareLayout = function() {
        if(sanitizedOpts.flowDirection == "ScrollDirectionTypeVertical") {
            _sectionLayoutDetails = [];
            _totalContentSize = Models.Geometry.getSizeZero();
            setConstrainedHeightOrWidth();
            var numberOfSections = layoutDelegate.numberOfSectionsInCollectionView.call(this, null);
            var totalHeight = 0;
            var startY = 0;
            for (var i = 0; i < numberOfSections; i++) {
                var indexPath = new Models.IndexPath({row: 0, section: i});
                var numberItemsInSection = layoutDelegate.numberItemsInSection(indexPath);
                var sectionLayoutInfo = VerticalFlowLayout.CreateLayoutDetailsForSection(indexPath, numberItemsInSection, startY, sanitizedOpts);
                _sectionLayoutDetails[i] = sectionLayoutInfo;
                totalHeight += sectionLayoutInfo.Frame.size.height;

                startY += sectionLayoutInfo.Frame.size.height;
            }

            _totalContentSize = new Models.Size({height: totalHeight, width: _constrainedHeightOrWidth});
        } else if(opts.flowDirection == "ScrollDirectionTypeHorizontal") {
            //Coming soon
        }
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

                var sections = VerticalFlowLayout.GetSectionsForRect(rect, _sectionLayoutDetails);
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

                    var header = VerticalFlowLayout.LayoutAttributesForSupplementaryView(indexPath, _sectionLayoutDetails[indexPath.section], "header");
                    if(header && !Models.Geometry.isSizeZero(header.frame.size)) {
                        layoutAttributesInRect.push(header);
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

                    var footer = VerticalFlowLayout.LayoutAttributesForSupplementaryView(indexPath, _sectionLayoutDetails[indexPath.section], "footer");
                    if(footer && !Models.Geometry.isSizeZero(footer.frame.size)) {
                        layoutAttributesInRect.push(footer);
                    }
                }
            }

            return new CollectionViewLayout.Model.ArrayOfLayoutAttributes(layoutAttributesInRect);
        },
        "layoutAttributesForItemAtIndexPath": function(indexPath) {

            if((opts.flowDirection == "ScrollDirectionTypeVertical")) {
                var attributes = VerticalFlowLayout.LayoutAttributesForItemAtIndexPath(indexPath, _sectionLayoutDetails[indexPath.section], sanitizedOpts.itemSize);
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
