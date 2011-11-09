Send = {
	init : function( name, detail ) {
		$("#sendPage").find('[name="body"]').val( detail );
		$("#sendPage").find('[name="subject"]').val( name );
	},
		
	toWACHref : function() {
		var protocol =  $("#sendMailMMS").find('input[type="radio"]').prop("checked") ? "mailto:" : "mmsto:";
		var str = protocol + "?to=" + $("#sendPage").find('[name="to"]').val() + "&amp;subject=" + 
			$("#sendPage").find('[name="subject"]').val() + "&amp;body=" + $("#sendPage").find('[name="body"]').val();
		return str;
	}

}
