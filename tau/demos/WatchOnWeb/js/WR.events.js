var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.func = WR.func || {};

//--------------------------------------------------------------------------//
//------------------------------ WR.events ---------------------------------//
//--------------------------------------------------------------------------//

WR.events.selectCountryPage = function( m ) {
	var wr = WR,
		func = WR.func,
		sm = m.SceneManager,
		STMS = m.STMS,
		selectCountryPage$ = sm.getPage$( "#selectCountryPage" ),
		countryList$ = selectCountryPage$.find( "#countryList" ),
		isAllCountry = false;

	window.sm = sm;

	new MyTap( countryList$[0], {
			parentIdList: [ "countryList" ],
			enableHover: true,
			minPressTime: 100,
			enableHoverDelay: true
		});
	countryList$[0].addEventListener( "mytap", function( e ) {

		if( e.target.parentNode.id !== "countryList" ) return;

		if( e.target.id === "OTHER" )
		{

		}
		else if( e.target.id === "OTHER_COUNTRIES" )
		{
			isAllCountry = true;

			var contentEle = selectCountryPage$.find(".ui-content")[0];
			contentEle.scrollTop = 0;

			WatchOnSandbox( "UEI", "STMS", function( m ) {
				func.insertCountriesToList( countryList$, "ALL", m );
			});
		}
		else
		{
			selectedCountry = e.target.id;
			sm.moveTo( "#brandListPage" );
		}
	});

	selectCountryPage$[0].addEventListener( "pagebeforeshow", function() {

		WatchOnSandbox( "UEI", "STMS", function( m ) {
			func.insertCountriesToList( countryList$, "TOP", m );
		});
	});

	selectCountryPage$[0].backEvent = function() {
		
		if( isAllCountry ) 
		{
			isAllCountry = false;
			
			var contentEle = selectCountryPage$.find(".ui-content")[0];
			contentEle.scrollTop = 0;

			WatchOnSandbox( "UEI", "STMS", function( m ) {
				func.insertCountriesToList( countryList$, "TOP", m );
			});
		}
		else
		{
			sm.back({ disableBackEvent: true });
		}
	};
};

WR.events.addDevicePage = function( m ) {
	var wr = WR,
		func = WR.func,
		sm = m.SceneManager,
		STMS = m.STMS,
		RemoconSet = m.RemoconSet,
		addDevicePage$ = sm.getPage$( "#addDevicePage" ),
		deviceList$ = addDevicePage$.find( "#deviceList" ),
		setType = "",
		rs = null;

	addDevicePage$[0].beforeComeBack = function() {
		var domStr = "";
		if( !func.isExistType( "TV", RemoconSet )) {

			domStr += "<a id='TV_ONLY' class='ui-btn STMS' data-stmsid='IDS_SR_BUTTON_TV'>"+STMS.getStrById("IDS_SR_BUTTON_TV")+"</a>";
			domStr += "<a id='TV_STB' class='ui-btn STMS' data-stmsid='IDS_YSM_HEADER_TV_AND_STB_ABB'>"+STMS.getStrById("IDS_YSM_HEADER_TV_AND_STB_ABB")+"</a>";

		} else if( !func.isExistType( "STB", RemoconSet )) {
			// TV O , STB X
			domStr += "<a id='STB' class='ui-btn STMS' data-stmsid='IDS_SR_OPT_STB_ABB'>"+STMS.getStrById("IDS_SR_OPT_STB_ABB")+"</a>";
		}

		if( !func.isExistType( "AIR", RemoconSet ) && AIR_DEBUG_FLAG ) {
			domStr += "<a id='AIR' class='ui-btn STMS' data-stmsid='IDS_SR_BODY_AIR_CONDITIONER'>"+STMS.getStrById("IDS_SR_BODY_AIR_CONDITIONER")+"</a>";
		}

		deviceList$.html( domStr );
	};

	addDevicePage$[0].addEventListener( "pagebeforeshow", function() {
		
		var domStr = "";

		if( !func.isExistType( "TV", RemoconSet )) {

			domStr += "<a id='TV_ONLY' class='ui-btn STMS' data-stmsid='IDS_SR_BUTTON_TV' >"+STMS.getStrById("IDS_SR_BUTTON_TV")+"</a>";
			domStr += "<a id='TV_STB' class='ui-btn STMS' data-stmsid='IDS_YSM_HEADER_TV_AND_STB_ABB'>"+STMS.getStrById("IDS_YSM_HEADER_TV_AND_STB_ABB")+"</a>";

		} else if( !func.isExistType( "STB", RemoconSet )) {
			// TV O , STB X
			domStr += "<a id='STB' class='ui-btn STMS' data-stmsid='IDS_SR_OPT_STB_ABB'>"+STMS.getStrById("IDS_SR_OPT_STB_ABB")+"</a>";
		}

		if( !func.isExistType( "AIR", RemoconSet ) && AIR_DEBUG_FLAG ) {
			domStr += "<a id='AIR' class='ui-btn STMS' data-stmsid='IDS_SR_BODY_AIR_CONDITIONER'>"+STMS.getStrById("IDS_SR_BODY_AIR_CONDITIONER")+"</a>";
		}
		deviceList$.html( domStr );
	});

	new MyTap( deviceList$[0], {
			parentIdList: [ "deviceList" ],
			enableHover: true,
			minPressTime: 100,
		});
	deviceList$[0].addEventListener( "mytap", function( e ) {

		if( e.target.id === "TV_ONLY" )
		{
			selectedSettingMode = SELECTED_MODE.TV_ONLY;

			deviceType = "TV";
			deviceTypeId = "IDS_SR_BUTTON_TV";
			
			sm.moveTo("#brandListPage");
		}
		else if( e.target.id === "TV_STB" )
		{
			selectedSettingMode = SELECTED_MODE.TV_AND_STB;

			deviceType = "TV";
			deviceTypeId = "IDS_SR_BUTTON_TV";
			
			sm.moveTo("#brandListPage");
		}
		else if( e.target.id === "STB" )
		{
			deviceType = "STB";
			deviceTypeId = "IDS_SR_OPT_STB_ABB";
			
			sm.moveTo("#selectCountryPage");
		}
		else if( e.target.id === "AIR" )
		{
			selectedSettingMode = SELECTED_MODE.AIR;

			deviceType = "AIR";
			deviceTypeId = "IDS_SR_BODY_AIR_CONDITIONER";
			
			sm.moveTo("#brandListPage");
		}
		else
		{
			console.error( "What is the target's id you clicked???" );
		}


	});
};
WR.events.optionPage = function( m ) {
	var wr = WR,
		func = WR.func,
		sm = m.SceneManager,
		STMS = m.STMS,
		Remocon = m.Remocon,
		RemoconSet = m.RemoconSet,
		optionPage$ = sm.getPage$( "#optionPage" ),
		optionList$ = optionPage$.find( "#optionList" ),
		setType = "",
		rs = null;

	/*
	var dumAir = {
		type: "AIR",
		codeSet: "airair",
		model: "airmodel",
		brandName: "airbrand"
	};
	new Remocon( dumAir );
	Remocon.saveToLocalStorage();
	*/

	optionPage$[0].beforeChange = function() {
		
		var rs = WR.curRemocon,
			domStr = "";

		setType = rs.getType();

		if( Remocon.remoconList.length > 1 ) {
			domStr += "<li id='changeRemote' class='STMS'";
			domStr += " data-stmsid='IDS_YSM_BODY_CHANGE_DEVICE_M_NOUN_ABB'>";
			domStr += STMS.getStrById("IDS_YSM_BODY_CHANGE_DEVICE_M_NOUN_ABB")+"</li>";
		}

		if( !func.isFull( Remocon )) {
			domStr += "<li id='addDevice' class='STMS' data-stmsid='IDS_SR_OPT_ADD_DEVICE_ABB'>";
			domStr += STMS.getStrById("IDS_SR_OPT_ADD_DEVICE_ABB")+"</li>";
		}

		domStr += "<li id='reset' class='STMS' data-stmsid='IDS_SR_HEADER_RESET'>";
		domStr += STMS.getStrById("IDS_SR_HEADER_RESET")+"</li>";

		optionList$.html( domStr );
		
	};

	new MyTap( optionList$[0], {
			idList: [ "reset", "addDevice", "changeRemote" ],
			parentIdList: [ "remoconList" ],
			enableHover: true,
			minPressTime: 100,
		});

	optionList$[0].addEventListener( "mytap", function( e ) {

		if( e.target.id === "reset" )
		{
			// 팝업 열고 닫아야함

			var data = {
				title: [ "IDS_SR_HEADER_RESET",  "Reset" ],
				contentLabel: [ "IDS_YSM_BODY_THE_REMOTE_CONTROL_WILL_BE_REMOVED", 
					"Remote control will be removed" ],
				btn: [{
					text: ["IDS_SR_BUTTON_CANCEL_ABB", "Cancel"],
					callback: function() {

						console.log( "Cancel" );
						sm.back();
					}
				}, {
					text: [ "IDS_SR_BUTTON_OK" , "OK" ],
					callback: function() {

						WR.curRemocon.getSet().removeItSelf();

						if( Remocon.remoconList.length < 1 )
						{
							console.log( " length: 0 ");
							sm.clearStack();

							sm.moveTo( "#main", { disablePush: true });
						}
						else
						{
							// 나머지 리모콘셋 찾아서 createDiv 보내야해
							console.log( " length: > 0");
							Remocon.remoconList[0].createRemoteDiv();
							func.refreshSectionChanger();
							func.moveToBasePage();
						}
					}
				}]
			};
			func.openPopup( data );
		}
		else if( e.target.id === "addDevice" )
		{
			sm.moveTo("#addDevicePage");
		}
		else if( e.target.id === "changeRemote" )
		{
			sm.moveTo( "#selectRemoconPage" );
		}
		else
		{
			console.error( "What is the target's id you clicked???" );
		}
	});
	
};

WR.events.selectRemoconPage = function( m ) {

	var wr = WR,
		func = WR.func,
		sm = m.SceneManager,
		Remocon = m.Remocon,
		RemoconSet = m.RemoconSet,
		selectRemoconPage$ = sm.getPage$( "#selectRemoconPage" ),
		remoconList$ = selectRemoconPage$.find( "#remoconList" );

	selectRemoconPage$[0].addEventListener( "pagebeforeshow", function() {

		var domStr = "", acStr = "";

		console.log("pagebeforeshow");
		
		domStr = "";
		for( var i=0, rs; rs = RemoconSet.remoconSetList[ i ]; i++ )
		{
			for( var j=0, rm; rm = rs.getRemoconArr()[ j ]; j++ )
			{
				console.log(rm.getLiStr());
				domStr += rm.getLiStr();
			}

			if( i===0 && rs.getType() === "AIR") {
				acStr = domStr;
				domStr = "" ;
			}
		}
		
		if( acStr ) domStr += acStr;
		remoconList$.html( domStr );
		selectRemoconPage$.find( "input#" + WR.curRemocon.getId() ).attr( "checked", true );
	});

	new MyTap( selectRemoconPage$[0], {
			idList: [ "cancelBtn" ],
			parentIdList: [ "remoconList" ],
			enableHover: true,
			minPressTime: 100,
		});
	selectRemoconPage$[0].addEventListener( "mytap", function( e ) {

		var target = null;

		if( e.target.id === "cancelBtn" )
		{
			sm.back();
			return;
		}

		if( e.target.parentNode.id === "remoconList" )
		{
			target = e.target;
		}
		else if( e.target.parentNode.parentNode.id === "remoconList" )
		{
			console.log( e.target.parentNode );
			target = e.target.parentNode;
		}
		else
		{
			console.log("3");
		}

		Remocon.remoconObjs[ target.id ].createRemoteDiv();
		func.moveToBasePage();
	});
	
};

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
		func = WR.func,
		sm = m.SceneManager,
		main$ = sm.getPage$( "#main" ),
		introList$ = main$.find( "#introList" );

	var holdLi$ = null,
		isMoved = false,
		startX = 0,
		startY = 0,
		pressTimer = null;

	new MyTap( introList$[0], { 
			parentIdList: [ "introList" ],
			enableHover: true,
			minPressTime: 500
		});

	introList$[0].addEventListener( "mytap", function( e ) {

		if( e.target.parentNode.id !== "introList" ) return;

		if( $("#watchon_lib").length < 1 )
		{
			console.log("load dynamically");
			var str = "<object id='watchon_lib' type='application/com-samsung-watchon' style='width: 0; height: 0;'></object>";

			$("body").append( str );
			watchon_lib = $("#watchon_lib")[0];
		}

		var selectedId = e.target.id;

		if( selectedId  === "TV" )
		{
			selectedSettingMode = SELECTED_MODE.TV_ONLY;

			deviceType = "TV";
			deviceTypeId = "IDS_SR_BUTTON_TV";
			
			brandListStatus = "top_brand";

			sm.moveTo( "#brandListPage" );
		
			WatchOnSandbox( "UEI", "STMS", func.createTopBrandList );
		}
		else if( selectedId === "TV_STB" )
		{
			selectedSettingMode = SELECTED_MODE.TV_AND_STB;

			deviceType = "TV";
			deviceTypeId = "IDS_SR_BUTTON_TV";
			
			brandListStatus = "top_brand";
			sm.moveTo( "#brandListPage" );
			
			WatchOnSandbox( "UEI", "STMS", func.createTopBrandList );
		}
		else if( selectedId === "AIR" )
		{
			selectedSettingMode = SELECTED_MODE.AIR;

			deviceType = "AIR";
			deviceTypeId = "IDS_SR_BODY_AIR_CONDITIONER";
			brandListStatus = "top_brand";
			sm.moveTo( "#brandListPage" );
			
			WatchOnSandbox( "UEI", "STMS", func.createTopBrandList );
		}
		else
		{
			console.error( "Unknown selectedId: '"+selectedId+"'" );
		}

	});
	
	/*
	introList$[0].addEventListener( "touchstart", function( e ) {

		isMoved = false;
		startX = e.touches[0].clientX;
		startY = e.touches[0].clientY;

		holdLi$ = $( e.target );

		startX = e.touches[0].clientX;

		if( e.target.parentNode.id !== "introList" ) 
		{
			console.log( "isMoved = true" );
			isMoved = true;
			return;
		}
		if( holdLi$ ) holdLi$.addClass( "hover" );
	});
	introList$[0].addEventListener( "touchmove", function( e ) {

		if( isMoved ) return;

        if ( Math.abs(e.touches[0].clientX - startX) > 10 || 
			Math.abs(e.touches[0].clientY - startY) > 10) 
		{
			isMoved = true;
			clearTimeout( pressTimer );
			if( holdLi$ ) holdLi$.removeClass( "hover" );
			holdLi$ = null;
		}
	});
	introList$[0].addEventListener( "touchend", function( e ) {

		setTimeout( function() {
			if( holdLi$ ) holdLi$.removeClass( "hover" );
		}, 300);

        if ( Math.abs( e.changedTouches[0].clientX - startX ) > 15 || 
			Math.abs( e.changedTouches[0].clientY - startY ) > 15) 
		{
			isMoved = true;
		}
		if( isMoved ) return;

		if( e.target.parentNode.id !== "introList" ) return;

		e.preventDefault();
		var selectedId = e.target.id;

		if( selectedId  === "TV" )
		{
			selectedSettingMode = SELECTED_MODE.TV_ONLY;

			deviceType = "TV";
			brandListStatus = "top_brand";
			sm.moveTo( "#brandListPage" );
		
			func.createTopBrandList();
		}
		else if( selectedId === "TV_STB" )
		{
			selectedSettingMode = SELECTED_MODE.TV_AND_STB;

			deviceType = "TV";
			brandListStatus = "top_brand";
			sm.moveTo( "#brandListPage" );
			
			func.createTopBrandList();
		}
		else if( selectedId === "AIR" )
		{
			selectedSettingMode = SELECTED_MODE.AIR;

			deviceType = "AIR";
			brandListStatus = "top_brand";
//			sm.moveTo( "#brandListPage" );
			
			func.createTopBrandList();
		}
		else
		{
			console.error( "Unknown selectedId: '"+selectedId+"'" );
		}
	});
	*/
};

WR.events.popupPage = function( m ) {

	var sm = m.SceneManager,
		popupPage$ = sm.getPage$( "#popupPage" ),
		footer$ = popupPage$.find( "footer" );

	new MyTap( footer$[0], {
			idList: [],
			parentIdList: [ "footer" ],
			idToNodeLinkMap: {},
			enableHover: true,
			minPressTime: 200,
			thresholdX: 20,
			thresholdY: 20
		});
	footer$[0].addEventListener( "mytap", function( e ) {
		
		WR.popupTapHandler( e );
	});
};
