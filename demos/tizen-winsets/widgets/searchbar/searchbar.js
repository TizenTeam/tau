( function ( ) {

function setSearchbar( pageID ) {

	$( "#" + pageID ).bind( "pageshow", function( ev ){
		var page = ev.target;

		$( "#" + pageID + "-search" ).bind( "input change", function( ev ){
			var regEx,
				sbar = ev.target,
				content = $( page ).children(":jqmData(role='content')")[0];

			regEx = ".*" + $( sbar ).val();

			$( content ).find( "p" ).each( function( ){
				if ( $( this ).text().search(new RegExp(regEx)) != -1) {
					$( this ).show();
				}
				else {
					$( this ).hide();
				}
			});

			$( content ).scrollview("scrollTo", 0, 0, 0);
		});
	});
}

setSearchbar("searchbar-demo-page-normal");
setSearchbar("searchbar-demo-page-cancel");
setSearchbar("searchbar-demo-page-button");

$( "#searchbar-demo-page-button" ).bind( "pageshow", function(){
	$( ".ui-btn-search-front-icon" ).bind( "vclick", function(){
		window.alert( "front button in searchbar pressed!" );
	});
});

} ( ) );


