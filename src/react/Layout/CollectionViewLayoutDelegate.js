var t = require('tcomb-validation');

var Geometry = require('JSCoreGraphics').CoreGraphics.Geometry;
var Foundation = require('JSCoreGraphics').Foundation;
var Kit = require('JSCoreGraphics').Kit;
var CollectionViewDatasource = require('../Datasource/CollectionViewDatasource');

var CollectionViewLayoutDelegate = t.struct({
    "numberItemsInSection": t.func(Foundation.DataTypes.IndexPath, t.Num),
    "numberOfSectionsInCollectionView": t.maybe(t.func(t.Nil, t.Num)),
    "sizeForItemAtIndexPath": t.maybe(t.func(Foundation.DataTypes.IndexPath, Geometry.DataTypes.Size)),
    "insetForSectionAtIndex": t.maybe(t.func(Foundation.DataTypes.IndexPath, Kit.DataTypes.EdgeInsets)),
    "minimumLineSpacingForSectionAtIndex": t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Num)),
    "shouldSelectItemAtIndexPath": t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Bool)),
    "targetContentOffsetForProposedContentOffset": t.maybe(t.func(Geometry.DataTypes.Point, Geometry.DataTypes.Point))
}, 'CollectionViewLayoutDelegate');

module.exports.Protocol = CollectionViewLayoutDelegate;