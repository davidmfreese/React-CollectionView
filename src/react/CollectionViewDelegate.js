var t = require('tcomb');

var Models = require('./Model/Models');

var CollectionViewDelegateProtocol = t.struct({
    "shouldSelectItemAtIndexPath": t.maybe(t.func(Models.IndexPath, t.Bool)),
    "didSelectItemAtIndexPath": t.maybe(t.func(Models.IndexPath, t.Nil)),
    "shouldDeselectItemAtIndexPath": t.maybe(t.func(Models.IndexPath, t.Bool)),

    "shouldHighlightItemAtIndexPath": t.maybe(t.func(Models.IndexPath, t.Bool)),
    "didHighlightItemAtIndexPath": t.maybe(t.func(Models.IndexPath, t.Nil)),
    "didUnhighlightItemAtIndexPath": t.maybe(t.func(Models.IndexPath, t.Nil)),

    "willDisplayCellForItemAtIndexPath": t.maybe(t.func(Models.IndexPath, t.Nil))
}, 'CollectionViewDelegateProtocol');

module.exports.Protocol = CollectionViewDelegateProtocol;