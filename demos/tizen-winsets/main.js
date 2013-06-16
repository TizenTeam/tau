$( document ).on( "pageinit", function () {
	$.mobile.tizen.enableSelection( $("div:jqmData(role='page')"), 'none' );
});


$( document ).on( "pageshow", function () {
        var $elFooter = $( ".ui-page-active .ui-footer" ),
                $elBackKey = $elFooter.children( ".ui-btn-back" ),
                $elMoreKey = $elFooter.children(":jqmData(icon='naviframe-more')"),
                cntMore = 0;

	if ( !($.tizen && $.tizen.frameworkData.deviceCapa && $.tizen.frameworkData.deviceCapa.inputKeyBack) ) {
		return true;
	}

	if ( $elMoreKey.length ) {
		cntMore = $elMoreKey.length + 1;
        }

        if ( $elFooter.children().length - $elBackKey.length - cntMore === 0 ) {
		$elFooter.hide();
                $( ".ui-page-active" ).page("refresh");
        }
});
