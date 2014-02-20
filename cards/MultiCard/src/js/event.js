/*jslint browser: true */
(function (window, document) {
	'use strict';

	function pad(value) {
		if (value < 10) {
			return '0' + value;
		}
		return value;
	}

	window.addEventListener('tizenhwkey', function (e) {
		if (e.keyName === 'back') {
			window.close();
		}
	}, false);

	window.addEventListener('carddata', function (evt) {
		var data = evt.detail,
			title = document.getElementById('title'),
			time = document.getElementById('time'),
			dateTime = new Date(data.from * 1000),
			place = document.getElementById('where'),
			comrade = document.getElementById('with'),
			etc = document.getElementById('etc'),
			hour = dateTime.getHours(),
			dayPart = hour >= 0 && hour < 12 ? 0 : 1,
			dayPartString = dayPart === 0 ? 'a.m.' : 'p.m.';

		if (dayPart === 1) {
			hour -= 12;
		}

		title.innerHTML = !data.title || data.title.length === 0 ? 'N/A' : data.title;
		place.innerHTML = !data.place || data.place.length === 0 ? 'N/A' : data.place;
		comrade.innerHTML = !data.companion || data.companion.length === 0 ? 'N/A' : data.companion;
		etc.innerHTML = !data.description || data.description.length === 0 ? 'N/A' : data.description;
		time.innerHTML = dayPartString + ' ' + hour + ':' + pad(dateTime.getMinutes());
	}, false);
}(window, window.document));
