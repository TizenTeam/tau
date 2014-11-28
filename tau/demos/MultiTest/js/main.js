var backEventListener = null;

var unregister = function () {
	if (backEventListener !== null) {
		window.removeEventListener('tizenhwkey', backEventListener, false);
		backEventListener = null;
		window.tizen.application.getCurrentApplication().exit();
	}
};

//Initialize function
var init = function () {
	// register once
	if (backEventListener !== null) {
		return;
	}

	// TODO:: Do your initialization job
	console.log("init() called");

	var backEvent = function (e) {
		if (e.keyName == "back") {
			try {
				if ($.mobile.urlHistory.activeIndex <= 0) {
					// if first page, terminate app
					unregister();
				} else {
					// move previous page
					$.mobile.urlHistory.activeIndex -= 1;
					$.mobile.urlHistory.clearForward();
					window.history.back();
				}
			} catch (ex) {
				unregister();
			}
		}
	};

	// add eventListener for tizenhwkey (Back Button)
	window.addEventListener('tizenhwkey', backEvent, false);
	backEventListener = backEvent;

	document.getElementById('eventBtn').addEventListener('click', function () {
		tau.changePage('#event', {transition: 'fade'});
	});

	document.getElementById('cancelBtn').addEventListener('click', function () {
		tau.changePage('#home', {transition: 'fade'});
	});

	document.getElementById('saveBtn').addEventListener('click', function () {
		tau.changePage('#home', {transition: 'fade'});
	});

	document.getElementById('exitBtn').addEventListener('click', function () {
		unregister();
	});

};

$(document).bind('pageinit', init);
$(document).unload(unregister);
