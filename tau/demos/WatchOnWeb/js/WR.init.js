//--------------------------------------------------------------------------//
//------------------------------- WR.init ----------------------------------//
//--------------------------------------------------------------------------//

WR.init.preloadImg = function() {

	setTimeout( function() {

		// After 1sec, pre-load images.
		var images = [
			"./images/watch_remote_setup_btn_bg_press.png",
			"./images/remote_setup/watch_remote_setup_ic_on_press.png"
		];

		var length = images.length;

		for( var i=0; i < length; i++)
		{
			(new Image()).src = images[ i ];
		}
		
	}, 3000);
};

WR.init.loadSetFromLs = function( m )
{
	var RemoconSet = m.RemoconSet,
		UEI = m.UEI,
		strData = UEI.loadStrFromFile( "RemoconSet" );
		objList = [];
	
	if( strData )
	{
		objList = JSON.parse( strData );

		for( var i=0, data; data = objList[ i ]; i++ )
		{
			new RemoconSet( JSON.parse( data ));
		}
	}
};

WR.init.loadRemoconFromLs = function( m )
{
	var wr = WR,
		func = wr.func,
		Remocon = m.Remocon,
		RemoconSet = m.RemoconSet,
		UEI = m.UEI,
		strData = UEI.loadStrFromFile( "Remocon" );

	if( !(strData && strData !== "[]") ) return;

	objList = JSON.parse( strData );

	for( var i=0, data; data = objList[ i ]; i++ )
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

//		UEI.insertSignalSetToRemocon( remocon.getCodeSet(), remocon );
	}
};

WR.init.scrollToTopForListPage = function()
{
	var pageIdList = [ 
			"brandListPage",
			"selectRemoconPage",
			"selectCountryPage",
			"addDevicePage",
			"main"
		];


	for( var i=0, id; id = pageIdList[ i ]; i++)
	{
		$( "#"+id )[0].addEventListener( "pageshow", function( e ) {

			var contentEle = $( e.target ).find(".ui-content")[0];
			contentEle.scrollTop = 0;

		});
	}
}
