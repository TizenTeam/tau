/*global jQuery, module, asyncTest, test, equal, deepEqual, ok, CustomEvent, start, stop */
(function (tau, $) {
	"use strict";

	module('profile/mobile/widget/mobile/Checkboxradio', {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test('Default checkboxradio', 4, function () {
		var check = document.getElementById('test1'),
			eventsCalled = {};

		$(document).on("checkboxradiobeforecreate checkboxradiocreate", function (e) {
			eventsCalled[e.type] = true;
		});
		$(check).checkboxradio();
		equal(check.getAttribute('data-tau-bound'), "Checkboxradio", "Check widget is created");
		equal($(check).closest("div[role='radio'].ui-radio.favorite").length, 1, "Wrapped");
		ok(eventsCalled.checkboxradiobeforecreate, 'checkboxradiobeforecreate called');
		ok(eventsCalled.checkboxradiocreate, 'checkboxradiocreate called');
		$(document).off("checkboxradiobeforecreate checkboxradiocreate");
	});

	test('Checkboxradio without label', 3, function () {
		var check = document.getElementById('test2');
		$(check).checkboxradio();
		equal(check.getAttribute('data-tau-bound'), "Checkboxradio", "Check widget is created");
		ok(document.querySelector("label[for='test2']"), "Empty label is created");
		equal($(check).closest("div[role='checkbox'].ui-checkbox").length, 1, "Wrapped");
	});

	test('Checkbox state', 6, function () {
		var check1 = document.getElementById('test3a'),
			label1 = document.querySelector('label[for="test3a"]'),
			check2 = document.getElementById('test3b'),
			label2 = document.querySelector('label[for="test3b"]');
		$(check1).checkboxradio();
		$(check2).checkboxradio();
		equal(check1.parentNode.getAttribute('aria-checked'), "true", "Check widget is checked");
		ok(label1.classList.contains('ui-checkbox-on'), 'Label properly checked');
		equal(label1.getElementsByClassName('ui-icon-checkbox-on').length, 1, "There is a proper icon");
		equal(check2.parentNode.getAttribute('aria-checked'), "false", "Check widget is not checked");
		ok(label2.classList.contains('ui-checkbox-off'), 'Label properly checked');
		equal(label2.getElementsByClassName('ui-icon-checkbox-off').length, 1, "There is a proper icon");
	});

	test('Radio state', 6, function () {
		var check1 = document.getElementById('test4a'),
			label1 = document.querySelector('label[for="test4a"]'),
			check2 = document.getElementById('test4b'),
			label2 = document.querySelector('label[for="test4b"]');
		$(check1).checkboxradio();
		$(check2).checkboxradio();
		equal(check1.parentNode.getAttribute('aria-selected'), "true", "Check widget is checked");
		ok(label1.classList.contains('ui-radio-on'), 'Label properly checked');
		equal(label1.getElementsByClassName('ui-icon-radio-on').length, 1, "There is a proper icon");
		equal(check2.parentNode.getAttribute('aria-selected'), "false", "Check widget is not checked");
		ok(label2.classList.contains('ui-radio-off'), 'Label properly checked');
		equal(label2.getElementsByClassName('ui-icon-radio-off').length, 1, "There is a proper icon");
	});

	test('Disabled state', 4, function () {
		var check1 = document.getElementById('test5a'),
			check2 = document.getElementById('test5b'),
			wrapper1,
			wrapper2;
		$(check1).checkboxradio();
		wrapper1 = check1.parentNode;
		$(check2).checkboxradio();
		$(check2).checkboxradio();//called againt to check if disabled option is not set incorrectly
		wrapper2 = check2.parentNode;
		equal(check1.getAttribute('disabled'), "true", "Disabled");
		ok(wrapper1.classList.contains('ui-disabled'), 'Wrapper has proper class');
		ok(!check2.getAttribute('disabled'), "Disabled");
		ok(!wrapper2.classList.contains('ui-disabled'), 'Wrapper has proper class');
	});

	test('Horizontal checkbox', 2, function () {
		var check1 = document.getElementById('test6a'),
			label1 = document.querySelector('label[for="test6a"]'),
			check2 = document.getElementById('test6b'),
			label2 = document.querySelector('label[for="test6b"]');
		$(check1).checkboxradio();
		$(check2).checkboxradio();
		ok(label1.classList.contains('ui-btn-active'), 'Checked checkbox has label with proper class');
		ok(!label2.classList.contains('ui-btn-active'), 'Unchecked checkbox has label with proper class');
	});

	test('Checkbox label events', 12, function () {
		var check1 = document.getElementById('test7a'),
			check2 = document.getElementById('test7b'),
			labelEnabled = document.querySelector("label[for='test7a']"),
			labelDisabled = document.querySelector("label[for='test7b']");
		$(check1).checkboxradio();
		$(check2).checkboxradio();

		tau.event.trigger(labelEnabled, "vclick");
		ok(check1.checked, "Checkbox was checked");
		ok(labelEnabled.classList.contains('ui-checkbox-on'), 'Label properly checked: has ui-checkbox-on');
		ok(!labelEnabled.classList.contains('ui-checkbox-off'), 'Label properly checked: no ui-checkbox-off');
		equal(check1.parentNode.getAttribute('aria-checked'), "true", "Check widget is checked");
		equal(labelEnabled.getElementsByClassName('ui-icon-checkbox-on').length, 1, "There is a proper icon");
		equal(labelEnabled.getElementsByClassName('ui-icon-checkbox-off').length, 0, "There is a proper icon");

		tau.event.trigger(labelDisabled, "vclick");
		ok(!check2.checked, "Checkbox wasn't checked - it is disabled");
		ok(!labelDisabled.classList.contains('ui-checkbox-on'), 'Label properly checked: no ui-checkbox-on');
		ok(labelDisabled.classList.contains('ui-checkbox-off'), 'Label properly checked: has ui-checkbox-off');
		equal(check2.parentNode.getAttribute('aria-checked'), "false", "Check widget is checked");
		equal(labelDisabled.getElementsByClassName('ui-icon-checkbox-off').length, 1, "There is a proper icon");
		equal(labelDisabled.getElementsByClassName('ui-icon-checkbox-on').length, 0, "There is a proper icon");
	});

	test('Radio label events', 12, function () {
		var check1 = document.getElementById('test8a'),
			check2 = document.getElementById('test8b'),
			labelEnabled = document.querySelector("label[for='test8a']"),
			labelDisabled = document.querySelector("label[for='test8b']");
		$(check1).checkboxradio();
		$(check2).checkboxradio();

		tau.event.trigger(labelEnabled, "vclick");
		ok(check1.checked, "Radio was checked");
		ok(labelEnabled.classList.contains('ui-radio-on'), 'Label properly checked: has ui-radio-on');
		ok(!labelEnabled.classList.contains('ui-radio-off'), 'Label properly checked: no ui-radio-off');
		equal(check1.parentNode.getAttribute('aria-selected'), "true", "Check widget is checked");
		equal(labelEnabled.getElementsByClassName('ui-icon-radio-on').length, 1, "There is a proper icon");
		equal(labelEnabled.getElementsByClassName('ui-icon-radio-off').length, 0, "There is a proper icon");

		tau.event.trigger(labelDisabled, "vclick");
		ok(!check2.checked, "Radio wasn't checked - it is disabled");
		ok(!labelDisabled.classList.contains('ui-radio-on'), 'Label properly checked: no ui-radio-on');
		ok(labelDisabled.classList.contains('ui-radio-off'), 'Label properly checked: has ui-radio-off');
		equal(check2.parentNode.getAttribute('aria-selected'), "false", "Check widget is checked");
		equal(labelDisabled.getElementsByClassName('ui-icon-radio-off').length, 1, "There is a proper icon");
		equal(labelDisabled.getElementsByClassName('ui-icon-radio-on').length, 0, "There is a proper icon");
	});

	test('Enable/disable checkboxradio', 8, function () {
		var check1 = document.getElementById('test9a'),
			check2 = document.getElementById('test9b');

		$(check1).checkboxradio();
		$(check2).checkboxradio();

		$(check1).checkboxradio('enable');
		equal($(check1).prop('disabled'), false, 'Input must have disabled property set to false when enabled');
		ok(!$(check1).parent().hasClass('ui-disabled'), 'Input wrapper must hot have ui-disabled class when enabled');
		$(check1).checkboxradio('disable');
		equal($(check1).prop('disabled'), true, 'Input must have disabled property set to true when disabled');
		ok($(check1).parent().hasClass('ui-disabled'), 'Input wrapper must have ui-disabled class when enabled');

		$(check2).checkboxradio('disable');
		equal($(check2).prop('disabled'), true, 'Input must have disabled property set to true when disabled');
		ok($(check2).parent().hasClass('ui-disabled'), 'Input wrapper must have ui-disabled class when enabled');
		$(check2).checkboxradio('enable');
		equal($(check2).prop('disabled'), false, 'Input must have disabled property set to false when enabled');
		ok(!$(check2).parent().hasClass('ui-disabled'), 'Input wrapper must hot have ui-disabled class when enabled');
	});

	asyncTest('Checkboxradio events', 2, function () {
		var checkA = document.getElementById('test10a'),
			checkB = document.getElementById('test10b'),
			labelA = document.querySelector("label[for='test10a']"),
			labelB = document.querySelector("label[for='test10b']"),
			events = tau.event;

		$(checkA).checkboxradio();
		$(checkB).checkboxradio();

		checkA.addEventListener('change', function () {
			ok(true, 'Click on checkboxradio A label should trigger change event on input element');
		});

		checkB.addEventListener('change', function () {
			ok(true, 'Click on checkboxradio B label should trigger change event on input element');
		});

		start();
		events.trigger(labelA, 'click');
		events.trigger(labelB, 'click');
	});
} (window.tau, jQuery));