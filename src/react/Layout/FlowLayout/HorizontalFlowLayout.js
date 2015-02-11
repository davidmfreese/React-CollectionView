//
//var setLayoutForHorizontalSection = function(indexPath) {
//    if(!_sectionLayoutDetails) {
//        _sectionLayoutDetails = [];
//    }
//
//    var numberItems = layoutDelegate.numberItemsInSection(indexPath);
//    var availableHeight = _constrainedHeightOrWidth - _sectionInsets.top - _sectionInsets.right;
//    var numberOfRows =  Math.floor((availableHeight - _itemSize.height)/(_itemSize.height + _minLineSpacing)) + 1;
//    var actualInteritemSpacing = Math.floor((availableHeight - _itemSize.width*numberOfRows)/(numberOfRows - 1));
//    var itemTotalHeight = _itemSize.height;
//    var columnWidth = _itemSize.width;
//    var numberOfTotalColumns = Math.ceil(numberItems/numberOfRows);
//    var totalWidth = numberOfTotalColumns*columnWidth + (numberOfTotalColumns - 1)*_minLineSpacing;
//    totalWidth += _headerReferenceSize.height + _footerReferenceSize.height;
//    totalWidth += _sectionInsets.left + _sectionInsets.right;
//    var sectionSize = Models.Size({width: totalWidth, height: _constrainedHeightOrWidth});
//
//    var startX = 0;
//    var previousSection = indexPath.section - 1;
//    if(previousSection < 0 ) {
//        previousSection = 0;
//    }
//    if(_sectionLayoutDetails && _sectionLayoutDetails[previousSection]) {
//        for (var i = 0; i <= indexPath.section - 1; i++) {
//            startX += _sectionLayoutDetails[i].Frame.size.width;
//        }
//    }
//
//    var sectionLayout = new VerticalSectionLayoutDetails({
//        Frame: new Models.Rect({
//            origin: new Models.Point({x: 0, y: startY}),
//            size: sectionSize
//        }),
//        NumberItems: numberItems,
//        NumberOfTotalRows: numberOfTotalRows,
//        ItemTotalWidth: itemTotalWidth,
//        NumberOfColumns: numberOfColumns,
//        RowHeight: rowHeight,
//        ActualInteritemSpacing: actualInteritemSpacing,
//        MinimumLineSpacing: _minLineSpacing,
//        SectionInsets: _sectionInsets,
//        HeaderReferenceSize:_headerReferenceSize,
//        FooterReferenceSize:_footerReferenceSize
//
//    });
//
//    _totalContentSize = new Models.Size({ width: _constrainedHeightOrWidth, height: startY + sectionSize.height});
//    _sectionLayoutDetails[indexPath.section] = sectionLayout;
//};

