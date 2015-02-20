var t = require('tcomb');
var ScrollPositionType =
    t.enums.of('None Top CenteredVertically Bottom Left CenteredHorizontally Right', 'ScrollPositionType');

module.exports = ScrollPositionType;
