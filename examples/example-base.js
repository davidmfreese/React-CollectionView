function exampleUtils() {
    var exampleUtils = {}

    exampleUtils.getCollectionViewSizes = function (isScrollHorizontal) {
        var sizes = {};
        sizes.window = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        var constrainedSize = isScrollHorizontal ? sizes.window.height : sizes.window.width;

        var currentCellSize = 512;
        var minBlockSize = 24;
        var numberColumns = 0;
        var idealNumColumns = 5;
        var maxNumberColumns = 6;
        while(currentCellSize >= minBlockSize) {
            if(currentCellSize > 192 && currentCellSize <= 304) {
                idealNumColumns = 4;
            }
            else if(currentCellSize <= 192) {
                idealNumColumns = 3;
            }

            var numberColumns = Math.ceil(constrainedSize / currentCellSize);
            if(numberColumns >= maxNumberColumns) {
                numberColumns = maxNumberColumns;
                break;
            }
            else if (numberColumns == idealNumColumns) {
                break;
            }

            currentCellSize -= minBlockSize;
        }
        if (numberColumns < 3) {
            numberColumns = 3;
        }

        sizes.cellSize = {
            height: Math.floor(constrainedSize / numberColumns),
            width: Math.floor(constrainedSize / numberColumns)
        };

        return sizes;

    }
    return exampleUtils;
}


