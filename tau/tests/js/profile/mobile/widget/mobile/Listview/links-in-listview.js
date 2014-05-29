/*jslint nomen: true */
/*global window:false, document:false,
 test:false, ok:false, equal:false, module:false, deepEqual:false, expect:false,
 $:false, console:false */
(function (document, ej) {
	'use strict';
	module('Listview', {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test('Links in listview', function () {
		var list1 = document.getElementById('list1'),
			list2 = document.getElementById('list2'),
			li;

		equal(list1.getAttribute('data-tau-bound'), "Listview", "List1 widget is created");
		equal(list2.getAttribute('data-tau-bound'), "Listview", "List2 widget is created");
		ok(list1.classList.contains('ui-listview'), 'List1 has ui-listview class');
		ok(list2.classList.contains('ui-listview'), 'List2 has ui-listview class');

		li = document.getElementById('li1_1');
		ok(li.children[0].tagName === 'DIV', 'LI element on List1 has children DIV');

		li = document.getElementById('li2_1');
		ok(li.children.length === 0, 'LI element on List2 has not children');
		li = document.getElementById('li2_2');
		ok(li.children[0].tagName === 'DIV', 'LI element on List2 has children DIV');
	});
}(document, window.ej));
