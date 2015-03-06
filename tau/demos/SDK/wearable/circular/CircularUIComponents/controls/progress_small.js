(function(){
	var page = document.getElementById( "pageSmallCircleProgressBar" ),
		progressBar = document.getElementById("circleprogress"),
		minusBtn = document.getElementById("minus"),
		plusBtn = document.getElementById("plus"),
		resultDiv = document.getElementById("result"),
		isCircle = tau.support.shape.circle,
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
		page.removeEventListener("pageshow", pageBeforeShowHandler);
		page.removeEventListener("pagehide", pageHideHandler);
		if (isCircle) {
			document.removeEventListener("rotarydetent", rotaryDetentHandler);
		} else {
			minusBtn.removeEventListener("click", minusBtnClickHandler);
			plusBtn.removeEventListener("click", plusBtnClickHandler);
		}
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

	function rotaryDetentHandler() {
		// Get rotary direction
		var direction = event.detail.direction,
		value = parseInt(progressBarWidget.value());

		if (direction === "CW") {
			// Right direction
			if (value < 100) {
				value++;
			} else {
				value = 100;
			}
		} else if (direction === "CCW") {
			// Left direction
			if (value > 0) {
				value--;
			} else {
				value = 0;
			}
		}

		progressBarWidget.value(value);
		printResult();
	}

	function pageBeforeShowHandler() {
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "small"});
		if (isCircle) {
			// make Circle Progressbar object
			document.addEventListener("rotarydetent", rotaryDetentHandler);
		} else {
			minusBtn.addEventListener("click", minusBtnClickHandler);
			plusBtn.addEventListener("click", plusBtnClickHandler);
		}

		i = parseInt(progressBarWidget.value());
		resultDiv.innerHTML = i + "%";
	};

	function pageHideHandler() {
		unbindEvents();
		clearVariables();
		// release object
		progressBarWidget.destroy();
	};

	page.addEventListener( "pagebeforeshow", pageBeforeShowHandler);
	page.addEventListener( "pagehide", pageHideHandler);
}());
