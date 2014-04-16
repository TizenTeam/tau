/*
 * UEI Library
 */

var $ = gear.ui.$document.constructor;

define({

	name: "UEI",
	def: (function () {

		var initialized = false;

		var pkgId = "";
		if( typeof tizen !== "undefined" ) {
			pkgId = tizen.application.getCurrentApplication().appInfo.packageId;
		} else {
			pkgId = "S8UVkC4ryF";
		}

		var dataDirStr = "/opt/usr/apps/" + pkgId + "/data/";
		var fileSchemeStr = "file://";
		var dataDir = null;

	/*
		function getSignalSetByLs( codeSet ) {

			var saved_signal_count = watchon_lib.save_codeset_ir_signals_to_localstorage(find_codeset_name);
			return localStorage[ find_codeset_name ];
		}
	*/

		function onResolveFailCb( error ) {
			console.error( "Occured an error: '"+ error +"'" );
		}
		function onListFilesFailCb( error ) {
			console.error( "Occured an error: '"+ error +"'" );
		}
		function onReadAsTextFailCb( error ) {
			console.error( "Occured an error: '"+ error +"'" );
		}
		function getFileFromFiles( files, fileStr ) {

			var length = files.length;

			for( var i=0; i<length; i++ )
			{
				if( files[ i ].isDirectory ) continue;
				if( files[ i ].name === fileName ) return files[ i ];
			}
			return false;
		}
		function getNextTestKey() {
			var key = watchon_lib.get_next_test_key();
			console.log("next key:" + key );
			return key;
		}
		function getCurCodeSet() {
			var codeSet = watchon_lib.get_current_test_key_codeset_name();
			console.log("irdbCurCodeSetName:" + codeSet);
			return codeSet;
		}
		function getFirstTestKey( brand ) {

			var firstKey = watchon_lib.get_first_test_key( brand );
			console.log( "irdb_first_key:" + firstKey );
			return firstKey;
		}
		function getTestKeyTotal( type, brand ) {

			var count = watchon_lib.get_test_key_total( type, brand );
			console.log("irdb_test_key_total(deviceType)(selectedBrand):" + type+"," + brand);
			console.log("irdb_test_key_total:" + count);
			return count;
		}
		function getNextAction( did_it_work ) {

			// did_it_work enum:
			// UNKNOWN = -1, WORKED = 0,  DID_NOT_WORK = 1,

			var irdb_next_action = watchon_lib.set_test_key_result( did_it_work );
			console.log( "irdb_next_action: [[[[[[[[[" + irdb_next_action + "]]]]]]]]]");
			
			//irdb_next_action  will be one of below value
			//kResult_GET_NEXT = 1	/* There are more keys to test, continue testing */
			//kResult_SUCCESS = 2	/* No more keys to test, successful */
			//kResult_FAILED = 3,   /* Failed to get codeset from search, restart whole process.*/
			//kResult_ERROR = -1,

			return irdb_next_action;
		}
		function insertSignalSetToRemocon( codeSet, remocon ) {

			if( !dataDir )
			{
				tizen.filesystem.resolve( fileSchemeStr + dataDirStr, function() {

					insertSignalSetToRemocon( codeSet, remocon );

				}, onResolveFailCb, "r" );
				return;
			}

			var	fileName = codeSet + ".json",
				fullPath = dataDirStr + fileName;

			// save the selected codeset signals to json file					
			var result = watchon_lib.save_codeset_ir_signals_to_file( codeSet, fullPath, true);

			if( result !== 0 )
			{
				console.error( "There is an error. result val is not SUCCESS");
				return false;
			}

			if( CHROME_MODE_FLAG ) return;

			dataDir.listFiles( function( files ) {

				var file = getFileFromFiles( files, fileName );

				if( !file )
				{
					console.error( "Can not find signal set json file( '"+fileName+"' )" );
				}

				file.readAsText( function( str ) {

					remocon.setSignalSet( JSON.parse( str ) );

				}, onReadAsTextFailCb );

			}, onListFilesFailCb );
		}

		function getAllBrands( type )
		{
			var strData = watchon_lib.get_all_brands( type, "" ),
				list = [];
			
			list = strData.split(",");

			if( list.length < 1 ) console.error( "Can not get all brands" );
			return list;
		}
		function getSavedAllBrandsFile( type )
		{
			var fileName = "";
			
			if (deviceType == "TV")
			{
				fileName = dataDirStr + "dump_tv_brandlist.csv";			
			}
			else if( deviceType == "STB")
			{
				fileName = dataDirStr + "dump_stb_brandlist.csv";			
			}
			else
			{
				console.error( "Unknown deviceType: '"+deviceType+"'" );
				return;
			}

			var result = watchon_lib.save_all_brands_to_file( type, "", fileName );
			if( result !== 0 )
			{
				console.error( "Can not save all brands" );
				return;
			}

			return {
				fileName: fileName,
				dirStr: fileSchemeStr + dataDirStr
			};
		}
		function getTopBrands( type, country )
		{
			var strData = "",
				list = [];

			if( type === "STB" || type === "Aircon" )
			{
				strData = watchon_lib.get_top_brands( type, country );
				list = strData.split( "," );
				return list;
			}
			else if( type === "TV" )
			{
				return [ "Samsung", "Toshiba", "Panasonic", "Sharp", "Sony", "Toshiba" ];
			}
			
			return list;
		}
		function sendByCodesetAndKey( codesetName, key )
		{
			var wr = WR,
				func = wr.func;

			console.log( "sendByCodesetAndKey() got codesetName: "+codesetName+", key: "+ key );

			key = Number( key );

			if( WATCHON_LIB_FLAG )
			{
				// send!!!!!!!!
		//		func.sendBySignal( irdb_ir_signal );
				setTimeout( function() {
				   console.log("send_codeset_key_ir result:" + watchon_lib.send_codeset_key_ir( codesetName, key ));
					
					console.error( "send_codeset_key_ir( " + codesetName + "," + key +")");
				}, 0);
			}
			else
			{
				console.error( "Please turn on the WATCHON_LIB_FLAG'!" );
			}
		}

		function sendBySignal( signal )
		{
			/*
			$("#sendBack").addClass( "press" );
			setTimeout( function() {
				$( "#sendBack").removeClass( "press" );
			}, 300);
			*/

			watchon_lib.send_ir( signal );
			console.log( "sendBySignal() : " + signal);

		//	send_remocon_ir( signal );

		//	// send!!!!!!!!
		//	if (webapis && webapis.irled && webapis.irled.supported)
		//	{
		//		console.log("webapis will send: "+ signal );
		//		try {
		//			webapis.irled.send( signal );
		//		} catch (e) {
		//			console.error("webapis.irled.send error:'" + e);
		//		}
		//	}
		//	else
		//	{
		//		console.error("Can not find 'webapis.irled.supprted'");
		//	}

		}

		function getCountryCodesByType( type )
		{
			console.log("getCountryCodesByType:" + navigator.language);
			var strData = watchon_lib.get_device_country_codes( type, navigator.language ),
				list = strData.split( "," );
			console.log("country::" + strData);

			if( list.length < 1 )
			{
				console.error( "Can not get country codes" );
				return false;
			}

			return list;
		}

		function saveStrToFile( fileName, str )
		{
			if( CHROME_MODE_FLAG ) return;
			
			var result = -1;
			if( LOCAL_STORAGE_FLAG ){
				try{
					console.log( "save to localStorage:" + fileName);
					localStorage[fileName] = str;
					result = 0;
				}
				catch(e){
					result = -1;
					console.error( "save to localStorage error:" + e );
				}
			}
			else{
				console.log( "save to file:" + fileName);
				result = watchon_lib.save_to_file( dataDirStr + fileName, str );	
			}
			
			if( result === 0 )
			{
				return true;
			}
			else
			{
				console.error( "saveStrToFile() result" + result );
				return false;
			}
		}

		function loadStrFromFile( fileName )
		{
			if( CHROME_MODE_FLAG ) return;
			
			var data = null;
			if( LOCAL_STORAGE_FLAG ){
				console.log( "load from localStorage");
				data =  localStorage[fileName];				
			}
			else{
				console.log( "load from file");
				var fullPath = dataDirStr + fileName;
				console.log( fullPath );
				data = watchon_lib.load_from_file( fullPath );				
			}
			
			if( data )
			{
				console.log( "SUCCESS!! load data: " + data );
				return data;
			}
			else
			{
				return false;
			}
		}

		// public APIs
		return {
			insertSignalSetToRemocon: insertSignalSetToRemocon,
			getNextTestKey: getNextTestKey,
			getCurCodeSet: getCurCodeSet,
			getTestKeyTotal: getTestKeyTotal,
			getNextAction: getNextAction,
			getFirstTestKey: getFirstTestKey,
			getAllBrands: getAllBrands,
			getTopBrands: getTopBrands,
			getSavedAllBrandsFile: getSavedAllBrandsFile,
			sendBySignal: sendBySignal,
			sendByCodesetAndKey: sendByCodesetAndKey,
			getCountryCodesByType: getCountryCodesByType,
			saveStrToFile: saveStrToFile,
			loadStrFromFile: loadStrFromFile
		};

	}())
});
