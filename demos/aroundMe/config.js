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
    // instead of calling a function here, we could set up a global
    // object (e.g. called CONFIG) and assign a "deps" property to it; then
    // load each of the files in the deps property inside bootstrap.js
    S.load(
		'lib/json2.js',
        'lib/jquery.ui.map.full.min.js',
		'lib/jquery.ui.map.extensions.js',
        'js/favorite.js',
        'init.js'
    );

    /* link custom stylesheet */
    S.css.load(
        'css/aroundme.css'
    );
}

loadGoogleMapScripts();
