function touchFactory(identifier, touchLocation, target) {
    this.identifier = identifier;
    this.target = target;

    this.startLocation = touchLocation;
    this.lastLocation = touchLocation;
    this.touchStartTime = Date.now();
    this.touchEndTime = null;
    this.velocity =
        this.getTouchDuration = function() {
            return (new Date()).getTime() - this.touchStart;
        }
    this.onMoved = function(newLocation) {
        if(!newLocation) {
            return;
        }
        var now = Date.now();
        var deltaX = newLocation.x - this.startLocation.x;
        var deltaY = newLocation.y - this.startLocation.y;
        var deltaT = now - this.touchStartTime;
        this.velocity = Math.sqrt(deltaX*deltaX+deltaY*deltaY)/deltaT;
        this.lastLocation = newLocation;
    }
    this.onEnded = function(endLocation) {
        this.lastLocation = endLocation;
        this.touchEndTime = Date.now();
    }
}

module.exports = touchFactory;
