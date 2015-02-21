## React-CollectionView
[React-CollectionView](https://github.com/davidmfreese/React-CollectionView) brings UICollectionView to the web.  The goal is to create a performant collection view that delegates the layout and cell(s) implementation to the user. Currently a simple [FlowLayout](https://github.com/davidmfreese/React-CollectionView/tree/master/src/react/Layout/FlowLayout) has been implemented which provides minimum out the box functionality. See the [examples](https://github.com/davidmfreese/React-CollectionView/tree/master/examples) folder for use cases and implementation examples.
#### Currently Implemented examples:
* Vertical Flowlayout with uniformed cells
* Horizontal Flowlayout with uniformed cells
* Vertical Flowlayout with uniformed cells, multiple sections and header/footers
* Horizontal Flowlayout with uniformed cells, multiple sections and header/footers
* Vertical Flowlayout using Infinity loading
* Vertical Flowlayout with new items inserted at top when view is scrolled to top
* Vertical Flowlayout using random images from the web.  Resizing the browser will invalidate layout, adjust cell sizes and reset scroll to top
* Horizontal Flowlayout using random images from the web.  The scroll viewport matches the image size. 
  * done - added paging functionality.  
  * todo - add swiping (might do this as native cordova plugin)
* Vertical Flowlayout (BIG data) with 1,000,000 data items.  Fits browser width/height and scrolls forever.  Good luck getting to the bottom (phantomjs cheat anyone)
  * todo - add transitions 
* Custom circle layout based off the WWDC implementation in 2012.  
  * todo - add transitions 

**WARNING** - This project is young and being developed in short iterations.  If you are interested in the project please fork.  There will be many breaking changes in the short term.  
