var WR = WR || {};

WR.LANGUAGE = navigator.language;
WR.didFirstStms = false;
WR.isReadyRestInit = false;
WR.func = WR.func || {};
WR.sectionChanger = null;
remoteIndi = null;
WR.curRemocon = null;

var AIR_DEBUG_FLAG = true; //false;

(function() {
	if( !AIR_DEBUG_FLAG ) {
		var main = document.getElementById( "main" );
		var childrenList = main.getElementsByTagName( "ul" )[0].children;

		for( var i=0, child; child = childrenList[ i ]; i++ )
		{
			if( child.id === "AIR" ) {
				child.classList.add( "none" );
			}
		}
	}
}());

WR.func.refreshSectionChanger = function()
{
	var wr = WR,
		func = wr.func,
		page = document.getElementById( "remotePage" );

	if( wr.sectionChanger ) {
		wr.sectionChanger.destroy();
	}
		
	var content = document.getElementById( "removeContent" );
	wr.sectionChanger = new SectionChanger( content, {
		circular: false,
		orientation: "horizontal",
		threshold: 10
	});
		
	console.log( "go refresh");
	remoteIndi.refresh();
	remoteIndi.setSection( 0 );
	wr.sectionChanger.scrollTo( 0, 0, 0 );
};

(function() {

	'use strict'

	if( WR.hasRemocon )
	{
		var setStrData = WR.setStrData;
		var remoconStrData = WR.remoconStrData;

		delete WR.hasRemocon;
		delete WR.setStrData;
		delete WR.remoconStrData;

		console.log( "yes remocon!!!!!!!!!!!!!!! " );

		var jsList = [ 
				'js/common/IndicatorTab.js', 
				'js/common/Remocon.js',
				'js/scroller.js',
				'js/sectionchanger.js'
			],
			length = jsList.length,
			i = 0;

		var script = document.createElement('script');
		script.onload = function onLoadHandler(){

			console.log( i + " th script onload!" );

			if( !( i < length-1 ) ) {
				console.log( "1 < length-1 ");
				WatchOnSandbox( "Remocon", "IndicatorTab", initIndi );
				WatchOnSandbox( "STMS", "Remocon", "RemoconSet", function( m ) {
					loadRemoconPage( m, setStrData, remoconStrData );
				});
				return;
			}
			var script = document.createElement('script');
			script.onload = function() {
				onLoadHandler();
			};
			script.src = jsList[ ++i ];
			document.body.appendChild( script );
		};
		console.log( i );
		script.src = jsList[ i ];
		document.body.appendChild( script ) ;
	}
	else
	{
		noLastUseRemocon();
	}

	function noLastUseRemocon() {

		console.log( Date.now() + " stms start" );
		console.log( "no remocon!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

		WatchOnSandbox( "STMS", function( m ) {
			m.STMS.loadStmsScript();
		});

		var script = document.createElement('script');
		script.onload = function() {
			console.log( "onload" );
			WR.isReadyRestInit = true;
		};
		script.src = 'js/common/Remocon.js';
		document.body.appendChild( script );

		document.getElementById('remotePage').classList.remove('ui-page-active');
		var main = document.getElementById('main');
		main.classList.add('ui-page-active');

		localStorage[ 'Remocon' ] = "";
		localStorage[ 'RemoconSet' ] = "";
		localStorage[ 'lastUseRemoconId' ] = "";
	}

	function loadRemoconPage( m, setStrData, remoconStrData )
	{
		'use strict'
		var STMS = m.STMS,
			Remocon = m.Remocon,
			RemoconSet = m.RemoconSet,
			i = 0,
			data = null,
			setObjList = {},
			remoconObjList = {};
	
		setObjList = JSON.parse( setStrData );

		for( i=0; data = setObjList[ i ]; i++ )
		{
			new RemoconSet( JSON.parse( data ));
		}

		remoconObjList = JSON.parse( remoconStrData );

		for( i=0; data = remoconObjList[ i ]; i++ )
		{
			var obj = JSON.parse( data ),
				remocon = new Remocon( obj ),
				setId = remocon.getSetId(),
				set = RemoconSet.remoconSetObjs[ setId ];

			if( !set ) {
				console.error( "Can not get RemoconSet by setId:'"+setId+"'");
				return;
			}

			set.addRemocon( remocon );
			remocon.setSet( set );
		}

		var rm = Remocon.remoconObjs[ WR.lastUseRemoconId ];

		if( rm )
		{
			rm.createRemoteDiv();
			WR.func.refreshSectionChanger();
		}
		else
		{
			noLastUseRemocon();
		}
		console.log( Date.now() + " stms start" );
		STMS.loadStmsScript();

		WR.isReadyRestInit = true;
	}

	function initIndi( m ) {

		var	IndicatorTab = m.IndicatorTab;

		var content = document.getElementById( "removeContent" );
		content.addEventListener( "sectionchange", function( e ) {
			remoteIndi.setSection( e.detail.active );
		});

		remoteIndi = new IndicatorTab( "scroller" );
	}

}());
