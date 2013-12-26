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
		var JSONData = JSON.parse(evt) , bindedArray = document.querySelectorAll('[data-bind]'), tempObj, bind, tagName, value;

		for (var i in bindedArray) {
			if( !isNaN( i ) ) {
				if (bindedArray.hasOwnProperty(i)) {
					tempObj = bindedArray[i];
					bind = JSON.parse(tempObj.getAttribute('data-bind'));
					tagName =tempObj.tagName;
					if( !bind.key ) {
						value = JSONData[bind.text];
						switch( tagName ) {
							case "IMG" : tempObj.setAttribute("src", value); break;
							default : tempObj.innerText = value; break;
						}
					} else {
						tempObj.innerText = bind.key;
					}
				}
			}
		}
	}, false);
}(window, window.document));
