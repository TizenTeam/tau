/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Progress Widget
 * Shows a control that indicates the progress percentage of an on-going operation.
 *
 * The progress widget shows a control that indicates the progress percentage of an on-going operation. This widget can be scaled to fit inside a parent container.
 *
 * ## Default selectors
 *
 * This widget provide three style progress.
 *
 * ### Simple progress bar
 * If you don't implement any class, you can show default progress style
 * To add a progress widget to the application, use the following code:
 *
 *      @example
 *      <progress max="100" value="90"></progress>
 *
 * ### Infinite progress bar
 * If you implement class (*ui-progress-indeterminate*), you can show image looks like infinite move.
 *
 * To add a progress widget to the application, use the following code:
 *      @example
 *      <progress class="ui-progress-indeterminate" max="100" value="100"></progress>
 *
 * ### Progress bar with additional information
 * If you implement div tag that can choose two classes (*ui-progress-proportion* or *ui-progress-ratio*) at progress tag same level, you can show two information (proportion information is located left below and ratio information is located right below)
 *
 * To add a progress widget to the application, use the following code:
 *
 *      @example
 *      <progress max="100" value="50"></progress>
 *      <div class="ui-progress-proportion">00/20</div>
 *      <div class="ui-progress-ratio">50%</div>
 *
 * ## JavaScript API
 *
 * Progress widget hasn't JavaScript API.
 *
 * @class ns.widget.core.Progress
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.BaseWidget,

				Progress = function () {
					this.options = {};
				},
				CLASSES_PREFIX = "ui-progress",
				classes = {
					INDETERMINATE: CLASSES_PREFIX + "-indeterminate",
					PROCESS: CLASSES_PREFIX + "-processing"
				},
				TYPE = {
					bar: "bar",
					circle: "circle"
				},
				prototype = new BaseWidget();

			Progress.events = {};

			/**
			 * Dictionary for Progress related css class names
			 * @property {Object} classes
			 * @member ns.widget.core.Progress
			 * @static
			 * @readonly
			 */
			Progress.classes = classes;

			/**
			 * Configure widget options
			 * @method _configure
			 * @member ns.widget.core.Progress
			 * @protected
			 */
			prototype._configure = function (element) {
				/**
					 * Options for widget
					 * @property {Object} options
					 * @property {boolean} [options.infinite=false] Decide if progress time period is determinated or indeterminated.
					 * @property {"bar"|"circle"} [options.appeariance="bar"] Set progrss appeariance.
					 * @member ns.widget.core.Progress
				 */
				this.options = {
						infinite : false,
						appeariance : TYPE.bar
				};
			};

			/**
			 * Build Progress
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Progress
			 */
			prototype._build = function (element) {
				var options = this.options,
					classList = element.classList,
					replacement = document.createElement('div'),
					i,
					attributes = element.attributes,
					length,
					nodeName,
					nodeValue;

				if (options.appeariance === TYPE.circle) {
					classList.add(classes.PROCESS);
					length = attributes.length;

					for (i = 0; i < length; ++i){
						nodeName  = attributes.item(i).name,
						nodeValue = attributes.item(i).value;
						replacement.setAttribute(nodeName, nodeValue);
					}

					replacement.innerHTML = element.innerHTML;
					element.parentNode.replaceChild(replacement, element);
				} else if (options.appeariance === TYPE.bar) {

					if (options.infinite === true) {
						classList.add(classes.INDETERMINATE);
					}

				}

				return element;
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Progress
			 */
			prototype._destroy = function () {
				this.options = null;
			};

			Progress.prototype = prototype;
			ns.widget.core.Progress = Progress;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Progress;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
