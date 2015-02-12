/** @jsx React.DOM */

// Create a fake global `window` and `document` object:
require('../testdom')();
var t = require('tcomb');
var tReact = require('tcomb-react');

var assert = require('assert');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var CollectionViewFramework = require('../../index');
var CollectionView = CollectionViewFramework.CollectionView;
var CollectionViewDatasource = CollectionViewFramework.CollectionViewDatasource;
var CollectionViewCell = CollectionViewFramework.CollectionViewCell;
var Models = CollectionViewFramework.Models;

describe('CollectionViewDataSource', function() {
    describe('#instance', function() {
        it('datasource protocol should not be null', function () {
            assert(CollectionViewDatasource != null, true, 'should not be null');
        });

        it('should have 1000 items in Section', function() {
            var numberOfItemsInSection = 1000;
            var datasource =  new CollectionViewDatasource.Protocol({
                numberItemsInSection: function(section) {
                    return numberOfItemsInSection;
                }
            });

            var indexPath = new Models.IndexPath({row:0, section:1});
            assert(datasource.numberItemsInSection(indexPath) == numberOfItemsInSection, true, 'should return 1000');
        });

        it('should throw exception for not returning CollectionViewCell for cellForItemAtIndexPath', function() {
            assert.throws(function() {
                var numberOfItemsInSection = 1000;
                var datasource = new CollectionViewDatasource.Protocol({
                    numberItemsInSection: function(section) {
                        return numberOfItemsInSection;
                    },
                    cellForItemAtIndexPath: function(indexPath) {
                        return "1";
                    }
                });

                CollectionViewCell.Protocol.is(datasource.cellForItemAtIndexPath(new Models.IndexPath({row:1, section:1})));
            });
        });
    });
});