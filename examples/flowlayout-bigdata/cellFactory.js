//Create your cell style
function SimpleCellFactory(data) {
    var _data = data;
    var _style = {};
    var SimpleCell = new rCV.CollectionViewCell.Protocol({
        "reuseIdentifier": "default",
        "highlighted": false,
        "selected": false,
        "prepareForReuse": function () {
        },
        "applyLayoutAttributes": function (attributes) {
            _style = {
                position: "absolute",
                top: attributes.frame.origin.y,
                left: attributes.frame.origin.x,
                height:attributes.frame.size.height,
                width: attributes.frame.size.width
            };
        },
        "getContentView": function () {
            var cellStyle = {
                "text-align": "center",
                "margin-top": cellSize.height/2 - 10
            };
            var Data = React.createElement('div', {style: cellStyle}, _data);
            var Border = React.createElement('div', {className:"simpleCell"}, Data);
            return React.createElement('div', { style: _style}, Border);
        },
        "setData": function (data) {
            _data = data;
        }
    });

    return SimpleCell;
}
