function touchFactory(identifier, touchLocation, target) {
    this.identifier = identifier;
    this.target = target;

    this.startLocation = touchLocation;
    this.lastLocation = touchLocation;
    this.touchStartTime = Date.now();
    this.touchEndTime = null;
    this.velocity = {
        x: 0,
        y: 0,
        magnitude: function() {
            return Math.sqrt(this.x*this.x + this.y*this.y);
        }
    };

    this.getTouchDuration = function() {
        return (new Date()).getTime() - this.touchStart;
    };

    this.onMoved = function(newLocation) {
        if(!newLocation) {
            return;
        }
        var now = Date.now();
        var deltaX = newLocation.x - this.startLocation.x;
        var deltaY = newLocation.y - this.startLocation.y;
        var deltaT = now - this.touchStartTime;
        this.velocity.x = deltaX/deltaT;
        this.velocity.y = deltaY/deltaT;
        this.lastLocation = newLocation;
    };
    this.onEnded = function(endLocation) {
        this.lastLocation = endLocation;
        this.touchEndTime = Date.now();
    }
}

module.exports = touchFactory;
