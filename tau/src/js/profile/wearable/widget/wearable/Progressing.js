/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Processing Widget
 * Shows that an operation is in progress.
 *
 * The processing widget shows that an operation is in progress.
 *
 * ## Default selectors
 *
 * To add a processing widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-processing"></div>
 *      <div class="ui-processing-text">
 *          Description about progress
 *      </div>
 *
 * ## JavaScript API
 *
 * Processing widget hasn't JavaScript API.
 *
 * @class ns.widget.wearable.Progressing
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Progressing = function () {
					return this;
				},
				prototype = new BaseWidget();

			Progressing.events = {};

			/**
			 * Build Progressing
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.Progressing
			 */
			prototype._build = function (element) {
				return element;
			};

			prototype._init = function (element) {
				return element;
			};

			prototype._bindEvents = function (element) {
				return element;
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.Progressing
			 */
			prototype._refresh = function () {
				return null;
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.Progressing
			 */
			prototype._destroy = function () {
				return null;
			};

			Progressing.prototype = prototype;
			ns.widget.wearable.Progressing = Progressing;

			engine.defineWidget(
				"Progressing",
				".ui-progress",
				[],
				Progressing,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Progressing;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
