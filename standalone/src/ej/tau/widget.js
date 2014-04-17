/*global window, define */
/*jslint plusplus: true, nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
/**
 * @class tau.VirtualGrid
 * @inheritdoc ns.widget.micro.VirtualGrid
 * @extends ns.widget.micro.VirtualGrid
 */
/**
 * @class tau.VirtualListview
 * @inheritdoc ns.widget.micro.VirtualListview
 * @extends ns.widget.micro.VirtualListview
 */
/**
 * @class tau.Popup
 * @inheritdoc ns.widget.micro.Popup
 * @extends ns.widget.micro.Popup
 */
/**
 * @class tau.Page
 * @inheritdoc ns.widget.micro.Page
 * @extends ns.widget.micro.Page
 */
/**
 * @class tau.PageContainer
 * @inheritdoc ns.widget.micro.PageContainer
 * @extends ns.widget.micro.PageContainer
 */
/**
 * @class tau.IndexScrollbar
 * @inheritdoc ns.widget.micro.IndexScrollbar
 * @extends ns.widget.micro.IndexScrollbar
 */
(function (document, frameworkNamespace, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../tau",
			"../ej/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			document.addEventListener("widgetdefined", function (evt) {
				var definition = evt.detail,
					name = definition.name,
					engine = frameworkNamespace.engine;

				ns[name] = (function (definitionName) {
					return function (element, options) {
						return engine.instanceWidget(element, definitionName, options);
					};
				}(name));
			}, false);

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej, window.tau));
