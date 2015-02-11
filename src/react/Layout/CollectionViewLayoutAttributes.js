var t = require('tcomb');
var tReact = require('tcomb-react');

var Models = require('../Model/Models');
var CollectionElementType = require('../Enums/CollectionElementType');

var CollectionViewLayoutAttributesProtocol = t.struct({
    "indexPath": Models.IndexPath,
    "representedElementCategory": t.func(t.Nil, t.Str),
    "representedElementKind": t.func(t.Nil, t.Str),
    "frame": Models.Rect,
    "size": Models.Size,
    "hidden": t.Bool
}, 'CollectionViewLayoutAttributesProtocol');

module.exports.Protocol = CollectionViewLayoutAttributesProtocol;