## React-CollectionView
[React-CollectionView](http://github.com/davidmfreese/React-CollectionView) brings UICollectionView to the web.  The goal is to create a performant collection view that delegates the layout and cell implementation to the user. Currently a simple [FlowLayout](http://github.com/davidmfreese/React-CollectionView/tree/master/src/react/Layout/FlowLayout) has been implemented which provides minimum out the box functionality. See the [examples](http://github.com/davidmfreese/React-CollectionView/tree/master/examples) folder for use cases and implementation examples. 

#### Examples:
* [Vertical Flowlayout](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical) - Uniform cell size with basic implementation (1,000,000 items).
* [Vertical Flowlayout - Insertions](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical-insertions) - New cells are inserted when scrolled to top (10,000 items).
* [Vertical Flowlayout - Mario](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical-mario) - Mario and his friends provide a more concrete example (10,000 items).
* [Vertical Flowlayout - Infinity](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical-infinity) - Infinity scroll example (10,000 items).
* [Horizontal Flowlayout](https://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-horizontal) - Uniform cell size with basic implementation (1,000,000 items).
* [Horizontal Flowlayout - Paging](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-horizontal-paging) - Paging Example (10,000 items).  Allows drag paging with mouse or touch.  This is powered by [React-GestureRecognizerMixin](http://github.com/davidmfreese/React-GestureRecognizerMixin).
* [Custom Layout - Circle](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical-insertions) - A circle layout based on WWDC 2012 UICollectionView example.
  * todo - add transitions to match the WWDC example

### Gesture Recognizer Mixin
This has been moved to a seperate project.  See [React-GestureRecognizerMixin](http://github.com/davidmfreese/React-GestureRecognizerMixin).

**WARNING** - This project is young and being developed in short iterations.  There will be many breaking changes in the short term.  
