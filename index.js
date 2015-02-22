
var Models = require('./src/react/Model/Models');

var CollectionView = require('./src/react/CollectionView.jsx');
var CollectionViewDelegate = require('./src/react/CollectionViewDelegate');
var CollectionViewCell = require('./src/react/Cell/CollectionViewCell.jsx');
var CollectionViewDatasource = require('./src/react/Datasource/CollectionViewDatasource');
var CollectionViewLayout = require('./src/react/Layout/CollectionViewLayout');
var CollectionViewLayoutDelegate = require('./src/react/Layout/CollectionViewLayoutDelegate');
var CollectionViewLayoutAttributes = require('./src/react/Layout/CollectionViewLayoutAttributes');
var ScrollViewDelegate = require('./src/react/ScrollView/ScrollViewDelegate');

//impl
var CollectionViewFlowLayout = require('./src/react/Layout/FlowLayout/CollectionViewFlowLayout');

var exports = {
    CollectionView: CollectionView,
    CollectionViewDelegate: CollectionViewDelegate,
    CollectionViewDatasource: CollectionViewDatasource,
    CollectionViewCell: CollectionViewCell,
    CollectionViewLayout: CollectionViewLayout,
    CollectionViewLayoutDelegate: CollectionViewLayoutDelegate,
    CollectionViewLayoutAttributes: CollectionViewLayoutAttributes,
    ScrollViewDelegate: ScrollViewDelegate,

    Models: Models,
    Enums: require('./src/react/Enums/Enums'),
    React: require('react/addons'),

    CollectionViewFlowLayout: CollectionViewFlowLayout,

    GestureRecognizer: require('./src/react/GestureRecognizer/GestureRecognizer'),
    GestureTouch: require('./src/react/GestureRecognizer/Touch'),
    GestureRecognizerMixin: require('./src/react/GestureRecognizer/GestureRecognizerMixin'),

    PanGestureRecognizer: require('./src/react/GestureRecognizer/PanGestureRecognizer'),
    TapGestureRecognizer: require('./src/react/GestureRecognizer/TapGestureRecognizer')
};

module.exports = exports;

