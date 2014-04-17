/*global window, console, test, equal, module, ej, asyncTest, start, HTMLElement, HTMLDivElement */
/*jslint nomen: true */
(function (window, document) {
	"use strict";

	var page = null,
		popup1Link = null,
		popup1 = null,
		popup1Widget = null,
		PopupClass = ej.widget.wearable.Popup,
		engine = ej.engine;

	function testPopup(title, testCallback, noAutoStart) {
		asyncTest(title, function () {
			var callback = function () {
				page.removeEventListener('pageshow', callback, false);
				testCallback();
				if (!noAutoStart) {
					start();
				}
			};
			page.addEventListener('pageshow', callback, false);
		});
	}

	function testPopupMarkup(popup, element) {
		var opts = popup.options,
			ui = popup.ui,
			header = ui.header,
			footer = ui.footer,
			content = ui.content;

		equal(popup instanceof PopupClass, true, 'Popup is instance of ns.widget.wearable.Popup');
		equal(popup.element, element, 'Popup element is the same as starting markup element');
			
		if (opts.header !== false) {
			equal(header instanceof HTMLDivElement, true, 'header is a HTMLDivElement');
			equal(header.classList.contains(PopupClass.classes.header), true, 'header contains proper class');
			if (typeof opts.header !== 'boolean') {
				equal(opts.header, header.innerHTML, 'header has content properly set');
			}
		}
		
		if (opts.footer !== false) {
			equal(footer instanceof HTMLDivElement, true, 'footer is a HTMLDivElement');
			equal(footer.classList.contains(PopupClass.classes.footer), true, 'footer contains proper class');
			if (typeof opts.footer !== 'boolean') {
				equal(opts.footer, footer.innerHTML, 'footer has content properly set');
			}
		}

		equal(content instanceof HTMLDivElement, true, 'content is a HTMLDivElement');
		equal(content.classList.contains(PopupClass.classes.content), true, 'content contains proper class');
	}
	
	module('Popup tests', {
		setup: function () {
			popup1Link = document.getElementById("popup1Link");
			popup1 = document.getElementById('popup1');
			page = document.getElementById('test');
			engine.run();
		},
		teardown: function () {
			engine._clearBindings();
		}
	});
	
	testPopup('basic widget creation', function () {
		popup1Widget = engine.getBinding(popup1);
		equal(popup1Widget, null, 'widget not created before user click');
		popup1Link.click();
		popup1Widget = engine.getBinding(popup1);

		testPopupMarkup(popup1Widget, popup1);
	});

	testPopup('widget creation with header and footer in data attributes', function () {
		popup1Widget = engine.getBinding(popup1);
		equal(popup1Widget, null, 'widget not created before user click');
		popup1.setAttribute('data-header', 'Test header');
		popup1.setAttribute('data-footer', 'Test footer');
		popup1Link.click();
		popup1Widget = engine.getBinding(popup1);

		testPopupMarkup(popup1Widget, popup1);
	});
	
	testPopup('widget creation with header and footer passed by options', function () {
		var header = document.createElement('div'),
			footer = document.createElement('div'),
			popupMarkup = '';

		popup1Widget = engine.getBinding(popup1);
		equal(popup1Widget, null, 'widget not created before user click');

		engine.instanceWidget(popup1, 'popup', {header: 'testi content header', footer: 'test footer content'});
		popup1Link.click();
		popup1Widget = engine.getBinding(popup1);

		testPopupMarkup(popup1Widget, popup1);

		// lets try tu imitate built widget and test that

		popupMarkup = popup1.outerHTML;

		engine.removeBinding(popup1);

		popup1.parentNode.innerHTML = popupMarkup;

		popup1 = document.getElementById('popup1');
		popup1Widget = engine.instanceWidget(popup1, 'popup', {header: 'testi content header', footer: 'test footer content'});

		testPopupMarkup(popup1Widget, popup1);
	});

	testPopup('widget creation with children and widget methods', function () {
		var display = '',
			visibility = '',
			style = popup1.style;
		popup1.innerHTML = '<span>Hello world!</span>';
		popup1.classList.add(PopupClass.classes.toast);
		popup1Link.click();
		popup1Widget = engine.getBinding(popup1);

		display = style.display;
		visibility = style.visibility;
		ej.utils.events.trigger(window, 'resize');
		popup1Widget.close();
		equal(style.display, display, 'display the same after refresh');
		equal(style.visibility, visibility, 'visibility the same after refresh');

		// recheck refresh if popup was hidden

		display = style.display = 'none';
		visibility = style.visibility;
		popup1Widget.refresh();
		equal(style.display, display, 'display the same after refresh');
		equal(style.visibility, visibility, 'visibility the same after refresh');

		testPopupMarkup(popup1Widget, popup1);
	});
	if (!window.navigator.userAgent.match('PhantomJS')) {
		testPopup('test popup open transition fade', function () {
			expect(2);
			var callbackFinished = function () {
					// this equal is just for qunit not to complain
					equal(true, true, 'show properly run');
					start();
					popup1.removeEventListener(PopupClass.events.show, callbackFinished, false);
				},
				callbackPre = function () {
					// this equal is just for qunit not to complain
					equal(true, true, 'before show properly run');
					popup1.removeEventListener(PopupClass.events.before_show, callbackFinished, false);
				};
			popup1Link.click();
			popup1Widget = engine.getBinding(popup1);
			popup1.addEventListener(PopupClass.events.show, callbackFinished, false);
			popup1.addEventListener(PopupClass.events.before_show, callbackPre, false);
			popup1Widget.open({
				transition: 'fade'
			});
		}, true);

		testPopup('test popup close transition slideup', function () {
			expect(2);
			var callbackFinished = function () {
					// this equal is just for qunit not to complain
					equal(true, true, 'hide properly run');
					start();
					popup1.removeEventListener(PopupClass.events.hide, callbackFinished, false);
				},
				callbackPre = function () {
					// this equal is just for qunit not to complain
					equal(true, true, 'before hide properly run');
					popup1.removeEventListener(PopupClass.events.before_hide, callbackFinished, false);
				};
			popup1Link.click();
			popup1Widget = engine.getBinding(popup1);
			
			popup1.addEventListener(PopupClass.events.hide, callbackFinished, false);
			popup1.addEventListener(PopupClass.events.before_hide, callbackPre, false);
	
			popup1Widget.close({
				transition: 'slideup'
			});
		}, true);
	}
}(window, window.document));
