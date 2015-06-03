/*global tau */
(function(){
	var page = document.getElementById("progresscircle-demo"),
		progressBar = document.getElementById("circle"),
		minusBtn = document.getElementById("minus"),
		plusBtn = document.getElementById("plus"),
		resultDiv = document.getElementById("result"),
		progressBarWidget,
		resultText,
		pageBeforeShowHandler,
		pageHideHandler,
		i;

	function printResult() {
		resultText = progressBarWidget.value();
		resultDiv.innerHTML = resultText + "%";
	}

	function clearVariables() {
		page = null;
		progressBar = null;
		minusBtn = null;
		plusBtn = null;
		resultDiv = null;
	}

	function minusBtnClickHandler() {
		i = i-10;
		if (i < 0) {
			i=0;
		}
		progressBarWidget.value(i);
		printResult();
	}

	function plusBtnClickHandler() {
		i = i+10;
		if (i > 100) {
			i=100;
		}
		progressBarWidget.value(i);
		printResult();
	}

	function unbindEvents() {
		page.removeEventListener("pageshow", pageBeforeShowHandler);
		page.removeEventListener("pagehide", pageHideHandler);
		minusBtn.removeEventListener("click", minusBtnClickHandler);
		plusBtn.removeEventListener("click", plusBtnClickHandler);
	}

	pageBeforeShowHandler = function () {
		progressBarWidget = new tau.widget.Progress(progressBar);
		minusBtn.addEventListener("click", minusBtnClickHandler);
		plusBtn.addEventListener("click", plusBtnClickHandler);
		i = parseInt(progressBarWidget.value(), 10);
		resultDiv.innerHTML = i + "%";
	};

	pageHideHandler = function () {
		unbindEvents();
		clearVariables();
	};

	page.addEventListener("pagebeforeshow", pageBeforeShowHandler);
	page.addEventListener("pagehide", pageHideHandler);
}());