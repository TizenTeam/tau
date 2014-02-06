var WR = WR || {};

WR.events = WR.events || {};
WR.init = WR.init || {};
WR.func = WR.func || {};

WR.enums = WR.enums || {};
WR.state = WR.state || {};

WR.state.SELECTED_MODE = function() {
	return val;
};

$( document ).ready( function() {

	var wr = WR,
		events = wr.events,
		init = wr.init,
		func = wr.func;

	WatchOnSandbox( "Remocon", "SwipeView", init.remotePage );

	WatchOnSandbox( "SceneManager", events.deviceEvent );
	WatchOnSandbox( "SceneManager", events.introPage );
	WatchOnSandbox( "SceneManager", events.brandListDiv );
	WatchOnSandbox( "SceneManager", events.remotePage );
	WatchOnSandbox( "SceneManager", "Remocon", events.deletePage );
	WatchOnSandbox( "SceneManager", "Remocon", events.remoconManagePage );
	WatchOnSandbox( "SceneManager", "Remocon", events.dynamicSettingPage );

	WatchOnSandbox( "SceneManager", "Remocon", func.loadLSData );
	WatchOnSandbox( "Remocon", func.updateRemoconManagePage );

	WatchOnSandbox( "Remocon", function( m ) {
		window.rr = m.Remocon;
	});
});

WR.enums.init = function( m ) {
	
	var wr = WR,
		that = wr.state,
		state = m.State;
};
