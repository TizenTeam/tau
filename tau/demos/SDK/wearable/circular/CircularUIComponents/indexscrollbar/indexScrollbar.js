(function() {
	var page = document.getElementById("pageIndexScrollbar"),
		isCircle = tau.support.shape.circle,
		indexScrollbar;

	function scrollStartHandler() {
		if (!indexScrollbar.isShow()) {
			indexScrollbar.hideHandler();
		}
	}

	function scrollEndHandler() {
		if (!indexScrollbar.isShow()) {
			indexScrollbar.showHandler();
		}
	}

	function getScrollableParent(element) {
		var overflow,
			style;

		while (element != document.body) {
			style = window.getComputedStyle(element);

			if (style) {
				overflow = style.getPropertyValue("overflow-y");
				if (overflow === "scroll" || (overflow === "auto"     && element.scrollHeight > element.clientHeight)) {
					return element;
				}
			}

			element = element.parentNode;
		}

		return null;
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

		var indexScrollbarElement = document.getElementById("indexscrollbar"),
			listviewElement = document.getElementById("list1"),	// list
			listDividers = listviewElement.getElementsByClassName("li-divider"),	// list dividers
			dividers = {},	// collection of list dividers
			indices = [],	// index list
			scroller,
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

		scroller = getScrollableParent(listviewElement);

		if (!isCircle) {
			// Create IndexScrollbar
			indexScrollbar = new tau.widget.IndexScrollbar(indexScrollbarElement, {index: indices});
		} else {
			// Create CircularIndexScrollbar
			indexScrollbar = new tau.widget.CircularIndexScrollbar(indexScrollbarElement, {index: indices});
			// Add SnapListview item "selected" event handler.
			listviewElement.addEventListener("selected", function (ev) {
				var indexValue = ev.target.textContent[0];

				if (!indexScrollbar.isShow()) {
					indexScrollbar.value(indexValue);
				}
			});

			// Add "scrollstart" event handler.
			document.addEventListener("scrollstart", scrollStartHandler);
			// Add "scollend" event handler.
			document.addEventListener("scrollend", scrollEndHandler);
		}

		// Add CircularIndexScrollbar index "select" event handler.
		indexScrollbarElement.addEventListener("select", function (ev) {
			var divider,
				idx = ev.detail.index;
			divider = dividers[idx];
			if(divider && scroller) {
				// Scroll to the li-divider element
				scroller.scrollTop = divider.offsetTop - scroller.offsetTop;
			}
		});
	});

	page.addEventListener("pagehide", function(ev) {
		if (isCircle) {
			document.removeEventListener("scrollstart", scrollStartHandler);
			document.removeEventListener("scrollend", scrollEndHandler);
		}
		indexScrollbar.destroy();
	});
} ());
