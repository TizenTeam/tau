/* ***************************************************************************
 * Copyright (c) 2000 - 2011 Samsung Electronics Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 *	Author: Wongi Lee <wongi11.lee@samsung.com>
 */

/**
 * Tizen Web UI FW Demo Application.
 * Using Tizen SDK WEB UI FW template and Tizen Device API - Contact. 
 * Demonstrate for developement of Simple Tizen Web Application.
 * Functions : 
 * 		Get the number of current contacts.
 *		Populate contact data.
 *		Delete all contacts.
**/

var defaultAddressbook = null;

/* Progressbar Animation */
function progressbarInit() {
	$("#progressbar").progressbar( "value", 0 );
	$("#pending").progress({ running: true });
}

function progressbarAnimation( max, current ) {
	var cur_potion = Math.ceil( current / max * 100 );
	
	$("#progressbar").progressbar( "value", cur_potion );
}

/* Get All contacts from addressbook */
function onContactSearchSuccess(contacts) {
	$("#contactsNumber").val(contacts.length);
}

function onFindError() {
	console.log ( "[Fail] Contact Device API Fetch Error." );
}

function fetchContacts() {
	defaultAddressbook.find(onContactSearchSuccess, onFindError);
}

/* Push Random contacts */
function onPushContactsSuccess() {
	
}

function onPushContactsFail() {
	
}

function pushContacts( requestNB ) {
	var firstNames = [
			"Kareem",
			"Shareef",
			"Donald",
			"Alex",
			"John",
			"Mark",
			"Joe",
			"Steve",
			"Mike",
			"Leandro",
			"Tony",
			"Mack",
			"Dexter",
			"Devin",
			"Jerry",
			"Dale",
			"Ruben",
			"Winston",
			"Chris",
			"Mickael"
		],
		lastNames = [
			"Abdul-Rauf",
			"Able",
			"Acker",
			"Baker",
			"Bardo",
			"Barnes",
			"Calderon",
			"Carr",
			"Carter",
			"Dark",
			"David",
			"Earl",
			"Edwards",
			"Fisher",
			"Hairston",
			"Jackson",
			"James",
			"Kidd",
			"Nelson",
			"Olowokandi"
		],
		domainNames = [
			"samsung.com",
			"naver.com",
			"daum.net",
			"google.com",
			"msn.com"
		],
		totalRequest = requestNB;

	function pushLoop(){
		if ( requestNB > 0 ) {
			var tfName = firstNames[ Math.floor( Math.random() * 20 ) ],
				tlName = lastNames[ Math.floor( Math.random() * 20 ) ],
				tDomain =domainNames[ Math.floor( Math.random() * 5 ) ],
				tpNumber1 = Math.floor( Math.random() * 99999999 ),
				tpNumber2 = Math.floor( Math.random() * 99999999 ),
				tpNumber3 = Math.floor( Math.random() * 99999999 );

			try {
				contact = new tizen.Contact( {
					name : new tizen.ContactName( {
						firstName : tfName,
						lastName : tlName
					} ),
					emails : [ new tizen.ContactEmailAddress( tlName + "@" + tDomain ) ],
					phoneNumbers : [ new tizen.ContactPhoneNumber( tpNumber1, ["WORK", "VOICE"] ), 
									new tizen.ContactPhoneNumber( tpNumber2, ["HOME", "VOICE"] ), 
									new tizen.ContactPhoneNumber( tpNumber3, ["PREF", "VOICE"] ) ]
				} );
			} catch ( err ) {
				console.log('The following error occurred while creating contact: '+ err.name);
			}

			try {
				defaultAddressbook.add(contact);
				fetchContacts();
			} catch (err) {
				console.log('The following error occurred while adding: ' + err.name);
			}

			progressbarAnimation( totalRequest, totalRequest - requestNB + 1 );
			
			requestNB--;
			
			setTimeout( pushLoop, 10 );
		}

		return;
	}

	setTimeout( pushLoop, 10 );
}

function deleteAllContacts( currentContacts ){
	var totalContacts = currentContacts.length,
		index = 0;

	progressbarInit();

	function deleteLoop( ) {
		if ( totalContacts > 0) {
			try {
				var contact = currentContacts[index];
				defaultAddressbook.remove(contact.id);
				progressbarAnimation( currentContacts.length, index + 1 );
			} catch (e) {
				// Error handling 
				console.log('Error(' + e.name + ') : ' + e.message);
			}

			fetchContacts();
			index++;
			totalContacts--;
			setTimeout( deleteLoop, 10 );
		}
	}

	setTimeout( deleteLoop, 10 );
}

// Initialize function
var init = function() {
	// TODO:: Do your initialization job
	/* Get Default Addressbook from Default Phonebook */
	defaultAddressbook = tizen.contact.getDefaultAddressBook();
	
	if ( defaultAddressbook == null ) {
		/* Fail to get Default Addressbook */
		console.log ( "[Fail] Contact Device API Error.");
		return;
	}
	
	/* Progressbar Initialize */
	progressbarInit();

	/* Event binding */
	$( "#pb_btn_getContacts" ).click( function(){
		fetchContacts();
		progressbarInit();
	} );

	$( "#pb_btn_full" ).click( function() {
		console.log( $( "#NBFullContacts" ).val() );
		pushContacts( $( "#NBFullContacts" ).val() );
	} );
	

	$("#pb_btn_deleteAll").click(function() {
		defaultAddressbook.find(deleteAllContacts, onFindError);
	} );

	return;
};
$(document).ready(init);
