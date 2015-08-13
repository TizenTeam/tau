(function (document) {
	"use strict";
	var page = document.getElementById("radio-demo"),
		choiceResult = document.querySelector(".radio-result");

	page.addEventListener("pageshow", function () {
		page.addEventListener("change", function (event) {
			var target = event.target;

			if (target.classList.contains("ui-radio") && target.name === "radio-choice" &&
					target.checked === true) {
				choiceResult.textContent = "Text active radio is " + target.id;
			}
		});
	});
}(window.document));

