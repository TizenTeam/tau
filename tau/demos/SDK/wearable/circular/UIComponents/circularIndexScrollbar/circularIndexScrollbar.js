(function() {
	var page = document.getElementById("pageCirulcarIndexScrollbar"),
		isb;
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

* Function

  * IndexScrollbar( element ) : Extract the sub-elements into the given element.

******************************************************************/

		var elisb = document.getElementById("circularindexscrollbar"),
			elList = document.getElementById("list1"),	// list
			elDividers = elList.getElementsByClassName("ui-listview-divider"),	// list dividers
			elScroller = elList.parentElement,	// the scroller (overflow-y:hidden)
			dividers = {},	// collection of list dividers
			indices = [],	// index list
			elDivider,
			i, idx;

		// For all list dividers,
		for(i=0; i < elDividers.length; i++) {
			// Add the list divider elements to the collection
			elDivider = elDividers[i];
			idx = elDivider.innerText;
			dividers[idx] = elDivider;

			// Add the index to the index list
			indices.push(idx);
		}

		// Create CircularIndexScrollbar
		isb = new tau.widget.CircularIndexScrollbar(elisb, {index: indices});

		// Bind a 'select' callback
		elisb.addEventListener("select", function(ev) {
			var elDivider,
				idx = ev.detail.index;
			elDivider = dividers[idx];
			if(elDivider) {
				// Scroll to the ui-listview-divider element
				elScroller.scrollTop = elDivider.offsetTop - elScroller.offsetTop;
			}
		});
	});

	page.addEventListener("pagehide", function(ev) {
		isb.destroy();
	});
} ());

