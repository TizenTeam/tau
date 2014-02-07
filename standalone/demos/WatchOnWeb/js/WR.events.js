var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.func = WR.func || {};

//--------------------------------------------------------------------------//
//------------------------------ WR.events ---------------------------------//
//--------------------------------------------------------------------------//

WR.events.deviceEvent = function( m ) {

	var sm = m.SceneManager;

	window.addEventListener( 'tizenhwkey', sm.deviceEvent );

	$( document ).keypress( function( e ) {

		if( e.which === 98 || e.which === 66 ) {

			sm.deviceEvent({ keyName: "back" });

		} else if( e.which === 77 || e.which === 109 ) {

			sm.deviceEvent({ keyName: "menu" });
		}
	});
};

WR.events.introPage = function( m ) {

	var wr = WR,
//		state = WR.state,
		sm = m.SceneManager,
		main$ = $( "#main" );

	main$.find("#tvOnlyBtn").click( function( e ) {

		console.log( selectedSettingMode );
		selectedSettingMode = SELECTED_MODE.TV_ONLY;
		console.log( selectedSettingMode );

		deviceType = "TV";
		brandListStatus = "top_brand";
		sm.moveTo( "#brandListPage" );
	
		addBrandItem();
	});

	main$.find("#tvAndStbBtn").click( function( e ) {

		selectedSettingMode = SELECTED_MODE.TV_AND_STB;

		deviceType = "TV";
		brandListStatus = "top_brand";
		sm.moveTo( "#brandListPage" );
		
		addBrandItem();
	});
}

//--------------------------------------------------------------------------//
//------------------------------- WR.func ----------------------------------//
//--------------------------------------------------------------------------//

WR.func.loadLSData = function( m ) {

	var Remocon = m.Remocon,
		sm = m.SceneManager;

	Remocon.createRemoconFromLS();

	if( Remocon.remoconList.length > 0 ) {
		Remocon.remoconList[0].createRemoteDiv( "#remotePage" );
		//remoteSV.update();
		sm.moveTo( "#remotePage" );
	}
};

WR.func.updateRemoconManagePage = function( m )
{
	var Remocon = m.Remocon,
		page$ = $( "#remoconManagePage" ),
		list$ = page$.find( "#remoteList" ),
		remoconList = Remocon.remoconList,
		domStr = "";

	if( remoconList.length < 1 ) return;

	remoconList.forEach( function( remocon ) {

		domStr += remocon.getLiStr();
	});

	list$.html( domStr );
};
