module("tau.navigator");

function openPopupTest3() {
	var secondPopup = document.getElementById('popup2'),
		onPopupShow = function() {
			document.removeEventListener('popupshow', onPopupShow, false);
			equal(document.getElementsByClassName('ui-popup-active')[0], secondPopup, 'popup1 was opened');
			start();
		}
	document.addEventListener('popupshow', onPopupShow, false);
	tau.openPopup([secondPopup]);
}

function openPopupTest2() {
	var firstPopup = document.getElementById('popup1'),
	onPopupShow = function() {
		document.removeEventListener('popupshow', onPopupShow, false);
		equal(document.getElementsByClassName('ui-popup-active')[0], firstPopup, 'popup1 was opened');
		start();
		asyncTest ( "tau.openPopup jQuery" , 1, openPopupTest3);
	}
	document.addEventListener('popupshow', onPopupShow, false);
	tau.openPopup(firstPopup);
}

function openPopupTest() {
	var second = document.getElementById('second'),
		onChangePage = function() {
			document.removeEventListener('pagechange', onChangePage, false);
			equal(document.getElementsByClassName('ui-page-active')[0], second, 'Page was changed');
			start();
		}
	document.addEventListener('pagechange', onChangePage, false);
	tau.changePage(second);
	
	asyncTest ( "tau.openPopup" , 1, openPopupTest2);
}

test ( "tau.navigator.autoInitialize set" , function () {
	ok(!document.getElementsByClassName('ui-page-active')[0], 'not initialize page');

	asyncTest ( "tau.navigator.autoInitialize not set" , 1, function () {
		var first = document.getElementById('first'),
			onShowPage = function() {
			document.removeEventListener('pageshow', onShowPage, false);
				equal(document.getElementsByClassName('ui-page-active')[0], first, 'Page was changed');
				start();
				asyncTest ( "tau.changePage" , 1, openPopupTest);
			}
		document.addEventListener('pageshow', onShowPage, false);
		tau.noConflict();
		tau = undefined;
		ej.engine.run();
	});
});