/*global window, define */
/*jslint nomen: true, plusplus: true */

/**
 * #Progress Widget
 *
 * ##Manual constructor
 * For manual creation of progress widget you can use constructor of widget:
 *
 *	@example
 *	var progress = ns.engine.instanceWidget(document.getElementById('foo'), 'progress');
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	var progress = $('#foo').progress();
 *
 * ##HTML Examples
 * ###Create simple progress pending from div using data-role:
 *
 *	@example
 *	<div data-role="progress" data-style="pending"></div>
 *
 * ###Create simple progress circle from div using data-role:
 *
 *	@example
 *	<div data-role="progress" data-style="circle"></div>
 *
 * ##Using in javascript
 * ###Show the progress
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).show();
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$('#foo').progress('show');
 *
 * ###Hide the progress
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).hide();
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$('#foo').progress('hide');
 *
 * ###Run the progress
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).running(true);
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$('#foo').progress('running', true);
 *
 * ###Stop the progress
 *
 *	@example
 *	ns.engine.instanceWidget(document.getElementById("foo")).running(true);
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	$('#foo').progress('running', false);
 *
 * @extends ns.widget.BaseWidget
 * @class ns.widget.Progress
 */

(function (window, ns) {
	"use strict";

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);


	define(
		[
			"../../../../core/engine",
			"../mobile",
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/**
			* {Object} Widget Alias for {@link ns.widget.BaseWidget}
			* @member ns.widget.Progress
			* @private
			*/
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* @property {ns.engine} engine Alias for class ns.engine
				* @member ns.widget.Progress
				* @private
				*/
				engine = ns.engine,
				classes = {
					uiProgressContainerCircle: "ui-progress-container-circle",
					uiProgressCircleRunning: "ui-progress-circle-running",
					uiProgressCircle: "ui-progress-circle",
					uiProgressbar: "ui-progressbar",
					uiProgressbarBg: "ui-progressbar-bg",
					uiProgressPending: "ui-progress-pending",
					uiProgressPendingRunning: "ui-progress-pending-running",
					uiProgressPrefix: ".ui-progress-"
				},
				/**
				* Alias for class ns.widget.Progress
				* @method Progress
				* @member ns.widget.Progress
				* @private
				*/
				Progress = function () {
					this.action = "";
					this.label = null;
					/**
					* @property {Object} options Object with default options
					* @member ns.widget.Progress
					* @instance
					*/
					this.options = {
						/**
						* style of button ("circle" or "pending")
						* @property {string} [options.style=null]
						* @member ns.widget.Progress
						* @instance
						*/
						/**
						* style of button ("circle" or "pending")
						* @cfg {string} [data-style='']
						*/
						style: null,

						running: true
					};
					/**
					* @property {string} runningClass witch information about css style animation element
					* @private
					*/
					this.runningClass = null;
					/**
					* @property {HTMLElement} _uiProgress nn
					* @protected
					*/
					this._uiProgress = null;

					// for compare tests pass
					this.runningClass = classes.uiProgressCircleRunning;
				};

			Progress.prototype = new BaseWidget();

			/**
			* @property {Object} classes Dictionary for progress related css class names
			* @member ns.widget.Progress
			* @static
			*/
			Progress.classes = classes;

			/**
			* Build structure of progress widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.Progress
			* @instance
			*/
			Progress.prototype._build = function (element) {
				/* cached Progress.classes object
				* type Object
				*/
				var classes = Progress.classes,
				/* cached options object
				* type Object
				*/
					options = this.options,
				/*
				* created HTML element of progress container
				* type HTMLElement
				*/
					progressElement = document.createElement('div'),
				/*
				* created HTML element of progress container
				* type HTMLElement
				*/
					progressPendingElement,
				/*
				* cached classList of element
				* type DOMTokenList
				*/
					elementClasses = element.classList;

				/*
				* Create structure for progress with style circle
				*/
				if (options.style === "circle") {
					elementClasses.add(classes.uiProgressContainerCircle);
					progressElement.classList.add(classes.uiProgressCircle);
					this.runningClass = classes.uiProgressCircleRunning;

					/*
					* Create structure for progress with style pending
					*/
				} else if (options.style === "pending") {
					elementClasses.add(classes.uiProgressbar);
					progressElement.classList.add(classes.uiProgressbarBg);
					progressPendingElement = document.createElement('div');
					progressPendingElement.classList.add(classes.uiProgressPending);
					progressElement.appendChild(progressPendingElement);
					this.runningClass = classes.uiProgressPendingRunning;
				}

				element.appendChild(progressElement);
				return element;
			};

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.Progress
			*/
			Progress.prototype._init = function (element) {
				if (this._uiProgress === null) {
					this._uiProgress = element.querySelector(Progress.classes.uiProgressPrefix + this.options.style);
				}
			};


			/**
			* Running the progress
			* @method running
			* @param {boolean} flag
			* @member ns.widget.Progress
			* @returns {boolean}
			* @instance
			*/
			Progress.prototype.running = function (flag) {
				if (typeof flag === "boolean") {
					this._setRunning(flag);
				}
				return this.options.running;
			};

			/**
			* Set running flag and refresh progress
			* @param {boolean} flag
			* @protected
			*/
			Progress.prototype._setRunning = function (flag) {
				if (typeof flag === "boolean") {
					this.options.running = flag;
					this._refresh();
				}
			};


			/**
			* Start progress
			* @protected
			*/
			Progress.prototype._start = function () {
				this.show();
				this._uiProgress.classList.add(this.runningClass);
			};

			/**
			* Stop progress
			* @protected
			*/
			Progress.prototype._stop = function () {
				this._uiProgress.classList.remove(this.runningClass);
			};

			/**
			* Show progress
			* @method Show
			* @member ns.widget.Progress
			* @instance
			*/
			Progress.prototype.show = function () {
				this.element.style.display = "";
			};

			/**
			* Hide progress
			* @method hide
			* @member ns.widget.Progress
			* @instance
			*/
			Progress.prototype.hide = function () {
				this.element.style.display = "none";
			};

			/**
			* Refresh progress
			* @method _refresh
			* @member ns.widget.Progress
			* @protected
			* @instance
			*/
			Progress.prototype._refresh = function () {
				if (this.options.running) {
					this._start();
				} else {
					this._stop();
				}
			};

			// definition
			ns.widget.mobile.Progress = Progress;
			engine.defineWidget(
				"Progress",
				"[data-role='progress'], .ui-progress",
				[
					'running',
					'show',
					'hide'
				],
				Progress,
				'tizen'
			);

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Progress;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
