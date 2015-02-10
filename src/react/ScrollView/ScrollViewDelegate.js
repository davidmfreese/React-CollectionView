var t = require('tcomb');

var Models = require('../Model/Models');
var Enums = require('../Enums/Enums');

var ScrollViewDelegate = t.struct({
    "scrollViewDidScroll": t.maybe(t.func([Enums.ScrollDirectionType, t.Num, t.Num], t.Nil)), //Direction, ScrollPosition (scrollTop), BottomOfView (ScrollTOp = BottomView means scrolled to bottom)
    "scrollViewWilLBeginDragging": t.maybe(t.func(t.Nil, t.Nil)),
    "scrollViewDidScrollToTop": t.maybe(t.func(t.Nil, t.Nil))
}, 'ScrollViewDelegate');

module.exports.Protocol = ScrollViewDelegate;
