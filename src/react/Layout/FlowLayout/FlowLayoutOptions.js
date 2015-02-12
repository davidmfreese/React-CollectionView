var t = require('tcomb');

var Models = require('../../Model/Models');
var Enums = require('../../Enums/Enums');

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

module.exports.Options = FlowLayoutOptions;

function sanitizeOptions(opts) {
    FlowLayoutOptions.is(opts);

    var _constrainedHeightOrWidth = 0;
    var _itemSize = Models.Geometry.getSizeZero();
    var _sectionInsets = Models.Geometry.getInsetsZero();
    var _minInteritemSpacing = 0;
    var _minLineSpacing = 0;
    var _headerReferenceSize = Models.Geometry.getSizeZero();
    var _footerReferenceSize = Models.Geometry.getSizeZero();
    var _width = opts.width;
    var _height = opts.height;

    if(opts.flowDirection != "ScrollDirectionTypeVertical" && opts.flowDirection != "ScrollDirectionTypeHorizontal") {
        throw "Unsupported flow direction";
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

    } else if (opts.flowDirection == "ScrollDirectionTypeHorizontal") {
        _constrainedHeightOrWidth = opts.height;
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
