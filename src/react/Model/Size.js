var t = require('tcomb');

var Size = t.struct({
    height: t.Num,
    width: t.Num
}, 'Size', true);

//var SizeFuncs = t.struct({
//    isSizeZero: t.func(Size, t.Bool)
//});
//
//Size = Size.extend(SizeFuncs);
//
//Size.prototype.isSizeZero = function(size) {
//    return size.height = 0 && size.width == 0;
//}

module.exports = Size;
