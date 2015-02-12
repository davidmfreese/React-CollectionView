var t = require('tcomb');

var Models = require('../../Model/Models');
var Enums = require('../../Enums/Enums');
var CollectionViewLayoutAttributes = require('../../Layout/CollectionViewLayoutAttributes');

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
    HeaderReferenceSize: Models.Size,
    FooterReferenceSize: Models.Size
}, 'SectionLayoutDetails');

VerticalSectionLayoutDetails.prototype.getEstimatedRowForPoint = function (point) {
    //zero based
    return Math.max(0, Math.floor((point.y - this.Frame.origin.y + this.MinimumLineSpacing) / (this.RowHeight + this.MinimumLineSpacing)));
};

VerticalSectionLayoutDetails.prototype.getStartingIndexForRow = function (row) {
    //zero based
    return Math.max(0, row * this.NumberOfColumns);
};

VerticalSectionLayoutDetails.prototype.getRowForIndex = function (indexPath) {
    //zero based
    return Math.floor(indexPath.row / this.NumberOfColumns);
};

function creationSectionLayoutDetails(indexPath, numberItemsInSection, startY, opts) {
    var _constrainedHeightOrWidth = opts.width;

    var numberItems = numberItemsInSection;
    var availableWidth = _constrainedHeightOrWidth - opts.sectionInsets.left - opts.sectionInsets.right;
    var numberOfColumns = Math.floor((availableWidth - opts.itemSize.width) / (opts.itemSize.width + opts.minimumInteritemSpacing)) + 1;
    var actualInteritemSpacing = Math.floor((availableWidth - opts.itemSize.width * numberOfColumns) / (numberOfColumns - 1));
    var itemTotalWidth = opts.itemSize.width;
    var rowHeight = opts.itemSize.height;
    var numberOfTotalRows = Math.ceil(numberItems / numberOfColumns);
    var totalHeight = numberOfTotalRows * rowHeight + (numberOfTotalRows - 1) * opts.minimumLineSpacing;
    totalHeight += opts.headerReferenceSize.height + opts.footerReferenceSize.height;
    totalHeight += opts.sectionInsets.top + opts.sectionInsets.bottom;
    var sectionSize = Models.Size({width: _constrainedHeightOrWidth, height: totalHeight});

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
        MinimumLineSpacing: opts.minimumLineSpacing,
        SectionInsets: opts.sectionInsets,
        HeaderReferenceSize: opts.headerReferenceSize,
        FooterReferenceSize: opts.footerReferenceSize
    });

    return sectionLayout;
}

function getSections(rect, sectionsLayoutDetails) {
    var sections = [];
    var startSection = -1;
    var endSection = -1;

    var numberOfSections = sectionsLayoutDetails.length;
    for(var i = 0; i < numberOfSections; i++) {
        var layout = sectionsLayoutDetails[i];

        if(Models.Geometry.rectIntersects(rect, layout.Frame) || Models.Geometry.rectIntersects(layout.Frame, rect)) {
            sections.push(i);
        }
    }

    return sections;
};

function layoutAttributesForItemAtIndexPath(indexPath, sectionLayoutInfo, itemSize) {
    Models.IndexPath.is(indexPath);
    VerticalSectionLayoutDetails.is(sectionLayoutInfo);
    Models.Size.is(itemSize);

    var row = sectionLayoutInfo.getRowForIndex(indexPath);
    var y = sectionLayoutInfo.Frame.origin.y + row * sectionLayoutInfo.RowHeight;
    y += sectionLayoutInfo.MinimumLineSpacing * (row) + sectionLayoutInfo.HeaderReferenceSize.height + sectionLayoutInfo.SectionInsets.top;
    var column = indexPath.row % sectionLayoutInfo.NumberOfColumns;
    var x = column * sectionLayoutInfo.ItemTotalWidth + column * sectionLayoutInfo.ActualInteritemSpacing + sectionLayoutInfo.SectionInsets.left;
    var origin = new Models.Point({x: x, y: y});
    var size = new Models.Size({height: itemSize.height, width: itemSize.width});
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

function layoutAttributesForSupplementaryView(indexPath, sectionLayoutInfo, kind) {
    var layoutAttributes = null;

    if(kind == "header") {
        var frame = new Models.Rect({
            origin: new Models.Point({x: 0, y: sectionLayoutInfo.Frame.origin.y}),
            size: new Models.Size({height: sectionLayoutInfo.HeaderReferenceSize.height, width: sectionLayoutInfo.HeaderReferenceSize.width})
        });
        var layoutAttributes = new CollectionViewLayoutAttributes.Protocol({
            "indexPath": indexPath,
            "representedElementCategory": function(){
                return "CollectionElementTypeSupplementaryView";
            },
            "representedElementKind": function(){
                return kind.toString();
            },
            "frame": frame,
            "size": frame.size,
            "hidden": false
        });
    } else if(kind == "footer") {
        var frame = new Models.Rect({
            origin: new Models.Point({x: 0, y: sectionLayoutInfo.Frame.origin.y + sectionLayoutInfo.Frame.size.height - sectionLayoutInfo.FooterReferenceSize.height}),
            size: new Models.Size({height: sectionLayoutInfo.FooterReferenceSize.height, width: sectionLayoutInfo.FooterReferenceSize.width})
        });
        var layoutAttributes = new CollectionViewLayoutAttributes.Protocol({
            "indexPath": indexPath,
            "representedElementCategory": function(){
                return "CollectionElementTypeSupplementaryView";
            },
            "representedElementKind": function(){
                return kind;
            },
            "frame": frame,
            "size": frame.size,
            "hidden": false
        });
    }

    return layoutAttributes;
}

module.exports = {
    LayoutDetails: VerticalSectionLayoutDetails,
    CreateLayoutDetailsForSection: creationSectionLayoutDetails,
    GetSectionsForRect: getSections,
    LayoutAttributesForItemAtIndexPath: layoutAttributesForItemAtIndexPath,
    LayoutAttributesForSupplementaryView: layoutAttributesForSupplementaryView
}
