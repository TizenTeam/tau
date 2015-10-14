(function (window, document) {
	"use strict";

	module("support/mobile/widget/TextInput", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("options check", function () {
		var input = document.getElementById('options');

		//after build
		var textInput = tau.widget.TextInput(input);

		equal(textInput.value(), "default value", "textinput initial value not read");
		var clearSearchButtonText = textInput.option("clearSearchButtonText");
		equal(clearSearchButtonText, "clear text", "textinput support option");
		ok(input.classList.contains("ui-body-a"), "body class exist");
	});

	test("textinput - value get/set", function () {
		var input9 = document.getElementById('getset');

		//after build
		var textInput = tau.widget.TextInput(input9);
		var labelText = textInput.getLabel();

		equal(labelText, "TEST", "textinput supports getLabel method");
		textInput.setLabel("TEXTINPUT");
		labelText = textInput.getLabel();
		equal(labelText, "TEXTINPUT", "textinput supports setLabel method");
	});
}(window, window.document));
