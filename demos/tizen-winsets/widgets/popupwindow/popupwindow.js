$( document ).one( "pageinit", "#popupwindow-demo", function () {
	$("#btn_textbox_popup_cancel").on("vclick", function ( ev ) {
		$("#textbox_popup").find("input").val("");
		$("#textbox_popup").popup("close");
		return false;
	});
});

function onSuccessPopupCallback ( ori ) {
        if ( ori.status === "PORTRAIT_PRIMARY" || ori.status === "PORTRAIT_SECONDARY" ) {
		$("#textbox_popup_landscape").popup("close");
		$("#go_textbox_popup a").attr("href", "#textbox_popup");
        }
        else if ( ori.status === "LANDSCAPE_PRIMARY" || ori.status === "LANDSCAPE_SECONDARY" ) {
		$("#textbox_popup").popup("close");
		$("#go_textbox_popup a").attr("href", "#textbox_popup_landscape");
        }

}

function onErrorPopupCallback ( error ) {
        console.error( "An error occurred " + error.message );
}

if ( $.tizen.__tizen__.util.isMobileBrowser() ) {
	tizen.systeminfo.addPropertyValueChangeListener( "DEVICE_ORIENTATION", onSuccessPopupCallback, onErrorPopupCallback );
}

