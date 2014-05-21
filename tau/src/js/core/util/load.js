/*global window, define, XMLHttpRequest */
/**
 * @class ns.util.load
 */
(function (document, ns) {
	'use strict';
	//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
	define(
		[
			'../util'
		],
		function () {
			//>>excludeEnd('tauBuildExclude');

			/**
			 * @property {HTMLHeadElement} head local alias for document HEAD element
			 * @static
			 * @private
			 */
			var head = document.head;
			/**
			 * @method load
			 */
			ns.util.load = {
				/**
				 * Add script to document
				 * (synchronous loading)
				 * @method scriptSync
				 * @param {string} scriptPath
				 * @param {?Function} successCB
				 * @param {?Function} errorCB
				 * @static
				 * @member ns.util.load
				 */
				scriptSync: function (scriptPath, successCB, errorCB) {
					var script,
						xhrObj = new XMLHttpRequest();

					// open and send a synchronous request
					xhrObj.open('GET', scriptPath, false);
					xhrObj.send();
					// add the returned content to a newly created script tag
					if (xhrObj.status === 200 || xhrObj.status === 304) {
						script = document.createElement('script');
						script.type = 'text/javascript';
						script.text = xhrObj.responseText;
						document.body.appendChild(script);
						if (typeof successCB === 'Function') {
							successCB(xhrObj, xhrObj.status);
						}
					} else {
						if (typeof successCB === 'Function') {
							errorCB(xhrObj, xhrObj.status, new Error(xhrObj.statusText));
						}
					}
				},

				/**
				 * @property {string} cacheBust
				 * @member ns.util.load
				 */
				cacheBust: (document.location.href.match(/debug=true/)) ? '?cacheBust=' + (new Date()).getTime() : '',

				/**
				 * Add element to head tag
				 * @method addElementToHead
				 * @param {HTMLElement} element
				 * @param {boolean} [asFirstChildElement=false]
				 * @member ns.util.load
				 */
				addElementToHead: function (element, asFirstChildElement) {
					var firstElement;
					if (head) {
						if (asFirstChildElement) {
							firstElement = head.firstElementChild;
							if (firstElement) {
								head.insertBefore(element, firstElement);
								return;
							}
						}
						head.appendChild(element);
					}
				},

				/**
				 * Create HTML link element with href
				 * @method makeLink
				 * @param {string} href
				 * @returns {HTMLLinkElement}
				 * @member ns.util.load
				 */
				makeLink: function (href) {
					var cssLink = document.createElement('link');
					cssLink.setAttribute('rel', 'stylesheet');
					cssLink.setAttribute('href', href);
					cssLink.setAttribute('name', 'tizen-theme');
					return cssLink;
				},

				/**
				 * Add css link element to head if not exists
				 * @method css
				 * @param {string} path
				 * @member ns.util.load
				 */
				css: function (path) {
					var cssLinks = head.getElementsByTagName('link'),
						i,
						link = null,
						cssLink;
					// Find css link element
					for (i = 0; i < cssLinks.length; i++) {
						cssLink = cssLinks[i];
						if (cssLink.getAttribute('rel') === 'stylesheet') {
							if (cssLink.getAttribute('name') === 'tizen-theme' ||
									cssLink.getAttribute('href') === path) {
								link = cssLink;
								break;
							}
						}
					}
					if (link) {
						// Found the link element!
						if (link.getAttribute('href') !== path) {
							link.setAttribute('href', path);
						}
					} else {
						this.addElementToHead(this.makeLink(path), true);
					}
				}
			};

			//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
			return ns.util.load;
		}
	);
	//>>excludeEnd('tauBuildExclude');
}(window.document, ns));