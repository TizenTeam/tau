(function() {
	var page = document.getElementById("pageIndexScrollbar"),
		listviewElement = document.getElementById("list1"),
		isCircle = tau.support.shape.circle,
		scrollHandlers = {},
		scroller,
		indexScrollbar;

	page.addEventListener("pageshow", function(ev) {

/*****************************************************************
	CircularIndexScrollbar example

* Usage
------------------------------------------------------------------
<div id="foo" class="ui-circularindexScrollbar" data-index="1,2,3"></div>

// Create an CircularIndexScrollbar
var el = document.getElementById("foo"),
    circularIndexScrollBar = tau.widget.CircularIndexScrollbar(el);

// Bind select event callback
el.addEventListener("select", function( ev ) {
	// the index string is stored in the ev.detail.index.
	var index = ev.detail.index;

	// Do anything you want with this index.
	console.log(index);
});
------------------------------------------------------------------

* HTML property

  * data-index : A string, having index strings concatenated by ','. For example,
                 "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".

******************************************************************/

		var indexScrollbarElement = document.getElementById("indexscrollbar"),
			listDividers = listviewElement.getElementsByClassName("ui-listview-divider"),	// list dividers
			dividers = {},	// collection of list dividers
			indices = [],	// index list
			divider,
			i, idx;

		// For all list dividers,
		for(i = 0; i < listDividers.length; i++) {
			// Add the list divider elements to the collection
			divider = listDividers[i];
			idx = divider.innerText;
			dividers[idx] = divider;

			// Add the index to the index list
			indices.push(idx);
		}

		scroller = tau.util.selectors.getScrollableParent(listviewElement);

		if (!isCircle) {
			// Create IndexScrollbar
			indexScrollbar = new tau.widget.IndexScrollbar(indexScrollbarElement, {index: indices, container: scroller});
		} else {
			// Create CircularIndexScrollbar
			indexScrollbar = new tau.widget.CircularIndexScrollbar(indexScrollbarElement, {index: indices});

			// scroll event handlers
			scrollHandlers = {
				start: function () {
					if (!indexScrollbar.isShow()) {
						indexScrollbar.hideHandler();
					}
				},
				end: function () {
					if (!indexScrollbar.isShow()) {
						indexScrollbar.showHandler();
					}
				}
			};

			listviewElement.addEventListener("scrollstart", scrollHandlers.start);
			listviewElement.addEventListener("scrollend", scrollHandlers.end);
		}


		// Add SnapListview item "selected" event handler.
		listviewElement.addEventListener("selected", function (ev) {
			if (!indexScrollbar.isShow()) {
				var indexValue = ev.target.textContent[0];
				indexScrollbar.value(indexValue);
			}
		});

		// Add IndexScrollbar index "select" event handler.
		indexScrollbarElement.addEventListener("select", function (ev) {
			var divider,
				idx = ev.detail.index;

			divider = dividers[idx];
			if(divider && scroller) {
				// Scroll to the ui-listview-divider element
				scroller.scrollTop = divider.offsetTop - scroller.offsetTop;
			}
		});
	});

	page.addEventListener("pagehide", function(ev) {
		if (isCircle) {
			listviewElement.removeEventListener("scrollstart", scrollHandlers.start);
			listviewElement.removeEventListener("scrollend", scrollHandlers.end);
		}
		indexScrollbar.destroy();
	});
} ());
