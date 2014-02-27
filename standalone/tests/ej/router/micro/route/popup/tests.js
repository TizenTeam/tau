module('router.micro.route.popup');

asyncTest( "test loading scripts in external files", 3, function(){
	var testExternalPopup = function() {
		document.removeEventListener('popupshow', testExternalPopup, false);
		equal(window.testVariableFromExternalFile, true, 'varable from inline script is set');
		equal(window.testVariableFromExternalFileSrc, true, 'varable from js file is set');
		ok(document.querySelector('[data-script]'), 'proper move attribute for script');
		start();
	};
	document.addEventListener('popupshow', testExternalPopup, false);
	gear.ui.openPopup( "path-test/external.html" );
});

asyncTest( "test loading scripts in external files", 1, function(){
	var popupElement = document.getElementById('popup');
	gear.ui.openPopup( '#popup' );
	setTimeout(function() {
		ok(!popupElement.classList.contains('ui-popup-active'), 'popup not open');
		start();
	}, 100);
});