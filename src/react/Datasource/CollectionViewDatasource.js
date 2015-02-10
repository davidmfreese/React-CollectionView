var t = require('tcomb');

var IndexPath = require('../Model/IndexPath');
var CollectionViewCell = require('../Cell/CollectionViewCell.jsx');

var CollectionViewDatasourceProtocol = t.struct({
    "numberItemsInSection": t.func(t.Num, t.Num),
    "numberOfSectionsInCollectionView": t.maybe(t.func(t.Nil, t.Num)),
    "cellForItemAtIndexPath": t.maybe(t.func(IndexPath, CollectionViewCell.Protocol)),
    "viewForSupplementaryElementOfKind": t.maybe(t.func([t.Str, IndexPath], CollectionViewCell.Protocol))
}, 'CollectionViewDatasourceProtocol');

module.exports.Protocol = CollectionViewDatasourceProtocol;
