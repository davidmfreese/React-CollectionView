var t = require('tcomb');

var Models = require('../Model/Models');
var CollectionViewLayoutDelegate = require('./CollectionViewLayoutDelegate');
var CollectionViewLayoutAttributes = require('./CollectionViewLayoutAttributes');
var CollectionViewDatasource = require('../Datasource/CollectionViewDatasource');

var LayoutModel = {};

LayoutModel.ArrayOfLayoutAttributes = t.list(CollectionViewLayoutAttributes.Protocol, "ArrayOfLayoutAttributes");

var CollectionViewLayoutProtocol = t.struct({
    "layoutDelegate": CollectionViewLayoutDelegate.Protocol,
    "getCollectionViewContentSize": t.func(t.Any, Models.Size),
    "prepareLayout": t.func(t.Any, t.Nil),//func is callback
    "layoutAttributesForElementsInRect":t.func(Models.Rect, LayoutModel.ArrayOfLayoutAttributes),
    "layoutAttributesForItemAtIndexPath":t.func(Models.IndexPath, CollectionViewLayoutAttributes.Protocol),
    "prepareForCollectionViewUpdates": t.func(t.Nil, t.Any),
    "invalidateLayout": t.func(t.Nil, t.Nil)
}, 'CollectionViewLayoutProtocol');

module.exports.Protocol = CollectionViewLayoutProtocol;
module.exports.Model = LayoutModel;
