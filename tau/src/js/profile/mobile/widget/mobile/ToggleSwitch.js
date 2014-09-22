/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true */
/**
 * # Toggle Switch Widget
 * Shows a 2-state switch.
 *
 * The toggle switch widget shows a 2-state switch on the screen.
 *
 * ## Default selectors
 *
 * To add a toggle switch widget to the application, use the following code:
 *
 *		@example
 *		<select name="flip-11" id="flip-11" data-role="slider">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *
 * ## Manual constructor
 * For manual creation of toggle switch widget you can use constructor of
 * widget from **tau** namespace:
 *
 *		@example
 *		<select id="toggle" name="flip-11" id="flip-11" data-role="slider"
 *		data-mini="true">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *		<script>
 *			var toggleElement = document.getElementById("toggle"),
 *				toggle = tau.widget.ToggleSwitch(toggleElement);
 *		</script>
 *
 * ## JavaScript API
 *
 * ToggleSwitch widget hasn't JavaScript API.
 *
 * @class ns.widget.mobile.ToggleSwitch
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/manipulation",
			"../../../../core/event",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var ToggleSwitch = function () {
				var self = this;
					/**
					 * All possible widget options
					 * @property {Object} options
					 * @property {?string} [options.trackTheme=null] sets
					 * the color scheme (swatch) for the slider's track
					 * @property {boolean} [options.disabled=false] start
					 * widget as enabled / disabled
					 * @property {?boolean} [options.mini=false] size
					 * of toggle switch
					 * @property {boolean} [options.highlight=true] if set
					 * then toggle switch can be highligted
					 * @property {?boolean} [options.inline=false] if value is
					 * "true" then toggle switch has css property
					 * display = "inline"
					 * @property {string} [options.theme=null] theme of widget
					 * @member ns.widget.mobile.Slider
					 */
					self.options = {
						trackTheme: null,
						disabled: false,
						mini: null,
						highlight: true,
						inline: null,
						theme: null
					};
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				events = ns.event,
				dom = ns.util.DOM,

				//classesPrefix = "ui-switch",
				classes = {
					toggleSwitch: "ui-slider-switch",
					toggleSwitchInput: "ui-slider-switch-input",
					toggleInneroffset: "ui-slider-inneroffset",
					toggle: "ui-toggle-switch",
					toggleInputLabel: "ui-toggle-label",
					toggleHandler: "ui-switch-handler"
				};

			ToggleSwitch.prototype = new BaseWidget();

			function createElement(name) {
				return document.createElement(name);
			}


			/**
			 * Dictionary for ToggleSwitch related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.ToggleSwitch
			 * @static
			 * @readonly
			 */
			ToggleSwitch.classes = classes;

			function onChangeValue(instance){
				var status = (instance.input.checked) ? 1 :0;

				instance.element.selectedIndex = status;
			}


			/**
			 * Build ToggleSwitch
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._build = function (element) {
				var options = this.options,
					label = createElement("label"),
					divHandler = createElement("div"),
					divInneroffset = createElement("div"),
					inputElement = document.createElement("input"),
					sliderContainer = document.createElement("div");

				element.className = classes.toggleSwitch;

				inputElement.type = "checkbox";

				inputElement.className = classes.toggleSwitchInput;
				divHandler.className = classes.toggleHandler;
				divInneroffset.className = classes.toggleInneroffset;
				sliderContainer.className = classes.toggle;
				label.className = classes.toggleInputLabel;

				sliderContainer.appendChild(divHandler);

				label.appendChild(inputElement);
				label.appendChild(sliderContainer);
				label.appendChild(divInneroffset);

				element.parentNode.insertBefore(label,
						element.nextSibling);

				return element;
			};

			/**
			* Inits widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.ToggleSwitch
			* @instance
			*/
			ToggleSwitch.prototype._init = function (element) {
				this.input = element.nextSibling.firstChild;
			};

			/**
			* Binds events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.ToggleSwitch
			* @instance
			*/
			ToggleSwitch.prototype._bindEvents = function () {
				this._onChangeValue = onChangeValue.bind(null, this);
				this.input.addEventListener('change', this._onChangeValue, true);
			};

			ns.widget.mobile.ToggleSwitch = ToggleSwitch;
			engine.defineWidget(
				"ToggleSwitch",
				"select[data-role='slider'], select[data-role='toggleswitch']",
				[],
				ToggleSwitch,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.ToggleSwitch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
