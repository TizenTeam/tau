loadGoogleMapScripts = function() {
    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = 'http://maps.google.com/maps/api/js?sensor=true&language=en&region=GB&libraries=geometry&callback=loadGooglePlacesScripts';
    document.head.appendChild( script );
};

loadGooglePlacesScripts = function() {
    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = 'http://maps.googleapis.com/maps/api/js?libraries=places&sensor=true&callback=loadLocalScripts';
    document.head.appendChild( script );
};

loadLocalScripts = function() {
    var scripts = new Array(
        'lib/json2.js',
        'lib/jquery.ui.map.full.min.js',
		'lib/jquery.ui.map.extensions.js',
        'lib/jsrender.js',
        'js/favorite.js',
        'js/detail.js',
		'js/list.js',
		'js/map.js',
		'js/send.js',
		'js/aroundme.js',
        'init.js'
    );

    $(scripts).each( function( i, e ) {
        var script = document.createElement( "script" );
        script.type = 'text/javascript';
        script.src = e;
        document.head.appendChild( script );
    });
}

loadGoogleMapScripts();
