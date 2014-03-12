/*global window, define */
/*jslint nomen: true, plusplus: true */
(function (document, ej, tau) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../engine",
			"../../tau",
			"../../utils/events",
			"../micro",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var BaseWidget = ej.widget.BaseWidget,
				engine = ej.engine,
				events = ej.utils.events,
				namespace = tau,
				/**
				* IndexScrollbar widget
				* @class ej.widget.micro.IndexScrollbar
				* @extends ej.widget.BaseWidget
				*/
				IndexScrollbar = function (element) {
					/**
					* @memberOf ej.widget.micro.IndexScrollbar
					*/

					if (!this._isValidElement(element)) {
						throw "Invalid element is given";
					}

					this.options = {
						delimeter: ",",
						index: [ "A", "B", "C", "D", "E", "F", "G", "H",
								"I", "J", "K", "L", "M", "N", "O", "P", "Q",
								"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"]
					};

					this.index = null;

					return this;
				},
				EventType = {},
				classes = {};
			IndexScrollbar.classes = classes;
			IndexScrollbar.events = EventType;

			IndexScrollbar.prototype = new BaseWidget();

			IndexScrollbar.prototype.widgetClass = "ui-indexscrollbar";

			IndexScrollbar.prototype._build = function (template, element) {
				if (!this._isExtended()) {
					this._draw(this._getIndex(), element);
					this._setExtended(true);
				}
				this.widgetName = "IndexScrollbar";
				return element;
			};

			IndexScrollbar.prototype._isValidElement = function (element) {
				return element.classList.contains(this.widgetClass);
			};

			IndexScrollbar.prototype._isExtended = function () {
				return !!this._extended;
			};

			IndexScrollbar.prototype._setExtended = function (flag) {
				this.extended = flag;
				return this;
			};

			IndexScrollbar.prototype._getIndex = function () {
				var options = this.options,
					index = options.index;
				if (typeof index === 'string') {
					index = index.split(options.delimeter);
				}
				return index;
			};

			/**	Draw additinoal sub-elements
			*	@param {array} indices	List of index string
			*/
			IndexScrollbar.prototype._draw = function (indices, element) {
				var ul,
					li,
					i,
					length = indices.length;
				element = element || this.element;
				ul = document.createElement("ul");
				for (i = 0; i < length; i++) {
					li = document.createElement("li");
					li.innerText = indices[i];
					ul.appendChild(li);
				}
				element.appendChild(ul);

				return this;
			};

			IndexScrollbar.prototype._clear = function (element) {
				element = element || this.element;
				while (element.firstChild) {
					element.removeChild(element.firstChild);
				}
			};

			function clickCallback(self, event) {
				var target = event.target,
					index = "";
				if ("li" === target.tagName.toLowerCase()) {
					index = target.innerText;
					events.trigger(self.element, "select", {index: index});
				}
			}

			IndexScrollbar.prototype._bindEvents = function (element) {
				element = element || this.element;
				this.clickCallback = clickCallback.bind(null, this);
				element.addEventListener("click", this.clickCallback, false);
				return this;
			};

			IndexScrollbar.prototype._refresh = function () {
				if (this._isExtended()) {
					this._clear();
					this._setExtended(false);
				}

				this._draw(this._getIndex());
				this._setExtended(true);
			};

			IndexScrollbar.prototype.addEventListener = function (type, listener) {
				this.element.addEventListener(type, listener);
			};

			IndexScrollbar.prototype.removeEventListener = function (type, listener) {
				this.element.removeEventListener(type, listener);
			};

			/**
			* init widget
			* @method _init
			* @param {HTMLElement} element
			* @new
			* @memberOf ej.widget.micro.IndexScrollbar
			*/
			IndexScrollbar.prototype._init = function (element) {
				return element;
			};

			/**
			* @method _destroy
			* @private
			* @memberOf ej.widget.micro.IndexScrollbar
			*/
			IndexScrollbar.prototype._destroy = function () {
				this.element.removeEventListener("click", this.clickCallback, false);
			};

			// definition
			namespace.IndexScrollbar = IndexScrollbar;
			engine.defineWidget(
				"IndexScrollbar",
				"",
				".ui-indexscrollbar",
				[],
				IndexScrollbar,
				'micro'
			);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return namespace.IndexScrollbar;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej, window.tau));
