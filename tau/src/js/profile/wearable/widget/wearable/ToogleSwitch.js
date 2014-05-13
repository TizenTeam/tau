/*global window, define */
/*jslint nomen: true */
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
				/**
				* ToggleSwitch widget
				* @class ns.widget.ToggleSwitch
				* @extends ns.widget.BaseWidget
				*/
				ToggleSwitch = function () {
					this.options = {
						text: null
					};
					return this;
				},
				events = {},
				classesPrefix = 'ui-switch',
				classes = {
					handler: classesPrefix + '-handler',
					inneroffset: classesPrefix + '-inneroffset',
					activation: classesPrefix + '-activation',
					input: classesPrefix + '-input',
					text: classesPrefix + '-text'
				},
				prototype = new BaseWidget();

			function getClass(name) {
				return classes[name];
			}

			function addClass(element, classId) {
				element.classList.add(getClass(classId));
			}

			function createElement(name) {
				return document.createElement(name);
			}

			ToggleSwitch.events = events;
			ToggleSwitch.classes = classes;

			/**
			* build ToggleSwitch
			* @method _build
			* @private
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.ToggleSwitch
			*/
			prototype._build = function (element) {
				var options = this.options,
					text = options.text,
					divText,
					label = createElement('label'),
					input = createElement('input'),
					divActivation = createElement('div'),
					divInneroffset = createElement('div'),
					divHandler = createElement('div');

				if (text) {
					divText = createElement('div');
					addClass(divText, 'text');
					divText.innerHTML = text;
					element.appendChild(divText);
				}
				addClass(divHandler, 'handler');
				divInneroffset.appendChild(divHandler);
				addClass(divInneroffset, 'inneroffset');
				divActivation.appendChild(divInneroffset);
				addClass(divActivation, 'activation');
				label.classList.add('ui-toggleswitch');
				input.type = 'checkbox';
				addClass(input, 'input');
				label.appendChild(input);
				label.appendChild(divActivation);
				element.appendChild(label);
				return element;
			};

			ToggleSwitch.prototype = prototype;
			ns.widget.wearable.ToggleSwitch = ToggleSwitch;

			engine.defineWidget(
				"ToggleSwitch",
				".ui-switch",
				[],
				ToggleSwitch,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ToggleSwitch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
