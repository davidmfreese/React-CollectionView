var t = require('tcomb-validation');
var tReact = require('tcomb-react');
var React = require('react');

var CollectionViewLayoutAttributes = require('../Layout/CollectionViewLayoutAttributes');

var CollectionViewCellProtocol = t.struct({
    "reuseIdentifier": t.Str,
    "highlighted": t.Bool,
    "selected": t.Bool,
    "prepareForReuse": t.func(t.Any, t.Any, "prepareForReuse"),
    "preferredLayoutAttributesFittingAttributes": t.maybe(t.func(CollectionViewLayoutAttributes.Protocol, CollectionViewLayoutAttributes.Protocol, "preferredLayoutAttributesFittingAttributes")),
    "applyLayoutAttributes": t.func(CollectionViewLayoutAttributes.Protocol, t.Nil, "applyLayoutAttributes"),

    "getContentView": t.Any,
    "getBackgroundView": t.Any,
    "getSelectedBackgroundView": t.Any,
    "getId": t.maybe(t.func(t.Any, t.Num, "getId"))

}, 'CollectionViewCellProtocol');

module.exports.Protocol = CollectionViewCellProtocol;

//NOT IMPLEMENTED
//  willTransitionFromLayout:toLayout:
//  didTransitionFromLayout:toLayout:
