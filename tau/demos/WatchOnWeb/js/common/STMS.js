/*
 * STMS Module
 *
 * There are public APIs in last part of the file
 *
 * 2014.02.11
 *
 */

define({

	name: "STMS",
	def: ( function () {
		
		var pkgId = "";
		if( typeof tizen !== "undefined" ) {
			pkgId = tizen.application.getCurrentApplication().appInfo.packageId;
		} else {
			pkgId = "S8UVkC4ryF";
		}
		var fileList = [ 'ar', 'as', 'az', 'bg', 'bn', 'ca', 'cs', 'da', 'de', 'el_GR', 'en', 'en_PH', 'en_US', 'es_ES', 'es_US', 'et', 'eu', 'fa', 'fi', 'fr_CA', 'fr', 'ga', 'gl', 'gu', 'he', 'hi', 'hr', 'hu', 'hy', 'id', 'is', 'it_IT', 'ja_JP', 'ka', 'kk', 'km', 'kn', 'ko_KR', 'lo', 'lt', 'lv', 'mk', 'ml', 'mr', 'ms', 'my', 'nb', 'ne', 'nl', 'or', 'pa', 'pl', 'pt_BR', 'pt_PT', 'ro', 'ru_RU', 'si', 'sk', 'sl', 'sq', 'sr', 'sv', 'ta', 'te', 'th', 'tl', 'tr_TR', 'uk', 'ur', 'uz', 'vi', 'zh_CN', 'zh_HK', 'zh_TW' ];

		var stmsMap = {
				IDS_B2_POPUP_SETUP: "set up",
				IDS_B2_POPUP_START: "start"
			};			
			
		var dataDirStr = "/opt/usr/apps/" + pkgId + "/res/wgt/string/";
		var fileSchemeStr = "file://";

		function setStmsMap( map ) {
			stmsMap = map;
		}

		function refreshStr( ele ) {

			if( !ele ) return;
			if( !ele.dataset ) return;
			var str = stmsMap[ ele.dataset.stmsid ];
				
			if( !str ) return;

			if( str.match( /%s/ ) )
			{
				if( WR.curRemocon ) {
					var type = getStrById( WR.curRemocon.getType() );
					str = str.replace(/%s/g, type);
				} else {
					str = str.replace( /%s/g, "the device" );
				}
			}
			if( str.match( /%d/ ) )
			{
				str = str.replace(/%d/g, "");
			}
			
			ele.innerHTML = str;
		}

		function check_file_exist(file_path) {

			var bExist = false;

			tizen.filesystem.resolve( file_path, function( file ) {

				console.log( file.name );
				// SUCCESS resolve()
				bExist = true;

			}, function( e ) {

				bExit = false;

			}, "r" );
		
			return bExist;
		}
		function refreshAllStr() {

			console.log( Date.now() + " enter refreshAllStr() ");
			var stmsTags = {};

			if( WR.didFirstStms ) {
				
				console.log( "didFirstStms" );
				stmsTags = document.getElementsByClassName( "STMS" );
				for( var key in stmsTags ) {
					refreshStr( stmsTags[ key ] );
				}

			} else {
				
				console.log( "!didFirstStms" );
				stmsTags = document.getElementById( "main" ).getElementsByClassName( "STMS" );
				
				// type casting : object -> Array
				stmsTags = Array.prototype.slice.call( stmsTags );

				stmsTags = stmsTags.concat( Array.prototype.slice.call( document.getElementById( "remotePage" ).getElementsByClassName( "STMS" )));

				stmsTags.forEach( function( ele ) {
					refreshStr( ele );
				});
				WR.didFirstStms = true;
			}
			console.log( Date.now() + " leave refreshAllStr() ");
		}
		
		function loadStmsScript() {

			var system_country_code = WR.LANGUAGE;
			system_country_code = system_country_code.replace("-","_");
			
			var lang = "";
			var lang_path = "file:///opt/usr/apps/" + pkgId + "/res/wgt/string/";
			
			var findFile = "";

			fileList.every( function( name ) {
				if( system_country_code === name ) {
					findFile = name;
					return false;
				} else {
					return true;
				}
			});

			if( !findFile )
			{
				var sub = system_country_code.substr( 0, 2 );
				fileList.every( function( name ) {
					if( sub === name ) {
						findFile = name;
						return false;
					} else {
						return true;
					}
				});
			}

			if( !findFile )
			{
				findFile = "en";
			}

			var stmsScript = document.getElementById( "stmsScript" );
			if( stmsScript ) {
				stmsScript.parentNode.removeChild( stmsScript );
			}

			var newScript = document.createElement("script");
			
			newScript.onload = function() {
				console.log( Date.now() + "onload" );
			};
			newScript.src = "string/" + findFile + ".js";

			console.log( Date.now() + "startload" );
			document.body.appendChild( newScript );
		}

		function disableSTMS( ele ) {

			removeClass( ele, "STMS" );
		}
		function getStrById( id, defaultStr ) {

			var str = stmsMap[ id ];

			if( str ) {
				return str;
			} else {
				if( defaultStr ) {
					return defaultStr;
				} else {
					return "";
				}
			}
		}
		function getStrByObj( obj ) {

			var str = "";
			
			if( !obj )
			{
				console.error( "obj is not exist" );
				return false;
			}
			if( obj.id )
			{
				str = stmsMap[ obj.id ];
				if( str ) return str;
			}

			if( obj.str )
			{
				return obj.str;
			}
			else
			{
				console.error( "obj must has id or str" );
				return false;
			}
		}


		/**
		 * The function that handles formatted strings like c language printf.
		 * Unlike C language, this function handles only %s and %d.
		 *
		 * @param {ele} A element strings are inserted to.
		 * @param {format} object includes below values
		 * 					id: STMS id pointing strings included %s or %d.
		 * 					str: If can not find STMS strings, this string is used instead.
		 * @param {idList} object includes below valuew
		 * 					id: STMS id pointing strings included.
		 * 					str: If can not find STMS strings, this string is used instead.
		 * @param {defaultStr?} If it occur error that can not find format str or idList's str,
		 * 						this string is used.
		 *
		 * Examples:
		 *
		 * STMS.combiHtml( document.getElementById( "title" ), 
		 * 			{ id: IDS_IS_TITLE_STRING, str : %s count: %d	},
		 * 			[ { id: IDS_IS_DEVIE_TYPE, str: "TV" }, { id: "", str: 0 } ],
		 *			"Loading..."
		 * );
		 *
		 */
		/*
		function combiHtml( ele, format, idList, defaultStr )
		{
			var formatStr = getStrByObj( format ),
				length = 0,
				str = "";

			if( formatStr )
			{
				length = formatStr.match( /%d|%s/ ).legnth;
			}
			else
			{
				if( defaultStr )
				{
					str = defaultStr;
				}
				else
				{
					console.error( "Can not find formatStr and defaultStr" );
				}
			}
		}
		*/

		function stmsHtml( ele$, id, defaultStr ) {

			var str = "";
				ele = ele$.jquery ? ele$[0] : ele$;				

			if( id && (str = getStrById( id )))
			{
				console.log( str );

				if( ele )
				{
					if( !str) return;

					var type = getStrById( deviceTypeId );
					str = str.replace(/%s/g, type);
					str = str.replace(/%d/g, "");
					
					if(id == 'IDS_YSM_BODY_TAP_THE_BUTTON_ABB'){
						ele.style.marginTop = "0px";
					}
					
					ele.innerHTML = str;
					
					
					if(id == 'IDS_YSM_BODY_DID_IT_WORK_Q_ABB'){
					
						var overflowHeight2 = ele.clientHeight < ele.scrollHeight;
					// in case of two lines
					
						console.log("marginTop:" + ele.style.marginTop);
						if(overflowHeight2){							
							ele.style.marginTop = "-21px";
						}
						else{
							ele.style.marginTop = "0px";							
						}
					}					
					
				}
				else
				{
					str = "stmsHtml() : Can not find ele$";
					console.error( str );
				}
			}
			else
			{
				console.log( "default" );
				str = defaultStr;
				if( ele && defaultStr )
				{
					console.log( "Because can not find STMS string, or id is null. use defaultStr" );
					ele.innerHTML = defaultStr;
				}
				else if( ele )
				{
					ele.innerHTML = "";
				}
				else
				{
					str = "stmsHtml() : Can not find ele";
					console.error( str );
				}
			}
			ele.classList.add( "STMS" );
			ele.dataset.stmsid = id;
			return str;
		}


		/*
		function StmsObj( data )
		{
			if( !data ) {
				console.error( "The 'data' is necessary." );
				return;
			}

			this.obj = data.obj;
			this.ele = data.ele;

			if( !this.obj || !this.ele )
			{
				console.log(" wef");
				delete this;
				return;
			}
		}
		StmsObj.prototype.getType = function() {

			if( this instanceof NormalObj ) return "NORMAL";
			else if( this instanceof CombiObj ) return "COMBI";
			else return false;
		}



		function NormalObj( data )
		{
			this.id = data.id || null;
			this.str = data.str || null;
		}
		*/


		// public APIs
		return {
			loadStmsScript: loadStmsScript,
			getStrById: getStrById,
			stmsHtml: stmsHtml,
			setStmsMap: setStmsMap,
			refreshAllStr: refreshAllStr

		};
	}())
});
