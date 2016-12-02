/*global window, ns, define */
/*jslint plusplus: true, nomen: true */
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
/**
 * #jQuery Mobile mapping colors
 * Object maps color support object from TAU namespace to
 * jQuery Mobile namespace.
 * @class ns.jqm.colors
 */
(function (window, document, ns, $) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./namespace",
			"../core/engine",
			"../core/util/colors"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.jqm.colors = {
				/**
				 * Proxy colors library from ns namespace to jQM namespace
				 * @method init
				 * @member ns.jqm.colors
				 * @static
				 */
				init: function () {
					if ($) {
						$.mobile.tizen.clrlib = ns.util.colors;
					}
				}
			};
			// Listen when framework is ready
			document.addEventListener(ns.engine.eventType.INIT, function () {
				ns.jqm.colors.init();
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm.colors;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns, ns.jqm.jQuery));
