$().ready(function() {
	module("button", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test ( "Button" , function () {
		var button = document.getElementById('button-0'),
			eventsCalled = {};

		$(document).on("buttonbeforecreate buttoncreate", function(e) {
			eventsCalled[e.type] = true;
		});

		//after build
		$(button).button();
		equal(button.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(eventsCalled.buttonbeforecreate, 'buttonbeforecreate called');
		ok(eventsCalled.buttoncreate, 'buttoncreate called');
		$(document).off("buttonbeforecreate buttoncreate");
	});
	test ( "Button - Inline" , function () {
		var button1 = document.getElementById('button-1');

		//after build
		$(button1).button();
		equal(button1.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button1.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button1.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');

	});
	test ( "Button - refresh" , function () {
		var button1 = document.getElementById('button-1');

		//after build
		$(button1).button();
		$(button1).button('option', 'inline', false);
		$(button1).button('refresh');
		equal(button1.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button1.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button1.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');

	});
	test ( "Button - Inline, Icon" , function () {
		var button2 = document.getElementById('button-2');

		//after build
		$(button2).button();
		equal(button2.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button2.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button2.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');
		ok($(button2).children().children().first().hasClass('ui-btn-text-padding-left'), 'Button has ui-btn-text-padding-left class');

	});
	test ( "Button - Inline, Call Icon, Icon Position(Right)" , function () {
		var button3 = document.getElementById('button-3');

		//after build
		$(button3).button();
		equal(button3.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button3.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button3.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');
		ok($(button3).children().children().first().hasClass('ui-btn-text-padding-right'), 'Button has ui-btn-text-padding-right class');
	});
	test ( "Button - Inline, Only Icon(Reveal)" , function () {
		var button4 = document.getElementById('button-4');

		//after build
		$(button4).button();
		equal(button4.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button4.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button4.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');
		ok(button4.classList.contains('ui-btn-icon_only'), 'Button has ui-btn-icon_only class');
	});
	test ( "Button - Inline, Only Icon(Send), circle" , function () {
		var button5 = document.getElementById('button-5'),buttonStyle,hasClass;

		//after build
		$(button5).button();
		equal(button5.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button5.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button5.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');
		ok(button5.classList.contains('ui-btn-icon_only'), 'Button has ui-btn-icon_only class');
		buttonStyle = button5.getAttribute('data-style');
		if ( buttonStyle !== undefined ) {
			switch ( buttonStyle ) {
			case "circle" :
				hasClass = " .ui-btn-corner-circle, .ui-btn-icon_only";
				break;
			case "edit" :
				hasClass = " .ui-btn-edit";
				break;
			case "nobg" :
				hasClass = " .ui-btn-icon-nobg, .ui-btn-icon_only";
				break;
			}
			ok( $(button5).children().is( hasClass ), 'Button has ' + hasClass + 'class');
		}
	});
	test ( "Button - Inline, Only Icon(Favorite), nobackground" , function () {
		var button6 = document.getElementById('button-6'),buttonStyle,hasClass;

		//after build
		$(button6).button();
		equal(button6.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button6.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button6.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');
		ok(button6.classList.contains('ui-btn-icon_only'), 'Button has ui-btn-icon_only class');
		buttonStyle = button6.getAttribute('data-style');
		if ( buttonStyle !== undefined ) {
			switch ( buttonStyle ) {
			case "circle" :
				hasClass = " .ui-btn-corner-circle, .ui-btn-icon_only";
				break;
			case "edit" :
				hasClass = " .ui-btn-edit";
				break;
			case "nobg" :
				hasClass = " .ui-btn-icon-nobg, .ui-btn-icon_only";
				break;
			}
			ok( $(button6).children().is( hasClass ), 'Button has ' + hasClass + 'class');
		}
	});
	test("Button - Enabled state", function () {
		var button7 = document.getElementById('button-7');

		//after build
		$(button7).button();
		equal(button7.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button7.classList.contains('ui-btn'), 'Button has ui-btn class');

		ok(!button7.classList.contains('ui-disabled'), 'Button hasn\'t ui-disabled class');
		ok(!button7.getAttribute('disabled'), 'Button hasn\'t disabled attribute');
		equal(button7.getAttribute('aria-disabled'), "false", "Button aria-disabled attribute is false");
	});
	test("Button - Disabled state", function () {
		var button8 = document.getElementById('button-8');

		//after build
		$(button8).button();
		equal(button8.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button8.classList.contains('ui-btn'), 'Button has ui-btn class');

		ok(button8.classList.contains('ui-disabled'), 'Button has ui-disabled class');
		ok(button8.getAttribute('disabled'), 'Button has disabled attribute');
		equal(button8.getAttribute('aria-disabled'), "true", "Button aria-disabled attribute is true");
	});
	test('Focus events', function () {
		var buttonA = $('#button-9a'),
			buttonB = $('#button-9b'),
			buttonC = $('#button-9c');
		buttonA.button();
		buttonB.button();
		buttonA.trigger('focus');
		ok(buttonA.parent().hasClass('ui-focus'), 'Enabled button can be focused');
		buttonB.trigger('focus');
		ok(buttonB.parent().hasClass('ui-focus'), 'Enabled button can be focused');
		ok(!buttonA.parent().hasClass('ui-focus'), 'Previous focused button lost focus');
		buttonC.trigger('focus');
		ok(!buttonC.parent().hasClass('ui-focus'), 'Disabled button cannot be focused');
	});
	test('vmouse events', function () {
		var buttonA = $('#button-10a');
		buttonA.button();
		ej.utils.events.trigger(buttonA[0], 'vmousedown')
		ok(buttonA.parent().hasClass('ui-btn-down-s'), 'Button is pressed');
		ok(!buttonA.parent().hasClass('ui-btn-up-s'), 'Button is pressed');
		ej.utils.events.trigger(buttonA[0], 'vmouseup')
		ok(buttonA.parent().hasClass('ui-btn-up-s'), 'Button is not pressed');
		ok(!buttonA.parent().hasClass('ui-btn-down-s'), 'Button is not pressed');
		ej.utils.events.trigger(buttonA[0], 'vmouseover')
		ok(buttonA.parent().hasClass('ui-btn-hover-s'), 'Button is in hover state');
		ok(!buttonA.parent().hasClass('ui-btn-up-s'), 'Button is in hover state');
		ej.utils.events.trigger(buttonA[0], 'vmouseout')
		ok(buttonA.parent().hasClass('ui-btn-up-s'), 'Button is not in hover state');
		ok(!buttonA.parent().hasClass('ui-btn-hover-s'), 'Button is not in hover state');
	});
	test('load themes', function () {
		var buttonA = $('#button-11'),
			buttonB = $('#button-12');
		buttonA.button();
		buttonB.button();
		ok(buttonA.parent().hasClass('ui-btn-box-a'), 'Button has a theme');
		ok(buttonB.parent().hasClass('ui-btn-box-s'), 'Button has s theme');
	});
});