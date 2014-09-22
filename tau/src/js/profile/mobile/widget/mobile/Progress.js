/*global window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */

/**
 * #Progress Widget
 * The progress widget shows that an operation is in progress.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - HTML elements with data-role equal "progress"
 *  - HTML elements with class ui-progress
 *
 * ###HTML Examples
 *
 * ####Create simple text input on INPUT element
 *
 *		@example
 *		<div id="progress" data-role="progress"></div>
 *
 * ## Manual constructor
 * For manual creation of button widget you can use constructor of widget from
 * **tau** namespace:
 *
 *		@example
 *		<div id="progress"></div>
 *		<script>
 *			var element = document.getElementById("progress"),
 *				progress = tau.widget.Progress(element);
 *		</script>
 *
 * Constructor has one required parameter **element** which is base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter **options** and it is a object
 * with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<div id="progress"></div>
 *		<script>
 *			$("#progress").progress();
 *		</script>
 *
 * jQuery Mobile constructor has one optional parameter **options** and it is
 * a object with options for widget.
 *
 * ##Options for widget
 *
 * Options for widget can be defined as _data-..._ attributes or supplied as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<div id="progress"></div>
 *		<script>
 *			var element = document.getElementById("progress"),
 *				progress = tau.widget.Progress(element);
 *
 *			// progress.methodName(argument1, argument2, ...);
 *			// for example
 *			progress.value(2);
 *		</script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		<div id="progress"></div>
 *		<script>
 *			// $(".selector").progress("methodName", argument1, argument2, ...);
 *			// for example
 *			$("#progress").progress("value", 2);
 *		</script>
 *
 * @extends ns.widget.BaseWidget
 * @class ns.widget.mobile.Progress
 */

(function (document, ns) {
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
			 * @member ns.widget.mobile.Progress
			 * @private
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {ns.engine} engine Alias for class ns.engine
				 * @member ns.widget.mobile.Progress
				 * @private
				 * @static
				 */
				engine = ns.engine,
				classes = {
					uiProgressContainerCircle: "ui-progress-container-circle",
					uiProgressCircleRunning: "ui-progress-circle-running",
					uiProgressCircle: "ui-progress-circle",
					uiProgressCircleSmall: "ui-progress-circle-small",
					uiProgressCircleLarge: "ui-progress-circle-large",
					uiProgressbar: "ui-progressbar",
					uiProgressbarBg: "ui-progressbar-bg",
					uiProgressPending: "ui-progress-pending",
					uiProgressPendingRunning: "ui-progress-pending-running",
					uiProgressPrefix: ".ui-progress-"
				},

				Progress = function () {
					this.action = "";
					this.label = null;
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {"circle"|"pending"} [options.style="pending"]
					 * style of progress
					 * @property {boolean} [options.running=true] start running
					 * or not
					 * @property {"small"|"medium"|"large"} [options.size="medium"] The size
					 * for the circle style progress
					 * @member ns.widget.mobile.Progress
					 */
					this.options = {
						style: "pending",
						running: true,
						size: "medium"
					};
					/**
					 * witch information about css style animation element
					 * @property {string} runningClass
					 * @member ns.widget.mobile.Progress
					 */
					this.runningClass = classes.uiProgressCircleRunning;
					/**
					 * @property {HTMLElement} _uiProgress nn
					 * @protected
					 * @member ns.widget.mobile.Progress
					 */
					this._uiProgress = null;
				};

			Progress.prototype = new BaseWidget();

			/**
			 * Dictionary for progress related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.Progress
			 * @static
			 */
			Progress.classes = classes;

			/**
			 * Build structure of progress widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Progress
			 */
			Progress.prototype._build = function (element) {
					/* cached options object
					* type Object
					*/
				var options = this.options,
					/*
					* created HTML element of progress container
					* type HTMLElement
					*/
					progressElement = document.createElement("div"),
					/*
					* created HTML element of progress container
					* type HTMLElement
					*/
					progressPendingElement,
					/*
					* cached classList of element
					* type DOMTokenList
					*/
					elementClasses = element.classList,
					progressClasses = progressElement.classList;

				/*
				 * Create structure for progress with style circle
				 */
				if (options.style === "circle") {
					elementClasses.add(classes.uiProgressContainerCircle);
					progressClasses.add(classes.uiProgressCircle);
					switch (options.size) {
					case "small":
						progressClasses.add(classes.uiProgressCircleSmall);
						break;
					case "large":
						progressClasses.add(classes.uiProgressCircleLarge);
						break;
					}
					this.runningClass = classes.uiProgressCircleRunning;

					/*
					 * Create structure for progress with style pending
					 */
				} else if (options.style === "pending") {
					elementClasses.add(classes.uiProgressbar);
					progressElement.classList.add(classes.uiProgressbarBg);
					progressPendingElement = document.createElement("div");
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
			 * @member ns.widget.mobile.Progress
			 */
			Progress.prototype._init = function (element) {
				var self = this,
					options = self.options;
				if (self._uiProgress === null) {
					self._uiProgress = element.querySelector(classes.uiProgressPrefix +
							options.style);
				}
				self._setRunning(options.running);
			};


			/**
			 * Method starts or stops running the progress.
			 *
			 *	@example
			 *	<div id="progress"></div>
			 *	<script>
			 *		var element = document.getElementById("progress"),
			 *			progressWidget = tau.widget.Progress(element),
			 *			// return current state of running
			 *			value = progressWidget.running();
			 *
			 *		progressWidget.running( true ); // starts running
			 *
			 *		progressWidget.running( fasle ); // stops running
			 *	</script>
			 *
			 *	@example
			 *	<div id="progress"></div>
			 *	<script>
			 *		// return current state of running
			 *		$( "#progress" ).progress( "running" );
			 *
			 *		// starts running
			 *		$( "#progress" ).progress( "running", true );
			 *
			 *		// stops running
			 *		$( "#progress" ).progress( "running", fasle );
			 *	</script>
			 *
			 * @method running
			 * @param {boolean} flag if thrue then set mode to running if false
			 * the stop running mode
			 * @member ns.widget.mobile.Progress
			 * @returns {boolean}
			 */
			Progress.prototype.running = function (flag) {
				if (typeof flag === "boolean") {
					this._setRunning(flag);
				}
				return this.options.running;
			};

			/**
			 * Set running flag and refresh progress
			 * @method _setRunning
			 * @param {boolean} flag
			 * @protected
			 * @member ns.widget.mobile.Progress
			 */
			Progress.prototype._setRunning = function (flag) {
				if (typeof flag === "boolean") {
					this.options.running = flag;
					this._refresh();
				}
			};


			/**
			 * Start progress
			 * @method _start
			 * @protected
			 * @member ns.widget.mobile.Progress
			 */
			Progress.prototype._start = function () {
				this.show();
				this._uiProgress.classList.add(this.runningClass);
			};

			/**
			 * Stop progress
			 * @method _stop
			 * @protected
			 * @member ns.widget.mobile.Progress
			 */
			Progress.prototype._stop = function () {
				this._uiProgress.classList.remove(this.runningClass);
			};

			/**
			 * Method shows progress.
			 *
			 *	@example
			 *	<div id="progress"></div>
			 *	<script>
			 *		var element = document.getElementById("progress"),
			 *			progressWidget = tau.widget.Progress(element);
			 *
			 *		progressWidget.show();
			 *	</script>
			 *
			 *	@example
			 *	<div id="progress"></div>
			 *	<script>
			 *		$( "#progress" ).progress( "show" );
			 *	</script>
			 *
			 * @method show
			 * @member ns.widget.mobile.Progress
			 */
			Progress.prototype.show = function () {
				this.element.style.display = "";
			};

			/**
			 * Method hides progress
			 *
			 *	@example
			 *	<div id="progress"></div>
			 *	<script>
			 *		var element = document.getElementById("progress"),
			 *			progressWidget = tau.widget.Progress(element);
			 *		progressWidget.hide();
			 *	</script>
			 *
			 *	@example
			 *	<div id="progress"></div>
			 *	<script>
			 *		$( "#progress" ).progress( "hide" );
			 *	</script>
			 *
			 * @method hide
			 * @member ns.widget.mobile.Progress
			 */
			Progress.prototype.hide = function () {
				this.element.style.display = "none";
			};

			/**
			 * Method refreshes a progress.
			 *
			 * This method will rebuild while DOM structure of widget. Method
			 * should be called after all manually change in HTML attributes
			 * of widget DOM structure. Refresh is called automatically after
			 * change any option of widget.
			 *
			 *	@example
			 *	<div id="progress"></div>
			 *	<script>
			 *		var element = document.getElementById("progress"),
			 *			progressWidget = tau.widget.Progress(element);
			 *
			 *		progressWidget.refresh();
			 *
			 *		// also will be called after
			 *		progressWidget.option("running", true);
			 *	</script>
			 *
			 *	@example
			 *	<div id="progress"></div>
			 *	<script>
			 *		$( "#progress" ).progress( "refresh" );
			 *	</script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.Progress
			 */

			/**
			 * Refresh progress
			 * @method _refresh
			 * @member ns.widget.mobile.Progress
			 * @protected
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
					"running",
					"show",
					"hide"
				],
				Progress,
				"tizen"
			);

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Progress;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
