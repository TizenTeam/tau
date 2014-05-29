/*global module, test, $, equal, ej, ok, start, stop, MouseEvent */
(function (ns) {
	"use strict";

	module('Dialog', {
		setup: function () {
			ns.engine._clearBindings();
		}
	});

	asyncTest('Dialog1', function() {
		var dialogContent = document.getElementById('dialogContent'),
			dialogBinding;
		function onDialogCreated(){
			document.body.removeEventListener('pagechange', onDialogCreated);
			start();
			dialogBinding = ns.engine.getBinding(dialogContent);

			ok(dialogContent.offsetHeight > 0, 'Is background visible');
			ok(dialogContent.offsetWidth > 0, 'Is background visible');
			ok(dialogContent.classList.contains(ns.widget.mobile.Dialog.classes.uiDialog), 'Is dialog classe added to the container');
			ok(dialogContent.className.match(/ui-overlay/i) !== null, 'Is background dimmed');

			dialogBinding.close();
		}

		document.getElementById('open').addEventListener('click', function(){
			document.body.addEventListener('pagechange', onDialogCreated);
			ns.engine.instanceWidget(document.getElementById('dialogContent'), 'Dialog');
			dialogBinding = ns.engine.getBinding('dialogContent');
		});
		// dialogContent.addEventListener('pageshow',onDialogCreated);
		document.getElementById('open').click();


	});


	asyncTest('Dialog closed', function() {
		var dialogContent2 = document.getElementById('dialogContent2'),
			dialogBinding2;

		function onDialogClosed (event){
			start();
			//document.getElementById('mainPage').removeEventListener('pageshow', onDialogClosed);
			document.body.removeEventListener('pagechange', onDialogClosed);

			ok(dialogContent2.offsetHeight === 0, 'Background is not visible');
			ok(dialogContent2.offsetWidth === 0, 'Background is not visible');
			// ok(dialogContent2.className.match(/ui-overlay/i) === null, 'Is overlay hidden');
		}

		function onDialogOpen (event){
			dialogBinding2 = ns.engine.getBinding('dialogContent2');
			document.body.removeEventListener('pagechange', onDialogOpen);
			document.body.addEventListener('pagechange', onDialogClosed);
			dialogBinding2.close();
		}

		document.getElementById('open2').addEventListener('click', function(){
			ns.engine.instanceWidget(document.getElementById('dialogContent2'), 'Dialog');
			document.body.addEventListener('pagechange', onDialogOpen);
		});

		window.setTimeout(function(){document.getElementById('open2').click();}, 100);
	});


} (window.ej));