/*global window, console */
/*jslint plusplus: true */
(function (window, document) {
	"use strict";

	var days = [
			'M', 'T', 'W', 'Th', 'F', 'S', 'Sn'
		],
		months = [
			'January', 'February', 'March', 'April', 'May', 'June', 'July',
			'August', 'September', 'October', 'November', 'December'
		];

	function pad(number) {
		return number < 10 ? '0' + number : number;
	}

	function makeCalendar(element) {
		var monthOffset = parseInt(element.getAttribute('data-monthOffset'), 10) || 0,
			now = new Date(),
			start = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1),
			end = new Date(start.getFullYear(), start.getMonth() + monthOffset + 1, 0),
			node = document.createElement('div'),
			current = null,
			i,
			l;

		/*
		current = node.cloneNode();
		current.setAttribute('class', 'month');
		current.textContent = months[start.getMonth()];
		element.appendChild(current);
		*/

		for (i = 0; i < 7; i++) {
			current = node.cloneNode();

			current.setAttribute('class', 'header');
			current.textContent = days[i];

			element.appendChild(current);
		}

		for (i = 0, l = end.getDate(); i < l; i++) {
			current = node.cloneNode();
			if (i === 0) {
				current.setAttribute('style', 'margin-left: ' + (start.getDay() * 14 + 2) + '%;');
			}
			current.textContent = pad(i + 1);

			if ((i + 1) < now.getDate()) {
				current.setAttribute('class', 'past');
			} else if ((i + 1) === now.getDate()) {
				current.setAttribute('class', 'today');
			} else {
				current.setAttribute('class', 'future');
			}

			if ((i + start.getDay() + 1) % 7 === 1) {
				current.classList.add('sunday');
			}

			element.appendChild(current);
		}

	}

	[].slice.call(document.querySelectorAll('.calendar-widget')).forEach(function (element) {
		makeCalendar(element);
	});
}(window, window.document));
