/*global define, ns, document, window */
/*jslint nomen: true, plusplus: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * IndexScrollbar widget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @class ns.widget.wearable.IndexScrollbar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../indexscrollbar",
			"../../../utils/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.utils.object;

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
					var element = this.element;
					element.className = this.options.className;
					element.innerHTML = "<span></span>";

					// Add to DOM tree
					this.options.container.appendChild(element);
					this.fitToContainer();
				},

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

				setValue: function( value ) {
					this.value = value;	// remember value
					value = value.toUpperCase();

					var selected = value.substr(value.length - 1),
						remained = value.substr(0, value.length - 1),
						inner = "<span>" + remained + "</span><span class=\"ui-selected\">" + selected + "</span>";
					this.element.firstChild.innerHTML = inner;	// Set indicator text
				},

				show: function() {
					//this.element.style.visibility="visible";
					this.element.style.display="block";
				},
				hide: function() {
					this.element.style.display="none";
				},
				destroy: function() {
					while(this.element.firstChild) {
						this.element.removeChild(this.element.firstChild);
					}
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
