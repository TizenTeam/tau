(function (document) {
	"use strict";
	module("profile/tv/widget/Slider", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("Slider", function () {
		var slider = document.getElementById('slider-1');

		tau.engine.createWidgets(document.getElementById('qunit-fixture'));

		equal(slider.getAttribute('data-tau-bound'), "TizenSlider", "Slider widget is created");
		ok(slider.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');
	});

	test("Popup Slider", function () {
		var slider = document.getElementById('slider-2');

		tau.engine.createWidgets(document.getElementById('qunit-fixture'));

		equal(slider.getAttribute('data-tau-bound'), "TizenSlider", "Slider widget is created");
		equal(slider.getAttribute('min'), "0", "Slider has minimum");
		equal(slider.getAttribute('max'), "100", "Slider has maximum");
		ok(slider.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');
	});

	test("Slider w/h icon", function () {
		var sliderBrightness = document.getElementById('slider-3'),
			sliderLoudness = document.getElementById('slider-4');

		tau.engine.createWidgets(document.getElementById('qunit-fixture'));

		equal(sliderBrightness.getAttribute('data-tau-bound'), "TizenSlider", "Slider widget is created");
		equal(sliderBrightness.getAttribute('data-icon'), "bright", "Slider has brightness icon");
		ok(sliderBrightness.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');

		equal(sliderLoudness.getAttribute('data-tau-bound'), "TizenSlider", "Slider widget is created");
		equal(sliderLoudness.getAttribute('data-icon'), "volume", "Slider has loudness icon");
		ok(sliderLoudness.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');
	});

	test("Slider without highlight", function () {
		var slider = document.getElementById('slider-5');

		tau.engine.createWidgets(document.getElementById('qunit-fixture'));

		equal(slider.getAttribute('data-tau-bound'), "TizenSlider", "Slider widget is created");
		equal(slider.getAttribute('data-highlight'), "false", "Slider has data-highlight set false");
		ok(slider.classList.contains('ui-slider-input'), 'Slider has ui-slider-input class');
	});

	test("Slider - focus & blur", function () {
		var slider = document.getElementById('slider-2'),
			sliderContainer;

		tau.engine.instanceWidget(slider, "TizenSlider");
		sliderContainer = document.getElementById('slider-2-container');

		ok(!sliderContainer.classList.contains('ui-focus'), 'Slider is not focused');
		sliderContainer.focus();
		ok(sliderContainer.classList.contains('ui-focus'), 'Slider is focused');
		sliderContainer.blur();
		ok(!sliderContainer.classList.contains('ui-focus'), 'Slider is blured');
	});

	test("Slider - showPopup", function () {
		var slider = document.getElementById('slider-2'),
			popups,
			ctxpopup;

		tau.engine.instanceWidget(slider, "TizenSlider");
		tau.event.trigger(slider, "focus");
		popups = document.getElementsByClassName('ui-popup');
		equal(popups.length, 1, "There is new popup");
		ctxpopup = popups[0];
		ok(ctxpopup.classList.contains('ui-ctxpopup'), 'Popup has ui-ctxpopup class after entering');
		ok(ctxpopup.classList.contains('ui-popup-arrow-t'), 'Popup has ui-popup-arrow-t class after entering');

		equal(ctxpopup.firstChild.innerText, slider.value, "Value displayed is the same as slider value");
	});

	test("Slider - destroy", function () {
		var slider = document.getElementById('slider-1'),
			widget;

		tau.engine.createWidgets(document.getElementById('qunit-fixture'));
		tau.engine.instanceWidget(slider, "TizenSlider");

		tau.engine.destroyWidget(slider, "TizenSlider");
		widget = tau.engine.getBinding(slider, "TizenSlider");
		ok(widget === null, "Slider has been destroyed");
	});
}(document));