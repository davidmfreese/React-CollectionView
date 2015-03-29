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
