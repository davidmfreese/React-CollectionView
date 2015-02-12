var t = require('tcomb');

var Models = require('../../Model/Models');
var Enums = require('../../Enums/Enums');
var CollectionViewLayoutAttributes = require('../../Layout/CollectionViewLayoutAttributes');

var HorizontalSectionLayoutDetails = t.struct({
    Frame: Models.Rect,
    NumberItems: t.Num,
    NumberOfTotalColumns: t.Num,
    ColumnWidth: t.Num,
    NumberOfRows: t.Num,
    MinimumInteritemSpacing: t.Num,
    ActualLineSpacing: t.Num,
    RowHeight: t.Num,
    SectionInsets: Models.EdgeInsets,
    HeaderReferenceSize: Models.Size,
    FooterReferenceSize: Models.Size
}, 'SectionLayoutDetails');

HorizontalSectionLayoutDetails.prototype.getEstimatedColumnForPoint = function (point) {
    //zero based
    return Math.max(0, Math.floor((point.x - this.Frame.origin.x + this.ActualLineSpacing) / (this.RowHeight + this.ActualLineSpacing)));
};

HorizontalSectionLayoutDetails.prototype.getStartingIndexForColumn = function (column) {
    //zero based
    return Math.max(0, column * this.NumberOfRows);
};

HorizontalSectionLayoutDetails.prototype.getColumnForIndex = function (indexPath) {
    //zero based
    return Math.floor(indexPath.row / this.NumberOfRows);
};

function creationSectionLayoutDetails(indexPath, numberItemsInSection, startX, opts) {
    var _constrainedHeightOrWidth = opts.height;

    var numberItems = numberItemsInSection;
    var availableHeight = _constrainedHeightOrWidth - opts.sectionInsets.top - opts.sectionInsets.bottom;
    var numberOfRows = Math.floor((availableHeight - opts.itemSize.height) / (opts.itemSize.height + opts.minimumLineSpacing)) + 1;

    var actualLineSpacing = Math.floor((availableHeight - opts.itemSize.height * numberOfRows) / Math.max(1, (numberOfRows - 1)));
    var itemTotalWidth = opts.itemSize.width;
    var rowHeight = opts.itemSize.height;
    var numberOfTotalColumns = Math.ceil(numberItems / numberOfRows);
    var totalWidth = numberOfTotalColumns * rowHeight + (numberOfTotalColumns - 1) * opts.minimumInteritemSpacing;
    totalWidth += opts.headerReferenceSize.width + opts.footerReferenceSize.width;
    totalWidth += opts.sectionInsets.left + opts.sectionInsets.right;
    var sectionSize = Models.Size({width: totalWidth, height: _constrainedHeightOrWidth});

    var sectionLayout = new HorizontalSectionLayoutDetails({
        Frame: new Models.Rect({
            origin: new Models.Point({x: startX, y: 0}),
            size: sectionSize
        }),
        NumberItems: numberItemsInSection,
        NumberOfTotalColumns: numberOfTotalColumns,
        ColumnWidth: itemTotalWidth,
        NumberOfRows: numberOfRows,
        MinimumInteritemSpacing: opts.minimumInteritemSpacing,
        ActualLineSpacing: actualLineSpacing,
        RowHeight: rowHeight,
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
    HorizontalSectionLayoutDetails.is(sectionLayoutInfo);
    Models.Size.is(itemSize);

    var column = sectionLayoutInfo.getColumnForIndex(indexPath);
    var x = sectionLayoutInfo.Frame.origin.x + column * sectionLayoutInfo.ColumnWidth + sectionLayoutInfo.MinimumInteritemSpacing * (column);
    x +=  + sectionLayoutInfo.HeaderReferenceSize.width + sectionLayoutInfo.SectionInsets.left;

    var row = indexPath.row % sectionLayoutInfo.NumberOfRows;
    var y = row * sectionLayoutInfo.RowHeight + row * sectionLayoutInfo.ActualLineSpacing;
    + sectionLayoutInfo.SectionInsets.top;
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
}

function layoutAttributesForSupplementaryView(indexPath, sectionLayoutInfo, kind) {
    var layoutAttributes = null;

    if(kind == "header") {
        var frame = new Models.Rect({
            origin: new Models.Point({x: sectionLayoutInfo.Frame.origin.x, y: 0}),
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
        var x = sectionLayoutInfo.Frame.origin.x + sectionLayoutInfo.Frame.size.width - sectionLayoutInfo.FooterReferenceSize.width
        var frame = new Models.Rect({
            origin: new Models.Point({x: x, y: 0}),
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
    LayoutDetails: HorizontalSectionLayoutDetails,
    CreateLayoutDetailsForSection: creationSectionLayoutDetails,
    GetSectionsForRect: getSections,
    LayoutAttributesForItemAtIndexPath: layoutAttributesForItemAtIndexPath,
    LayoutAttributesForSupplementaryView: layoutAttributesForSupplementaryView
}
