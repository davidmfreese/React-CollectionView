var t = require("tcomb-validation");
var ScrollPositionType =
    t.enums.of("None Top CenteredVertically Bottom Left CenteredHorizontally Right", "ScrollPositionType");

module.exports = ScrollPositionType;
