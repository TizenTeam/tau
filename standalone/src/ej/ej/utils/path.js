/*global window, define, RegExp */
(function (window, document, ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../utils",
			"./object",
			"./selectors",
			"./DOM/attributes",
			"../engine"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
				/**
				* Local alias for ej.engine
				* @property {Object} engine Alias for {@link ej.engine}
				* @memberOf ej.utils.path
				* @static
				* @private
				*/
			var engine = ej.engine,
				/**
				* Local alias for ej.utils.object
				* @property {Object} object Alias for {@link ej.utils.object}
				* @memberOf ej.utils.path
				* @static
				* @private
				*/
				object = ej.utils.object,
				/**
				* Local alias for ej.utils.selectors
				* @property {Object} selectors Alias for {@link ej.utils.selectors}
				* @memberOf ej.utils.path
				* @static
				* @private
				*/
				selectors = ej.utils.selectors,
				/**
				* Local alias for ej.utils.DOM
				* @property {Object} DOM Alias for {@link ej.utils.DOM}
				* @memberOf ej.utils.path
				* @static
				* @private
				*/
				DOM = ej.utils.DOM,
				/**
				*
				* @memberOf ej.utils.path
				* @property {HTMLBaseElement} base
				* @static
				* @private
				*/
				base,
				/**
				*
				* @memberOf ej.utils.path
				* @property {Object} location
				* @static
				* @private
				*/
				location = {},
				/**
				* Ej utils path namespace
				* @class ej.utils.path
				* @static
				*/
				path = {
					/**
					*
					* @memberOf ej.utils.path
					* @property {string} [uiStateKey="&ui-state"]
					* @static
					*/
					uiStateKey: "&ui-state",

					// This scary looking regular expression parses an absolute URL or its relative
					// variants (protocol, site, document, query, and hash), into the various
					// components (protocol, host, path, query, fragment, etc that make up the
					// URL as well as some other commonly used sub-parts. When used with RegExp.exec()
					// or String.match, it parses the URL into a results array that looks like this:
					//
					//	[0]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content
					//	[1]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread
					//	[2]: http://jblas:password@mycompany.com:8080/mail/inbox
					//	[3]: http://jblas:password@mycompany.com:8080
					//	[4]: http:
					//	[5]: //
					//	[6]: jblas:password@mycompany.com:8080
					//	[7]: jblas:password
					//	[8]: jblas
					//	[9]: password
					//	[10]: mycompany.com:8080
					//	[11]: mycompany.com
					//	[12]: 8080
					//	[13]: /mail/inbox
					//	[14]: /mail/
					//	[15]: inbox
					//	[16]: ?msg=1234&type=unread
					//	[17]: #msg-content
					//
					/**
					* @poperty {RegExp} urlParseRE
					* @memberOf ej.utils.path
					* @static
					*/
					urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,

					/**
					* Abstraction to address xss (Issue #4787) by removing the authority in
					* browsers that auto	decode it. All references to location.href should be
					* replaced with a call to this method so that it can be dealt with properly here
					* @method getLocation
					* @param {string|Object} url
					* @return {string}
					* @memberOf ej.utils.path
					*/
					getLocation: function (url) {
						var uri = this.parseUrl(url || window.location.href),
							hash = uri.hash;
						// mimic the browser with an empty string when the hash is empty
						hash = hash === "#" ? "" : hash;
						location = uri;
						// Make sure to parse the url or the location object for the hash because using location.hash
						// is autodecoded in firefox, the rest of the url should be from the object (location unless
						// we're testing) to avoid the inclusion of the authority
						return uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash;
					},

					/**
					*
					* @method getDocumentUrl
					* @memberOf ej.utils.path
					* @param {boolean} [asParsedObject=false]
					* @return {string|Object}
					* @static
					*/
					getDocumentUrl: function (asParsedObject) {
						return asParsedObject ? object.copy(path.documentUrl) : path.documentUrl.href;
					},

					/**
					*
					* @method parseLocation
					* @return {Object}
					* @memberOf ej.utils.path
					*/
					parseLocation: function () {
						return this.parseUrl(this.getLocation());
					},

					/**
					* Parse a URL into a structure that allows easy access to
					* all of the URL components by name.
					* If we're passed an object, we'll assume that it is
					* a parsed url object and just return it back to the caller.
					* @method parseUrl
					* @memberOf ej.utils.path
					* @param {string|Object} url
					* @return {Object} uri record
					* @return {string} return.href
					* @return {string} return.hrefNoHash
					* @return {string} return.hrefNoSearch
					* @return {string} return.domain
					* @return {string} return.protocol
					* @return {string} return.doubleSlash
					* @return {string} return.authority
					* @return {string} return.username
					* @return {string} return.password
					* @return {string} return.host
					* @return {string} return.hostname
					* @return {string} return.port
					* @return {string} return.pathname
					* @return {string} return.directory
					* @return {string} return.filename
					* @return {string} return.search
					* @return {string} return.hash
					* @static
					*/
					parseUrl: function (url) {
						var matches;
						if (typeof url === "object") {
							return url;
						}

						matches = path.urlParseRE.exec(url || "") || [];

							// Create an object that allows the caller to access the sub-matches
							// by name. Note that IE returns an empty string instead of undefined,
							// like all other browsers do, so we normalize everything so its consistent
							// no matter what browser we're running on.
						return {
							href:		matches[0] || "",
							hrefNoHash:   matches[1] || "",
							hrefNoSearch: matches[2] || "",
							domain:	matches[3] || "",
							protocol:	matches[4] || "",
							doubleSlash:  matches[5] || "",
							authority:	matches[6] || "",
							username:	matches[8] || "",
							password:	matches[9] || "",
							host:		matches[10] || "",
							hostname:	matches[11] || "",
							port:		matches[12] || "",
							pathname:	matches[13] || "",
							directory:	matches[14] || "",
							filename:	matches[15] || "",
							search:	matches[16] || "",
							hash:		matches[17] || ""
						};
					},

					/**
					* Turn relPath into an asbolute path. absPath is
					* an optional absolute path which describes what
					* relPath is relative to.
					* @method makePathAbsolute
					* @memberOf ej.utils.path
					* @param {string} relPath
					* @param {string} absPath
					* @return {string}
					* @static
					*/
					makePathAbsolute: function (relPath, absPath) {
						var absStack,
							relStack,
							directory,
							i;
						if (relPath && relPath.charAt(0) === "/") {
							return relPath;
						}

						relPath = relPath || "";
						absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";

						absStack = absPath ? absPath.split("/") : [];
						relStack = relPath.split("/");
						for (i = 0; i < relStack.length; i++) {
							directory = relStack[i];
							switch (directory) {
							case ".":
								break;
							case "..":
								if (absStack.length) {
									absStack.pop();
								}
								break;
							default:
								absStack.push(directory);
								break;
							}
						}
						return "/" + absStack.join("/");
					},

					/**
					* Returns true if both urls have the same domain.
					* @method isSameDomain
					* @memberOf ej.utils.path
					* @param {string|Object} absUrl1
					* @param {string|Object} absUrl2
					* @return {boolean}
					* @static
					*/
					isSameDomain: function (absUrl1, absUrl2) {
						return path.parseUrl(absUrl1).domain === path.parseUrl(absUrl2).domain;
					},

					/**
					* Returns true for any relative variant.
					* @method isRelativeUrl
					* @memberOf ej.utils.path
					* @param {string|Object} url
					* @return {boolean}
					* @static
					*/
					isRelativeUrl: function (url) {
						// All relative Url variants have one thing in common, no protocol.
						return path.parseUrl(url).protocol === "";
					},

					/**
					* Returns true for an absolute url.
					* @memberOf ej.utils.path
					* @param {string} url
					* @return {boolean}
					* @static
					*/
					isAbsoluteUrl: function (url) {
						return path.parseUrl(url).protocol !== "";
					},

					/**
					* Turn the specified realtive URL into an absolute one. This function
					* can handle all relative variants (protocol, site, document, query, fragment).
					* @method makeUrlAbsolute
					* @memberOf ej.utils.path
					* @param {string} relUrl
					* @param {string} absUrl
					* @return {string}
					* @static
					*/
					makeUrlAbsolute: function (relUrl, absUrl) {
						if (!path.isRelativeUrl(relUrl)) {
							return relUrl;
						}

						var relObj = path.parseUrl(relUrl),
							absObj = path.parseUrl(absUrl),
							protocol = relObj.protocol || absObj.protocol,
							doubleSlash = relObj.protocol ? relObj.doubleSlash : (relObj.doubleSlash || absObj.doubleSlash),
							authority = relObj.authority || absObj.authority,
							hasPath = relObj.pathname !== "",
							pathname = path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname),
							search = relObj.search || (!hasPath && absObj.search) || "",
							hash = relObj.hash;

						return protocol + doubleSlash + authority + pathname + search + hash;
					},

					/**
					* Add search (aka query) params to the specified url.
					* @method addSearchParams
					* @memberOf ej.utils.path
					* @param {string|Object} url
					* @param {Object|string} params
					* @return {string}
					*/
					addSearchParams: function (url, params) {
						var urlObject = path.parseUrl(url),
							paramsString = (typeof params === "object") ? this.getAsURIParameters(params) : params,
							searchChar = urlObject.search || "?";
						return urlObject.hrefNoSearch + searchChar + (searchChar.charAt(searchChar.length - 1) !== "?" ? "&" : "") + paramsString + (urlObject.hash || "");
					},

					addHashSearchParams: function (url, params) {
						var u = path.parseUrl(url),
							p = (typeof params === "object") ? path.getAsURIParameters(params) : params,
							h = u.hash,
							s = h ? (h.indexOf("?") < 0 ? h + "?" : h + "&") : "#?";
						return u.hrefNoHash + s + (s.charAt(s.length - 1) !== "?" ? "&" : "") + p;
					},

					/**
					*
					* @method convertUrlToDataUrl
					* @memberOf ej.utils.path
					* @param {string} absUrl
					* @param {string} dialogHashKey
					* @param {Object} documentBase  uri structure
					* @param {Object} documentUrl uri structure
					* @return {string}
					* @static
					*/
					convertUrlToDataUrl: function (absUrl, dialogHashKey, documentBase, documentUrl) {
						var urlObject = path.parseUrl(absUrl);
						documentBase = documentBase || path.documentBase;
						documentUrl = documentUrl || path.documentUrl;
						if (path.isEmbeddedPage(urlObject, documentBase, false, documentUrl)) {
							// For embedded pages, remove the dialog hash key as in getFilePath(),
							// otherwise the Data Url won't match the id of the embedded Page.
							return urlObject.hash.split(dialogHashKey)[0].replace(/^#/, "").replace(/\?.*$/, "");
						}
						if (path.isSameDomain(urlObject, documentBase)) {
							return urlObject.hrefNoHash.replace(documentBase.domain, "").split(dialogHashKey)[0];
						}

						return window.decodeURIComponent(absUrl);
					},

					/**
					* Get path from current hash, or from a file path
					* @method get
					* @memberOf ej.utils.path
					* @param {string} newPath
					* @return {string}
					*/
					get: function (newPath) {
						if (newPath === undefined) {
							newPath = this.parseLocation().hash;
						}
						return this.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, '');
					},

					/**
					* Test if a given url (string) is a path
					* NOTE might be exceptionally naive
					* @method isPath
					* @memberOf ej.utils.path
					* @param {string} url
					* @return {boolean}
					* @static
					*/
					isPath: function (url) {
						return (/\//).test(url);
					},

					/**
					* Return a url path with the window's location protocol/hostname/pathname removed
					* @method clean
					* @memberOf ej.utils.path
					* @param {string} url
					* @param {Object} documentBase  uri structure
					* @return {string}
					* @static
					*/
					clean: function (url, documentBase) {
						return url.replace(documentBase.domain, "");
					},

					/**
					* Just return the url without an initial #
					* @method stripHash
					* @memberOf ej.utils.path
					* @param {string} url
					* @return {string}
					* @static
					*/
					stripHash: function (url) {
						return url.replace(/^#/, "");
					},

					/**
					*
					* @method stripQueryParams
					* @memberOf ej.utils.path
					* @param {string} url
					* @return {string}
					* @static
					*/
					stripQueryParams: function (url) {
						return url.replace(/\?.*$/, "");
					},

					/**
					*
					* @method isHashValid
					* @memberOf ej.utils.path
					* @param {string} hash
					* @param {boolean}
					* @static
					*/
					isHashValid: function (hash) {
						return (/^#[^#]+$/).test(hash);
					},

					/**
					* check whether a url is referencing the same domain, or an external domain or different protocol
					* could be mailto, etc
					* @method isExternal
					* @memberOf ej.utils.path
					* @param {string|Object} url
					* @param {Object} documentUrl uri object
					* @return {boolean}
					* @static
					*/
					isExternal: function (url, documentUrl) {
						var urlObject = path.parseUrl(url);
						return urlObject.protocol && urlObject.domain !== documentUrl.domain ? true : false;
					},

					/**
					*
					* @method hasProtocol
					* @memberOf ej.utils.path
					* @param {string} url
					* @return {boolean}
					* @static
					*/
					hasProtocol: function (url) {
						return (/^(:?\w+:)/).test(url);
					},

					isEmbedded: function (url) {
						var u = path.parseUrl(url);

						if (u.protocol !== "") {
							return (!path.isPath(u.hash) && u.hash && (u.hrefNoHash === path.parseLocation().hrefNoHash));
						}
						return (/^#/).test(u.href);
					},

					/**
					*
					* @method squash
					* @memberOf ej.utils.path
					* @param {string} url
					* @param {string} resolutionUrl
					* @return {string}
					*/
					squash: function (url, resolutionUrl) {
						var href,
							cleanedUrl,
							search,
							stateIndex,
							isPath = this.isPath(url),
							uri = this.parseUrl(url),
							preservedHash = uri.hash,
							uiState = "";

						// produce a url against which we can resole the provided path
						resolutionUrl = resolutionUrl || (path.isPath(url) ? path.getLocation() : path.getDocumentUrl());

						// If the url is anything but a simple string, remove any preceding hash
						// eg #foo/bar -> foo/bar
						//	#foo -> #foo
						cleanedUrl = isPath ? path.stripHash(url) : url;

						// If the url is a full url with a hash check if the parsed hash is a path
						// if it is, strip the #, and use it otherwise continue without change
						cleanedUrl = path.isPath(uri.hash) ? path.stripHash(uri.hash) : cleanedUrl;

						// Split the UI State keys off the href
						stateIndex = cleanedUrl.indexOf(this.uiStateKey);

						// store the ui state keys for use
						if (stateIndex > -1) {
							uiState = cleanedUrl.slice(stateIndex);
							cleanedUrl = cleanedUrl.slice(0, stateIndex);
						}

						// make the cleanedUrl absolute relative to the resolution url
						href = path.makeUrlAbsolute(cleanedUrl, resolutionUrl);

						// grab the search from the resolved url since parsing from
						// the passed url may not yield the correct result
						search = this.parseUrl(href).search;

						// @TODO all this crap is terrible, clean it up
						if (isPath) {
							// reject the hash if it's a path or it's just a dialog key
							if (path.isPath(preservedHash) || preservedHash.replace("#", "").indexOf(this.uiStateKey) === 0) {
								preservedHash = "";
							}

							// Append the UI State keys where it exists and it's been removed
							// from the url
							if (uiState && preservedHash.indexOf(this.uiStateKey) === -1) {
								preservedHash += uiState;
							}

							// make sure that pound is on the front of the hash
							if (preservedHash.indexOf("#") === -1 && preservedHash !== "") {
								preservedHash = "#" + preservedHash;
							}

							// reconstruct each of the pieces with the new search string and hash
							href = path.parseUrl(href);
							href = href.protocol + "//" + href.host + href.pathname + search + preservedHash;
						} else {
							href += href.indexOf("#") > -1 ? uiState : "#" + uiState;
						}

						return href;
					},

					/**
					*
					* @method isPreservableHash
					* @memberOf ej.utils.path
					* @param {string} hash
					* @return {boolean}
					*/
					isPreservableHash: function (hash) {
						return hash.replace("#", "").indexOf(this.uiStateKey) === 0;
					},

					/**
					* Escape weird characters in the hash if it is to be used as a selector
					* @method hashToSelector
					* @memberOf ej.utils.path
					* @param {string} hash
					* @return {string}
					* @static
					*/
					hashToSelector: function (hash) {
						var hasHash = (hash.substring(0, 1) === "#");
						if (hasHash) {
							hash = hash.substring(1);
						}
						return (hasHash ? "#" : "") + hash.replace(new RegExp('([!"#$%&\'()*+,./:;<=>?@[\\]^`{|}~])', 'g'), "\\$1");
					},

					/**
					* Check if the specified url refers to the first page in the main application document.
					* @method isFirstPageUrl
					* @memberOf ej.utils.path
					* @param {string} url
					* @param {Object} documentBase uri structure
					* @param {boolean} documentBaseDiffers
					* @param {Object} documentUrl uri structure
					* @return {boolean}
					* @static
					*/
					isFirstPageUrl: function (url, documentBase, documentBaseDiffers, documentUrl) {
						var urlStructure,
							samePath,
							firstPage,
							firstPageId,
							hash;

						documentBase = documentBase !== undefined ? documentBase : path.documentBase;
						documentBaseDiffers = documentBaseDiffers !== undefined ? documentBaseDiffers : path.documentBaseDiffers;
						documentUrl = documentUrl !== undefined ? documentUrl : path.documentUrl;

						// We only deal with absolute paths.
						urlStructure = path.parseUrl(path.makeUrlAbsolute(url, documentBase));

						// Does the url have the same path as the document?
						samePath = urlStructure.hrefNoHash === documentUrl.hrefNoHash || (documentBaseDiffers && urlStructure.hrefNoHash === documentBase.hrefNoHash);

						// Get the first page element.
						firstPage = engine.getRouter().firstPage;

						// Get the id of the first page element if it has one.
						firstPageId = firstPage ? firstPage.id : undefined;
						hash = urlStructure.hash;

						// The url refers to the first page if the path matches the document and
						// it either has no hash value, or the hash is exactly equal to the id of the
						// first page element.
						return samePath && (!hash || hash === "#" || (firstPageId && hash.replace(/^#/, "") === firstPageId));
					},

					/**
					* Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
					* requests if the document doing the request was loaded via the file:// protocol.
					* This is usually to allow the application to "phone home" and fetch app specific
					* data. We normally let the browser handle external/cross-domain urls, but if the
					* allowCrossDomainPages option is true, we will allow cross-domain http/https
					* requests to go through our page loading logic.
					* @method isPermittedCrossDomainRequest
					* @memberOf ej.utils.path
					* @param {Object} docUrl
					* @param {string} reqUrl
					* @return {boolean}
					* @static
					*/
					isPermittedCrossDomainRequest: function (docUrl, reqUrl) {
						return ej.get('allowCrossDomainPages') &&
							docUrl.protocol === "file:" &&
							reqUrl.search(/^https?:/) !== -1;
					},

					/**
					*
					* @method getAsURIParameters
					* @memberOf ej.utils.path
					* @param {Object} data
					* @return {string}
					* @static
					*/
					getAsURIParameters: function (data) {
						var url = '',
							key;
						for (key in data) {
							url += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
						}
						return url.substring(0, url.length - 1);
					},

					/**
					*
					* @memberOf ej.utils.path
					* @property {string|null} documentUrl
					*/
					documentUrl: null,

					/**
					*
					* @memberOf ej.utils.path
					* @property {boolean} documentBaseDiffers
					*/
					documentBaseDiffers: false,

					/**
					* Set location hash to path
					* @method set
					* @memberOf ej.utils.path
					* @param {string} path
					* @static
					*/
					set: function (path) {
						location.hash = path;
					},

					/**
					* Return the substring of a filepath before the sub-page key, for making a server request
					* @method getFilePath
					* @memberOf ej.utils.path
					* @param {string} path
					* @param {string} dialogHashKey
					* @return {string}
					* @static
					*/
					getFilePath: function (path, dialogHashKey) {
						var splitkey = '&' + ej.get('subPageUrlKey');
						return path && path.split(splitkey)[0].split(dialogHashKey)[0];
					},

					/**
					* Remove the preceding hash, any query params, and dialog notations
					* @method cleanHash
					* @memberOf ej.utils.path
					* @param {string} hash
					* @param {string} dialogHashKey
					* @return {string}
					* @static
					*/
					cleanHash: function (hash, dialogHashKey) {
						return path.stripHash(hash.replace(/\?.*$/, "").replace(dialogHashKey, ""));
					},

					/**
					*
					* @method isEmbeddedPage
					* @memberOf ej.utils.path
					* @param {string} url
					* @param {Object} documentBase uri structure
					* @param {boolean} documentBaseDiffers
					* @param {Object} documentUrl uri structure
					* @return {boolean}
					* @static
					*/
					isEmbeddedPage: function (url, documentBase, documentBaseDiffers, documentUrl) {
						var urlObject = path.parseUrl(url);

						//if the path is absolute, then we need to compare the url against
						//both the documentUrl and the documentBase. The main reason for this
						//is that links embedded within external documents will refer to the
						//application document, whereas links embedded within the application
						//document will be resolved against the document base.
						if (urlObject.protocol !== "") {
							return (urlObject.hash &&
								((documentUrl && urlObject.hrefNoHash === documentUrl.hrefNoHash) ||
									(documentBase && documentBaseDiffers && urlObject.hrefNoHash === documentBase.hrefNoHash)));
						}
						return (/^#/).test(urlObject.href);
					}
				};

			path.documentUrl = path.parseLocation();

			base = document.querySelector('base');

			/**
			*
			* @memberOf ej.utils.path
			* @property {Object} documentBase uri structure
			* @static
			*/
			path.documentBase = base ? path.parseUrl(path.makeUrlAbsolute(base.getAttribute("href"), path.documentUrl.href)) : path.documentUrl;

			path.documentBaseDiffers = (path.documentUrl.hrefNoHash !== path.documentBase.hrefNoHash);

			/**
			*
			* @method getDocumentBase
			* @memberOf ej.utils.path
			* @param {boolean} [asParsedObject=false]
			* @return {string|Object}
			* @static
			*/
			path.getDocumentBase = function (asParsedObject) {
				return asParsedObject ? object.copy(path.documentBase) : path.documentBase.href;
			};

			/**
			*
			* @method getClosestBaseUrl
			* @memberOf ej.utils.path
			* @param {HTMLElement} element
			* @return {string}
			* @static
			*/
			path.getClosestBaseUrl = function (element) {
				// Find the closest page and extract out its url.
				var url = DOM.getNSData(selectors.getClosestBySelector(element, ej.micro.selectors.page), "url"),
					baseUrl = path.documentBase.hrefNoHash;

				if (!ej.get('dynamicBaseEnabled') || !url || !path.isPath(url)) {
					url = baseUrl;
				}

				return path.makeUrlAbsolute(url, baseUrl);
			};

			ej.utils.path = path;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return path;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
