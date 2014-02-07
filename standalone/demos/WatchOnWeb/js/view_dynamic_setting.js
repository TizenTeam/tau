var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.view = WR.view || {};
WR.func = WR.func || {};

remoarr = [];

WR.events.dynamicSettingPage = function( m )
{
	var wr = WR,
		func = wr.func,
		dsView1 = $("#dynamicSettingPage"),
		dsView2 = $("#dynamicSettingPage2"),
		dsView3 = $("#dynamicSettingPage3"),
		dsView4 = $("#dynamicSettingPage4"),
		dsView2NoBtn = dsView2.find("#noBtn"),
		dsView2YesBtn = dsView2.find("#yesBtn"),
		sm = m.SceneManager,
		Remocon = m.Remocon;

	$("#introOkBtn").click( function( e ) {
		sm.moveTo( "#dynamicSettingPage2", true );
	});

	dsView2.find(".buttonBox").click( function( e ) {
		
		dsView2YesBtn.removeClass( "ui-state-disabled" );
		dsView2NoBtn.removeClass( "ui-state-disabled" );
		dsView2.find( ".commandLabel" ).html( "Did it work?" );
	});

	dsView2NoBtn.click( function( e ) {
		
		var str = "Press the button";

		dsView2.find( ".commandLabel" ).html( str );
		dsView2YesBtn.addClass( "ui-state-disabled" );
		dsView2NoBtn.addClass( "ui-state-disabled" );
	});

	dsView2YesBtn.click( function( e ) {

		var newRemocon = new Remocon( tmpRemoconData );

		newRemocon.saveToLocalStorage();
		newRemocon.createRemoteDiv( "#remotePage" );
//		remoteSV.update();
		WatchOnSandbox( "Remocon", func.updateRemoconManagePage );

		if( deviceType === "STB" )
		{
			sm.clearStack();
			sm.pushPage( "#remotePage" );
			sm.moveTo( "#dynamicSettingPage3", true );
			return;
		}

		console.log( selectedSettingMode );
		console.log( typeof selectedSettingMode );
		console.log( SELECTED_MODE.TV_ONLY );
		console.log( SELECTED_MODE.TV_AND_STB );

		if( selectedSettingMode === SELECTED_MODE.TV_ONLY )
		{
			sm.clearStack();
			sm.pushPage( "#remotePage" );
			sm.moveTo( "#dynamicSettingPage3", true );
		}
		else if( selectedSettingMode === SELECTED_MODE.TV_AND_STB )
		{
			deviceType = "STB";
			brandListStatus = "top_brand";
			sm.clearStack();
			sm.pushPage( "#remotePage" );
			sm.moveTo( "#brandListPage", true );
		}
		else
		{
			console.error( "error" );
		}
	});

	dsView2.find("#imgBtn").click( function( e ) {
		console.log( "send()" );
	});

	dsView3.find("#doneBtn").click( function( e ) { 		// STB done

		sm.clearStack();
		sm.moveTo( "#remotePage", true );
	});

	dsView4.find( "#doneBtn" ).click( function( e ) {		// TV done

		sm.clearStack();
		sm.moveTo( "#remotePage", true );
	});

	dsView1[0].beforeChange = function() {
		var str = "Point your device towards the "+deviceType+" and press the button";
		dsView1.find( ".contentLabel" ).html( str );
	};

	dsView2[0].beforeChange = function() {
		var str = "Press power";

		dsView2.find( ".commandLabel" ).html( str );
		dsView2YesBtn.addClass( "ui-state-disabled" );
		dsView2NoBtn.addClass( "ui-state-disabled" );
	};
	dsView2[0].afterChange = function() {
//		console.log( "afterChange");
	};
	dsView2[0].beforePageInit = function() {
//		console.log( "나는 페이지가 최초에 열릴때 한번만 실행됨");
	};
	dsView2[0].afterPageInit = function() {
//		console.log( "나는 페이지가 최초에 열릴때 한번만 실행됨2");
	};
	dsView3[0].beforeChange = function() {
		var str = "";( deviceType === "TV" ) ? "TV" : "STB";

		if( selectedSettingMode === SELECTED_MODE.TV_ONLY ) {
			str += "TV"
		} else {
			str += "TV&STB"
		}
		str += " remote control setup is complete";

		dsView3.find( "#completeLabel" ).html( str );
	};

	$( document ).keypress( function( e ) {
		console.log( e.which );
	});
};
