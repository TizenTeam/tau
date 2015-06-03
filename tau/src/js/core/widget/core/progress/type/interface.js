/*global window, define, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Progress type Interface
 * Interface for type of progress
 * @class ns.widget.core.progress.type.interface
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../type"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			ns.widget.core.progress.type.interface = {
				/**
				 * Init DOM for progress
				 * @method build
				 * @param Progress
				 * @static
				 * @member ns.widget.core.progress.type.interface
				 */
				build: function ( /*Progress*/ ) {
				},
				/**
				 * Init Style for progress
				 * @method init
				 * @param Progress
				 * @static
				 * @member ns.widget.core.progress.type.interface
				 */
				init: function ( /*Progress*/ ) {
				},
				/**
				 * Init Style for progress
				 * @method refresh
				 * @param Progress
				 * @static
				 * @member ns.widget.core.progress.type.interface
				 */
				refresh: function( /*Progress*/ ) {

				},
				/**
				 * Init Style for progress
				 * @method changeValue
				 * @param Progress
				 * @static
				 * @member ns.widget.core.progress.type.interface
				 */
				changeValue: function( /*Progress*/ ) {

				},
				/**
				 * Init Style for progress
				 * @method destroy
				 * @param Progress
				 * @static
				 * @member ns.widget.core.progress.type.interface
				 */
				destroy: function( /*Progress*/ ) {

				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
