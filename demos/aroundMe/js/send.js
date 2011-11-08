Send = {
	isMMS : false,

	init : function( name, detail ) {
		$("#sendPage").find('[name="body"]').val( detail );
		$("#sendPage").find('[name="subject"]').val( name );
	},
	
	toggleMailMMS : function( mms ) {
		this.isMMS = mms;
	},
	
	toWACHref : function() {
		var protocol = this.isMMS ? "mmsto:" : "mailto";
		var str = protocol + "?to=" + $("#sendPage").find('[name="to"]').val() + "&amp;subject=" + 
			$("#sendPage").find('[name="subject"]').val() + "&amp;body=" + $("#sendPage").find('[name="body"]').val();
		return str;
	}

}
