/** @jsx React.DOM */

// Create a fake global `window` and `document` object:
require("../testdom")();
var t = require("tcomb");
var tReact = require("tcomb-react");

var assert = require("assert");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var CollectionViewFramework = require("../../index");
var CollectionView = CollectionViewFramework.CollectionView;
var CollectionViewDatasource = CollectionViewFramework.CollectionViewDatasource;
var CollectionViewCell = CollectionViewFramework.CollectionViewCell;
var Models = CollectionViewFramework.Models;

describe("CollectionViewCell", function() {
    describe("#instance", function() {
        it("datasource protocol should not be null", function () {
            assert(CollectionViewCell != null, true, "should not be null");
            assert(CollectionViewCell.Protocol != null, true, "should not be null");
        });

        it("should return ReactElement from cell.getContentView", function() {

            var cell = new CollectionViewCell.Protocol({
                "highlighted": false,
                "selected": true,
                "reuseIdentifier": "test",
                "prepareForReuse": function() {
                },
                "applyLayoutAttributes": function(layoutAttributes) {
                },
                "getContentView": function() {
                    return <div><span>1</span><span>2</span></div>;
                }
            });

            var contentView = cell.getContentView().call(this, null);

            var rendered = TestUtils.renderIntoDocument(
                contentView
            );

            assert(rendered.getDOMNode().childNodes.length == 2, true, "should be react node");
        });

    });
});/**
 * Created by davidfreese on 2/9/15.
 */
