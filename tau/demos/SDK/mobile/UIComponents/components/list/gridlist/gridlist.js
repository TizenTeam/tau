var elPage = document.getElementById("grid-page"),
	elGrid = document.getElementById("gridlist"),
	modeBtn = document.getElementById("modeBtn"),
	gridList;

function modeHandler() {
	if (gridList.options.reorder === true) {
		gridList.option("reorder", false);
		modeBtn.textContent = "Edit";
	} else {
		gridList.option("reorder", true);
		modeBtn.textContent = "Done";
	}
}

elPage.addEventListener("pageshow", function() {
	gridList = tau.widget.GridList(elGrid);
	modeBtn.addEventListener("click", modeHandler);
});

elPage.addEventListener("pagebeforehide", function() {
	modeBtn.removeEventListener("click", modeHandler);
});