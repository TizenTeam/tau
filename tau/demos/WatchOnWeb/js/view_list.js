var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.func = WR.func || {};

WR.ENUM = WR.ENUM || {};

SELECTED_MODE = { 
	TV_ONLY: 0,
	TV_AND_STB: 1,
	AIR: 2
};

var setarr = [];
Object.freeze( WR.ENUM );

// 정리 해야하는 전역변수들------------
selectedSettingMode = SELECTED_MODE.TV_ONLY;
deviceType = "TV";
deviceTypeId = "IDS_SR_BUTTON_TV";
brandListStatus = "top_brand";
tmpRemoconData = {};
var documentsDir;
deleteIdx = -1;
var curCodeSet = "";
var curKey;
var next_codeset_name;
var selectedBrand = "";
var selectedCountry = "";
WR.allBrandList = [];
WR.sideIndex = {};
WR.popupTapHandler = null;
//-----------------------------------------

WR.events.brandListPage = function( m )
{
	var wr = WR,
		func = wr.func,
		brandListPage$ = $( "#brandListPage" ),
		sm = m.SceneManager,
		isAllBrand = false;


	brandListPage$[0].beforeChange = function() {

		isAllBrand = false;
		brandListStatus = "top_brand";

		if( $( "#vlistScript" ).length < 1 )
		{
			var jsList = [ "lib/js/virtuallist.js" ],
				length = jsList.length,
				i = 0;

			var script = document.createElement('script');

			script.onload = function onLoadHandler(){

				if( !( i < length-1 ) ) {
					// all finish
					WatchOnSandbox( "UEI", "STMS", func.createTopBrandList );
					return;
				}
				var script = document.createElement('script');
				script.onload = function() {
					onLoadHandler();
				};
				script.src = jsList[ ++i ];
				document.body.appendChild( script );
			};

			script.src = jsList[ i ];
			document.body.appendChild( script) ;
		}
		else
		{
			WatchOnSandbox( "UEI", "STMS", func.createTopBrandList );
		}
	};
	brandListPage$[0].beforeComeBack = function() {

		isAllBrand = false;

		brandListStatus = "top_brand";
		WatchOnSandbox( "UEI", "STMS", func.createTopBrandList );
	};

	new MyTap( brandListPage$[0], {
			parentIdList: [ "brandList" ],
			enableHover: true,
			minPressTime: 100,
			enableHoverDelay: true
		});
	
	brandListPage$[0].addEventListener( "mytap", function( e ) {

		if( e.target.parentNode.id !== "brandList" ) return;

		selectedBrand = e.target.id;
		console.log( "brand item click : " + e.target.id );

		if( e.target.id === "allBrand" )
		{
			isAllBrand = true;
			brandListStatus = "all_brand";
			WatchOnSandbox( "UEI", func.createAllBrandList );
		}
		else if( e.target.id === "id_s_voice" )
		{
			// s voice 페이지로 이동
			console.log("will be moved to the s voice page");
		}
		else
		{
			tmpRemoconData = {
				type: deviceType,
				brandName: e.target.id,
				model: "[]"
			};

			sm.moveTo( "#dynamicSettingPage" );
		}
	});

	brandListPage$[0].backEvent = function() {
		
		if( isAllBrand ) 
		{
			brandListStatus = "top_brand";
			
			brandListPage$.find( "#brandList" ).remove();
			brandListPage$.find(".ui-content").prepend( "<ul class='ui-listview' id='brandList'></ul>" );
			
			var contentEle = brandListPage$.find(".ui-content")[0];
			contentEle.scrollTop = 0;
			
			WatchOnSandbox( "UEI", "STMS", func.createTopBrandList );
			isAllBrand = false;

			gear.ui.fireEvent( brandListPage$[0], 'pagehide', null);
		}
		else
		{
			sm.back({ disableBackEvent: true });
		}
	};
};


//---------- fileRead Modules 로 만들어야함--------//
WR.func.createAllBrandList = function( m )
{
	var wr = WR,
		func = wr.func,
		brandListPage$ = $( "#brandListPage" ),
		brandList$ = brandListPage$.find( "#brandList" ),
		loading$ = brandListPage$.find("#loading"),
		UEI = m.UEI;

	if( vlist ) {
		vlist.destroy();
		vlist = null;
	}

	if( deviceType === "AIR" )
	{
		var allList = [];
		allList = UEI.getAllBrands( "Aircon" );

		/*
		var domStr = "";
		allList.forEach( function( brand ) {
			domStr += "<li id='"+brand+"'>"+brand+"</li>";
		});
		brandList$.html( domStr );
		*/
		
		brandList$.html( "" );
		func.insertAllBrandToListInPage( allList, brandList$, brandListPage$, true );
		return;
	}

	loading$.show();
	brandList$.hide();
	brandList$.html( "" );

	if( !CHROME_MODE_FLAG )
	{
		var path = {
			fileName: "",
			dirStr: ""
		};

		path = UEI.getSavedAllBrandsFile( deviceType );
		console.log( "UEI.getSavedAllBrandsFile(): "+ path.fileName + "// " + path.dirStr );

		tizen.filesystem.resolve( path.dirStr, function( dir ) {

			dir.listFiles( onsuccessFile, function() {

				console.error( "Can not read files" );
			});

		}, function( e ) {

			console.log("Error" + e.message);

		}, "r");
	}
	else
	{
		brandList$.html( "Turn on the CHROME_MODE_FLAG!" );
		console.error( "Turn on the CHROME_MODE_FLAG!" );
	}
	brandList$.show();	
	loading$.hide();

	// callback Function
	function onsuccessFile( files )
	{
		for (var i = 0; i < files.length; i++)
		{
			if ( files[i].isDirectory ) continue;

			var filename = "";
			if (deviceType == "TV")
				filename = "dump_tv_brandlist.csv";
			else
				filename = "dump_stb_brandlist.csv";

			if (files[i].name == filename) 
			{
				files[i].readAsText( function( str ) {

					var arr = str.split( "\n" );
//					arr.splice( 30, arr.length - 30 );
//					console.log( arr.length );
					func.insertAllBrandToListInPage( arr, brandList$, brandListPage$ );

				}, function( e ) {

					console.log("Error " + e.message);

				}, "UTF-8");

				break;
			}
		}
		console.log("success");
	}
}

WR.func.createTopBrandList = function( m )
{
	var brandListPage$ = $( "#brandListPage" ),
		brandList$ = brandListPage$.find( "#brandList" ),
		loading$ = brandListPage$.find( "#loading" ),
		domStr = "",
		brandList = [],
		UEI = m.UEI,
		STMS = m.STMS;

	if( deviceType === "TV" )
	{
		brandList = UEI.getTopBrands( "TV" );
	}	
	else if( deviceType === "STB" )
	{
		brandList = UEI.getTopBrands( "STB", selectedCountry );
	}
	else if( deviceType === "AIR" )
	{
		brandList = UEI.getTopBrands( "Aircon", selectedCountry );
	}
	else
	{
		console.error( "Unknown deviceType: '"+deviceType+"'" );
	}

	brandList.forEach( function( brand ) {
		domStr += "<li id='"+brand+"'>"+brand+"</li>";
	});
	domStr += "<a id='allBrand' class='ui-btn'>"+STMS.getStrById("IDS_YSM_OPT_SHOW_ALL_BRANDS_ABB")+"</a>";
	
//	domStr += "<div id='allBrand' class='ui-btn'>"+STMS.getStrById("IDS_YSM_OPT_SHOW_ALL_BRANDS_ABB")+"</div>";

	brandList$.html( domStr );	
	brandList$.show();	
	loading$.hide();
};
