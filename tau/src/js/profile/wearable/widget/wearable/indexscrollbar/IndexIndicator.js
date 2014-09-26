/*global define, ns, document, window */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #IndexIndicator widget
 * Class creates index indicator.
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @class ns.widget.wearable.indexscrollbar.IndexIndicator
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../indexscrollbar",
			"../../../../../core/util/object",
			"../../../../../core/event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				events = ns.event;

			/**
			 * @brief block 'unexpected bouncing effect' on indexscroller indicator.
			 */
			function blockEvent (event) {
				event.preventDefault();
				event.stopPropagation();
			}

			function IndexIndicator(element, options) {
				this.element = element;
				this.options = utilsObject.merge(options, this._options, false);
				this.value = null;

				this._init();

				return this;
			}

			IndexIndicator.prototype = {
				_options: {
					className: "ui-indexscrollbar-indicator",
					selectedClass: "ui-selected",
					container: null
				},
				_init: function() {
					var self = this,
						options = self.options,
						element = self.element;
					element.className = options.className;
					element.innerHTML = "<span></span>";
					events.on(element, ["touchstart", "touchmove"], blockEvent, false);


					// Add to DOM tree
					options.container.insertBefore(element, options.referenceElement);
					self.fitToContainer();
				},

				/**
				 * Fits size to container.
				 * @method fitToContainer
				 * @member ns.widget.wearable.indexscrollbar.IndexIndicator
				 */
				fitToContainer: function() {
					var element = this.element,
						container = this.options.container,
						containerPosition = window.getComputedStyle(container).position;

					element.style.width = container.offsetWidth + "px";
					element.style.height = container.offsetHeight + "px";

					if ( containerPosition !== "absolute" && containerPosition !== "relative" ) {
						element.style.top = container.offsetTop + "px";
						element.style.left = container.offsetLeft + "px";
					}
				},

				/**
				 * Sets value of widget.
				 * @method setValue
				 * @param {string} value
				 * @member ns.widget.wearable.indexscrollbar.IndexIndicator
				 */
				setValue: function( value ) {
					this.value = value;	// remember value
					value = value.toUpperCase();

					var selected = value.substr(value.length - 1),
						remained = value.substr(0, value.length - 1),
						inner = "<span>" + remained + "</span><span class=\"ui-selected\">" + selected + "</span>";
					this.element.firstChild.innerHTML = inner;	// Set indicator text
				},

				/**
				 * Shows widget.
				 * @method show
				 * @member ns.widget.wearable.indexscrollbar.IndexIndicator
				 */
				show: function() {
					//this.element.style.visibility="visible";
					this.element.style.display="block";
				},

				/**
				 * Hides widget.
				 * @method hide
				 * @member ns.widget.wearable.indexscrollbar.IndexIndicator
				 */
				hide: function() {
					this.element.style.display="none";
				},

				/**
				 * Destroys widget.
				 * @method destroy
				 * @member ns.widget.wearable.indexscrollbar.IndexIndicator
				 */
				destroy: function() {
					var element = this.element;

					while(element.firstChild) {
						element.removeChild(element.firstChild);
					}
					events.off(element, ["touchstart", "touchmove"], blockEvent, false);
					this.element = null;	// unreference element

				}
			};
			ns.widget.wearable.indexscrollbar.IndexIndicator = IndexIndicator;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return IndexIndicator;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
