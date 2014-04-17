/*jslint browser: true, white: true */
/**
 * Test script
 * Run this script to test card (e.g. copy/paste & run it in Google Chrome JS Console)
//--- Start of test script
 var cardData = {
		"msgId":"card-contact-req",
		"name": "Suzy, Bae",
		"photo": "images/suzy.png",
		"description": "reporter from magazine",
		"contacts": [{
			"type": "mobile",
			"value": "+82-12345-6789"
		},{
			"type": "home",
			"value": "031-12345-6789"
		},{
			"type": "office",
			"value": "02-8888-9954"
		}]
};

var e = new CustomEvent('carddata', {detail: cardData});
window.dispatchEvent(e);
 //--- End of test script
 */
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