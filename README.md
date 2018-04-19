## React-CollectionView
[React-CollectionView](http://github.com/davidmfreese/React-CollectionView) brings UICollectionView to the web.  The goal is to create a performant collection view that delegates the layout and cell implementation to the user. Currently a simple [FlowLayout](http://github.com/davidmfreese/React-CollectionView/tree/master/src/react/Layout/FlowLayout) has been implemented which provides minimum out the box functionality. See the [examples](http://github.com/davidmfreese/React-CollectionView/tree/master/examples) folder for use cases and implementation examples. 

#### Examples:
* [Vertical Flowlayout](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical) - Uniform cell size with basic implementation (1,000,000 items).
* [Vertical Flowlayout - Insertions](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical-insertions) - New cells are inserted when scrolled to top (10,000 items).
* [Vertical Flowlayout - Mario](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical-mario) - Mario and his friends provide a more concrete example (10,000 items).
* [Vertical Flowlayout - Infinity](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical-infinity) - Infinity scroll example (10,000 items).
* [Horizontal Flowlayout](https://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-horizontal) - Uniform cell size with basic implementation (1,000,000 items).
* [Horizontal Flowlayout - Paging](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-horizontal-paging) - Paging Example (10,000 items).  Allows drag paging with mouse or touch.  This is powered by [React-GestureRecognizerMixin](http://github.com/davidmfreese/React-GestureRecognizerMixin).
* [Item Selection](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical-selection) - Allow selection of Item in collection view.  Item will rotate and background color will change.  Currently only single item selection is implemented.  Tap is powered by [React-GestureRecognizerMixin](http://github.com/davidmfreese/React-GestureRecognizerMixin).  
* [Scroll To Index Path](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical-scrollToIndexPath) - Allow scroll to item (index path).  Scroll can be animated and also centered vertically/horizontally.
* [Custom Layout - Circle](http://github.com/davidmfreese/React-CollectionView/tree/master/examples/flowlayout-vertical-insertions) - A circle layout based on WWDC 2012 UICollectionView example.
  * todo - add transitions to match the WWDC example

### React-ScrollView
This has been moved to a seperate project.  See [React-ScrollView](http://github.com/davidmfreese/React-ScrollView).

### Gesture Recognizer Mixin
This has been moved to a seperate project.  See [React-GestureRecognizerMixin](http://github.com/davidmfreese/React-GestureRecognizerMixin).

**WARNING** - This is a personal project to push the performance limits of React.  Use at your own risk :)
