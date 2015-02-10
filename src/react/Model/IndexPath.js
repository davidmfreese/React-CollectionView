var t = require('tcomb');

var IndexPath = t.struct({
    row: t.Num,
    section: t.maybe(t.Num)
}, 'IndexPath');

module.exports = IndexPath;

