var ME_LOCATION_LAT = 37.257762;
var ME_LOCATION_LNG = 127.053022;

var meLocation;

function initAroundMe() {
	AroundMe.init();
}

function popSmallPopup( message1, message2 ) {
	var popupdiv = '<div data-role="smallpopup" id="resultPopup" data-text1="' + message1 + '" data-text2="' + message2  + '" data-interval="3000"></div>';
	if ( $("#resultPopup") ) {
		$("#resultPopup").remove();
	}
	$.mobile.activePage.find('[data-role="content"]').append( popupdiv );
	var popup = $("#resultPopup");
	popup.smallpopup();
	popup.smallpopup('show');
	popup.bind('tapped', function() {
		$("#resultPopup").smallpopup('hide');
		$("#resultPopup").remove();
	});
}

function popConfirmPopup( message1 ) {
	var popdiv = '<div id="confirmPopup" data-role="poppupwindow" data-style="center_basic_1btn">' +
				'<p data-role="text">' + 
				message1 + 
				'</p>' +
				'<div id="confirmPopupBtn" data-role="button-bg"><input type="button" value="CONFIRM /></div>' + 
				'</div>';
	if ( $("#confirmPopup") ) {
		$("#confirmPopup").remove();
	}
	$.mobile.activePage.find('[data-role="content"]').append( popdiv );
	var popup = $("#confirmPopup");
	popup.popupwindow();
	popup.popupwindow('open' );	
	$("#confirmPopupBtn").bind( 'vclick', function() {
		$("#confirmPopup").popupwindow('close');
		$("#confirmPopup").remove();
	});
}

initAroundMe();
