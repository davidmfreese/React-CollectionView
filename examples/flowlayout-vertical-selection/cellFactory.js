//Create your cell style
function SimpleCellFactory(data) {
    var _attributes = undefined;
    var SimpleCell = new rCV.CollectionViewCell.Protocol({
        reuseIdentifier: "default",
        highlighted: false,
        selected: false,
        prepareForReuse: function () {
            this.selected = false;
            this.highlighted = false;
            _attributes = undefined;
        },
        applyLayoutAttributes: function (attributes) {
            _attributes = attributes;
        },
        getContentView: function () {
            var positionStyle = {
                position: "absolute",
                top: _attributes.frame.origin.y,
                left: _attributes.frame.origin.x,
                height:_attributes.frame.size.height,
                width: _attributes.frame.size.width,
                backgroundColor: "white"
            };

            if(this.selected) {
                positionStyle["msTransform"] = "rotate(20deg)";
                positionStyle["WebkitTransform"] = "rotate(20deg)";
                positionStyle["transform"] = "rotate(20deg)";
                positionStyle["zIndex"] = 1000;
                positionStyle["backgroundColor"] = "yellow"
                positionStyle.left = positionStyle.left - positionStyle.width*.10;
                positionStyle.top = positionStyle.top - positionStyle.height*.10;
                positionStyle.height = positionStyle.height*1.20;
                positionStyle.width = positionStyle.width*1.20;
            }

            var cellStyle = {
                "text-align": "center",
                "margin-top": positionStyle.height/2 - 10
            };

            var Data = React.createElement('div', {style: cellStyle}, data);
            var Border = React.createElement('div', {className:"simpleCell"}, Data);
            return React.createElement('div', { style: positionStyle}, Border);
        },
        setData: function (data) {
        }

    }, true); //make mutable

    return SimpleCell;
}
