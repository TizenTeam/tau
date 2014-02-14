/*global window, define */
/**
 * #Object utilities
 * Namespace with helpers function connected with objects.
 *
 * @class ej.utils.object
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../utils" // fetch namespace
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var object = {
				/**
				* Copy object to new object
				* @method copy
				* @param {Object} orgObject
				* @return {Object}
				* @static
				* @memberOf ej.utils.object
				*/
				copy: function (orgObject) {
					return object.merge({}, orgObject);
				},

				/**
				* Attach fields from second object to first object.
				* @method merge
				* @param {Object} newObject
				* @param {Object} orgObject
				* @return {Object}
				* @static
				* @memberOf ej.utils.object
				*/
				merge: function (newObject, orgObject) {
					var key;
					for (key in orgObject) {
						if (orgObject.hasOwnProperty(key)) {
							newObject[key] = orgObject[key];
						}
					}
					return newObject;
				},

				/**
				* Attach fields from second and next object to first object.
				* @method multiMerge
				* @param {Object} newObject
				* @param {Object} orgObject
				* @return {Object}
				* @static
				* @memberOf ej.utils.object
				*/
				multiMerge: function () {
					var key,
						args = [].slice.call(arguments),
						newObject = args.shift(),
						orgObject,
						argsLength = args.length,
						i;
					for (i = 0; i < argsLength; i++) {
						orgObject = args.shift();
						for (key in orgObject) {
							if (orgObject.hasOwnProperty(key)) {
								newObject[key] = orgObject[key];
							}
						}
					}
					return newObject;
				}
			};
			ej.utils.object = object;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return object;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.ej));
