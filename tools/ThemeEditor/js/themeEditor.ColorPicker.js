/*jslint browser: true */
/*global $, CustomEvent*/
(function (window) {
	'use strict';

	var themeEditor = window.themeEditor,
		cssClasses = {
			//@TODO: please fill
		},
		ColorPicker = function () {

			return this;
		};

	ColorPicker.prototype.build = function (element) {
		$(element).ColorPickerSetColor();
	};

	ColorPicker.prototype.setColor = function (color) {
		$.xcolor.test(color).getHex()
	};

	ColorPicker.prototype.destroy = function () {
		//@TODO write destroy method
		this.element.removeEventListener('click', badgeClickHandler.bind(null, badgePreview), false);
	};

	themeEditor.ColorPicker = ColorPicker;
}(window));