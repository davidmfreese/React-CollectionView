var t = require('tcomb-validation');

var Foundation = require('JSCoreGraphics').Foundation;
var CollectionViewCell = require('../Cell/CollectionViewCell.jsx');

var CollectionViewDatasourceProtocol = t.struct({
    "numberItemsInSection": t.func(Foundation.DataTypes.IndexPath, t.Num),
    "numberOfSectionsInCollectionView": t.maybe(t.func(t.Nil, t.Num)),
    "cellForItemAtIndexPath": t.maybe(t.func(Foundation.DataTypes.IndexPath, t.maybe(CollectionViewCell.Protocol))),
    "viewForSupplementaryElementOfKind": t.maybe(t.func([t.Str, Foundation.DataTypes.IndexPath], t.maybe(CollectionViewCell.Protocol)))
}, 'CollectionViewDatasourceProtocol');

module.exports.Protocol = CollectionViewDatasourceProtocol;
