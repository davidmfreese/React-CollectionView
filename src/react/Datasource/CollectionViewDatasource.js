var t = require('tcomb');

var IndexPath = require('../Model/IndexPath');
var CollectionViewCell = require('../Cell/CollectionViewCell.jsx');

var CollectionViewDatasourceProtocol = t.struct({
    "numberItemsInSection": t.func(IndexPath, t.Num),
    "numberOfSectionsInCollectionView": t.maybe(t.func(t.Nil, t.Num)),
    "cellForItemAtIndexPath": t.maybe(t.func(IndexPath, t.maybe(CollectionViewCell.Protocol))),
    "viewForSupplementaryElementOfKind": t.maybe(t.func([t.Str, IndexPath], t.maybe(CollectionViewCell.Protocol)))
}, 'CollectionViewDatasourceProtocol');

module.exports.Protocol = CollectionViewDatasourceProtocol;
