/*global window, define, Object, Element */
/**
 * #Data attributes utils
 * @class ns.util.data
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util", // fetch namespace
			"../event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var hashMap = {},
				eventUtils = ns.event,
				body = document.body,
				fetchDom = function (element, key) {
					var dataKey = 'data-' + key,
						data,
						result;
					if (element.hasAttribute(dataKey)) {
						data = element.getAttribute(dataKey);
						try {
							result = JSON.parse(data);
						} catch (ignore) {}
					}
					return result;
				},
				removeDom = function (element, key) {
					var dataKey = 'data-' + key;
					if (element.hasAttribute(dataKey)) {
						element.removeAttribute(dataKey);
					}
				},
				/**
				 * Return hash for object
				 * @method hashObject
				 * @param {*} value
				 * @return {string}
				 * @member ns.util.data
				 * @static
				 * @private
				 */
				hashObject = function (value) {
					if (value === undefined ||
							value === null ||
							value === false) {
						throw "Hashed object/primitive can not be undefined, null or false";
					}

					if (value instanceof Element && value.hasAttribute("data-ns-hash")) {
						return value.getAttribute("data-ns-hash");
					}

					if (value instanceof Object) {
						value.__tau_hash = value.__tau_hash || ns.getUniqueId();
					}
					var h = (typeof value) + "-" + (value instanceof Object ?
								value.__tau_hash : value.toString());

					if (value instanceof Element) {
						value.setAttribute("data-ns-hash", h);
					}
					return h;
				};

			ns.util.data = {

				set: function (element, key, value) {
					var hash = hashObject(element);
					if (!hash) {
						return false;
					}

					if (!hashMap[hash]) {
						hashMap[hash] = {};
					}

					hashMap[hash][key] = value;

					if (element instanceof Element) {
						eventUtils.trigger(element, "setData", {"key": key, "value": value});
					}
					eventUtils.trigger(body, "globalSetData", {"element": element, "key": key, "value": value});

					return value;
				},

				get: function (element, key, defaultValue) {
					var hash = hashObject(element),
						value;
					if (hash) {
						if (hashMap[hash] && hashMap[hash][key] !== undefined) {
							value = hashMap[hash][key];
						}

						if (element instanceof Element) {
							if (value === undefined) {
								value = fetchDom(element, key);
								// pass it to memory HashMap
								hashMap[hash] = hashMap[hash] || {};
								hashMap[hash][key] = hashMap[hash][key] || value;
							}
							eventUtils.trigger(element, "getData", {"key": key, "value": value});
						}
						eventUtils.trigger(body, "globalGetData", {"element": element, "key": key, "value": value});

						return value;
					}

					return defaultValue;
				},

				remove: function (element, key) {
					var hash = hashObject(element),
						value;
					if (hash && hashMap[hash] && hashMap[hash][key] !== undefined) {
						value = hashMap[hash][key];

						delete hashMap[hash][key];
						if (Object.keys(hashMap[hash]) === 0) {
							delete hashMap[hash];
						}

						if (element instanceof Element) {
							removeDom(element, key);
							eventUtils.trigger(element, "removeData", {"key": key, "value": value});
						}
						eventUtils.trigger(body, "globalRemoveData", {"element": element, "key": key, "value": value});

						return true;
					}
					return false;
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.data;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
