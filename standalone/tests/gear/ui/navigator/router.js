module("main");

test ( "gear.ui.navigator.autoInitialize set" , function () {
	ok(!document.getElementsByClassName('ui-page-active')[0], 'not initialize page');

	asyncTest ( "gear.ui.navigator.autoInitialize not set" , 1, function () {
		var first = document.getElementById('first'),
			onShowPage = function() {
			document.removeEventListener('pageshow', onShowPage, false);
				equal(document.getElementsByClassName('ui-page-active')[0], first, 'Page was changed');
				start();
	
				asyncTest ( "gear.ui.changePage" , 1, function () {
					var second = document.getElementById('second'),
						onChangePage = function() {
							document.removeEventListener('pagechange', onChangePage, false);
							equal(document.getElementsByClassName('ui-page-active')[0], second, 'Page was changed');
							start();
						}
					document.addEventListener('pagechange', onChangePage, false);
					gear.ui.changePage(second);
					
					asyncTest ( "gear.ui.openPopup" , 1, function () {
						var firstPopup = document.getElementById('popup1'),
							onPopupShow = function() {
								document.removeEventListener('popupshow', onPopupShow, false);
								equal(document.getElementsByClassName('ui-popup-active')[0], firstPopup, 'popup1 was opened');
								start();
								asyncTest ( "gear.ui.openPopup jQuery" , 1, function () {
									var secondPopup = document.getElementById('popup2'),
										onPopupShow = function() {
											document.removeEventListener('popupshow', onPopupShow, false);
											equal(document.getElementsByClassName('ui-popup-active')[0], secondPopup, 'popup1 was opened');
											start();
										}
									document.addEventListener('popupshow', onPopupShow, false);
									gear.ui.openPopup([secondPopup]);
								});
							}
						document.addEventListener('popupshow', onPopupShow, false);
						gear.ui.openPopup(firstPopup);
					});
				});
			}
		document.addEventListener('pageshow', onShowPage, false);
		gear.ui.noConflict();
		gear = undefined;
		ej.engine.run();
	});
});