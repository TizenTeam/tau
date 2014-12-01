(function(){

	var page = document.getElementById( "pageCircleProgressBar" ),
		progressBar = document.getElementById("circleprogress"),
		minusBtn = document.getElementById("minus"),
		plusBtn = document.getElementById("plus"),
		resultDiv = document.getElementById("result"),
		progressBarWidget,
		resultText,
		i;

	function printResult() {
		resultText = progressBarWidget.value();
		resultDiv.innerHTML = resultText + "%";
	};

	function clearVariables() {
		page = null;
		progressBar = null;
		minusBtn = null;
		plusBtn = null;
		resultDiv = null;
	};

	function unbindEvents() {
		page.removeEventListener("pageshow", pageShowHandler);
		page.removeEventListener("pagehide", pageHideHandler);
		minusBtn.removeEventListener("click", minusBtnClickHandler);
		plusBtn.removeEventListener("click", plusBtnClickHandler);
	};

	function minusBtnClickHandler() {
		i = i-10;
		if (i < 0) {
			i=0;
		}
		progressBarWidget.value(i);
		printResult();
	};

	function plusBtnClickHandler() {
		i = i+10;
		if (i > 100) {
			i=100;
		}
		progressBarWidget.value(i);
		printResult();
	};

	function pageShowHandler() {
		// make Circle Progressbar object
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "full"});
		i = parseInt(progressBarWidget.value());
		resultDiv.innerHTML = i + "%";

		minusBtn.addEventListener("click", minusBtnClickHandler);
		plusBtn.addEventListener("click", plusBtnClickHandler);

	};

	function pageHideHandler() {
		unbindEvents();
		clearVariables();
		// release object
		progressBarWidget.destroy();
	};

	page.addEventListener( "pageshow", pageShowHandler);
	page.addEventListener( "pagehide", pageHideHandler);

}());
