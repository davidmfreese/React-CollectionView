var t = require('tcomb-validation');

var Geometry = require('JSCoreGraphics').CoreGraphics.Geometry;

var ScrollViewDelegate = t.struct({
    "scrollViewDidScroll": t.maybe(t.func(Geometry.DataTypes.Point, t.Nil)),
    "scrollViewWilLBeginDragging": t.maybe(t.func(t.Obj, t.Nil)),
    "scrollViewDidScrollToTop": t.maybe(t.func(t.Obj, t.Nil)),
    scrollViewDidEndScrollingAnimation: t.maybe(t.func(t.Obj, t.Nil)),
    scrollViewDidEndDecelerating: t.maybe(t.func(t.Obj, t.Nil))
}, 'ScrollViewDelegate');

module.exports.Protocol = ScrollViewDelegate;
