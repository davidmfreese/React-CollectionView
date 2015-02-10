var t = require('tcomb');
var tReact = require('tcomb-react');

var Models = require('../Model/Models');
var CollectionElementType = require('../Enums/CollectionElementType');

var CollectionViewLayoutAttributesProtocol = t.struct({
    "indexPath": Models.IndexPath,
    "representedElementCategory": t.func(t.Nil, CollectionElementType),
    "representedElementKind": t.func(t.Nil, t.Str),
    "frame": Models.Rect,
    "size": Models.Size,
    "hidden": t.Bool
}, 'CollectionViewLayoutAttributesProtocol');

module.exports.Protocol = CollectionViewLayoutAttributesProtocol;

//Identifying the Referenced Item
//    indexPath - Property
//    representedElementCategory - Property
//    representedElementKind - Property
//    Accessing the Layout Attributes
//    frame - Property
//    bounds - Property
//    center - Property
//    size - Property
//    transform3D - Property
//    transform - Property
//    alpha - Property
//    zIndex - Property
//    hidden - Property
//
//Constants
//    CollectionElementType