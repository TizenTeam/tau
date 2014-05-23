/*global window, define */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
*
* Licensed under the Flora License, Version 1.1 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://floralicense.org/license/
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/*jslint plusplus: true, nomen: true */
/**
 * #Fieldcontainer Widget
 * Fieldcontain widget improves the styling of labels and form elements on wider screens. It aligns the input and associated label side-by-side and breaks to stacked block-level elements below ~480px. Moreover, it adds a thin bottom border to act as a field separator.
 *
 * ##Default selectors
 * In default all div or fieldset elements with _data-role=fieldcontain_ are changed to fieldcontain widget.
 *
 * ##Manual constructor
 * For manual creation of fieldcontain widget you can use constructor of widget:
 *
 *	@example
 *	var fieldcontain = ns.engine.instanceWidget(document.getElementById('fieldcontain'), 'Fieldcontain');
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	var fieldcontain = $('#fieldcontain').fieldcontain();
 *
 * ##HTML Examples
 *
 * ###Create fieldcontain
 *
 *	@example
 *	<div data-role="fieldcontain">
 *		<label for="name">Text Input:</label>
 *		<input type="text" name="name" id="name" value="" />
 *	</div>
 *
 * ##Hiding labels accessibly
 * For the sake of accessibility, the framework requires that all form elements be paired with a meaningful label. To hide labels in a way that leaves them visible to assistive technologies — for example, when letting an element's placeholder attribute serve as a label — apply the helper class ui-hidden-accessible to the label itself:
 *
 *	@example
 *	<label for="username" class="ui-hidden-accessible">Username:</label>
 *	<input type="text" name="username" id="username" value="" placeholder="Username"/>
 *
 * To hide labels within a field container and adjust the layout accordingly, add the class ui-hide-label to the field container as in the following:
 *
 *	@example
 *	<div data-role="fieldcontain" class="ui-hide-label">
 *		<label for="username">Username:</label>
 *		<input type="text" name="username" id="username" value="" placeholder="Username"/>
 *	</div>
 *
 * While the label will no longer be visible, it will be available to assisitive technologies such as screen readers.
 *
 * Because radio and checkbox buttons use the label to display the button text you can't use ui-hidden-accessible in this case. However, the class ui-hide-label can be used to hide the legend element:
 *
 *	@example
 *	<div data-role="fieldcontain" class="ui-hide-label">
 *		<fieldset data-role="controlgroup">
 *			<legend>Agree to the terms:</legend>
 *			<input type="checkbox" name="checkbox-agree" id="checkbox-agree" class="custom" />
 *			<label for="checkbox-agree">I agree</label>
 *		</fieldset>
 *	</div>
 *
 * @class ns.widget.mobile.Fieldcontain
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			* Alias for class ns.widget.mobile.Fieldcontain
			* @method Fieldcontain
			* @member ns.widget.mobile.Fieldcontain
			* @private
			* @static
			*/
			var Fieldcontain = function () {
					return;
				},
				/**
				* @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
				* @member ns.widget.mobile.Fieldcontain
				* @private
				* @static
				*/
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* @property {Object} engine Alias for class ns.engine
				* @member ns.widget.mobile.Fieldcontain
				* @private
				* @static
				*/
				engine = ns.engine;

			Fieldcontain.classes = {
				uiFieldContain: "ui-field-contain",
				uiBody: "ui-body",
				uiBr: "ui-br"
			};

			Fieldcontain.prototype = new BaseWidget();

			/**
			* Build structure of fieldcontain widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.mobile.Fieldcontain
			* @instance
			*/
			Fieldcontain.prototype._build = function (element) {
				var childNodes = element.childNodes,
					classList = element.classList,
					i = childNodes.length,
					childNode,
					classes = Fieldcontain.classes;
				// adding right classes
				classList.add(classes.uiFieldContain);
				classList.add(classes.uiBody);
				classList.add(classes.uiBr);
				// removing whitespace between label and form element
				while (--i >= 0) {
					childNode = childNodes[i];
					if (childNode.nodeType === 3 && !/\S/.test(childNode.nodeValue)) {
						element.removeChild(childNode);
					}
				}
				return element;
			};

			// definition
			ns.widget.mobile.Fieldcontain = Fieldcontain;
			engine.defineWidget(
				"Fieldcontain",
				"[data-role='fieldcontain'], .ui-fieldcontain",
				[],
				Fieldcontain,
				'mobile'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Fieldcontain;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
