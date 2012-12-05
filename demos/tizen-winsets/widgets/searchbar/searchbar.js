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
	});
	
	/*searchbar-content*/
});