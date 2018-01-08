/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
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
/*global window, define, ns */
/**
 * #Button
 * Button component changes the default browser buttons to special buttons with additional features, such as icons, corners, and shadows.
 *
 * ##Default Selectors
 *
 * By default, all button elements are displayed as Tizen Web UI buttons.
 * In addition, all elements with the *class="ui-btn"* and *data-role="button"* attribute are displayed as Tizen Web UI buttons.
 *
 * ##Manual Constructor
 *
 * To manually create a button component, use the component constructor from the tau namespace:
 *
 * @example
 *    <div id="button"></div>
 *    <script>
 *      var buttonElement = document.getElementById("button"),
 *        button = tau.widget.Button(buttonElement);
 *    </script>
 *
 * The constructor requires an HTMLElement parameter to create the component, and you can get it with the
 * document.getElementById() method. The constructor can also take a second parameter, which is an object defining the
 * configuration options for the component.
 *
 * ##HTML Examples
 *
 * To create a simple button from a link using the class selector:
 *
 * @example
 *   <a href="#page2" class="ui-btn">Link button</a>
 *
 * To create a simple button using the <button> element:
 *
 * @example
 *    <button>Button element</button>
 *
 * @since 2.0
 * @class ns.widget.mobile.Button
 * @extends ns.widget.core.Button
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/widget/core/Button",
			"../mobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Button = ns.widget.core.Button;

			ns.widget.mobile.Button = Button;

			ns.engine.defineWidget(
				"Button",
				"button, [data-role='button'], .ui-btn, input[type='button']",
				[],
				Button,
				"mobile",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
