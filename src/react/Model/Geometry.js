var Point = require('./Point');
var Size = require('./Size');
var Rect = require('./Rect');
var EdgeInsets = require('./EdgeInsets');

var Geometry = {};

var pointZero = new Point({x: 0, y: 0});
var sizeZero = new Size({height:0, width:0});
var rectZero = new Rect({
    origin: pointZero,
    size: sizeZero
});
var insetsZero = new EdgeInsets({top: 0, bottom: 0, left: 0, right: 0});

Geometry.isSizeZero = function(size){
    return size.height == sizeZero.height & size.width == sizeZero.width;
};

Geometry.getPointZero = function() {
    return pointZero;
};

Geometry.getSizeZero = function() {
    return sizeZero;
};

Geometry.getRectZero = function() {
    return rectZero;
};

Geometry.getInsetsZero = function() {
    return insetsZero;
};

module.exports = Geometry;