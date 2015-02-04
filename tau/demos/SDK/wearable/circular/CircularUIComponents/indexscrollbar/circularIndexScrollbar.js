(function() {
	var page = document.getElementById("pageCirulcarIndexScrollbar"),
		circularIndexScrollbar;

	function scrollStartHandler() {
		if (!circularIndexScrollbar.isShow()) {
			circularIndexScrollbar.hideHandler();
		}
	}

	function scrollEndHandler() {
		if (!circularIndexScrollbar.isShow()) {
			circularIndexScrollbar.showHandler();
		}
	}

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

		var circularIndexScrollbarElement = document.getElementById("circularindexscrollbar"),
			listviewElement = document.getElementById("list1"),	// list
			listDividers = listviewElement.getElementsByClassName("li-divider"),	// list dividers
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

		// Create CircularIndexScrollbar
		circularIndexScrollbar = new tau.widget.CircularIndexScrollbar(circularIndexScrollbarElement, {index: indices});

		// Add CircularIndexScrollbar index "select" event handler.
		circularIndexScrollbarElement.addEventListener("select", function (ev) {
			var divider,
				idx = ev.detail.index;
			if (circularIndexScrollbar.isShow()) {
				divider = dividers[idx];
				if(divider) {
					// Scroll to the li-divider element
					page.scrollTop = divider.offsetTop - page.offsetTop;
				}
			}
		});

		// Add SnapListview item "selected" event handler.
		listviewElement.addEventListener("selected", function (ev) {
			var indexValue = ev.target.textContent[0];

			if (!circularIndexScrollbar.isShow()) {
				circularIndexScrollbar.value(indexValue);
			}
		});

		// Add "scrollstart" event handler.
		document.addEventListener("scrollstart", scrollStartHandler);
		// Add "scollend" event handler.
		document.addEventListener("scrollend", scrollEndHandler);

	});

	page.addEventListener("pagehide", function(ev) {
		document.removeEventListener("scrollstart", scrollStartHandler);
		document.removeEventListener("scrollend", scrollEndHandler);
		circularIndexScrollbar.destroy();
	});
} ());
