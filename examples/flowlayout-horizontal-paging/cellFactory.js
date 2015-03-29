//Create your cell style
function SimpleCellFactory(data, indexPath) {
    var _indexPath = indexPath;
    var _data = data;
    var _style = {};

    var SimpleCell = new rCV.CollectionViewCell.Protocol({
        reuseIdentifier: "default",
        highlighted: false,
        selected: false,
        prepareForReuse: function () {
        },
        applyLayoutAttributes: function (attributes) {
            _style = {
                position: "absolute",
                top: attributes.frame.origin.y,
                left: attributes.frame.origin.x,
                height:attributes.frame.size.height,
                width: attributes.frame.size.width
            };
        },
        getContentView: function () {

            var Img = React.createElement('img',
                {
                    src: imageForCells[_indexPath.row],
                    style:{width:"100%"}
                });

            return React.createElement('div',
                {
                    style: _style,
                    key: "section:" + _indexPath.section + ";row" + _indexPath.row,
                }, Img);

        },
        setData: function (data) {
            _data = data;
        }

    });

    return SimpleCell;
}