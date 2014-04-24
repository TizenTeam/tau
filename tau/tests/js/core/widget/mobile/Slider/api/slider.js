(function (ns) {
	'use strict';
	test ( "API ns.widget.Slider" , function () {
		var widget, Slider;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.Slider, 'function', 'Class ns.widget.mobile.Slider exists');

		widget = new ns.widget.mobile.Slider();
		Slider = ns.widget.mobile.Slider;

		equal(typeof widget.configure, 'function', 'Method slider.configure exists');
		equal(typeof widget._getCreateOptions, 'function', 'Method slider._getCreateOptions exists');
		equal(typeof widget.build, 'function', 'Method slider.build exists');
		equal(typeof widget.init, 'function', 'Method slider.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method slider.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method slider.destroy exists');
		equal(typeof widget.disable, 'function', 'Method slider.disable exists');
		equal(typeof widget.enable, 'function', 'Method slider.enable exists');
		equal(typeof widget.refresh, 'function', 'Method slider.refresh exists');
		equal(typeof widget.option, 'function', 'Method slider.option exists');

		equal(typeof widget.options, 'object', 'Property slider.options exists');
		equal(typeof widget.options.trackTheme, 'object', 'Property slider.options.trackTheme exists');
		equal(typeof widget.options.disabled, 'boolean', 'Property slider.options.disabled exists');
		equal(typeof widget.options.mini, 'object', 'Property slider.options.mini exists');
		equal(typeof widget.options.highlight, 'boolean', 'Property slider.options.highlight exists');
		equal(typeof widget.options.inline, 'object', 'Property slider.options.inline exists');
		equal(widget.options.theme, null, 'Property slider.options.theme exists');

		equal(typeof Slider.classes, 'object', 'Property slider.classes exists');
		equal(typeof Slider.classes.theme, 'string', 'Property slider.classes.theme exists');
		equal(typeof Slider.classes.mini, 'string', 'Property slider.classes.mini exists');
		equal(typeof Slider.classes.sliderSwitch, 'string', 'Property slider.classes.sliderSwitch exists');
		equal(typeof Slider.classes.sliderInline, 'string', 'Property slider.classes.sliderInline exists');
		equal(typeof Slider.classes.sliderMini, 'string', 'Property slider.classes.sliderMini exists');
		equal(typeof Slider.classes.slider, 'string', 'Property slider.classes.slider exists');
		equal(typeof Slider.classes.sliderHandle, 'string', 'Property slider.classes.sliderHandle exists');
		equal(typeof Slider.classes.sliderBg, 'string', 'Property slider.classes.sliderBg exists');
		equal(typeof Slider.classes.sliderToggle, 'string', 'Property slider.classes.sliderToggle exists');
		equal(typeof Slider.classes.sliderToggleOn, 'string', 'Property slider.classes.sliderToggleOn exists');
		equal(typeof Slider.classes.sliderToggleOff, 'string', 'Property slider.classes.sliderToggleOff exists');
		equal(typeof Slider.classes.sliderInneroffset, 'string', 'Property slider.classes.sliderInneroffset exists');
		equal(typeof Slider.classes.sliderInput, 'string', 'Property slider.classes.sliderInput exists');
		equal(typeof Slider.classes.sliderContainer, 'string', 'Property slider.classes.sliderContainer exists');


		equal(typeof widget._build, 'function', 'Method slider._build exists');
		equal(typeof widget._bindEvents, 'function', 'Method slider._bindEvents exists');
		equal(typeof widget._init, 'function', 'Method slider._bindEvents exists');
		equal(typeof widget._refresh, 'function', 'Method slider._refresh exists');
		equal(typeof widget._getValue, 'function', 'Method slider._getValue exists');
	});
}(ej));