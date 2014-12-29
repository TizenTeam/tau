(function(){

	var page = document.getElementById( "pageCircleProgressBar" ),
		smallPage = document.getElementById( "pageSmallCircleProgressBar" ),
		progressBar = document.getElementById("circleprogress"),
		minusBtn = document.getElementById("minus"),
		plusBtn = document.getElementById("plus"),
		resultDiv = document.getElementById("result"),
		progressBarWidget,
		resultText,
		i;

	function printResult() {
		resultText = progressBarWidget.value();
		resultDiv.innerHTML = smallPage ? resultText : resultText + "%";
	};

	function clearVariables() {
		page = null;
		smallPage = null;
		progressBar = null;
		minusBtn = null;
		plusBtn = null;
		resultDiv = null;
	};

	function unbindEvents() {
		if (page) {
			page.removeEventListener("pageshow", pageShowHandler);
			page.removeEventListener("pagehide", pageHideHandler);
		}
		if (smallPage) {
			smallPage.removeEventListener("pageshow", pageShowHandler);
			smallPage.removeEventListener("pagehide", pageHideHandler);
		}
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
		if (page) {
		// make Circle Progressbar object
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "full"});
		}
		if (smallPage) {
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "small"});
		}

		i = parseInt(progressBarWidget.value());
		resultDiv.innerHTML = smallPage ? i : i + "%";

		minusBtn.addEventListener("click", minusBtnClickHandler);
		plusBtn.addEventListener("click", plusBtnClickHandler);

	};

	function pageHideHandler() {
		unbindEvents();
		clearVariables();
		// release object
		progressBarWidget.destroy();
	};
	if (page) {
		page.addEventListener( "pageshow", pageShowHandler);
		page.addEventListener( "pagehide", pageHideHandler);
	}

	if (smallPage) {
		smallPage.addEventListener( "pageshow", pageShowHandler);
		smallPage.addEventListener( "pagehide", pageHideHandler);
	}
}());
