var t = require('tcomb');

var Models = require('../Model/Models');
var Enums = require('../Enums/Enums');

var ScrollViewDelegate = t.struct({
    "scrollViewDidScroll": t.maybe(t.func(Models.Point, t.Nil)),
    "scrollViewWilLBeginDragging": t.maybe(t.func(t.Obj, t.Nil)),
    "scrollViewDidScrollToTop": t.maybe(t.func(t.Obj, t.Nil)),
    scrollViewDidEndScrollingAnimation: t.maybe(t.func(t.Obj, t.Nil)),
    scrollViewDidEndDecelerating: t.maybe(t.func(t.Obj, t.Nil))
}, 'ScrollViewDelegate');

module.exports.Protocol = ScrollViewDelegate;
