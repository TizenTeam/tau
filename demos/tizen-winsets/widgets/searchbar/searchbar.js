$( "#searchbar-demo-page" ).bind( "pageshow", function(){
	$( "#search1" ).bind( "input change", function(){
		var regEx = "";

		regEx = ".*" + $( "#search1" ).val();

		$("#searchbar-content p").each(function(){
			if ( $( this ).text().search(new RegExp(regEx)) != -1) {
				$( this ).show();
			}
			else {
				$( this ).hide();
			}
		});

		$("#searchbar-content").scrollview("scrollTo", 0, 0, 0);
	});
});

$( "#searchbar-demo-page-button" ).bind( "pageshow", function(){
	$( ".ui-btn-search-front-icon" ).bind( "vclick", function(){
		window.alert( "front button in searchbar pressed!" );
	});
});
