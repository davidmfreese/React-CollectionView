var t = require('tcomb');

var Models = require('../Model/Models');
var CollectionViewDatasource = require('../Datasource/CollectionViewDatasource');

var CollectionViewLayoutDelegate = t.struct({
    "numberItemsInSection": t.func(Models.IndexPath, t.Num),
    "numberOfSectionsInCollectionView": t.maybe(t.func(t.Nil, t.Num)),
    "sizeForItemAtIndexPath": t.maybe(t.func(Models.IndexPath, Models.Size)),
    "insetForSectionAtIndex": t.maybe(t.func(Models.IndexPath, Models.EdgeInsets)),
    "minimumLineSpacingForSectionAtIndex": t.maybe(t.func(Models.IndexPath, t.Num)),
    "shouldSelectItemAtIndexPath": t.maybe(t.func(Models.IndexPath, t.Bool))
}, 'CollectionViewLayoutDelegate');

module.exports.Protocol = CollectionViewLayoutDelegate;