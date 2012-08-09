/**
 * loader.js
 *
 * Youmin Ha <youmin.ha@samsung.com>
 */

( function ($, Globalize, window, undefined) {

	 var tizen = {
		libFileName : "tizen-web-ui-fw(.min)?.js",

		frameworkData : {
			rootDir: '/usr/lib/tizen-web-ui-fw',
			version: '0.1',
			theme: "tizen-white",
			viewportScale: false,
			defaultFontSize: 16,
			minified: false
		},

		util : {
			loadScriptSync : function ( scriptPath, successCB, errorCB ) {
				$.ajax( {
					url: scriptPath,
					dataType: 'script',
					async: false,
					crossDomain: false,
					success: successCB,
					error: function ( jqXHR, textStatus, errorThrown ) {
						if ( errorCB ) {
							errorCB( jqXHR, textStatus, errorThrown );
						} else {
							var ignoreStatusList = [ 404 ];  // 404: not found
							if ( -1 == $.inArray( jqXHR.status, ignoreStatusList ) ) {
								window.alert( 'Error while loading ' + scriptPath + '\n' + jqXHR.status + ':' + jqXHR.statusText );
							} else {
								console.log( 'Error while loading ' + scriptPath + '\n' + jqXHR.status + ':' + jqXHR.statusText );
							}
						}
					}
				} );
			},
			getScaleFactor: function ( ) {
				var factor = navigator.scale,
					width = 0,
					defaultWidth = 720;

				if ( !factor ) {
					width = screen.width < screen.height ? screen.width : screen.height;
					factor = width / defaultWidth;
					if ( factor > 1 ) {
						// NOTE: some targets(e.g iPad) need to set scale equal or less than 1.0
						factor = 1;
					}
				}
				console.log( "ScaleFactor: " + factor );
				return factor;
			},
			isMobileBrowser: function ( ) {
				var mobileIdx = window.navigator.appVersion.indexOf("Mobile"),
					isMobile = -1 < mobileIdx;
				return isMobile;
			}
		},

		css : {
			cacheBust: ( document.location.href.match( /debug=true/ ) ) ?
					'?cacheBust=' + ( new Date( ) ).getTime( ) :
					'',
			addElementToHead : function ( elem ) {
				var head = document.getElementsByTagName( 'head' )[0];
				if( head ) {
					$( head ).prepend( elem );
				}
			},
			makeLink : function ( href ) {
				var cssLink = document.createElement( 'link' );
				cssLink.setAttribute( 'rel', 'stylesheet' );
				cssLink.setAttribute( 'href', href );
				cssLink.setAttribute( 'name', 'tizen-theme' );
				return cssLink;
			},
			load: function ( path ) {
				var head = document.getElementsByTagName( 'head' )[0],
					cssLinks = head.getElementsByTagName( 'link' ),
					idx,
					l = null;
				// Find css link element
				for ( idx = 0; idx < cssLinks.length; idx++ ) {
					if( cssLinks[idx].getAttribute( 'name' ) == "tizen-theme" ) {
						l = cssLinks[idx];
						break;
					}
				}
				if ( l ) {	// Found the link element!
					l.setAttribute( 'href', path );
				} else {
					this.addElementToHead( this.makeLink( path ) );
				}
			}
		},

		getParams: function ( ) {
			/* Get data-* params from <script> tag, and set tizen.frameworkData.* values
			 * Returns true if proper <script> tag is found, or false if not.
			 */
			// Find current <script> tag element
			var scriptElems = document.getElementsByTagName( 'script' ),
				val = null,
				foundScriptTag = false,
				idx,
				elem,
				src,
				tokens,
				version_idx;

			function getTizenTheme( ) {
				var t = navigator.theme ? navigator.theme.split( ':' )[0] : null;
				if ( t ) {
					t = t.replace('-hd', '');
					if( ! t.match( /^tizen-/ ) ) {
						t = 'tizen-' + t;
					}
				}
				return t;
			}

			for ( idx in scriptElems ) {
				elem = scriptElems[idx];
				src = elem.src ? elem.getAttribute( 'src' ) : undefined;
				if (src && src.match( this.libFileName )) {
					// Set framework data, only when they are given.
					tokens = src.split(/[\/\\]/);
					version_idx = -3;
					this.frameworkData.rootDir = elem.getAttribute( 'data-framework-root' )
						|| tokens.slice( 0, tokens.length + version_idx ).join( '/' )
						|| this.frameworkData.rootDir;
					this.frameworkData.version = elem.getAttribute( 'data-framework-version' )
						|| tokens[ tokens.length + version_idx ]
						|| this.frameworkData.version;
					this.frameworkData.theme = elem.getAttribute( 'data-framework-theme' )
						|| getTizenTheme( )
						|| this.frameworkData.theme;
					this.frameworkData.viewportScale = "true" === elem.getAttribute( 'data-framework-viewport-scale' ) ? true : this.frameworkData.viewportScale;
					this.frameworkData.minified = src.search(/\.min\.js$/) > -1 ? true : false;
					foundScriptTag = true;
					break;
				}
			}
			return foundScriptTag;
		},

		loadTheme: function ( theme ) {
			var themePath, cssPath, jsPath;

			if ( ! theme ) {
				theme = tizen.frameworkData.theme;
			}
			themePath = [
					tizen.frameworkData.rootDir,
					tizen.frameworkData.version,
					'themes',
					theme
				].join( '/' ),

			jsPath = [themePath, 'theme.js'].join( '/' );

			if( tizen.frameworkData.minified ) {
				cssPath = [themePath, 'tizen-web-ui-fw-theme.min.css'].join( '/' );
			} else {
				cssPath = [themePath, 'tizen-web-ui-fw-theme.css'].join( '/' );
			}
			tizen.css.load( cssPath );
			tizen.util.loadScriptSync( jsPath );
		},

		/** Load Globalize culture file, and set default culture.
		 *  @param[in]  language  (optional) Language code. ex) en-US, en, ko-KR, ko
		 *                        If language is not given, read language from html 'lang' attribute, 
		 *                        or from system setting.
		 *  @param[in]  cultureDic (optional) Dictionary having language code->
		 */
		loadGlobalizeCulture: function ( language, cultureDic ) {
			var self = this,
				cFPath,
				lang,
				mockJSXHR;

			function getLang ( language ) {
				var lang = language
						|| $( 'html' ).attr( 'lang' )
						|| window.navigator.language.split( '.' )[0]	// Webkit, Safari + workaround for Tizen
						|| window.navigator.userLanguage	// IE
						|| 'en',
					countryCode = null,
					countryCodeIdx = lang.lastIndexOf('-'),
					ignoreCodes = ['Cyrl', 'Latn', 'Mong'];	// Not country code!
				if ( countryCodeIdx != -1 ) {	// Found country code!
					countryCode = lang.substr( countryCodeIdx + 1 );
					if ( ignoreCodes.join( '-' ).indexOf( countryCode ) < 0 ) {
						// countryCode is not found from ignoreCodes.
						// Make countryCode to uppercase.
						lang = [ lang.substr( 0, countryCodeIdx ), countryCode.toUpperCase( ) ].join( '-' );
					}
				}
				// NOTE: 'en' to 'en-US', because globalize has no 'en' culture file.
				lang = lang == 'en' ? 'en-US' : lang;
				return lang;
			}

			function getNeutralLang ( lang ) {
				var neutralLangIdx = lang.lastIndexOf( '-' ),
					neutralLang;
				if ( neutralLangIdx != -1 ) {
					neutralLang = lang.substr( 0, neutralLangIdx );
				}
				return neutralLang;
			}

			function getCultureFilePath ( lang, cFDic ) {
				var cFPath = null;	// error value

				if ( "string" != typeof lang ) {
					return null;
				}
				if ( cFDic ) {
					if ( cFDic[lang] ) cFPath = cFDic[lang];
				} else {
					// Default Globalize culture file path
					cFPath = [
						self.frameworkData.rootDir,
						self.frameworkData.version,
						'js',
						'cultures',
						['globalize.culture.', lang, '.js'].join( '' ),
					].join( '/' );
				}
				return cFPath;
			}

			function printLoadError( cFPath, jqXHR ) {
				console.log( "Error " + jqXHR.status + ": " + jqXHR.statusText );
				console.log( "::Culture file (" + cFPath + ") is failed to load.");
			}

			function loadCultureFile ( cFPath, errCB ) {
				function _successCB ( ) {
					console.log( "Culture file (" + cFPath + ") is loaded successfully.");
				}
				function _errCB ( jqXHR, textStatus, err ) {
					if( errCB ) {
						errCB( jqXHR, textStatus, err );
					}
					else {
						printLoadError( cFPath, jqXHR );
					}
				}

				if( ! cFPath ) {	// Invalid cFPath -> Regard it as '404 Not Found' error.
					mockJSXHR = {
						status: 404,
						statusText: "Not Found"
					};
					_errCB( mockJSXHR, null, null );
				} else {
					$.ajax( {
						url: cFPath,
						dataType: 'script',
						cache: true,
						async: false,
						success: _successCB,
						error: _errCB
					} );
				}
			}

			lang = getLang( language );
			cFPath = getCultureFilePath( lang, cultureDic );
			loadCultureFile( cFPath,
				function ( jqXHR, textStatus, err ) {
					if( jqXHR.status == 404 ) {
						// If culture file is not found, try once more with neutral lang.
						var nLang = getNeutralLang( lang ),
							cFPath = getCultureFilePath( nLang, cultureDic );
						loadCultureFile( cFPath, null );
					} else {
						printLoadError( cFPath, jqXHR );
					}
				} );

			return lang;
		},
		setGlobalize: function ( ) {
			var lang = this.loadGlobalizeCulture( );

			// Set culture
			// NOTE: It is not needed to set with neutral lang.
			//       Globalize automatically deals with it.
			Globalize.culture( lang );
		},
		/**
		 * Load custom globalize culture file
		 * Find current system language, and load appropriate culture file from given colture file list.
		 *
		 * @param[in]	cultureDic	collection of 'language':'culture file path' key-val pair.
		 * @example
		 * var myCultures = {
		 * 		"en"    : "culture/en.js",
		 * 		"fr"    : "culture/fr.js",
		 * 		"ko-KR" : "culture/ko-KR.js"
		 * };
		 * loadCultomGlobalizeCulture( myCultures );
		 *
		 * ex) culture/fr.js
		 * -------------------------------
		 * Globalize.addCultureInfo( "fr", {
		 *   messages: {
		 *     "hello" : "bonjour",
		 *     "translate" : "traduire"
		 *   }
		 * } );
		 * -------------------------------
		 */
		loadCustomGlobalizeCulture: function ( cultureDic ) {
			tizen.loadGlobalizeCulture( null, cultureDic );
		},

		/** Set viewport meta tag for mobile devices.
		 *
		 * @param[in]	viewportWidth	Viewport width. 'device-dpi' is also allowed.
		 * @param[in]	useAutoScale	If true, cculate & use scale factor. otherwise, scale factor is 1.
		 * @param[in]	useDeviceDpi	If true, add 'target-densityDpi=device-dpi' to viewport meta content.
		 */
		setViewport: function ( viewportWidth, useAutoScale, useDeviceDpi ) {
			var meta,
				scale = 1,
				head,
				content,
				ratio,
				threshold = 15,
				standardWidth = 360,
				screenWidth = screen.width;

			// Do nothing if viewport setting code is already in the code.
			$( "meta[name=viewport]" ).each( function ( ) {
				console.log( "User set viewport... framework viewport will not be applied." );
				meta = this;
				return;
			});
			if( meta ) {
				content = $( meta ).prop( "content" );
				if ( content.indexOf( "device-width" ) > 0
						&& content.indexOf( "device-dpi" ) > 0 ) {
					ratio = screenWidth > standardWidth ? ( screenWidth/standardWidth) : 1;
					$.vmouse.moveDistanceThreshold = threshold * ratio;
					$.vmouse.clickDistanceThreshold = threshold * ratio;
				}
				return;	// Ignore viewport setting, when viewport is already set.
			}

			// Set meta tag
			meta = document.createElement( "meta" );
			if ( meta ) {
				scale = useAutoScale ? this.util.getScaleFactor( ) : scale;
				meta.name = "viewport";
				meta.content = "width=" + viewportWidth + ", initial-scale=" + scale + ", maximum-scale=" + scale + ", user-scalable=0";
				if ( useDeviceDpi ) {
					meta.content += ", target-densityDpi=device-dpi";
				}
				console.log( meta.content );
				head = document.getElementsByTagName( 'head' ).item( 0 );
				head.insertBefore( meta, head.firstChild );

				// TODO : change threshold when scaleFactor is changed. Reference line 354-356
			}
		},

		/**	Read body's font-size, scale it, and reset it.
		 *  param[in]	desired font-size / base font-size.
		 */
		scaleBaseFontSize: function ( themeDefaultFontSize, ratio ) {
			var scaledFontSize = Math.round( themeDefaultFontSize * ratio );

			$( 'html.ui-mobile' ).css( { 'font-size': scaledFontSize + "px" } );
			console.log('html:font size is set to ' + scaledFontSize );
			$( document ).ready( function ( ) {
				$( '.ui-mobile').children( 'body' ).css( { 'font-size': scaledFontSize + "px" } );
			} );
		},

		setScaling: function ( ) {
			var baseWidth = 720,		// Winset GUI Guide is 720 HD.
				standardWidth = 360,
				themeDefaultFontSize;

			themeDefaultFontSize = this.frameworkData.defaultFontSize;

			$( 'body' ).attr( 'data-tizen-theme-default-font-size', themeDefaultFontSize );

			if ( this.frameworkData.viewportScale ) {
				// Use viewport scaling with base font-size
				// NOTE: No font-size setting is needed.
				this.setViewport( baseWidth, true, true );
			} else {
				// Fixed viewport scale(=1.0) with scaled font size
				this.setViewport( "device-width", false, undefined );
				this.scaleBaseFontSize( themeDefaultFontSize, parseFloat( standardWidth / baseWidth ) );
			}
		}
	};

	function export2TizenNS ( $, tizen ) {
		if ( undefined == typeof $.tizen ) {
			$.tizen = { };
		}

		$.tizen.frameworkData = tizen.frameworkData;
		$.tizen.loadCustomGlobalizeCulture = tizen.loadCustomGlobalizeCulture;
		$.tizen.loadTheme = tizen.loadTheme;

		$.tizen.__tizen__ = tizen;	// for unit-test
	}

	export2TizenNS( $, tizen );

	tizen.getParams( );
	tizen.loadTheme( );
	tizen.setScaling( );	// Run after loadTheme(), for the default font size.
	tizen.setGlobalize( );

	// Turn off JQM's auto initialization option.
	// NOTE: This job must be done before domready.
	$.mobile.autoInitializePage = false;

	$(document).ready( function ( ) {
		$.mobile.initializePage( );
	});

} ( jQuery, window.Globalize, window ) );
