// UI 에서 빠졌음
WR.events.remoconManagePage = function( m )
{
	var sm = m.SceneManager,
		Remocon = m.Remocon;
	var remoconManagePage$ = $( "#remoconManagePage" );

	remoconManagePage$.find( "#remoteList" ).click( function( e ) {

		console.log( e.target.id );
		if( e.target.parentNode.id !== "remoteList" ) return;
		var remocon = Remocon.remoconObjs[ e.target.id ];
		remocon.getParentSet().createRemoteDiv( "#remotePage" );
		sm.moveTo( "#remotePage",  { disablePush: true });
	});

	var startDelY = 0;
	var longPressTimer = null;

	remoconManagePage$.find( "#remoteList" )[0].addEventListener( "touchstart", function( e ) {
		
		if( e.target.parentNode.id !== "remoteList" ) return;

		deleteIdx = e.target.id;
		startDelY = e.touches[0].clientY;

		longPressTimer = setTimeout( function() {
			sm.moveTo( "#deleteRemoconPage" );
		}, 700);
	});
	remoconManagePage$.find( "#remoteList" )[0].addEventListener( "touchmove", function( e ) {
		var y = e.touches[0].clientY;
		if( Math.abs( startDelY-y ) > 40 )
		{
			clearTimeout( longPressTimer );
		}
	});
	remoconManagePage$.find( "#remoteList" ).on("mouseup", function() {

		clearTimeout( longPressTimer );
	});

	remoconManagePage$.find( "#addTvBtn" ).click( function(e) {
		console.log( e.target.id );
		deviceType = "TV";
		sm.moveTo("#brandListPage");
		return false;
	});
	remoconManagePage$.find( "#addStbBtn" ).click( function(e) {
		console.log( e.target.id );
		deviceType = "STB";
		sm.moveTo("#brandListPage");
		return false;
	});

};


function print_get_app_info(){
	if(!!window.openDatabase) {
	     console.log("support Web SQL Database");
	}
	else{
		console.log("no support Web SQL Database");
	}	
	
	var cur_app = tizen.application.getCurrentApplication();
	console.log("tizen.application.appInfo.id:" + cur_app.appInfo.id);
	console.log("tizen.application.appInfo.name:" + cur_app.appInfo.name);
	console.log("tizen.application.appInfo.iconPath:" + cur_app.appInfo.iconPath);
	console.log("tizen.application.appInfo.version:" + cur_app.appInfo.version);
	console.log("tizen.application.appInfo.show:" + cur_app.appInfo.show);
	console.log("tizen.application.appInfo.installDate:" + cur_app.appInfo.installDate);
	console.log("tizen.application.appInfo.size:" + cur_app.appInfo.size);
	console.log("tizen.application.appInfo.packageId:" + cur_app.appInfo.packageId);
}
function test_np_plugin(){
	console.log("checking watchon np plugin mime type");
	
	var mimetype = navigator.mimeTypes['application/com-samsung-watchon'];
	if (mimetype) {
		console.log("type:" + mimetype.type);
		console.log("suffixes:" + mimetype.suffixes);		
		console.log("description:" + mimetype.description);		
		
	} else {
		console.log("no mimetype info watchon np plugin");
		return;
	}
	
	if( watchon_lib) {

//		 load all device types 
		var device_type_count = watchon_lib.save_all_device_types_to_localstorage();
		console.log("device_type_count:" + device_type_count);
		var i = 0;
		var device_type = "";
		var key_str = "";
		for(i = 0; i < device_type_count; i++){
			key_str = 'devicetype_' + i;
			device_type = localStorage[key_str];
			console.log(key_str + ":" + device_type);
		}		
		
//		load all brands of the specified device type 
		var selected_device_type = "TV";
		var brand_count = watchon_lib.save_all_brands_to_localstorage(selected_device_type);
		console.log("brand_count:" + brand_count);	
		var brand = "";		
		for(i = 0; i < brand_count; i++){
			key_str = 'brand_' + select_device_type + "_" + i;
			brand = localStorage[key_str];
			console.log(key_str + ":" + brand);
		}		
		
//		load test key for the specified device type and brand bane
		var selected_brand = "Samsung";
		irdb_ret = watchon_lib.get_test_key_total(selected_device_type, selected_brand);		
		console.log("test_key_total:" + irdb_ret);

	} else {
		console.error( "Can not load 'watchon_lib' !!" );
	}	
}




	else if( WATCHON_LIB_FLAG )
	{
		if( WR.allBrandList.length < 10 )
		{
			var brand_count = watchon_lib.save_all_brands_to_localstorage(deviceType);
		}

//			console.log("irdb_load_all_brand count:" + brand_count);
		
		if( VLIST_DEBUG_FLAG )
		{
			var elisb = document.createElement('div'),
				localAllBrandList = WR.allBrandList,
				isb,
				brandListEle = brandList$[0],
				firstChar = "",
				lastOccuredChar = "",
				tmpData = "",
				key = "";

			//index scroll
			elisb.className = "ui-indexscrollbar";
			brandListEle.parentNode.appendChild( elisb );

			console.log("1");
			if( localAllBrandList.length < 10 )
			{
				for( var i = 1; i < brand_count; i++)
				{
					key = "brand_" + deviceType + "_" + i;
					tmpData = localStorage[ key ];
					localStorage.removeItem( key );
					if( !tmpData ) continue;

					localAllBrandList.push( tmpData );
					firstChar = tmpData.substring(0, 1).toUpperCase();

					if( lastOccuredChar === "Z" ) continue;

					if ( firstChar !== lastOccuredChar )
					{
						WR.sideIndex[ firstChar ] = i;
						lastOccuredChar = firstChar;
					}
				}
			}

			console.log("1");
			elisb.setAttribute("data-index", Object.keys(WR.sideIndex).join(","));
			console.log("2");
			isb = gear.ui.IndexScrollbar( elisb );
			console.log("3");

			// vlist
			console.log( "VLIST_DEBUG_FLAG ON" );
			
			allBrandCount = localAllBrandList.length;
			// Add a virtuallist
			vlist = gear.ui.VirtualListview( brandListEle, {
//					dataLength: brand_count,
				dataLength: allBrandCount,
				bufferSize: 40
			});
			vlist.setListItemUpdater( function(li, index) {
//					var data = localStorage[ "brand_" + deviceType + "_" + index];
				var data = localAllBrandList[ index ];
				li.innerText = data;
				li.id = data;
			});
			console.log("draw");
			setTimeout( function() {
				vlist.draw();
			}, 1000);

			var selectIndexHandler = function(ev) {
				var j = ev.detail.index;
				vlist.scrollToIndex( WR.sideIndex[ j ] );
			};
			elisb.addEventListener("select", selectIndexHandler, false);

			var pageHideHandler = (function( vlist, isb, elisb ) {
				vlist.destroy();
				elisb.removeEventListener("select", selectIndexHandler, false);
				isb.destroy();
				elisb.parentNode.removeChild(elisb);
				brandListPage$[0].removeEventListener('pagehide', pageHideHandler, false);

				//comeback part
				brandListStatus = "top_brand";

				brandListPage$ = $("#brandListPage");
				brandListPage$.find( "#brandList" ).remove();
				brandListPage$.find(".ui-content").prepend( "<ul class='ui-listview' id='brandList'></ul>" );

			}).bind(null, vlist, isb, elisb);

			brandListPage$[0].addEventListener('pagehide', pageHideHandler, false);

		}
		else
		{
			console.log( "VLIST_DEBUG_FLAG OFF" );
			var htmlStr="";

			for(var i=0; i < brand_count; i++)
			{
				var brand = localStorage[ "brand_" + i ];
				htmlStr+='<li id="'+brand+'">'+brand+'</li>';
			}

			brandList$.html( htmlStr );
		}
	}
	else
	{
		brandList$.html( "Can not load 'watchon_lib' !!" );
		console.error( "Can not load 'watchon_lib' !!" );
	}


	//
		// start of other latin america countires
		// end of other latin america countires

	/*
	} else if( QS_JPN){
		three_letter_country_code == "JPN"
		country_name== "Japan "
	} else if( QS_BGR){
		three_letter_country_code == "BGR"
		country_name== "Bulgaria      "
	} else if( QS_HRV){
		three_letter_country_code == "HRV"
		country_name== "Croatia       "
	} else if( QS_CZE){
		three_letter_country_code == "CZE"
		country_name== "Czech "
	} else if( QS_GRC){
		three_letter_country_code == "GRC"
		country_name== "Greece"
	} else if( QS_HUN){
		three_letter_country_code == "HUN"
		country_name== "Hungary       "
	} else if( QS_ROU){
		three_letter_country_code == "ROU"
		country_name== "Romania       "
	} else if( QS_TUR){
		three_letter_country_code == "TUR"
		country_name== "Turkey"
	} else if( QS_SRB){
		three_letter_country_code == "SRB"
		country_name== "Serbia"
	} else if( QS_SMR){
		three_letter_country_code == "SMR"
		country_name== "San Marino    "
	} else if( QS_MCO){
		three_letter_country_code == "MCO"
		country_name== "Monaco"
	} else if( QS_HKG){
		three_letter_country_code == "HKG"
		country_name== "Hong Kong     "
	} else if( QS_TWN){
		three_letter_country_code == "TWN"
		country_name== "Taiwan"
	} else if( QS_NZL){
		three_letter_country_code == "NZL"
		country_name== "New Zealand   "
	} else if( QS_SVK){
		three_letter_country_code == "SVK"
		country_name== "Slovakia      "
	} else if( QS_SGP){
		three_letter_country_code == "SGP"
		country_name== "Singapore     "
	} else if( QS_ZAF){
		three_letter_country_code == "ZAF"
		country_name== "South Africa  "
	} else if( QS_EST){
		three_letter_country_code == "EST"
		country_name== "Estonia       "
	} else if( QS_SVN){
		three_letter_country_code == "SVN"
		country_name== "Slovenia      "
	} else if( QS_KAZ){
		three_letter_country_code == "KAZ"
		country_name== "Kazakhstan    "
	} else if( QS_LVA){
		three_letter_country_code == "LVA"
		country_name== "Latvia"
	} else if( QS_LTU){
		three_letter_country_code == "LTU"
		country_name== "Lithuania     "
	} else if( QS_UKR){
		three_letter_country_code == "UKR"
		country_name== "Ukraine       "
	} else if( QS_VNM){
		three_letter_country_code == "VNM"
		country_name== "Vietnam       "
	} else if( QS_IRN){
		three_letter_country_code == "IRN"
		country_name== "Iran  "
	} else if( QS_TUN){
		three_letter_country_code == "TUN"
		country_name== "Tunisia       "
	} else if( QS_IDN){
		three_letter_country_code == "IDN"
		country_name== "Indonesia     "
	} else if( QS_ISR){
		three_letter_country_code == "ISR"
		country_name== "Israel"
	} else if( QS_URY){
		three_letter_country_code == "URY"
		country_name== "Uruguay       "
	} else if( QS_PRY){
		three_letter_country_code == "PRY"
		country_name== "Paraguay      "
	} else if( QS_BLZ){
		three_letter_country_code == "BLZ"
		country_name== "Belize"
	} else if( QS_CUB){
		three_letter_country_code == "CUB"
		country_name== "Cuba  "
	} else if( QS_HTI){
		three_letter_country_code == "HTI"
		country_name== "Haiti "
	} else if( QS_DOM){
		three_letter_country_code == "DOM"
		country_name== "Dominican Republic    "
	} else if( QS_PRI){
		three_letter_country_code == "PRI"
		country_name== "Puerto Rico   "
	} else if( QS_TTO){
		three_letter_country_code == "TTO"
		country_name== "Trinidad and Tobago   "
	} else if( QS_GUY){
		three_letter_country_code == "GUY"
		country_name== "Guyana   "
	} else if( QS_SUR){
		three_letter_country_code == "SUR"
		country_name== "Suriname   "
	} else if( QS_GHA){
		three_letter_country_code == "GHA"
		country_name== "Ghana   "
	} else if( QS_KEN){
		three_letter_country_code == "KEN"
		country_name== "Kenya   "
	} else if( QS_DMA){
		three_letter_country_code == "DMA"
		country_name== "Dominica      "
	} else if( QS_AND){
		three_letter_country_code == "AND"
		country_name== "Andorra       "
	} else if( QS_ISL){
		three_letter_country_code == "ISL"
		country_name== "Iceland       "
	} else if( QS_BIH){
		three_letter_country_code == "BIH"
		country_name== "Bosnia"
	} else if( QS_MNE){
		three_letter_country_code == "MNE"
		country_name== "Montenegro    "
	} else if( QS_MKD){
		three_letter_country_code == "MKD"
		country_name== "Macedonia     "
	} else if( QS_ALB){
		three_letter_country_code == "ALB"
		country_name== "Albania       "
	} else if( QS_CYP){
		three_letter_country_code == "CYP"
		country_name== "Cyprus"
	} else if( QS_BLR){
		three_letter_country_code == "BLR"
		country_name== "Belarus       "
	} else if( QS_ARM){
		three_letter_country_code == "ARM"
		country_name== "Armenia       "
	} else if( QS_AZE){
		three_letter_country_code == "AZE"
		country_name== "Azerbaijan    "
	} else if( QS_GEO){
		three_letter_country_code == "GEO"
		country_name== "Georgia       "
	} else if( QS_UZB){
		three_letter_country_code == "UZB"
		country_name== "Uzbekistan    "
	} else if( QS_TKM){
		three_letter_country_code == "TKM"
		country_name== "Turkmenistan  "
	} else if( QS_TJK){
		three_letter_country_code == "TJK"
		country_name== "Tajikistan    "
	} else if( QS_KGZ){
		three_letter_country_code == "KGZ"
		country_name== "Kyrgyzstan    "
	} else if( QS_MNG){
		three_letter_country_code == "MNG"
		country_name== "Mongolia      "
	} else if( QS_MDA){
		three_letter_country_code == "MDA"
		country_name== "Moldova       "
	} else if( QS_MYS){
		three_letter_country_code == "MYS"
		country_name== "Malaysia      "
	} else if( QS_THA){
		three_letter_country_code == "THA"
		country_name== "Thailand      "
	} else if( QS_MMR){
		three_letter_country_code == "MMR"
		country_name== "Myanmar       "
	} else if( QS_PHL){
		three_letter_country_code == "PHL"
		country_name== "Philippines   "
	} else if( QS_LKA){
		three_letter_country_code == "LKA"
		country_name== "Sri Lanka     "
	} else if( QS_NPL){
		three_letter_country_code == "NPL"
		country_name== "Nepal "
	} else if( QS_BGD){
		three_letter_country_code == "BGD"
		country_name== "Bangladesh    "
	} else if( QS_PSE){
		three_letter_country_code == "PSE"
		country_name== "Palestine     "
	} else if( QS_MAR){
		three_letter_country_code == "MAR"
		country_name== "Morocco       "
	} else if( QS_DZA){
		three_letter_country_code == "DZA"
		country_name== "Algeria       "
	} else if( QS_EGY){
		three_letter_country_code == "EGY"
		country_name== "Egypt "
	} else if( QS_PAK){
		three_letter_country_code == "PAK"
		country_name== "Pakistan      "
	} else if( QS_LBY){
		three_letter_country_code == "LBY"
		country_name== "Libya "
	} else if( QS_JOR){
		three_letter_country_code == "JOR"
		country_name== "Jordan"
	} else if( QS_IRQ){
		three_letter_country_code == "IRQ"
		country_name== "Iraq  "
	} else if( QS_LBN){
		three_letter_country_code == "LBN"
		country_name== "Lebanon       "
	} else if( QS_SYR){
		three_letter_country_code == "SYR"
		country_name== "SYRIA "
	} else if( QS_ARE){
		three_letter_country_code == "ARE"
		country_name== "United Arab Emirate "
	} else if( QS_OMN){
		three_letter_country_code == "OMN"
		country_name== "Oman  "
	} else if( QS_KWT){
		three_letter_country_code == "KWT"
		country_name== "Kuwait"
	} else if( QS_QAT){
		three_letter_country_code == "QAT"
		country_name== "Qatar "
	} else if( QS_BHR){
		three_letter_country_code == "BHR"
		country_name== "Bahrain       "
	} else if( QS_YEM){
		three_letter_country_code == "YEM"
		country_name== "Yemen "
	} else if( QS_NGA){
		three_letter_country_code == "NGA"
		country_name== "Nigeria  "
	} else if( QS_TZA){
		three_letter_country_code == "TZA"
		country_name== "Tanzania "
	} else if( QS_UGA){
		three_letter_country_code == "UGA"
		country_name== "Uganda "
	} else if( QS_GIN){
		three_letter_country_code == "GIN"
		country_name== "Guinea  "
	} else if( QS_GNB){
		three_letter_country_code == "GNB"
		country_name== "Guinea-Bissau "
	} else if( QS_BEN){
		three_letter_country_code == "BEN"
		country_name== "Benin  "
	} else if( QS_AFG){
		three_letter_country_code == "FAG"
		country_name== "Afghanistan  "
	} else if( QS_TGO){
		three_letter_country_code == "TGO"
		country_name== "Togo  "
	} else if( QS_CMR){
		three_letter_country_code == "CMR"
		country_name== "Cameroon  "
	} else if( QS_MRT){
		three_letter_country_code == "MRT"
		country_name== "Mauritania  "
	} else if( QS_MLI){
		three_letter_country_code == "MLI"
		country_name== "Mali  "
	} else if( QS_LBR){
		three_letter_country_code == "LBR"
		country_name== "Liberia  "
	} else if( QS_GMB){
		three_letter_country_code == "GMB"
		country_name== "Gambia  "
	} else if( QS_AGO){
		three_letter_country_code == "AGO"
		country_name== "Angola  "
	} else if( QS_SEN){
		three_letter_country_code == "SEN"
		country_name== "Senegal  "
	} else if( QS_RWA){
		three_letter_country_code == "RWA"
		country_name== "Rwanda  "
	} else if( QS_BDI){
		three_letter_country_code == "BDI"
		country_name== "Burundi  "
	} else if( QS_SYC){
		three_letter_country_code == "SYC"
		country_name== "Seychelles  "
	} else if( QS_ERI){
		three_letter_country_code == "ERI"
		country_name== "Eritrea  "
	} else if( QS_SDN){
		three_letter_country_code == "SDN"
		country_name== "Sudan  "
	} else if( QS_ETH){
		three_letter_country_code == "ETH"
		country_name== "Ethiopia  "
	} else if( QS_COG){
		three_letter_country_code == "COG"
		country_name== "Democratic of Congo  "
	} else if( QS_COD){
		three_letter_country_code == "COD"
		country_name== "Rep of Congo  "
	} else if( QS_GAB){
		three_letter_country_code == "GAB"
		country_name== "Gabon  "
	} else if( QS_DJI){
		three_letter_country_code == "DJI"
		country_name== "Djibouti  "
	} else if( QS_SOM){
		three_letter_country_code == "SOM"
		"Somalia  "
		country_name==
	*/	



var g_message_string_map;

function message_file_read_complete_callback(msg_map){
	
	g_message_string_map ={};	
	
	console.log("on message_file_read_success_callback");
	for(var key in msg_map){
		console.log(key + "=" + msg_map[key]);
		g_message_string_map[key] = msg_map[key];
	}
}

function get_stms_string(complete_callback)
{
	try{
		var lang_val = navigator.language;
		lang_val = "en-us";
		var lang_file = "file:///opt/usr/apps/S8UVkC4ryF/string/" + lang_val + ".xml";

		console.log( lang_file );
		
		tizen.filesystem.resolve( lang_file, function( file ) {

			// SUCCESS resolve()
			if(file)
			{
				console.log("file.path:" + file.fullPath);

				file.readAsText( function( str ) {

					// SUCCESS readAsText()

					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString( str, "text/xml" );
					var string_count = xmlDoc.evaluate( "count(/string_table/text)", xmlDoc, null, XPathResult.NUMBER_TYPE, null);

					console.log( "string item count:" + string_count.numberValue );

					var i = 0;
					var string_map = {};

					for(i = 1; i <= string_count.numberValue; i++) 
					{
						var xpath_attr = "/string_table/text[" + i + "]/@id";
						var xpath_val = "/string_table/text[" + i + "]";
						var attr_result = xmlDoc.evaluate( xpath_attr, xmlDoc, null, XPathResult.STRING_TYPE, null);
						var val_result = xmlDoc.evaluate( xpath_val, xmlDoc, null, XPathResult.STRING_TYPE, null);
						string_map[ attr_result.stringValue ] = val_result.stringValue;						 
					}
					complete_callback(string_map);
				}, function( e ) {

					// FAIL readAsText()
					console.error( "resolve() is SUCCESS but can not read(readAsText()) the file" );

				}, "UTF-8" );			
			}

		}, function( e ) {

			// FAIL resolve()
			console.error( "Can not read(resolve()) a string file" );

		}, "r" );	
	
	} catch( e ) {
		console.log(e);
	}	
}

function system_local_changed( locale ){

	// check locale.country and locale.language	
	get_stms_string( message_file_read_complete_callback );
}



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

		var stmsMap = {};

		function settingStr( ele, id ) {

			var ele$ = $( ele );
			ele$.addClass( "STMS" );
			ele$.attr( "stmsid", id );
			ele$.html( g_message_string_map[ id ] );
		}

		function refreshStr( ele ) {

			var ele$ = $( ele );
			ele$.html( stmsMap[ ele$.attr( "stmsid" ) ] );
		}

		function refreshAllStr() {
			$( ".STMS" ).each( function() {

				refreshStr( this );
			});
		}

		function disableSTMS( ele ) {

			$( ele ).removeClass( "STMS" );
		}

		// public APIs
		return {
			refreshAllStr: refreshAllStr,
			settingStr: settingStr
		};
	}())
});

var g_message_string_map;

function message_file_read_complete_callback(msg_map){
	
	g_message_string_map ={};	
	
	console.log("on message_file_read_success_callback");
	for(var key in msg_map){
		console.log(key + "=" + msg_map[key]);
		g_message_string_map[key] = msg_map[key];
	}
}


function get_stms_string(complete_callback)
{
	try{
		var lang_val = navigator.language;
		console.log("navigator.language:" + lang_val);
		lang_val = "en-us";
		var string_files_dir = "file:///opt/usr/apps/S8UVkC4ryF/string";		
		
		tizen.filesystem.resolve( string_files_dir, function( dir ) {

			if(typeof dir == undefined){
				console.log("dir == undefined");
				return;
			}
			
			dir.listFiles(function(files){
				var file_count = files.length;
				var i = 0;
				for(i = 0; i < file_count; i++){
					console.log("string file name:" + files[i].name);					
				}
				
			}, null, {"name" : "*.po"});							

		}, function( e ) {
			// FAIL resolve()
			console.error( "Can not read(resolve()) a string file" );

		}, "r" );
	
	} catch( e ) {
		console.log(e);
	}	
}

function system_local_changed( locale ){

	// check locale.country and locale.language	
	get_stms_string( message_file_read_complete_callback );
}


				/*
				var localStorage_key = codesetName + "_" + key;
				var irdb_ir_signal = localStorage[localStorage_key];
				if (irdb_ir_signal) {
					console.log("get irdb_ir_signal from localStorage:" + irdb_ir_signal);
				} else {

					var irdb_ir_signal = watchon_lib.get_key_ir_signal(codesetName, key);

					console.log("get irdb_ir_signal from np plugin:" + irdb_ir_signal);			

					func.sendBySignal( irdb_ir_signal );
					return;
				}

				if (!irdb_ir_signal) {			
					console.log("get irdb_ir_signal return empty:");
				}
				else{
					localStorage[localStorage_key] = irdb_ir_signal;
				}
				*/






		/*
        if (this.hasTouchEventOccured && e.type === 'mouseup') {
			console.log( "[[[[[[[[[[[[[[[[[[ mouseup ]]]]]]]]]]]]]]]]]]" );
//			e.preventDefault();
//            e.stopPropagation();
            this.hasTouchEventOccured = false;
            return;
        }
		*/



			if( this.element.mytap ) {

				console.log( "func");
				this.element.mytap( e );

			} else {

//				console.log( "event");
//				evt = document.createEvent('Event');
//				evt.initEvent('mytap', true, true );
//				evt.targetKey = this.targetKey;
//				e.target.dispatchEvent( evt, { targetKey: this.key });
			}

			/*
			var clickEvt = document.createEvent("MouseEvent");
			clickEvt.initMouseEvent( "click", true, true, window );
			e.target.dispatchEvent( clickEvt );
			*/






	/*
	remotePage$[0].addEventListener( "touchend", function(e) {
		clearInterval( repeatTimer );
	});

	remotePage$[0].addEventListener( "touchstart", function(e) {

		isMoved = false;
		startX = e.touches[0].clientX;
		startY = e.touches[0].clientY;

		var ele$ = $( e.target ),
			key = ele$.attr( "data-key" ),
			rm = WR.curRemocon;

		isPressed = false;

		if( !( ele$.hasClass( "rBtn" ) || ele$.hasClass( "chBtn" ) )) return;

		ele$.addClass( "hover" );

		firstTimer = setTimeout( function() {
		// after 100ms
	
			if( e.target.id === "powerSelBtn" && rm.getType() ===  "STB" )
			{
				remotePage$.toggleClass( "openPowerSelector" );
				return;
			}

			setTimeout( function() {
			// after 400ms

				ele$.removeClass( "hover" );
				
			}, 300 );

//			UEI.sendBySignal( rm.getSignalByKey( key ));
			UEI.sendByCodesetAndKey( rm.getCodeSet(), key );
			isPressed = true;

		}, 100 );

		// 볼륨이나 채널이 아니면 repeat 없고 여기서 끝
		if( ["15","16","13","14"].lastIndexOf( key ) < 0 ) return;

		repeatTimer = setInterval( function() {

			if( repeatCount > 8 ) {
				clearInterval( repeatTimer );

				ele$.removeClass( "hover" );

				repeatCount = 0;
				return;
			}
			ele$.addClass( "hover" );
			repeatCount++;
			console.log( "touchstart : " + e.target.id );

			var rm = WR.curRemocon;

//			UEI.sendBySignal( rm.getSignalByKey( key ));
			UEI.sendByCodesetAndKey( rm.getCodeSet(), key );

		}, 200 );
	});
	*/



	/*
		else if( $( e.target).hasClass( "rBtn" ) || $( e.target).hasClass( "chBtn" ))
		{
			if( e.target.id === "tvPowerBtn" )
			{
				rm = rm.getSet().getRemoconByType( "TV" );
			}

			var ele$ = $( e.target );
//			UEI.sendByCodesetAndKey( rm.getCodeSet(), ele$.attr("data-key") );


			UEI.sendBySignal( rm.getSignalByKey( ele$.attr("data-key")) );

			ele$.addClass( "press" );
			setTimeout( function() {
				$( e.target ).removeClass( "press" );
			}, 800);
		}
	*/






		function combiHtml( data ) {

			/*
				combiHtml({
					ele$: ele,
					format: { id: "IDS_II" },
					list: [{ id: "IDS", defaultStr: "wwfq" }, { str: "TV" }],
					defaultStr: "english default"
				});
			*/

			var ele$ = data.ele$ || null,
				format = data.format || "",
				id = data.id || "",
				list = data.list || [],
				defaultStr = data.defaultStr || "",
				str = "";

			if( !(ele$) ) return;
			
			var count = format.split( "%s" ).length - 1;
			count += format.split( "%d" ).length - 1;
			count += format.split( "%S" ).length - 1;
			count += format.split( "%D" ).length - 1;

			if( count !== idList.length )
			{
				console.error( "Make sure that idList.length is equal to count" );
				return false;
			}

//			str = vsprintf( format, idList );

			if( id && (str = getStrById( id )))
			{
				if( ele$.length < 1 )
				{
					str = "stmsHtml() : Can not find ele$";
					console.error( str );
				}
				else
				{
					ele$.attr( "data-stmsid", id );
					ele$.addClass( "STMS" );
					ele$.html( str );
				}
			}
			else
			{
				str = defaultStr;
				if( ele$.length < 1 )
				{
					str = "stmsHtml() : Can not find ele$";
					console.error( str );
				}
				else
				{
					console.log( "Because not find STMS string, or id is null. use defaultStr" );
					ele$.removeClass( "STMS" );
					ele$.html( str );
				}
			}
			return str;
			
		}




		Remocon.prototype.createRemoteDiv = function( parentNodeSelStr ) 
		{
			var remotePage$ = parentNodeSelStr ? $( parentNodeSelStr ) : $( "#remotePage" ),
				hiddenPage$ = $( "#hiddenPage" ),
				scroller$ = remotePage$.find( "#scroller" );

			console.log("RemoconType:" + this.getType());

			if( this.getType() === "TV" )
			{
				var src$ = hiddenPage$.children( "#TV" );
				var clone$ = src$.clone();
				remotePage$.find( ".titleLogoImg" ).css({
					"background-image": "url('./images/watch_ic_header_tv.png')"
				});
				WR.curRemocon = this;
				STMS.stmsHtml( remotePage$.find( ".ui-title" ), "IDS_SR_BUTTON_TV", "TV" );
				scroller$.html("");
				scroller$.prepend( clone$ );
				scroller$.append( hiddenPage$.find( "#chKeypad" ).clone() );
			}
			else if( this.getType() === "STB" )
			{
				var src$ = hiddenPage$.children( "#STB" );
				var clone$ = src$.clone();
				remotePage$.find( ".titleLogoImg" ).css({
					"background-image": "url('./images/watch_ic_header_stb.png')"
				});
				WR.curRemocon = this;
				STMS.stmsHtml( remotePage$.find( ".ui-title" ), "IDS_YSM_HEADER_TV_AND_STB_ABB", "TV and STB" );
				scroller$.html("");
				scroller$.prepend( clone$ );
				scroller$.append( hiddenPage$.find( "#chKeypad" ).clone() );
			}
			else if( this.getType() === "AIR" )
			{
				var src$ = hiddenPage$.children( "#AIR" );
				var clone$ = src$.clone();
				remotePage$.find( ".titleLogoImg" ).css({
					"background-image": "url('./images/watch_ic_header_aircon.png')"
				});
				WR.curRemocon = this;
				STMS.stmsHtml( remotePage$.find( ".ui-title" ), "IDS_SR_BODY_AIR_CONDITIONER", "Air conditioner" );
				scroller$.html("");
				scroller$.prepend( clone$ );
			}
			else
			{
				console.error( "Unknown type: '"+this.getType()+"'" );
			}

			UEI.saveStrToFile( "lastUseRemoconId", this.getId() );
			Remocon.remoconChangedCb( this );

			return this;
		}
