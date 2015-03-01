var t = require('tcomb-validation');

var Foundation = require('JSCoreGraphics').Foundation;

var CollectionViewDelegateProtocol = t.struct({
    "shouldSelectItemAtIndexPath": t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Bool)),
    "didSelectItemAtIndexPath": t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Nil)),
    "shouldDeselectItemAtIndexPath": t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Bool)),

    "shouldHighlightItemAtIndexPath": t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Bool)),
    "didHighlightItemAtIndexPath": t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Nil)),
    "didUnhighlightItemAtIndexPath": t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Nil)),

    "willDisplayCellForItemAtIndexPath": t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Nil))
}, 'CollectionViewDelegateProtocol');

module.exports.Protocol = CollectionViewDelegateProtocol;