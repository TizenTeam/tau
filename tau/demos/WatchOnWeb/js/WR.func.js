/*
 *	WR.func.js
 */

var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.func = WR.func || {};

WR.enums = WR.enums || {};
WR.state = WR.state || {};

WR.init.sendBtnPressOff = function() {

	$("#sendBack").on("webkitAnimationEnd", function(e) {
		$(this).removeClass("press");
	});

};

WR.func.getRemoconSetFromType = function(type, RemoconSet) {

	for ( var i = 0, rs; rs = RemoconSet.remoconSetList[i]; i++) {
		var setType = rs.getType();

		if (setType === type) {
			return rs;
		}
	}
	return false;
};

WR.func.isExistType = function(type, RemoconSet) {

	var enums = {
		TV : 0,
		STB : 1,
		AIR : 2
	}, flags = [ false, false, false ];

	for ( var i = 0, rs; rs = RemoconSet.remoconSetList[i]; i++) {
		var setType = rs.getType();
		console.log(setType);

		if (setType === "TV_STB") {
			flags[enums.TV] = true;
			flags[enums.STB] = true;
		} else {
			flags[enums[setType]] = true;
		}
	}

	return flags[enums[type]];
};

WR.func.isFull = function(Remocon) {

	var enums = {
		TV : 0,
		STB : 1,
		AIR : 2
	}, flags = [ false, false, false ];

	if (!AIR_DEBUG_FLAG) {

		delete enums.AIR;
		flags.splice(2, 1);
	}

	for ( var i = 0, rm; rm = Remocon.remoconList[i]; i++) {
		var type = rm.getType();
		flags[enums[type]] = true;
	}
	console.log(flags.lastIndexOf(false));
	console.log(flags);

	if (flags.lastIndexOf(false) < 0)
		return true;
	else
		return false;
};

WR.func.updateRemoconManagePage = function(m) {
	var Remocon = m.Remocon, page$ = $("#remoconManagePage"), list$ = page$
			.find("#remoteList"), remoconList = Remocon.remoconList, domStr = "";

	if (remoconList.length < 1)
		return;

	remoconList.forEach(function(remocon) {

		domStr += remocon.getLiStr();
	});

	list$.html(domStr);
};

WR.func.insertCountriesToList = function( list$, mode, m ) {

	var wr = WR,
		func = wr.func,
		domStr = "",
		countryCodeStr = "",
		countryCodeList = [],
		tmpList = [],
		topCountryCount = 7,
		code = "",
		length = 0,
		UEI = m.UEI,
		STMS = m.STMS;

	countryCodeList = UEI.getCountryCodesByType( "STB" );
	length = countryCodeList.length;

	for ( var i = 0; code = countryCodeList[i]; i++) {
		tmpList.push(code);
	}

	// Insert other latin countries
	if (mode === "TOP") {
		// push 'Other Latin' & pop remainder
		code = countryCodeList[countryCodeList.length - 1];
		tmpList.splice(topCountryCount, length - topCountryCount);
		tmpList.push(code);

	} else if (mode === "ALL") {
		//
		// remove Other Latin
		tmpList.pop();
		tmpList.splice(0, topCountryCount);

	} else {

		console.log("'mode' is wrong");

	}

	tmpList.forEach(function(code) {

		var itemId = func.getCountryNameByCode(code);
		domStr += "<li id='" + code + "' class='STMS' data-stmsid='" + itemId + "'>"+STMS.getStrById( itemId )
				+ "</li>";
	});

	if (mode === "TOP")
		domStr += "<li id='OTHER_COUNTRIES'>"+STMS.getStrById("IDS_YSM_BODY_OTHER_COUNTRIES_ABB")+"</li>";

	list$.html(domStr);
};

WR.func.openPopup = function( data ) {

	var popupPage$ = $("#popupPage"), footer$ = popupPage$.find("footer");

	WatchOnSandbox( "SceneManager", "RemoconSet", "STMS", function( m ) {

		var sm = m.SceneManager, 
			STMS = m.STMS,
			RemoconSet = m.RemoconSet,
			domStr = "",
			d = data,
			isArray = data.btn instanceof Array;

		console.log( d.title );
		console.log( d.contentLabel );

		STMS.stmsHtml( popupPage$.find("#title"), d.title[0], d.title[1] ); 
		STMS.stmsHtml( popupPage$.find("#contentLabel"), d.contentLabel[0], d.contentLabel[1] );			

		if( d.btn.length === 1 )
		{
			footer$.removeClass("ui-grid-col-2");
			footer$.addClass("ui-grid-col-1");
		}
		else if( d.btn.length === 2 )
		{
			footer$.removeClass("ui-grid-col-1");
			footer$.addClass("ui-grid-col-2");
		}

		var str = "";
		for( var i=0, btn; btn = d.btn[ i ]; i++ )
		{
			domStr += "<a id='" + i + "'";
			domStr += "class='ui-btn";

			if( str = STMS.getStrById( btn.text[0] )) 
			{
				domStr += " STMS' data-stmsid='"+btn.text[0]+"'>";
			}
			else
			{
				str = btn.text[1];
				domStr += "'>";
			}
			domStr += str + "</a>";
		}
		footer$.html(domStr);

		if( typeof d.backCb === "function" )
		{
			popupPage$[0].backEvent = d.backCb;
		}
		else
		{
			popupPage$[0].backEvent = null;
		}

		WR.popupTapHandler = function( e ) {

			var clickedBtn = null;
			if( clickedBtn = d.btn[ Number( e.target.id ) ] )
			{
				if( typeof clickedBtn.callback === "function" )
				{
					clickedBtn.callback();
				}
			}
		};

		if ( data.disablePush )
			sm.moveTo("#popupPage", { disablePush : true });
		else
			sm.moveTo("#popupPage");
	});
};

WR.func.getCountryNameByCode = function(three_letter_country_code)
{
	var map = {
		"KOR" : "IDS_SR_BODY_SOUTH_KOREA_M_COUNTRYNAME", //"Korea",
		"JPN" : "IDS_CHATON_BODY_JAPAN_M_COUNTRYNAME", //"Japan",
		"CHN" : "IDS_SR_BODY_CHINA_M_COUNTRYNAME", //"China",
		"IND" : "IDS_CHATON_BODY_INDIA_M_COUNTRYNAME", // "India",
		"GBR" : "IDS_SR_BODY_UNITED_KINGDOM_M_COUNTRYNAME", //"United Kingdom",
		"FRA" : "IDS_SR_BODY_FRANCE_M_COUNTRYNAME", //"France",
		"DEU" : "IDS_SR_BODY_GERMANY_M_COUNTRYNAME", //"Germany",
		"ITA" : "IDS_SR_BODY_ITALY_M_COUNTRYNAME", //"Italy",
		"ESP" : "IDS_SR_BODY_SPAIN_M_COUNTRYNAME", //"Spain",
		"NLD" : "IDS_CHATON_BODY_NETHERLANDS_M_COUNTRYNAME", //"Netherlands",
		"BEL" : "IDS_SR_BODY_BELGIUM_M_COUNTRYNAME", //"Belgium",
		"SWE" : "IDS_SR_BODY_SWEDEN_M_COUNTRYNAME", //"Sweden",
		"NOR" : "IDS_SR_BODY_NORWAY_M_COUNTRYNAME", //"Norway",
		"DNK" : "IDS_SR_BODY_DENMARK_M_COUNTRYNAME", //"Denmark",
		"FIN" : "IDS_SR_BODY_FINLAND_M_COUNTRYNAME", //"Finland",
		"CHE" : "IDS_SR_BODY_SWITZERLAND_M_COUNTRYNAME", //"Switzerland",
		"IRL" : "IDS_SR_BODY_IRELAND_M_COUNTRYNAME", //"Ireland",
		"AUT" : "IDS_SR_BODY_AUSTRIA_M_COUNTRYNAME", //"Austria",
		"RUS" : "IDS_WCL_BODY_RUSSIA_M_COUNTRYNAME", //"Russia",
		"LUX" : "IDS_SR_BODY_LUXEMBOURG_M_COUNTRYNAME", //"Luxembourg",
		"POL" : "IDS_SR_BODY_POLAND_M_COUNTRYNAME", //"Poland",
		"PRT" : "IDS_SR_BODY_PORTUGAL_M_COUNTRYNAME", //"Portugal",
		"AUS" : "IDS_CHATON_BODY_AUSTRALIA_M_COUNTRYNAME", //"Australia",
		"SAU" : "IDS_CHATON_BODY_SAUDI_ARABIA_M_COUNTRYNAME", //"Saudi Arabia",
		"USA" : "IDS_SR_BODY_UNITED_STATES_OF_AMERICA_M_COUNTRYNAME", //"United States",
		"CAN" : "IDS_CHATON_BODY_CANADA_M_COUNTRYNAME", //"Canada",
		"BRA" : "IDS_CHATON_BODY_BRAZIL_M_COUNTRYNAME", //"Brazil",
		"MEX" : "IDS_CHATON_BODY_MEXICO_M_COUNTRYNAME", //"Mexico",
		"ARG" : "IDS_CHATON_BODY_ARGENTINA_M_COUNTRYNAME", //"Argentina",
		"CHL" : "IDS_CHATON_BODY_CHILE_M_COUNTRYNAME", //"Chile",
		"PER" : "IDS_CHATON_BODY_PERU_M_COUNTRYNAME", //"Peru",
		"COL" : "IDS_CHATON_BODY_COLOMBIA_M_COUNTRYNAME", //"Colombia",
		"OLA" : "IDS_YSM_BODY_LATIN_COUNTRIES_ABB" //"Other latin countries"
	};

	return map[three_letter_country_code];
};

WR.func.insertAllBrandToListInPage = function( arr, list$, page$, disableVList )
{
    'use strict';

	var	arrLen = arr.length,
		elisb = document.createElement('div'),
		isb = null,
		sideIndex = {},
		firstChar = "",
		lastOccuredChar ="",
		listEle = list$[0];

	elisb.className = 'ui-indexscrollbar';
	list$.parent().find( ".ui-indexscrollbar" ).remove();
	listEle.parentNode.appendChild( elisb );

	var tmpData = "",
		didSeeFirstA = false;

	sideIndex[ "#" ] = 0;
	console.log( arrLen );
	for (var i = 0; i < arrLen; i++)
	{
		tmpData = arr[i];

		if( lastOccuredChar === "Z" ) break;

		if( !tmpData ) {
			console.log( "brand name is undefined" );
			continue;
		}

		firstChar = tmpData.substring(0, 1).toUpperCase();

		if( !didSeeFirstA )
		{
			if( firstChar.search( /[A-Z]/ ) > -1 && i === 0 )
			{
				delete sideIndex[ "#" ];
				didSeeFirstA = true;
			}
			if( firstChar.search( /[A-Z]/ ) > -1 )
			{
				didSeeFirstA = true;
			}
			else
			{
				continue;
			}
		}

		if ( firstChar !== lastOccuredChar )
		{
			console.log( firstChar+": " + i );
			sideIndex[firstChar] = i;
			lastOccuredChar = firstChar;
		}
	}

	elisb.setAttribute("data-index", Object.keys( sideIndex ).join(","));
	isb = gear.ui.IndexScrollbar(elisb, { keepSelectEventDelay: 50 });
	
	// Add a virtuallist
	vlist = gear.ui.VirtualListview( listEle, {
		dataLength: arrLen,
		bufferSize: 30
	});
	vlist.setListItemUpdater(function( li, index ) {
		var data = arr[index];
		li.innerText = data;
		li.id = data;
	});
	vlist.draw();

	var selectIndexHandler = function(ev) {
		var idx = ev.detail.index;
		vlist.scrollToIndex(sideIndex[idx]);
	};
	elisb.addEventListener("select", selectIndexHandler, false);

	page$.find( "#loading" ).hide();
	list$.show();

	var pageHideHandler = (function(vlist, isb) {

		if( vlist ) {
			vlist.destroy();
			vlist = null;
		}

		elisb.removeEventListener("select", selectIndexHandler, false);
		isb.destroy();
		elisb.parentNode.removeChild(elisb);
		page$[0].removeEventListener('pagehide', pageHideHandler, false);

	}).bind(null, vlist, isb);

	page$[0].addEventListener('pagehide', pageHideHandler, false);
};

WR.func.moveToBasePage = function() 
{
	WatchOnSandbox( "SceneManager", "RemoconSet", function( m ) {

		var sm = m.SceneManager,
			RemoconSet = m.RemoconSet;

		sm.clearStack();

		if( RemoconSet.remoconSetList.length < 1 )
		{
			localStorage[ 'lastUseRemoconId' ] = "";
			sm.moveTo( "#main", { disablePush: true });
		}
		else
		{
			sm.moveTo( "#remotePage", { disablePush: true });
		}
	});
};

WR.func.sectionChangeCb = function( e ) 
{
	console.log( "changed section" );
	remoteIndi.setSection( e.detail.active );
};
