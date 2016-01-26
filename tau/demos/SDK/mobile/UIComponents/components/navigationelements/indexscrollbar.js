(function(tau) {
	var page = document.getElementById("indexscrollbarPage"),
		isbElement = document.getElementById("indexscrollbar"),
		dividers = page.getElementsByClassName("ui-group-index"),
		isb,
		scroller,
		dividerIndexObject = {},
		selectBound;

	function onSelect(event) {
		var divider = dividerIndexObject[event.detail.index];

		if (divider && scroller) {
			scroller.scrollTop = divider.offsetTop;
		}
	}
	page.addEventListener("pagebeforeshow", function() {
		var i, len, idx;
		scroller = tau.util.selectors.getScrollableParent(document.getElementById("isbList"));
		len = dividers.length;
		for (i = 0; i < len; i++) {
			idx = dividers[i].textContent;
			dividerIndexObject[idx] = dividers[i];
		}
		isb = new tau.widget.IndexScrollbar(isbElement);
		selectBound = onSelect.bind();
		isb.addEventListener("select", selectBound);
	});

	page.addEventListener("pagehide", function(){
		isb.removeEventListener("select", selectBound);
		isb.destroy();
	});
}(window.tau));
