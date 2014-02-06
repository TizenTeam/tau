var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.func = WR.func || {};

WR.ENUM = WR.ENUM || {};

SELECTED_MODE = { 
	TV_ONLY: 0,
	TV_AND_STB: 1
};

var setarr = [];
Object.freeze( WR.ENUM );

// 정리 해야하는 전역변수들------------
selectedSettingMode = SELECTED_MODE.TV_ONLY;
deviceType = "TV";
brandListStatus = "top_brand";
tmpRemoconData = {};
var documentsDir;
deleteIdx = -1;
lastUseRemoconId = 0;
//-----------------------------------------

WR.events.brandListDiv = function( m )
{
	var	brandListPage$ = $( "#brandListPage" ),
		brandList$ = brandListPage$.find( "#brandList" ),
		sm = m.SceneManager;

	brandListPage$[0].beforeChange = function() {
		brandListStatus = "top_brand";
		addBrandItem();
	};

	brandList$[0].addEventListener( "click", function( e ) {

		console.log("brand item click : " + e.target.id);

		if( e.target.id === "allBrand" )
		{
			brandListStatus = "all_brand";
			addBrandItem();
		}
		else if( e.target.id === "id_s_voice" )
		{
			// s voice 페이지로 이동
		}
		else
		{
			console.log( "insert to tmpRemoconData " );
			tmpRemoconData = {
				type: deviceType,
				brandName: e.target.id,
				model: "[]",
				codeSet: "[]",
			};

			sm.moveTo( "#dynamicSettingPage" );
		}
	});
}

WR.events.remoconManagePage = function( m )
{
	var sm = m.SceneManager,
		Remocon = m.Remocon;
	var remoconManagePage$ = $( "#remoconManagePage" );

	remoconManagePage$.find( "#remoteList" ).click( function( e ) {

		console.log( e.target.id );
		if( e.target.parentNode.id !== "remoteList" ) return;
		var remocon = Remocon.remoconObjs[ e.target.id ];
		remocon.createRemoteDiv( "#remotePage" );
		sm.moveTo( "#remotePage", true );
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

}

WR.events.deletePage = function( m ) 
{
	var wr = WR,
		func = wr.func,
		sm = m.SceneManager,
		Remocon = m.Remocon;

	var deleteRemoconPage$ = $( "#deleteRemoconPage" );

	console.log( Remocon.remoconList );
	deleteRemoconPage$.find("footer").click( function( e ) {

		if( e.target.id === "yesBtn" ) 
		{
			Remocon.remoconObjs[ deleteIdx ].removeItSelf();
			WatchOnSandbox( "Remocon", func.updateRemoconManagePage);

			if( Remocon.remoconList.length < 1 )
			{
				sm.clearStack();
				sm.moveTo( "#main", true );
				return false;
			}
		}
	window.a = sm;
		sm.back();

		return false;
	});

};

//---------- fileRead Modules 로 만들어야함--------//
function addBrandItem()
{
	var brandListPage$ = $( "#brandListPage" );
	brandListPage$.find("#titleType").html( deviceType + " brand list");
	brandListPage$.find("#brandList").empty();
	brandListPage$.find("#brandList").hide();
	brandListPage$.find("#loading").show();

	if( brandListStatus === "all_brand") 
	{
		var resAddr = "file:///opt/usr/apps/S8UVkC4ryF/res/wgt/resource/";
		tizen.filesystem.resolve( resAddr, //dump_tv_58850.csv',
			function( dir ) {
				documentsDir = dir;
				dir.listFiles( onsuccessFile, onerrorFile );
			}, function( e ) {
				console.log("Error" + e.message);
		}, "r" );	
	}
	else
	{
		if( deviceType == "TV" )
		{
			$("#brandListPage #brandList").hide();
			$("#brandListPage #loading").show();
			$("#brandListPage #brandList").append('<li id="Samsung">Samsung</li>');
			$("#brandListPage #brandList").append('<li id="Panasonic">Panasonic</li>');
			$("#brandListPage #brandList").append('<li id="Sony">Sony</li>');
			$("#brandListPage #brandList").append('<li id="Toshiba">Toshiba</li>');
			$("#brandListPage #brandList").append('<li id="Toshiba">LG</li>');
			$("#brandListPage #brandList").append('<li id="Sharp">Sharp</li>');
			$("#brandListPage #brandList").append('<li id="allBrand">Show all brands</li>');
			$("#brandListPage #brandList").show();	
			$("#brandListPage #loading").hide();
		}	
		else
		{
			$("#brandListPage #brandList").hide();
			$("#brandListPage #loading").show();
			$("#brandListPage #brandList").append('<li id="Samsung">Samsung</li>');
			$("#brandListPage #brandList").append('<li id="Comcast">Comcast</li>');
			$("#brandListPage #brandList").append('<li id="Cox">Cox</li>');
			$("#brandListPage #brandList").append('<li id="Dish Network">Dish Network</li>');
			$("#brandListPage #brandList").append('<li id="Time Warner">Time Warner</li>');
			$("#brandListPage #brandList").append('<li id="Verizon">Verizon</li>');
			$("#brandListPage #brandList").append('<li id="allBrand">Show all brands</li>');
			$("#brandListPage #brandList").show();
			$("#brandListPage #loading").hide();
		}
		
	}
	
	function onsuccessFile(files) 
	{
		for(var i = 0; i < files.length; i++) 
		{
			if (files[i].isDirectory == false)
			{
				var filename = "";
				if( deviceType == "TV" )
					filename = "dump_tv_brandlist.csv";
				else
					filename = "dump_stb_brandlist.csv";
				
				if( files[i].name==filename){
					files[i].readAsText( 
						function(str){
				             var arr = str.split("\n");
				             $("#brandListPage #brandList").hide();
				             var htmlStr="";
				             for(var i=1;i<arr.length;i++)
			            	 {
				            	htmlStr+='<li id="'+arr[i]+'">'+arr[i]+'</li>';
			            	 	
			            	 	//$("#brandListPage #brandList").append('<li id="'+arr[i]+'">'+arr[i]+'</li>');
			            	 	
			            	 	
			            	 }
				             $("#brandListPage #brandList").append(htmlStr);
				             $("#brandListPage #brandList").show();
				             $("#brandListPage #loading").hide();
				        }, function(e){
				             console.log("Error " + e.message);
				        }, "UTF-8" );
					
					break;
				}
			}
		}
		
		console.log("success");
	}

	function onerrorFile(error) {
	  console.log("The error " + error.message + " occurred when listing the files in the selected folder");
	}

}

