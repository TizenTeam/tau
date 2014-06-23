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
		sender.innerHTML = data.sender;
		rcv.innerHTML = data.rcvinfo;
		rcvtime.innerHTML = dayPartString + ' ' + hour + ':' + pad(dateTime.getMinutes());
		rcvmsg.innerHTML = data.data;
	}, false);
}(window, window.document));
