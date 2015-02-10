/** @jsx React.DOM */

var assert = require('assert');

var CollectionViewFramework = require('../../index');
var Models = CollectionViewFramework.Models;
var Size = Models.Size;

describe('CollectionView.Models', function() {
    describe('Size', function () {
        it('should have height of 100', function (done) {
            var size = new Models.Size({height:100, width:100});
            assert.equal(size.height == 100, true, 'height should be equal to 100');
            done();
        });

        it('should have width of 100', function (done) {
            var size = new Models.Size({height:100, width:100});
            assert.equal(size.width == 100, true, 'height should be equal to 100');
            done();
        });

        it('should be SizeZero', function (done) {
            var size = new Models.Size({height:0, width:0});
            assert.equal(Models.Geometry.isSizeZero(size), true, 'should be empty size');
            done();
        });

        it('should not be SizeZero', function (done) {
            var size = new Models.Size({height:100, width:100});
            assert.equal(Models.Geometry.isSizeZero(size), false, 'should be empty size');
            done();
        });
    });
});

