/*global window, define */
/**
 * @class ns.util.globalize
 */
(function (window, document, ns, Globalize) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util",
			"../../../../libs/globalize/lib/globalize"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var loadedCultures = {};

			function getLang(language) {
				var lang = language ||
						document.getElementsByTagName('html')[0].getAttribute('lang') ||
						window.navigator.language.split('.')[0] || // Webkit, Safari + workaround for Tizen
						'en',
					countryCode = null,
					countryCodeIdx = lang.lastIndexOf('-'),
					ignoreCodes = ['Cyrl', 'Latn', 'Mong'];	// Not country code!
				if (countryCodeIdx !== -1) {	// Found country code!
					countryCode = lang.substr(countryCodeIdx + 1);
					if (ignoreCodes.join('-').indexOf(countryCode) < 0) {
						// countryCode is not found from ignoreCodes.
						// Make countryCode to uppercase.
						lang = [lang.substr(0, countryCodeIdx), countryCode.toUpperCase()].join('-');
					}
				}
				// NOTE: 'en' to 'en-US', because globalize has no 'en' culture file.
				lang = (lang === 'en' ? 'en-US' : lang);
				return lang;
			}

			function getNeutralLang(lang) {
				var neutralLangIdx = lang.lastIndexOf('-'),
					neutralLang;
				if (neutralLangIdx !== -1) {
					neutralLang = lang.substr(0, neutralLangIdx);
				}
				return neutralLang;
			}

			function getCultureFilePath(lang, cultureDictionary) {
				var path = null,
					frameworkData = ns.frameworkData;
				if (typeof lang === "string") {
					if (cultureDictionary && cultureDictionary[lang]) {
						path = cultureDictionary[lang];
					} else {
						// Default Globalize culture file path
						path = [
							frameworkData.jsPath,
							//ns.getConfig('version'),
							'cultures',
							['globalize', 'culture', lang, 'js'].join('.')
						].join('/');
					}
				}
				return path;
			}

			function printLoadError(path) {
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.error("Error loading culture file (" + path + ") is failed to load.");
				//>>excludeEnd("tauDebug");
			}

			function _errCB(path, errCB) {
				if (typeof errCB === 'function') {
					errCB(path);
				} else {
					printLoadError(path);
				}
			}

			function loadCultureFile(path) {
				var script,
					xhrObj;
				if (path) {	// Invalid path -> Regard it as '404 Not Found' error.
					if (loadedCultures[path] === undefined) {
						try {
							script = document.createElement('script');
							// get some kind of XMLHttpRequest
							xhrObj = new XMLHttpRequest();
							// open and send a synchronous request
							xhrObj.open('GET', path, false);
							xhrObj.send('');
							// add the returned content to a newly created script tag
							script.type = "text/javascript";
							script.text = xhrObj.responseText;
							document.body.appendChild(script);
							loadedCultures[path] = true;
						} catch (ignore) {
						}
					}
				} else {
					_errCB(path);
				}
			}

			ns.util.globalize = {
				/**
				* Load Globalize culture file, and set default culture.
				* @method loadGlobalizeCulture
				* @param [language] Language code. ex) en-US, en, ko-KR, ko
				*						If language is not given, read language from html 'lang' attribute,
				*						or from system setting.
				* @param [cultureDictionary] Dictionary having language code->
				* @member ns.util.globalize
				* @return {string}
				*/
				loadGlobalizeCulture: function (language, cultureDictionary) {
					var path,
						lang;
					lang = getLang(language);
					path = getCultureFilePath(lang, cultureDictionary);
					loadCultureFile(path,
						function () {
							var nLang,
								npath;
							nLang = getNeutralLang(lang);
							npath = getCultureFilePath(nLang, cultureDictionary);
							loadCultureFile(npath, null);
						}, function (lang) {
							Globalize.culture(lang);
						}, lang);
					return lang;
				},
				/**
				 * @method setGlobalize/
				 * @member ns.util.globalize
				 * @return {?string}
				 */
				setGlobalize: function () {
					var lang,
						self = this;
					/*
					* Tizen has rule that language was set by region setting
					*/
					if (window.tizen) {
						window.tizen.systeminfo.getPropertyValue("LOCALE", function (locale) {
							var countryLang = locale.country;
							if (countryLang) {
								countryLang = countryLang.replace("_", "-");
							}
							countryLang = self.loadGlobalizeCulture(countryLang);
							return Globalize.culture(countryLang);
						});
					} else {
						lang = this.loadGlobalizeCulture();
						return Globalize.culture(lang);
					}
					return null;
				},
				/**
				* Load custom globalize culture file
				* Find current system language, and load appropriate culture file from given colture file list.
				* @method loadCustomGlobalizeCulture
				* @param cultureDictionary	collection of 'language':'culture file path' key-val pair.
				* @member ns.util.globalize
				* @example
				* var myCultures = {
				*	"en"	: "culture/en.js",
				*	"fr"	: "culture/fr.js",
				*	"ko-KR" : "culture/ko-KR.js"
				* };
				* loadCultomGlobalizeCulture( myCultures );
				*
				* ex) culture/fr.js
				* -------------------------------
				* Globalize.addCultureInfo( "fr", {
				*   messages: {
				*	"hello" : "bonjour",
				*	"translate" : "traduire"
				*   }
				* } );
				* -------------------------------
				*/
				loadCustomGlobalizeCulture: function (cultureDictionary) {
					this.loadGlobalizeCulture(null, cultureDictionary);
				},

				/**
				* return culture object from Globalize library
				* @method culture
				* @return {Object}
				* @static
				* @member ns.util.globalize
				*/
				culture: function () {
					this.setGlobalize();
					return Globalize.culture();
				}
			};

			document.addEventListener("DOMContentLoaded", function () {
				var globalize = ns.util.globalize;
				globalize.setGlobalize();
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.globalize;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns, window.Globalize));
