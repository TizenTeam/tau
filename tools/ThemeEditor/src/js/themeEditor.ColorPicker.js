/*jslint browser: true */
/*global $, CustomEvent, badgeClickHandler, badgePreview*/
(function (window) {
	'use strict';

	var themeEditor = window.themeEditor,
		ColorPicker = {};

	ColorPicker = function (element, onChange) {
		// Build Color Picker
		this.colorPicker = element.ColorPicker({
			flat: true,
			onChange: onChange
		});

		return this;
	};

	ColorPicker.prototype.setColor = function (color) {
		var hexColor = $.xcolor.test(color).getHex();
		this.colorPicker.ColorPickerSetColor(hexColor);
	};

	ColorPicker.prototype.destroy = function () {
		//@TODO write destroy method
		this.element.removeEventListener('click', badgeClickHandler.bind(null, badgePreview), false);
	};

	themeEditor.ColorPicker = ColorPicker;
}(window));