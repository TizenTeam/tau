	module("button", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test ( "Button" , function () {
		var button = document.getElementById('button-0'),
			eventsCalled = {},
			eventHandler = function(e) {
				eventsCalled[e.type] = true;
			};

		document.addEventListener("buttonbeforecreate", eventHandler);
		document.addEventListener("buttoncreate", eventHandler);

		//after build
		ej.engine.instanceWidget(button, 'Button');
		equal(button.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(eventsCalled.buttonbeforecreate, 'buttonbeforecreate called');
		ok(eventsCalled.buttoncreate, 'buttoncreate called');
		document.removeEventListener("buttonbeforecreate", eventHandler);
		document.removeEventListener("buttoncreate", eventHandler);
	});
	test ( "Button - Inline" , function () {
		var button1 = document.getElementById('button-1');

		//after build
		ej.engine.instanceWidget(button1, 'Button');
		equal(button1.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button1.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button1.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');

	});
	test ( "Button - Inline, Icon" , function () {
		var button2 = document.getElementById('button-2');

		//after build
		ej.engine.instanceWidget(button2, 'Button');
		equal(button2.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button2.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button2.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');
		ok(button2.firstChild.firstChild.classList.contains('ui-btn-text-padding-left'), 'Button has ui-btn-text-padding-left class');

	});
	test ( "Button - Inline, Call Icon, Icon Position(Right)" , function () {
		var button3 = document.getElementById('button-3');

		//after build
		ej.engine.instanceWidget(button3, 'Button');
		equal(button3.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button3.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button3.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');
		ok($(button3).children().children().first().hasClass('ui-btn-text-padding-right'), 'Button has ui-btn-text-padding-right class');
	});
	test ( "Button - Inline, Only Icon(Reveal)" , function () {
		var button4 = document.getElementById('button-4');

		//after build
		ej.engine.instanceWidget(button4, 'Button');
		equal(button4.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button4.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button4.classList.contains('ui-btn-inline'), 'Button has ui-btn-inline class');
		ok(button4.classList.contains('ui-btn-icon_only'), 'Button has ui-btn-icon_only class');
	});
	test ( "Button - Inline, Only Icon(Send), circle" , function () {
		var button5 = document.getElementById('button-5'),buttonStyle,hasClass;

		//after build
		ej.engine.instanceWidget(button5, 'Button');
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
		ej.engine.instanceWidget(button6, 'Button');
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
		ej.engine.instanceWidget(button7, 'Button');
		equal(button7.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button7.classList.contains('ui-btn'), 'Button has ui-btn class');

		ok(!button7.classList.contains('ui-disabled'), 'Button hasn\'t ui-disabled class');
		ok(!button7.getAttribute('disabled'), 'Button hasn\'t disabled attribute');
		equal(button7.getAttribute('aria-disabled'), "false", "Button aria-disabled attribute is false");
	});
	test("Button - Disabled state", function () {
		var button8 = document.getElementById('button-8');

		//after build
		ej.engine.instanceWidget(button8, 'Button');
		equal(button8.getAttribute('data-tau-bound'), "true", "Button widget is created");
		ok(button8.classList.contains('ui-btn'), 'Button has ui-btn class');

		ok(button8.classList.contains('ui-disabled'), 'Button has ui-disabled class');
		ok(button8.getAttribute('disabled'), 'Button has disabled attribute');
		equal(button8.getAttribute('aria-disabled'), "true", "Button aria-disabled attribute is true");
	});
	test('Focus events', function () {
		var buttonA = document.getElementById('button-9a'),
			buttonB = document.getElementById('button-9b'),
			buttonC = document.getElementById('button-9c');
		ej.engine.instanceWidget(buttonA, 'Button');
		ej.engine.instanceWidget(buttonB, 'Button');
		ej.engine.instanceWidget(buttonC, 'Button');
		ok(!buttonA.parentNode.classList.contains('ui-focus'), 'Default button is not focused');
		ok(!buttonB.parentNode.classList.contains('ui-focus'), 'Default button is not focused');
		ok(!buttonC.parentNode.classList.contains('ui-focus'), 'Default button is not focused');
		buttonA.focus();
		ok(buttonA.parentNode.classList.contains('ui-focus'), 'Enabled button can be focused');
		buttonB.focus();
		ok(buttonB.parentNode.classList.contains('ui-focus'), 'Enabled button can be focused');
		ok(!buttonA.parentNode.classList.contains('ui-focus'), 'Previous focused button lost focus');
		buttonC.focus();
		ok(!buttonC.parentNode.classList.contains('ui-focus'), 'Disabled button cannot be focused');
	});
	test('vmouse events', function () {
		var buttonA = document.getElementById('button-10a');
		ej.engine.instanceWidget(buttonA, 'Button');
		ej.event.trigger(buttonA, 'vmousedown');
		ok(buttonA.parentNode.classList.contains('ui-btn-down-s'), 'Button is pressed');
		ok(!buttonA.parentNode.classList.contains('ui-btn-up-s'), 'Button is pressed');
		ej.event.trigger(buttonA, 'vmouseup');
		ok(buttonA.parentNode.classList.contains('ui-btn-up-s'), 'Button is not pressed');
		ok(!buttonA.parentNode.classList.contains('ui-btn-down-s'), 'Button is not pressed');
		ej.event.trigger(buttonA, 'vmouseover');
		ok(buttonA.parentNode.classList.contains('ui-btn-hover-s'), 'Button is in hover state');
		ok(!buttonA.parentNode.classList.contains('ui-btn-up-s'), 'Button is in hover state');
		ej.event.trigger(buttonA, 'vmouseout');
		ok(buttonA.parentNode.classList.contains('ui-btn-up-s'), 'Button is not in hover state');
		ok(!buttonA.parentNode.classList.contains('ui-btn-hover-s'), 'Button is not in hover state');
	});
	test('load themes', function () {
		var buttonA = document.getElementById('button-11'),
			buttonB = document.getElementById('button-12');
		ej.engine.instanceWidget(buttonA, 'Button');
		ej.engine.instanceWidget(buttonB, 'Button');
		ok(buttonA.parentNode.classList.contains('ui-btn-box-a'), 'Button has a theme');
		ok(buttonB.parentNode.classList.contains('ui-btn-box-s'), 'Button has s theme');
	});