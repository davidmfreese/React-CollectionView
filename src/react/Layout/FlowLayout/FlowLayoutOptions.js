var t = require('tcomb-validation');

var Geometry = require('JSCoreGraphics').CoreGraphics.Geometry;
var Foundation = require('JSCoreGraphics').Foundation;
var Kit = require('JSCoreGraphics').Kit;
var Enums = require('../../Enums/Enums');

var FlowLayoutOptions = t.struct({
    flowDirection: Enums.ScrollDirectionType,
    width: t.Num,
    height: t.Num,
    minimumLineSpacing: t.maybe(t.Num),
    minimumInteritemSpacing: t.maybe(t.Num),
    sectionInsets: t.maybe(Kit.DataTypes.EdgeInsets),
    itemSize: t.maybe(Geometry.DataTypes.Size),
    headerReferenceSize: t.maybe(Geometry.DataTypes.Size),
    footerReferenceSize: t.maybe(Geometry.DataTypes.Size)
},' FlowLayoutOptions');

module.exports.Options = FlowLayoutOptions;

function sanitizeOptions(opts) {
    FlowLayoutOptions.is(opts);

    var _constrainedHeightOrWidth = 0;
    var _itemSize = Geometry.Constants.sizeZero;
    var _sectionInsets = Kit.edgeInsetsZero;
    var _minInteritemSpacing = 0;
    var _minLineSpacing = 0;
    var _headerReferenceSize = Geometry.Constants.sizeZero;
    var _footerReferenceSize = Geometry.Constants.sizeZero;
    var _width = opts.width;
    var _height = opts.height;

    if(opts.flowDirection != "ScrollDirectionTypeVertical" && opts.flowDirection != "ScrollDirectionTypeHorizontal") {
        throw "Unsupported flow direction";
    }
    if(!opts.itemSize || Geometry.isSizeZero(opts.itemSize)) {
        throw "Non uniform item size is not implemented."
    }
    if(opts.itemSize) {
        Geometry.DataTypes.Size.is(opts.itemSize);
        _itemSize = opts.itemSize;
    }
    if(opts.sectionInsets) {
        Kit.DataTypes.EdgeInsets.is(opts.sectionInsets);
        _sectionInsets = opts.sectionInsets;
    }
    if(opts.flowDirection == "ScrollDirectionTypeVertical") {
        _constrainedHeightOrWidth = opts.width;

    } else if (opts.flowDirection == "ScrollDirectionTypeHorizontal") {
        _constrainedHeightOrWidth = opts.height;
    }
    if(opts.minimumInteritemSpacing) {
        _minInteritemSpacing = opts.minimumInteritemSpacing;
    }
    if(opts.minimumLineSpacing) {
        _minLineSpacing = opts.minimumLineSpacing;
    }
    if(opts.headerReferenceSize && Geometry.DataTypes.Size.is(opts.headerReferenceSize)) {
        _headerReferenceSize = opts.headerReferenceSize;
    }
    if(opts.footerReferenceSize && Geometry.DataTypes.Size.is(opts.footerReferenceSize)) {
        _footerReferenceSize = opts.footerReferenceSize;
    }

    var sanitizedOptions = new FlowLayoutOptions({
        flowDirection: opts.flowDirection,
        width: _width,
        height: _height,
        minimumLineSpacing: _minLineSpacing,
        minimumInteritemSpacing: _minInteritemSpacing,
        sectionInsets: _sectionInsets,
        itemSize: _itemSize,
        headerReferenceSize: _headerReferenceSize,
        footerReferenceSize: _footerReferenceSize
    });

    return sanitizedOptions;
}

module.exports.SanitizeOptions = sanitizeOptions;
