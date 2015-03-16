var t = require("tcomb-validation");

var Foundation = require("JSCoreGraphics").Foundation;

var CollectionViewDelegateProtocol = t.struct({
    shouldSelectItemAtIndexPath: t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Bool, "shouldSelectItemAtIndexPath")),
    didSelectItemAtIndexPath: t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Nil, "didSelectItemAtIndexPath")),
    shouldDeselectItemAtIndexPath: t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Bool, "shouldDeselectItemAtIndexPath")),
    didDeselectItemAtIndexPath: t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Nil, "shouldDeselectItemAtIndexPath")),

    shouldHighlightItemAtIndexPath: t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Bool, "shouldHighlightItemAtIndexPath")),
    didHighlightItemAtIndexPath: t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Nil, "didHighlightItemAtIndexPath")),
    didUnhighlightItemAtIndexPath: t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Nil, "didUnhighlightItemAtIndexPath")),

    willDisplayCellForItemAtIndexPath: t.maybe(t.func(Foundation.DataTypes.IndexPath, t.Nil, "willDisplayCellForItemAtIndexPath"))
}, "CollectionViewDelegateProtocol");

module.exports.Protocol = CollectionViewDelegateProtocol;