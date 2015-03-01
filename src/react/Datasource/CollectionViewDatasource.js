var t = require('tcomb-validation');

var Foundation = require('JSCoreGraphics').Foundation;
var CollectionViewCell = require('../Cell/CollectionViewCell');

var CollectionViewDatasourceProtocol = t.struct({
    "numberItemsInSection": t.func(Foundation.DataTypes.IndexPath, t.Num, "numberItemsInSection"),
    "numberOfSectionsInCollectionView": t.maybe(t.func(t.Nil, t.Num, "numberOfSectionsInCollectionView")),
    "cellForItemAtIndexPath": t.maybe(t.func(Foundation.DataTypes.IndexPath, t.maybe(CollectionViewCell.Protocol), "cellForItemAtIndexPath")),
    "viewForSupplementaryElementOfKind": t.maybe(t.func([t.Str, Foundation.DataTypes.IndexPath], t.maybe(CollectionViewCell.Protocol), "viewForSupplementaryElementOfKind"))
}, 'CollectionViewDatasourceProtocol');

module.exports.Protocol = CollectionViewDatasourceProtocol;
