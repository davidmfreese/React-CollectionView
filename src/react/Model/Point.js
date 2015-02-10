var t = require('tcomb');

var Point = t.struct({
    x: t.Num,
    y: t.Num
}, 'Point');

module.exports = Point;