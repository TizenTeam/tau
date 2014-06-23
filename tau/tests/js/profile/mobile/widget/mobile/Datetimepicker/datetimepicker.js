	module("datetimepicker", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test ( "Datetimepicker, datetime, date-format" , function () {
		var datetimepicker = document.getElementById('test-date'),
			eventsCalled = {},
			element;

		$(document).on("datetimepickerbeforecreate datetimepickercreate", function(e) {
			eventsCalled[e.type] = true;
		});

		//after build
		$(datetimepicker).datetimepicker();

		equal(datetimepicker.getAttribute('data-tau-bound'), "Datetimepicker", "Datetimepicker widget is created");
		ok(datetimepicker.classList.contains('ui-input-text'), 'Datetimepicker has ui-input-text class');
		element = datetimepicker.nextSibling;
		ok(element.classList.contains('ui-datefield'), 'Datetimepicker has ui-datefield class');
		element = element.firstChild.firstChild;
		ok(element.classList.contains('ui-datefield-month'), 'Datetimepicker has ui-datefield-month class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-day'), 'Datetimepicker has ui-datefield-day class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-year'), 'Datetimepicker has ui-datefield-year class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-tab'), 'Datetimepicker has ui-datefield-tab class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-hour'), 'Datetimepicker has ui-datefield-hour class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-separator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-min'), 'Datetimepicker has ui-datefield-min class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-period'), 'Datetimepicker has ui-datefield-period class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(!element, 'Datetimepicker has ui-datefield-tab class');

		ok(eventsCalled.datetimepickerbeforecreate, 'datetimepickerbeforecreate called');
		ok(eventsCalled.datetimepickercreate, 'datetimepickercreate called');
		$(document).off("datetimepickerbeforecreate datetimepickercreate");
	});


	test ( "Datetimepicker, datetime" , function () {
		var datetimepicker = document.getElementById('test-date2'),
			eventsCalled = {},
			element;

		$(document).on("datetimepickerbeforecreate datetimepickercreate", function(e) {
			eventsCalled[e.type] = true;
		});

		//after build
		$(datetimepicker).datetimepicker();

		equal(datetimepicker.getAttribute('data-tau-bound'), "Datetimepicker", "Datetimepicker widget is created");
		ok(datetimepicker.classList.contains('ui-input-text'), 'Datetimepicker has ui-input-text class');
		element = datetimepicker.nextSibling;
		ok(element.classList.contains('ui-datefield'), 'Datetimepicker has ui-datefield class');
		element = element.firstChild.firstChild;
		ok(element.classList.contains('ui-datefield-month'), 'Datetimepicker has ui-datefield-day class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-day'), 'Datetimepicker has ui-datefield-year class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-year'), 'Datetimepicker has ui-datefield-month class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-tab'), 'Datetimepicker has ui-datefield-tab class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-hour'), 'Datetimepicker has ui-datefield-hour class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-separator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-min'), 'Datetimepicker has ui-datefield-min class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-separator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-period'), 'Datetimepicker has ui-datefield-period class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(!element, 'Datetimepicker has ui-datefield-tab class');
		ok(eventsCalled.datetimepickerbeforecreate, 'datetimepickerbeforecreate called');
		ok(eventsCalled.datetimepickercreate, 'datetimepickercreate called');
		$(document).off("datetimepickerbeforecreate datetimepickercreate");
	});

	test ( "Datetimepicker, date" , function () {
		var datetimepicker = document.getElementById('test-date3'),
			eventsCalled = {},
			element;

		$(document).on("datetimepickerbeforecreate datetimepickercreate", function(e) {
			eventsCalled[e.type] = true;
		});

		//after build
		$(datetimepicker).datetimepicker();

		equal(datetimepicker.getAttribute('data-tau-bound'), "Datetimepicker", "Datetimepicker widget is created");
		ok(datetimepicker.classList.contains('ui-input-text'), 'Datetimepicker has ui-input-text class');
		element = datetimepicker.nextSibling;
		ok(element.classList.contains('ui-datefield'), 'Datetimepicker has ui-datefield class');
		element = element.firstChild.firstChild;
		ok(element.classList.contains('ui-datefield-month'), 'Datetimepicker has ui-datefield-day class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-day'), 'Datetimepicker has ui-datefield-year class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-year'), 'Datetimepicker has ui-datefield-month class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(!element, 'Datetimepicker has ui-datefield-tab class');

		ok(eventsCalled.datetimepickerbeforecreate, 'datetimepickerbeforecreate called');
		ok(eventsCalled.datetimepickercreate, 'datetimepickercreate called');
		$(document).off("datetimepickerbeforecreate datetimepickercreate");
	});

	test ( "Datetimepicker, time" , function () {
		var datetimepicker = document.getElementById('test-date4'),
			eventsCalled = {},
			element;

		$(document).on("datetimepickerbeforecreate datetimepickercreate", function(e) {
			eventsCalled[e.type] = true;
		});

		//after build
		$(datetimepicker).datetimepicker();

		equal(datetimepicker.getAttribute('data-tau-bound'), "Datetimepicker", "Datetimepicker widget is created");
		ok(datetimepicker.classList.contains('ui-input-text'), 'Datetimepicker has ui-input-text class');
		element = datetimepicker.nextSibling;
		ok(element.classList.contains('ui-datefield'), 'Datetimepicker has ui-datefield class');
		element = element.firstChild.firstChild;
		ok(element.classList.contains('ui-datefield-hour'), 'Datetimepicker has ui-datefield-month class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-min'), 'Datetimepicker has ui-datefield-day class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-separator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-period'), 'Datetimepicker has ui-datefield-period class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(!element, 'Datetimepicker has ui-datefield-tab class');

		ok(eventsCalled.datetimepickerbeforecreate, 'datetimepickerbeforecreate called');
		ok(eventsCalled.datetimepickercreate, 'datetimepickercreate called');
		$(document).off("datetimepickerbeforecreate datetimepickercreate");
	});

	test ( "Datetimepicker, datetime, date-format" , function () {
		var datetimepicker = document.getElementById('test-date5'),
			eventsCalled = {},
			element;

		$(document).on("datetimepickerbeforecreate datetimepickercreate", function(e) {
			eventsCalled[e.type] = true;
		});

		//after build
		$(datetimepicker).datetimepicker();

		equal(datetimepicker.getAttribute('data-tau-bound'), "Datetimepicker", "Datetimepicker widget is created");
		ok(datetimepicker.classList.contains('ui-input-text'), 'Datetimepicker has ui-input-text class');
		element = datetimepicker.nextSibling;
		ok(element.classList.contains('ui-datefield'), 'Datetimepicker has ui-datefield class');
		element = element.firstChild.firstChild;
		ok(element.classList.contains('ui-datefield-month'), 'Datetimepicker has ui-datefield-month class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-day'), 'Datetimepicker has ui-datefield-day class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-year'), 'Datetimepicker has ui-datefield-year class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-tab class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-hour'), 'Datetimepicker has ui-datefield-hour class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-separator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-min'), 'Datetimepicker has ui-datefield-min class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-period'), 'Datetimepicker has ui-datefield-period class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(!element, 'Datetimepicker has ui-datefield-tab class');

		ok(eventsCalled.datetimepickerbeforecreate, 'datetimepickerbeforecreate called');
		ok(eventsCalled.datetimepickercreate, 'datetimepickercreate called');
		$(document).off("datetimepickerbeforecreate datetimepickercreate");
	});

	test ( "Datetimepicker, datetime, date-format" , function () {
		var datetimepicker = document.getElementById('test-date6'),
			eventsCalled = {},
			element;

		$(document).on("datetimepickerbeforecreate datetimepickercreate", function(e) {
			eventsCalled[e.type] = true;
		});

		//after build
		$(datetimepicker).datetimepicker();

		equal(datetimepicker.getAttribute('data-tau-bound'), "Datetimepicker", "Datetimepicker widget is created");
		ok(datetimepicker.classList.contains('ui-input-text'), 'Datetimepicker has ui-input-text class');
		element = datetimepicker.nextSibling;
		ok(element.classList.contains('ui-datefield'), 'Datetimepicker has ui-datefield class');
		element = element.firstChild.firstChild;
		ok(element.classList.contains('ui-datefield-month'), 'Datetimepicker has ui-datefield-month class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-day'), 'Datetimepicker has ui-datefield-day class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-seperator'), 'Datetimepicker has ui-datefield-seperator class');
		ok(!element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(element.classList.contains('ui-datefield-year'), 'Datetimepicker has ui-datefield-year class');
		ok(element.classList.contains('ui-btn'), 'Datetimepicker has ui-btn class');
		element = element.nextSibling;
		ok(!element, 'Datetimepicker has ui-datefield-tab class');

		ok(eventsCalled.datetimepickerbeforecreate, 'datetimepickerbeforecreate called');
		ok(eventsCalled.datetimepickercreate, 'datetimepickercreate called');
		$(document).off("datetimepickerbeforecreate datetimepickercreate");
	});

	function makeTwoDigits(val) {
		var ret = val.toString(10);
		if (val < 10) {
			ret = "0" + ret;
		}
		return ret;
	}

	function timetoString(time) {
		return makeTwoDigits(time.getHours()) + ':' +
			makeTwoDigits(time.getMinutes()) + ':' +
			makeTwoDigits(time.getSeconds());
	}

	function dateToString(date) {
		return ((date.getFullYear() % 10000 ) + 10000).toString().substr(1) + '-' +
			makeTwoDigits(date.getMonth() + 1) + '-' +
			makeTwoDigits(date.getDate());
	}

	test ( "Datetimepicker, methods" , function () {
		var datetimepicker = document.getElementById('test-date2'),
			$datetimepicker = $(datetimepicker),
			date = new Date();

		$datetimepicker.datetimepicker();

		equal($datetimepicker.datetimepicker('value', date), $datetimepicker, 'Datetimepicker set value');
		equal($datetimepicker.datetimepicker('value'), dateToString(date)+'T'+timetoString(date), 'Datetimepicker get value');

		equal($datetimepicker.datetimepicker('option', 'date', date), $datetimepicker, 'Datetimepicker set date');
		equal($datetimepicker.datetimepicker('option', 'date').getTime(), date.getTime(), 'Datetimepicker get date');

		equal($datetimepicker.datetimepicker('option', 'date', date.toString()), $datetimepicker, 'Datetimepicker set date (string)');
		equal($datetimepicker.datetimepicker('option', 'date').getTime(), new Date(date.toString()).getTime(), 'Datetimepicker get date (string)');

		equal($datetimepicker.datetimepicker('option', 'format', 'yyyy-mm-dd'), $datetimepicker, 'Datetimepicker set format');
		equal($datetimepicker.datetimepicker('option', 'format'), 'yyyy-mm-dd', 'Datetimepicker get format');

		equal($datetimepicker.datetimepicker('option', 'type', 'date'), $datetimepicker, 'Datetimepicker set type');
		equal($datetimepicker.datetimepicker('option', 'type'), 'date', 'Datetimepicker get type');

		equal($datetimepicker.datetimepicker('option', 'type', 'datewrong'), $datetimepicker, 'Datetimepicker set type, wrong value');
		equal($datetimepicker.datetimepicker('option', 'type'), 'datetime', 'Datetimepicker get type, wrong value');

	});

	function testClick(field) {
		var datetimepicker = document.getElementById('test-date2'),
			$datetimepicker = $(datetimepicker),
			date = new Date(),
			btn;
		
		popupCreate = function() {
			document.removeEventListener('circularviewcreate', popupCreate, false);
			ok(true, 'Popup was created');
			equal($datetimepicker.datetimepicker('option', 'date').getMonth(), date.getMonth(), 'Datetimepicker get value');
			ej.event.trigger($('.ui-datetimepicker-selector a').get(3), 'vclick');
		}

		change = function(event) {
			$datetimepicker.get(0).removeEventListener('change', change, false);
			ok(event.detail.newValue, 'Datetimepicker get value');
			start();
		}

		document.addEventListener('circularviewcreate', popupCreate, false);
		$datetimepicker.get(0).addEventListener('change', change, false);

		$datetimepicker.datetimepicker();
		btn = $('.ui-datefield-' + field).get(0);
		ej.event.trigger(btn, 'vclick');
	}

	//asyncTest ( "Datetimepicker, click month" ,3, testClick.bind(null, 'month'));

	asyncTest ( "Datetimepicker, click day" ,3, testClick.bind(null, 'day'));

	asyncTest ( "Datetimepicker, click hour" ,3, testClick.bind(null, 'hour'));

	asyncTest ( "Datetimepicker, click year" ,3, testClick.bind(null, 'year'));

	asyncTest ( "Datetimepicker, click min" ,3, testClick.bind(null, 'min'));
/*
 @TODO correct these tests 
	test ( "Datetimepicker, div, date-type" , function () {
		var datetimepicker = document.getElementById('test-date7');

		//after build
		$(datetimepicker).datetimepicker();

		equal(datetimepicker.getAttribute('data-tau-bound'), "Datetimepicker", "Datetimepicker widget is created");
	});

	test ( "Datetimepicker, div, date-type" , function () {
		var datetimepicker = document.getElementById('test-date8');

		//after build
		$(datetimepicker).datetimepicker();

		equal(datetimepicker.getAttribute('data-tau-bound'), "Datetimepicker", "Datetimepicker widget is created");
	});

	test ( "Datetimepicker, div, date-type" , function () {
		var datetimepicker = document.getElementById('test-date9');

		//after build
		$(datetimepicker).datetimepicker();

		equal(datetimepicker.getAttribute('data-tau-bound'), "Datetimepicker", "Datetimepicker widget is created");
	});
*/
