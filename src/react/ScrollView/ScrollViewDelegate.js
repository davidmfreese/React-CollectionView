var t = require('tcomb-validation');

var Geometry = require('JSCoreGraphics').CoreGraphics.Geometry;

var ScrollViewDelegate = t.struct({
    "scrollViewDidScroll": t.maybe(t.func(Geometry.DataTypes.Point, t.Nil, "scrollViewDidScroll")),
    "scrollViewWilLBeginDragging": t.maybe(t.func(t.Obj, t.Nil, "scrollViewWilLBeginDragging")),
    "scrollViewDidScrollToTop": t.maybe(t.func(t.Obj, t.Nil, "scrollViewDidScrollToTop")),
    scrollViewDidEndScrollingAnimation: t.maybe(t.func(t.Obj, t.Nil, "scrollViewDidEndScrollingAnimation")),
    scrollViewDidEndDecelerating: t.maybe(t.func(t.Obj, t.Nil, "scrollViewDidEndDecelerating"))
}, 'ScrollViewDelegate');

module.exports.Protocol = ScrollViewDelegate;
