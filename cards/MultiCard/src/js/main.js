//-- MessageCard
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
			rcv = document.getElementById('received'),
			sender = document.getElementById('sender'),
			rcvtime = document.getElementById('rcvtime'),
			rcvmsg = document.getElementById('rcvmsg'),
			dateTime = new Date(data.received * 1000),
			hour = dateTime.getHours(),
			dayPart = hour >= 0 && hour < 12 ? 0 : 1,
			dayPartString = dayPart === 0 ? 'a.m.' : 'p.m.';

		if (dayPart === 1) {
			hour -= 12;
		}

		rcv.innerHTML = data.rcvinfo;
		sender.innerHTML = data.sender;
		rcvtime.innerHTML = dayPartString + ' ' + hour + ':' + pad(dateTime.getMinutes());
		rcvmsg.innerHTML = data.data;
	}, false);
}(window, window.document));
//-- ContactCard
(function (window, document) {
	'use strict';

	window.addEventListener('tizenhwkey', function (e) {
		if (e.keyName === 'back') {
			window.close();
		}
	}, false);

	window.addEventListener('carddata', function (evt) {
		var	data = evt.detail,
			dataContacts = data.contacts,
			name = document.getElementById('name'),
			photo = document.getElementById('photo'),
			mobile = document.getElementById('mobile'),
			contactTypes = [document.getElementById('contact0Type'),
					document.getElementById('contact1Type'),
					document.getElementById('contact2Type')
					],
			contactValues = [document.getElementById('contact0Value'),
					document.getElementById('contact1Value'),
					document.getElementById('contact2Value')
					],
			i;

		name.innerHTML = data.name;
		photo.src = data.photo;

		for (i = 0; i < 3; i+=1) {
			if (dataContacts[i]) {
				contactTypes[i].innerHTML = typeof dataContacts[i].type ? dataContacts[i].type : "";
				contactValues[i].innerHTML = typeof dataContacts[i].value ? dataContacts[i].value : "";
			} else {
				contactTypes[i].innerHTML = "";
				contactValues[i].innerHTML = "";
			}
		}
		mobile.innerHTML = contactValues[0].innerHTML = typeof dataContacts[0].value ? dataContacts[0].value : "";

	}, false);
}(window, window.document));
//-- WeatherCard
//-- EventCard
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
