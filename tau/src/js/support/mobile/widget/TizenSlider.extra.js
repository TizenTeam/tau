/*global window, ns, define */
/*jslint nomen: true */
/*
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Legacy TizenSlider is provided this extra js file.
 *
 * @class ns.widget.mobile.Slider
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"./Slider.extra"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				TizenSlider = ns.widget.mobile.SliderExtra;
			ns.widget.mobile.TizenSlider = TizenSlider;
			engine.defineWidget(
				"TizenSlider",
				"",
				[],
				TizenSlider,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.TizenSlider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
