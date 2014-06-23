/*jslint nomen: true */
/*global document:false, window:false,
 module:false, test:false, ok:false, equal:false, $:false,
 dividerTests:false*/
(function (document, ej) {
	'use strict';

	module('Listview autodividers - constructor', {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test('Listview autodividers - constructor', function () {
		var list = document.getElementById('test');

		$(list).listview({
			autodividers: true,
			autodividersSelector: function (li) {
				return $(li).find('.callDate').text() === (new Date())
					? "Today" : $(li).find('.callDate').text();
			}
		}).listview('refresh');
		equal(list.children.length, 5, 'Number of children');
	});

}(document, window.ej));