var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.view = WR.view || {};
WR.func = WR.func || {};

WR.events.dynamicSettingPage = function( m )
{
	var wr = WR,
		func = wr.func,
		sm = m.SceneManager,
		UEI = m.UEI,
		STMS = m.STMS,
		Remocon = m.Remocon,
		RemoconSet = m.RemoconSet,
		dsIntroPage$ = sm.getPage$("#dynamicSettingPage"),
		dsPage$ = sm.getPage$("#dynamicSettingPage2"),
		okBtn$ = dsIntroPage$.find("#okBtn"),
		btnFooter$ = dsPage$.find("#btnFooter"),
		textFooter$ = dsPage$.find("#textFooter"),
		noBtn$ = dsPage$.find("#noBtn"),
		yesBtn$ = dsPage$.find("#yesBtn"),
		buttonBox$ = dsPage$.find( ".buttonBox"),
		bgBtnImg$ = buttonBox$.find( ".bgBtnImg" ),
		remotePage$ = sm.getPage$( "#remotePage" ),
		curBtnName = "Power";
		curBtnId = "IDS_SR_KEY_POWER";

	function updateUiByKey( key ) {
		
		var style = document.createElement( "style" );
		var fileName= "";
		var curBtnName = "";
		var curBtnId = "";
		
		if(deviceType === "AIR"){
			fileName = WR.airKeyMap[ key ].img;
			curBtnName = WR.airKeyMap[ key ].keyStr;
			curBtnId = WR.airKeyMap[ key ].dId;
		}
		else if(deviceType === "TV"){
			fileName = WR.tvKeyMap[ key ].img;
			curBtnName = WR.tvKeyMap[ key ].keyStr;
			curBtnId = WR.tvKeyMap[ key ].dId;
		}
		else if(deviceType === "STB"){
			fileName = WR.stbKeyMap[ key ].img;
			curBtnName = WR.stbKeyMap[ key ].keyStr;
			curBtnId = WR.stbKeyMap[ key ].dId;
		}
		else{
			fileName = "";
			curBtnName = "";
			curBtnId = "";
		}
		
		var pressFileName = fileName.replace( ".png", "_press.png" );
		var str = "Press the button";		
		
		STMS.stmsHtml( dsPage$.find( ".ui-title" ), curBtnId, curBtnName );
		STMS.stmsHtml( dsPage$.find( ".commandLabel" ), "IDS_YSM_BODY_TAP_THE_BUTTON_ABB" );
		
//		dsPage$.children( "footer" ).children().addClass( "none" );
		btnFooter$.addClass( "none" );

		var myStyle = $( "#myStyle" );
		if( myStyle.length > 0 ) myStyle.remove();

		style.type = "text/css";
		style.id = "myStyle";
		style.innerHTML = " .buttonBox .fgBtnImg { background-image: url('./images/remote_setup/"+fileName+"'); } .buttonBox.hover .fgBtnImg { background-image: url('./images/remote_setup/"+pressFileName+"');}";
		document.body.appendChild( style );

		// pressImg pre-loading
		(new Image()).src = "./images/remote_setup/" + pressFileName;
		
		console.log( "Update UI by key: "+ key );
	}

	var irdbFirstKey, irdbCurCodeSet;

	dsPage$[0].addEventListener( "pagebeforeshow", function() {

		console.log("dsPage$[0] pagebeforeshow called");
		
		STMS.stmsHtml( dsPage$.find( ".commandLabel" ), "IDS_YSM_BODY_TAP_THE_BUTTON_ABB" );
		
//		BtnFooter$.addClass( "none" );
//		yesBtn$.addClass( "none" );
//		noBtn$.addClass( "none" );

		if( deviceType === "AIR" ) var type = "Aircon";
		else type = deviceType;

		var irdbTestKeyTotal = UEI.getTestKeyTotal( type, selectedBrand );
		
		if( irdbTestKeyTotal > 0)
		{
			irdbFirstKey = UEI.getFirstTestKey( selectedBrand );
			irdbCurCodeSet = UEI.getCurCodeSet();
			curKey = irdbFirstKey;
			curCodeSet = irdbCurCodeSet;

			updateUiByKey( curKey );
		}
	});

	new MyTap( okBtn$[0], {
			idList: [ "okBtn" ],
			enableHover: true,
			minPressTime: 300
		});

	okBtn$[0].addEventListener( "mytap", function( e ) {

		console.log("okBtn click");
		sm.moveTo( "#dynamicSettingPage2", { disablePush: true });
	});


	var holdLi$ = null,
		isMoved = false,
		startX = 0,
		startY = 0,
		pressTimer = null;

	function tapButtonBox() {

		var WR = wr,
			func = wr.func;

		STMS.stmsHtml( dsPage$.find( ".commandLabel" ), "IDS_YSM_BODY_DID_IT_WORK_Q_ABB" );

		btnFooter$.removeClass( "none" );
		textFooter$.addClass( "none" );
//		yesBtn$.removeClass( "none" );
//		noBtn$.removeClass( "none" );

		var isFinishSend = false;
		var isPress = true;

		UEI.sendByCodesetAndKey( curCodeSet, curKey );
	}

	new MyTap( dsPage$[0], {
			idList: [ "yesBtn", "noBtn", "bgBtnImg" ],
			idToNodeLinkMap: { "bgBtnImg": dsPage$.find( "#buttonBox" )[0] },
			enableHover: true,
			minPressTime: 50,
			thresholdX: 40,
			thresholdY: 40
		});

	dsPage$[0].addEventListener( "mytap", function( e ) {

		var id = e.target.id;
		console.log( id );

		if( id === "bgBtnImg")
		{
			tapButtonBox();
			return;
		}

		if( !(id === "yesBtn" || id === "noBtn" ) ) return;
		if( id === "noBtn" )	textFooter$.removeClass( "none" );
		else	textFooter$.addClass( "none" );
		
		var nextAction = 0,
			didItWork = 0; 		// UNKNOWN = -1, WORKED = 0,  DID_NOT_WORK = 1,

		if( id === "yesBtn" ) didItWork = 0;
		else if( id === "noBtn" ) didItWork = 1;
		else console.error( "Error: This message should never be show!" );

		nextAction = UEI.getNextAction( didItWork );

		if( nextAction == 1)
		{
			// TEST MORE!
			console.log( "Test More! ");
			curKey = UEI.getNextTestKey();
			curCodeSet = UEI.getCurCodeSet();

			updateUiByKey( curKey );
		}
		else if( nextAction == 2)
		{
			// SUCCESS
			console.log( "createRemocon!!! ");
			tmpRemoconData.codeSet = curCodeSet;
			createRemoconAndGo();
		}
		else
		{
			// FAILED
			console.log("Can not find codeset");

			var data = {
				disablePush: true, title: [ "IDS_SAPPS_BODY_NOTICE", "Notice" ],
				contentLabel: [ "IDS_YSM_BODY_THIS_MODEL_IS_NOT_SUPPORTED", "Sorry.<br>This model cannot be supported." ],
				btn: [{
					text: [ "IDS_SR_BUTTON_OK", "OK" ],
					callback: func.moveToBasePage
				}],
				backCb: func.moveToBasePage
			};
			func.openPopup( data, { disablePush: true });
		 }
	});

	function createRemoconAndGo() {
		var keylist_str = watchon_lib.get_codeset_keys(tmpRemoconData.codeSet);
		tmpRemoconData.keyList = keylist_str.split(",");
		console.log("createRemoconAndGo:" + keylist_str);
		var wr = WR,
			func = wr.func,
			newRemocon = new Remocon( tmpRemoconData ),
			rs = null,
			data = {};

		var save_to_localStorage = false;

//		UEI.insertSignalSetToRemocon( curCodeSet, newRemocon );

		if( deviceType === "STB" )
		{
			console.log("STB");
			rs = func.getRemoconSetFromType( "TV", RemoconSet );
			rs.addRemocon( newRemocon );
			rs.setType( "TV_STB" );

			WR.curRemocon = newRemocon.createRemoteDiv();
			
			newRemocon.setSetId( rs.getId() );

			data = {
				disablePush: true, title: [ "IDS_SSCHOL_HEADER_COMPLETED", "Completed" ],
				contentLabel: [ "IDS_YSM_BODY_PS_REMOTE_CONTROL_SETUP_IS_COMPLETE", "%s remote control setup is completed." ],
				btn: [{
					text: [ "IDS_YSM_BUTTON_DONE", "Done" ],
					callback: func.moveToBasePage
				}],
				backCb: func.moveToBasePage
			};
			func.openPopup( data );
		}
		else if( selectedSettingMode === SELECTED_MODE.TV_ONLY )
		{
			console.log("TVONLY");
			rs = new RemoconSet();
			rs.addRemocon( newRemocon );
			rs.setType( "TV" );

			WR.curRemocon = newRemocon.createRemoteDiv();

			data = {
				disablePush: true, title: [ "IDS_SSCHOL_HEADER_COMPLETED", "Completed"],
				contentLabel: [ "IDS_YSM_BODY_PS_REMOTE_CONTROL_SETUP_IS_COMPLETE", "%s remote control setup is completed."],
				btn: [{
					text: [ "IDS_YSM_BUTTON_DONE", "Done" ],
					callback: func.moveToBasePage
				}],
				backCb: func.moveToBasePage
			};
			func.openPopup( data );
		}
		else if( selectedSettingMode === SELECTED_MODE.TV_AND_STB )
		{
			console.log("TV&STB");
			rs = new RemoconSet();
			rs.addRemocon( newRemocon );
			// 이때까진 TV만 등록된 상태
			rs.setType( "TV" );
			WR.curRemocon = newRemocon.createRemoteDiv();

			data = {
				disablePush: true,
				title: [ "IDS_SR_BODY_SET_UP", "Set up" ],
				contentLabel: ["IDS_YSM_BODY_START_SETUP_OF_STB_REMOTE_CONTROL", "Start setup of STB remote control."],
				btn: [{
					text: ["IDS_YSM_BUTTON_NEXT", "Next" ],
					callback: function() {
						brandListStatus = "top_brand";
						deviceType = "STB";
						deviceTypeId = "IDS_SR_OPT_STB_ABB";
						sm.clearStack();
						sm.pushPage( "#remotePage" );
						sm.moveTo( "#selectCountryPage", { disablePush: true });
					}
				}],
				backCb: func.moveToBasePage
			};
			func.openPopup( data, { disablePush: true });
		}
//		else if( selectedSettingMode === SELECTED_MODE.AIR )
		else if( deviceType === "AIR" )
		{
			console.log("AIR");
			rs = new RemoconSet();
			rs.addRemocon( newRemocon );
			rs.setType( "AIR" );
			WR.curRemocon = newRemocon.createRemoteDiv();

			data = {
				disablePush: true, title: [ "IDS_SSCHOL_HEADER_COMPLETED", "Completed" ], 
				contentLabel: [ "IDS_YSM_BODY_PS_REMOTE_CONTROL_SETUP_IS_COMPLETE", "%s remote control setup is completed." ],
				btn: [{
					text: [ "IDS_YSM_BUTTON_DONE", "Done" ],
					callback: func.moveToBasePage
				}],
				backCb: func.moveToBasePage
			};
			func.openPopup( data, { disablePush: true });
		}
		else
		{
			console.error( "error" );
		}
		UEI.saveStrToFile( "lastUseRemoconId", newRemocon.getId() );
	}
	
	dsIntroPage$[0].beforeChange = function() {

		if( deviceType === "AIR" ) 	deviceTypeId = "IDS_SR_BODY_AIR_CONDITIONER";
		else if( deviceType == "STB" ) 	deviceTypeId = "IDS_SR_OPT_STB_ABB";
		else 	deviceTypeId = "IDS_SR_BUTTON_TV";

		STMS.stmsHtml( dsIntroPage$.find( ".contentLabel" ), "IDS_YSM_BODY_POINT_YOUR_WATCH_TOWARDS_THE_PS_AND_TAP_THE_POWER_BUTTON" );
		
		btnFooter$.addClass( "none" );
		textFooter$.addClass( "none" );
		
	//	str = sprintf( "wefji iewof%d wef ", type);
	//	STMS.stmsHtml( dsIntroPage$.find( ".contentLabel" ), IDS_YSM_BODY_POINT_YOUR_WATCH_TOWARDS_THE_PS_AND_TAP_THE_POWER_BUTTON );
	//
	};

};
