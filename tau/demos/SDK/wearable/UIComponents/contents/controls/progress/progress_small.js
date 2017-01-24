/*global tau */
(function () {
	var page = document.getElementById("pageSmallCircleProgressBar"),
		progressBar = document.getElementById("circleprogress"),
		minusBtn = document.getElementById("minus"),
		plusBtn = document.getElementById("plus"),
		progressBarWidget,
		pageBeforeShowHandler,
		pageHideHandler,
		i;

	/**
	 * Rotary event handler
	 */
	function rotaryDetentHandler() {
		// Get rotary direction
		var direction = event.detail.direction,
			value = parseInt(progressBarWidget.value(), 10);

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
	}

	/**
	 * Initializes global variables
	 */
	function clearVariables() {
		page = null;
		progressBar = null;
		minusBtn = null;
		plusBtn = null;
	}

	/**
	 * Click event handler for minus button
	 */
	function minusBtnClickHandler() {
		i = i - 10;
		if (i < 0) {
			i = 0;
		}
		progressBarWidget.value(i);
	}

	/**
	 * Click event handler for plus button
	 */
	function plusBtnClickHandler() {
		i = i + 10;
		if (i > 100) {
			i = 100;
		}
		progressBarWidget.value(i);
	}

	/**
	 * Removes event listeners
	 */
	function unbindEvents() {
		page.removeEventListener("pageshow", pageBeforeShowHandler);
		page.removeEventListener("pagehide", pageHideHandler);
		if (tau.support.shape.circle) {
			document.removeEventListener("rotarydetent", rotaryDetentHandler);
		} else {
			minusBtn.removeEventListener("click", minusBtnClickHandler);
			plusBtn.removeEventListener("click", plusBtnClickHandler);
		}
	}

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	pageBeforeShowHandler = function () {
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "small"});
		if (tau.support.shape.circle) {
			// make Circle Progressbar object
			document.addEventListener("rotarydetent", rotaryDetentHandler);
		} else {
			minusBtn.addEventListener("click", minusBtnClickHandler);
			plusBtn.addEventListener("click", plusBtnClickHandler);
		}
	};

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	pageHideHandler = function () {
		unbindEvents();
		clearVariables();
		// release object
		progressBarWidget.destroy();
	};

	page.addEventListener("pagebeforeshow", pageBeforeShowHandler);
	page.addEventListener("pagehide", pageHideHandler);
}());
