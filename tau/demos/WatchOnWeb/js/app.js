
var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.func = WR.func || {};

WR.enums = WR.enums || {};
WR.state = WR.state || {};

// setting value
var VLIST_DEBUG_FLAG = true;
var FILE_READ_FLAG = true;
var WATCHON_LIB_FLAG = true;
var CHROME_MODE_FLAG = false;
var LOCAL_STORAGE_FLAG = true;

var USE_FILE = true;


if( typeof watchon_lib === "undefined" )
{
	console.log("npplugin dynamic load mode");
	var watchon_lib = null;
}
else
{
	console.log("npplugin static load mode");
}

if( navigator.userAgent.toLowerCase().indexOf('chrome') > -1 )
{
	CHROME_MODE_FLAG = true;
}
else
{
	CHROME_MODE_FLAG = false;
}

var vlist = vlist || null;	// virtuallist object
var webapis = webapis || null;
var watchon_lib = watchon_lib || null;

    
function send_remocon_ir(ir_signal) {

//	setTimeout( function() {
//
//		if (webapis && webapis.irled && webapis.irled.supported)
//		{
//			console.log("webapis will send ir: "+ ir_signal );
//			try {
//				webapis.irled.send( ir_signal );
//				console.log("ir send success: "+ ir_signal );
//			} catch (e) {
//				console.error("webapis.irled.send error:'" + e);
//			}
//		}
//		else
//		{
//			console.error("Can not find 'webapis.irled.supprted'");
//		}
//
//	}, 100 ); 
//	watchon_lib.send_ir( ir_signal)
}
WR.state.SELECTED_MODE = function() {
	return val;
};

var $ = gear.ui.$document.constructor;

$( document ).ready( function() {	
	
	// css dynamic loading
	var fileref=document.createElement("link");
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", "./lib/themes/default/gear.ui.min.css");
	fileref.addEventListener('load', function() { 

		console.log("css 2");
		var fileref2=document.createElement("link");
		fileref2.setAttribute("rel", "stylesheet");
		fileref2.setAttribute("type", "text/css");
		fileref2.setAttribute("href", "./css/style.css");
		document.getElementsByTagName("head")[0].appendChild( fileref2 );

	}, false);
	console.log("css 1");
	document.getElementsByTagName("head")[0].appendChild( fileref );
		
	var readyTimer = setInterval( function() {

		// wait
		console.log( "wait" );
		if( !WR.isReadyRestInit ) return;

		clearInterval( readyTimer );

		document.addEventListener("visibilitychange", function() {
			console.log("visibilitychange!!");

			if( WR.LANGUAGE !== navigator.language )
			{

				WR.LANGUAGE = navigator.language;
				WatchOnSandbox( "STMS", function( m ) {
					var STMS = m.STMS;
					STMS.loadStmsScript();
				});
			}
		});

		var wr = WR,
			events = wr.events,
			init = wr.init,
			func = wr.func;

		console.log( Date.now() + " other init start" );

		// setRemoconChange callback
		WatchOnSandbox( "Remocon", function( m ) {
			var Remocon = m.Remocon;
			Remocon.setRemoconChangedCb( function() {

				console.log( "changed remocon!" );
				$("#remotePage")[0].addEventListener( "pageshow", function remoteChangeCb() {
					console.log( "refresh remocon!" );
					func.refreshSectionChanger();
					
					$("#remotePage")[0].removeEventListener( "pageshow", remoteChangeCb );
				});

			});
		});

		// sectionchanger init
		if( !remoteIndi )
		{
			console.log( "still not load indi, so enter here ");
			var script = document.createElement('script');
			script.onload = function() {
				console.log( "indicator load" );
				WatchOnSandbox( "Remocon", "IndicatorTab", function( m ) {
					var Remocon = m.Remocon,
						IndicatorTab = m.IndicatorTab;

					var content = document.getElementById( "removeContent" );
					content.addEventListener( "sectionchange", func.sectionChangeCb );

					remoteIndi = new IndicatorTab({ target$: $( "#scroller" ) });

				});
			};
			script.src = 'js/common/IndicatorTab.js';
			document.body.appendChild( script );
		}

		WatchOnSandbox( "SceneManager", "Remocon", "RemoconSet", "UEI", "STMS", init.remotePage );
		WatchOnSandbox( "SceneManager", events.popupPage );

		WatchOnSandbox( "SceneManager", events.deviceEvent );
		WatchOnSandbox( "SceneManager", events.brandListPage );
		WatchOnSandbox( "SceneManager", "RemoconSet", "UEI", "STMS", events.remotePage );
		WatchOnSandbox( "SceneManager", "Remocon", "RemoconSet", "UEI", "STMS", events.dynamicSettingPage );
		WatchOnSandbox( "SceneManager", "Remocon", "RemoconSet", "STMS", events.optionPage );
		WatchOnSandbox( "SceneManager", "RemoconSet", "STMS", events.addDevicePage );
		WatchOnSandbox( "SceneManager", "STMS", events.selectCountryPage );
		WatchOnSandbox( "SceneManager", "RemoconSet", "Remocon", events.selectRemoconPage );

		init.preloadImg();

		console.log( Date.now() + " other init end" );

		if( $("#watchon_lib").length < 1 )
		{
			console.log("load dynamically");
			var str = "<object id='watchon_lib' type='application/com-samsung-watchon' style='width: 0; height: 0;'></object>";

			$("body").append( str );
			watchon_lib = $("#watchon_lib")[0];
		}

		var remoteCss=document.createElement("link");
		remoteCss.setAttribute("rel", "stylesheet");
		remoteCss.setAttribute("type", "text/css");
		remoteCss.setAttribute("href", "./css/remotePage.css");
		document.getElementsByTagName("head")[0].appendChild( remoteCss );

		WatchOnSandbox( "STMS", function( m ) {
			var STMS = m.STMS;

			STMS.refreshAllStr();
		});

		WatchOnSandbox( "SceneManager", events.introPage );
		init.scrollToTopForListPage();

	}, 10);
});

WR.enums.init = function( m ) {
	
	var wr = WR,
		that = wr.state,
		state = m.State;
};
