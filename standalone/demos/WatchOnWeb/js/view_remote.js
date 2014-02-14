var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.view = WR.view || {};
WR.func = WR.func || {};

//var remoteSV = null;

//localStorage.setItem("device_type", ""); localStorage.setItem("brand_name", ""); localStorage.setItem("code_set_name", ""); localStorage.setItem("model", "");

WR.init.remotePage = function( m ) {

	// 앱 진입시 필요한 이벤트 리스너 같은거 달기
	var wr = WR,
		func = wr.func,
		events = wr.events,
		SwipeView = m.SwipeView,
		Remocon = m.Remocon;

//	remoteSV = new SwipeView( "#remotePage" );

	var remoconList = Remocon.remoconList;

	if( remoconList[ lastUseRemoconId ] ) {
		remoconList[ lastUseRemoconId ].createRemoteDiv();
//		remoteSV.update();
	} else {
//		remoteSV.update();
	}

	
};

WR.events.remotePage = function( m ) {

	var	remotePage$ = $( "#remotePage" ),
		sm = m.SceneManager;

	remotePage$[0].beforeChange = function() {

//		remoteSV.moveTo( 0 );
		sm.clearStack();
	};

	remotePage$[0].addEventListener( "touchend", function(e) {

		console.log( "click : " + e.target.id );

		if( e.target.id === "titleMenuButton" ) {
			sm.moveTo( "#remoconManagePage" );
		}
	});
};
