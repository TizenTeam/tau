/**
 * loader.js : Loader for web-ui-fw
 * Refactored from bootstrap.js
 *
 * By Youmin Ha <youmin.ha@samsung.com>
 *
 */
S = {
	libFileName : "tizen-web-ui-fw(.min)?.js",

	frameworkData : {
		rootDir: '/usr/lib/tizen-web-ui-fw',
		version: '0.1',
		theme: "default"
		},

    cacheBust: (document.location.href.match(/debug=true/)) ?
               '?cacheBust=' + (new Date()).getTime() :
               '',

	util : {
		addElementToHead : function(elem) {
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(elem);
		},
		loadScriptSync : function(scriptPath, successCB, errorCB) {
			$.ajax({
				url: scriptPath,
				dataType: 'script',
				async: false,
				success: successCB,
				error: function(jqXHR, textStatus, errorThrown) {
					if(errorCB) errorCB(jqXHR, textStatus, errorThrown);
					else {
						var ignoreStatusList = [
							404,	// not found
							];
						if(-1 == $.inArray(jqXHR.status, ignoreStatusList)) {
							alert('Error while loading ' + scriptPath + '\n' + jqXHR.status + ':' + jqXHR.statusText);
						}
						else {
							console.log('Error while loading ' + scriptPath + '\n' + jqXHR.status + ':' + jqXHR.statusText);
						}
					}
				}
			});
		},
		getScaleFactor: function () {
			var factor = window.scale;

			if ( !factor ) {
				var width = screen.width < screen.height ? screen.width : screen.height,
					defaultWidth = 720;

				factor = width / defaultWidth;
				if ( factor > 1 ) {
					// TODO NOTE some of targets(e.g iPad) need to set scale equal or less than 1.0
					factor = 1;
				}
			}
			console.log( "ScaleFactor: " + factor );
			return factor;
		}
	},

	css : {
		load: function (path) {
			S.util.addElementToHead(this.makeLink(path + S.cacheBust));
		},

		makeLink : function (href) {
			var customstylesheetLink = document.createElement('link');
			customstylesheetLink.setAttribute('rel', 'stylesheet');
			customstylesheetLink.setAttribute('href', href);
			return customstylesheetLink;
		}
	},

	getParams: function() {
		/* Get data-* params from <script> tag, and set S.frameworkData.* values
		 * Returns true if proper <script> tag is found, or false if not.
		 */
		// Find current <script> tag element
		var scriptElems = document.getElementsByTagName('script'),
			val = null,
			foundScript = false;
		for ( var idx in scriptElems ) {
			var elem = scriptElems[idx],
				src = elem.src ? elem.getAttribute( 'src' ) : undefined;
			if(src && src.match(this.libFileName)) {
				// Set framework data, only when they are given.
				var tokens = src.split(/[\/\\]/),
					version_idx = -3;
				this.frameworkData.rootDir = elem.getAttribute( 'data-framework-root' ) || tokens.slice( 0, tokens.length + version_idx ).join( '/' ) || this.frameworkData.rootDir;
				this.frameworkData.version = elem.getAttribute( 'data-framework-version' ) || tokens[ tokens.length + version_idx ] || this.frameworkData.version;
				this.frameworkData.theme = elem.getAttribute( 'data-framework-theme' ) || this.frameworkData.theme;
				foundScript = true;
				break;
			}
		}
		return foundScript;
	},

	loadTheme: function() {
		var themePath = [
				this.frameworkData.rootDir,
				this.frameworkData.version,
				'themes',
				this.frameworkData.theme
					].join('/'),
			cssPath = [themePath, 'tizen-web-ui-fw-theme.css'].join('/'),
			jsPath = [themePath, 'theme.js'].join('/');

		this.css.load(cssPath);
		this.util.loadScriptSync(jsPath);
	},

	setViewport: function () {
		var meta;
		$("meta").each( function() {
			if ( $(this).attr("name") === "viewport" ) {
				console.log("user set viewport... framework viewport will not be applied.");
				meta = this;
			}
		});
		if ( meta )
			return;
		if ( meta = document.createElement( "meta" )) {
			//set meta tags for view port
			var scale = S.util.getScaleFactor();

			meta.name = "viewport";
			meta.content = "width=device-width, initial-scale=" + scale + ", maximum-scale=" + scale + ", user-scalable=0, target-densityDpi=device-dpi";
			console.log( meta.content );
			var head = document.getElementsByTagName('head').item(0);
			head.insertBefore(meta, head.firstChild);
		}
	},

	/** Load Globalize culture file, and set default culture.
	 *  @param[in]  language  Language code. ex) en-US, en, ko-KR, ko
	 *                        If language is not given, read language from html 'lang' attribute, or from system setting.
	 */
	loadGlobalizeCulture: function(language) {
		function getGlobalizeCultureFile(lang) {
			return ['globalize.culture.', lang, '.js'].join('');
		};
		function getGlobalizeCulturePath(self, file) {
			return [
				self.frameworkData.rootDir,
				self.frameworkData.version,
				'js',
				'cultures',
				file,
			].join('/');
		}

		// Get lang, and change country code to uppercase chars.
		var lang = language 
			|| $( 'html' ).attr( 'lang' )
			|| window.navigator.language	/* Webkit, Safari */
			|| window.navigator.userLanguage	/* IE */
			|| 'en',
			countryCodeIdx = lang.lastIndexOf('-'),
			ignoreCodes = ['Cyrl', 'Latn', 'Mong'];	// Not country code!

		if(countryCodeIdx != -1) {	// Found country code!
			var countryCode = lang.substr(countryCodeIdx + 1);
			if(ignoreCodes.join('-').indexOf(countryCode) < 0) { // countryCode is not found from ignoreCodes
				// Make countryCode to uppercase
				lang = [ lang.substr(0, countryCodeIdx), countryCode.toUpperCase() ].join('-');
			}
		}

		var self = this,
			globalizeCultureFile = getGlobalizeCultureFile(lang),
			globalizeCulturePath = getGlobalizeCulturePath(self, globalizeCultureFile),
			neutralLangIndex = lang.lastIndexOf('-');

		// Run culture script
		console.log('Run globalize culture: ' + globalizeCulturePath);
		this.util.loadScriptSync(
			globalizeCulturePath,
			null,
			function(jqXHR, textStatus, errorThrown) {	// Failed to load!
				if(jqXHR.status == 404) {
					// If culture file is not found, run neutral language culture. 
					// (e.g. en-US --> en)
					if(neutralLangIndex != -1) {
						var neutralLang = lang.substr(0, neutralLangIndex),
							neutralCultureFile = getGlobalizeCultureFile(neutralLang),
							neutralCulturePath = getGlobalizeCulturePath(self, neutralCultureFile);
						console.log('Run globalize culture of neutral lang: ' + neutralCulturePath);
						self.util.loadScriptSync(neutralCulturePath);
					}
				}
				else {
					alert('Error while loading ' + scriptPath + '\n' + jqXHR.status + ':' + jqXHR.statusText);
				}
			}
		);
		return lang;
	},
	setGlobalize: function() {
		var lang = this.loadGlobalizeCulture();

		// Set culture
		// NOTE: It is not needed to set with neutral lang. 
		//       Globalize automatically deals with it.
		Globalize.culture(lang);
	}
};


// Loader's jobs
(function (S, $, undefined) {
	S.getParams( );
	S.loadTheme( );
	S.setViewport( );
	S.setGlobalize( );

	// Turn off JQM's auto initialization option.
	// NOTE: This job must be done before domready.
	$.mobile.autoInitializePage = false;
	domReady( function( ) {
		$.mobile.initializePage( );
	});
 })(S, jQuery);
