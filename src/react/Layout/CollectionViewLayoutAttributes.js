var t = require('tcomb-validation');
var tReact = require('tcomb-react');

var Geometry = require('JSCoreGraphics').CoreGraphics.Geometry;
var Foundation = require('JSCoreGraphics').Foundation;
var CollectionElementType = require('../Enums/CollectionElementType');

var CollectionViewLayoutAttributesProtocol = t.struct({
    "indexPath": Foundation.DataTypes.IndexPath,
    "representedElementCategory": t.func(t.Nil, t.Str),
    "representedElementKind": t.func(t.Nil, t.Str),
    "frame": Geometry.DataTypes.Rect,
    "size": Geometry.DataTypes.Size,
    "hidden": t.Bool
}, 'CollectionViewLayoutAttributesProtocol');

module.exports.Protocol = CollectionViewLayoutAttributesProtocol;