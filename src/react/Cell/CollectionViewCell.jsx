var t = require('tcomb-validation');
var tReact = require('tcomb-react');
var React = require('react');

var CollectionViewLayoutAttributes = require('../Layout/CollectionViewLayoutAttributes');

var CollectionViewCellProtocol = t.struct({
    "reuseIdentifier": t.Str,
    "highlighted": t.Bool,
    "selected": t.Bool,
    "prepareForReuse": t.func(t.Nil, t.Nil),
    "preferredLayoutAttributesFittingAttributes": t.maybe(t.func(CollectionViewLayoutAttributes.Protocol, CollectionViewLayoutAttributes.Protocol)),
    "applyLayoutAttributes": t.func(CollectionViewLayoutAttributes.Protocol, t.Nil),

    "getContentView": t.func(t.Nil, tReact.react.ReactElement),
    "getBackgroundView": t.maybe(t.func(t.Nil, tReact.react.ReactElement)),
    "getSelectedBackgroundView": t.maybe(t.func(t.Nil, tReact.react.ReactElement))

}, 'CollectionViewCellProtocol');

module.exports.Protocol = CollectionViewCellProtocol;

//NOT IMPLEMENTED
//  willTransitionFromLayout:toLayout:
//  didTransitionFromLayout:toLayout:
