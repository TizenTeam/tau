/**
 * loader.js : Loader for web-ui-fw
 * Refactored from bootstrap.js
 *
 * By Youmin Ha <youmin.ha@samsung.com>
 *
 */

( function ($, Globalize, window, undefined) {

	window.S = {
		libFileName : "tizen-web-ui-fw(.min)?.js",

		frameworkData : {
			rootDir: '/usr/lib/tizen-web-ui-fw',
			version: '0.1',
			theme: "default",
			viewportScale: false,
		},

		util : {
			loadScriptSync : function ( scriptPath, successCB, errorCB ) {
				$.ajax( {
					url: scriptPath,
					dataType: 'script',
					async: false,
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
				var factor = window.scale,
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
				head.appendChild( elem );
			},
			load: function ( path ) {
				this.addElementToHead( this.makeLink( path + this.cacheBust ) );
			},
			makeLink : function ( href ) {
				var customstylesheetLink = document.createElement( 'link' );
				customstylesheetLink.setAttribute( 'rel', 'stylesheet' );
				customstylesheetLink.setAttribute( 'href', href );
				return customstylesheetLink;
			}
		},

		getParams: function ( ) {
			/* Get data-* params from <script> tag, and set S.frameworkData.* values
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
						|| this.frameworkData.theme;
					this.frameworkData.viewportScale = "true" === elem.getAttribute( 'data-framework-viewport-scale' ) ? true : this.frameworkData.viewportScale;
					foundScriptTag = true;
					break;
				}
			}
			return foundScriptTag;
		},

		loadTheme: function ( ) {
			var themePath = [
					this.frameworkData.rootDir,
					this.frameworkData.version,
					'themes',
					this.frameworkData.theme
				].join( '/' ),
				cssPath = [themePath, 'tizen-web-ui-fw-theme.css'].join( '/' ),
				jsPath = [themePath, 'theme.js'].join( '/' );

			this.css.load( cssPath );
			this.util.loadScriptSync( jsPath );
		},

		/** Load Globalize culture file, and set default culture.
		 *  @param[in]  language  Language code. ex) en-US, en, ko-KR, ko
		 *                        If language is not given, read language from html 'lang' attribute, or from system setting.
		 */
		loadGlobalizeCulture: function ( language ) {
			function getGlobalizeCultureFile( lang ) {
				return ['globalize.culture.', lang, '.js'].join( '' );
			}
			function getGlobalizeCulturePath( self, file ) {
				return [
					self.frameworkData.rootDir,
					self.frameworkData.version,
					'js',
					'cultures',
					file,
				].join( '/' );
			}

			// Get lang, and change country code to uppercase chars.
			var self = this,
				lang = language
					|| $( 'html' ).attr( 'lang' )
					|| window.navigator.language.split( '.' )[0]	/* Webkit, Safari + workaround for Tizen */
					|| window.navigator.userLanguage	/* IE */
					|| 'en',
				countryCode = null,
				countryCodeIdx = lang.lastIndexOf('-'),
				ignoreCodes = ['Cyrl', 'Latn', 'Mong'],	// Not country code!
				globalizeCultureFile,
				globalizeCulturePath,
				neutralLangIndex;

			if ( countryCodeIdx != -1 ) {	// Found country code!
				countryCode = lang.substr( countryCodeIdx + 1 );
				if ( ignoreCodes.join( '-' ).indexOf( countryCode ) < 0 ) { // countryCode is not found from ignoreCodes
					// Make countryCode to uppercase
					lang = [ lang.substr( 0, countryCodeIdx ), countryCode.toUpperCase( ) ].join( '-' );
				}
			}

			// NOTE: 'en' to 'en-US', because globalize has no 'en' culture file.
			lang = lang == 'en' ? 'en-US' : lang;

			globalizeCultureFile = getGlobalizeCultureFile( lang );
			globalizeCulturePath = getGlobalizeCulturePath( self, globalizeCultureFile );
			neutralLangIndex = lang.lastIndexOf( '-' );

			// Run culture script
			console.log( 'Run globalize culture: ' + globalizeCulturePath );
			this.util.loadScriptSync(
				globalizeCulturePath,
				null,
				function ( jqXHR, textStatus, errorThrown ) {	// Failed to load!
					if ( jqXHR.status == 404 ) {
						// If culture file is not found, run neutral language culture. 
						// (e.g. en-US --> en)
						if ( neutralLangIndex != -1 ) {
							var neutralLang = lang.substr( 0, neutralLangIndex ),
								neutralCultureFile = getGlobalizeCultureFile( neutralLang ),
								neutralCulturePath = getGlobalizeCulturePath( self, neutralCultureFile );
							console.log( 'Run globalize culture of neutral lang: ' + neutralCulturePath );
							self.util.loadScriptSync( neutralCulturePath );
						}
					} else {
						window.alert( 'Error while loading ' + globalizeCulturePath + '\n' + jqXHR.status + ':' + jqXHR.statusText );
					}
				}
			);
			return lang;
		},
		setGlobalize: function ( ) {
			var lang = this.loadGlobalizeCulture( );

			// Set culture
			// NOTE: It is not needed to set with neutral lang. 
			//       Globalize automatically deals with it.
			Globalize.culture( lang );
		},

		/** Set viewport meta tag for mobile devices.
		 *
		 * @param[in]	viewportWidth	Viewport width. 'device-dpi' is also allowed.
		 * @param[in]	useAutoScale	If true, calculate & use scale factor. otherwise, scale factor is 1.
		 * @param[in]	useDeviceDpi	If true, add 'target-densityDpi=device-dpi' to viewport meta content.
		 */
		setViewport: function ( viewportWidth, useAutoScale, useDeviceDpi ) {
			var meta,
				scale = 1,
				head;
			// Do nothing if viewport setting code is already in the code.
			$( "meta[name=viewport]" ).each( function ( ) {
				console.log( "User set viewport... framework viewport will not be applied." );
				meta = this;
				return;
			});
			if( meta ) {
				return;	// Ignore viweport setting, when viewport is already set.
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
			}
		},

		/**	Read body's font-size, scale it, and reset it.
		 *  param[in]	desired font-size / base font-size.
		 */
		scaleBaseFontSize: function ( themeDefaultFontSize, ratio ) {
			var scaledFontSize = Math.round( themeDefaultFontSize * ratio );
			$( '.ui-mobile' ).css( { 'font-size': scaledFontSize + "px" } );
			$( '.ui-mobile').children( 'body' ).css( { 'font-size': scaledFontSize + "px" } );
		},

		setScaling: function ( ) {
			var baseWidth = 720,		// NOTE: need to be changed to get the value from theme.
				standardWidth = 360,
				themeDefaultFontSize = parseInt( $( 'body' ).css( 'font-size' ), 10 );
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
} ( jQuery, window.Globalize, window ) );


// Loader's job list
( function ( S, $, undefined ) {
	S.getParams( );
	S.loadTheme( );
	S.setGlobalize( );

	// Turn off JQM's auto initialization option.
	// NOTE: This job must be done before domready.
	$.mobile.autoInitializePage = false;

	$(document).ready( function ( ) {
		S.setScaling( );
		$.mobile.initializePage( );
	});
} ( window.S, jQuery ) );
