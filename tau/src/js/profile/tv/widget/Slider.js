/*global ns */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/*
 * # Slider Widget
 * Creates horizontal axis with a draggable handle. It can be used to set singular value from within
 * lower and upper boundries.
 *
 * ## Using
 * User can drag the handle using touch capabilities. The other way, using remote control, is focusing
 * Slider using arrows and selecting it with OK [Enter if using keyboard]. Now you can adjust Slider
 * value using left/down right/up arrows. To apply new value use OK [Enter] button.
 *
 * ## Default selectors
 * All **INPUT** tags with _type="range"_ are changed into slider.
 *
 * ### HTML Examples
 *
 * #### Create slider input
 *
 *		@example
 *		<input id="slider-1" name="slider-1" type="range" value="5" min="0" max="10"/>
 *
 * ## Manual constructor
 * For manual creation of slider widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<input id="slider-1" name="slider-1" type="range" value="5" min="0" max="10"/>
 *		<script>
 *			var sliderElement = document.getElementById("slider-1"),
 *				slider = tau.widget.TizenSlider(sliderElement);
 *		</script>
 *
 * Constructor has one required parameter **element** which
 * is base **HTMLElement** to create widget. We recommend get this element
 * by method *document.getElementById*. Second parameter is **options**
 * and it is a object with options for widget.
 *
 *		@example
 *		<input id="slider-1" name="slider-1" type="range" value="5" min="0" max="10"/>
 *		<script>
 *			var sliderElement = document.getElementById("slider-1"),
 *				slider = tau.widget.TizenSlider(sliderElement, {data-popup: true});
 *		</script>
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<input id="slider-1" name="slider-1" type="range" value="5" min="0" max="10"/>
 *		<script>
 *		var slider = document.getElementById("slider"),
 *			slider = tau.widget.TizenSlider(slider);
 *
 *		// slider.methodName(methodArgument1, methodArgument2, ...);
 *		// for example
 *		var value = slider.value("5");
 *		</script>
 *
 * @class ns.widget.tv.Slider
 * @extends ns.widget.mobile.TizenSlider
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../support/mobile/widget/Slider.extra",
			"../../../core/engine",
			"../../../core/theme",
			"../../../core/util/selectors",
			"../../../core/util/object",
			"./BaseKeyboardSupport",
			"../tv"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				Slider = ns.widget.mobile.SliderExtra;
			// definition
			ns.widget.tv.Slider = Slider;

			engine.defineWidget(
				"TizenSlider",
				"input[type='range'], :not(select)[data-role='slider'], :not(select)[data-type='range']",
				[],
				Slider,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Slider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
