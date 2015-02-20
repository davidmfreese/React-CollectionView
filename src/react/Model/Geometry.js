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

Geometry.isPointZero = function(point){
    return point.x == 0 && point.y == 0;
};

Geometry.isSizeZero = function(size){
    return size.height == sizeZero.height & size.width == sizeZero.width;
};

Geometry.isRectZero = function(rect){
    return this.isPointZero(rect.origin) && this.isSizeZero(rect.size);
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

Geometry.rectIntersects = function(rect1, rect2) {
    return  !(rect1.origin.x + rect1.size.width < rect2.origin.x
        || rect2.origin.x + rect2.size.width < rect1.origin.x
        || rect1.origin.y + rect1.size.height < rect2.origin.y
        || rect2.origin.y + rect2.size.width < rect1.origin.y)

        || (
                rect1.origin.x >= rect2.origin.x && rect1.origin.x <= rect2.origin.x + rect2.size.width
                && rect1.origin.y >= rect2.origin.y && rect1.origin.y <= rect2.origin.y + rect2.size.height
            )
};

Geometry.rectGetMaxX = function(rect) {
    return rect.origin.x + rect.size.width;
};

Geometry.rectGetMaxY = function(rect) {
    return rect.origin.y + rect.size.height;
};

module.exports = Geometry;