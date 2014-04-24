/*global module, asyncTest, $, equal, ej, ok, start, stop, MouseEvent */
var events = ej.utils.events;
document.addEventListener('DOMContentLoaded', function(){
	"use strict";
	asyncTest("Contacts", function(){
		var fastScroll = document.getElementsByClassName('ui-fastscroll'),
			contactsUl = document.getElementById('contacts'),
			contactsDividers = contactsUl.getElementsByClassName('ui-li-divider'),
			fastScrollDividers = fastScroll[0].getElementsByTagName('li'),
			popup = document.getElementsByClassName('ui-fastscroll-popup')[0],
			dividerText,
			i,
			length,
			checkIsScrolled,
			afterDestroy,
			widget;

		checkIsScrolled = function(listDivider){
			var scrollClip = contactsUl.parentElement.parentElement,
				contactsListHeight = contactsUl.offsetHeight,
				clipHeight = scrollClip.offsetHeight,
				nextSibling,
				maxOffset,
				lastChild,
				lastChildOffset;
			if (contactsListHeight > clipHeight) {
				nextSibling = listDivider.nextElementSibling;
				while (nextSibling) {
					if (!nextSibling.classList.contains('ui-li-divider')) {
						nextSibling = nextSibling.nextElementSibling;
					} else {
						break;
					}
				}

				if (nextSibling && nextSibling.offsetTop + nextSibling.offsetHeight < contactsListHeight){
					ok(scrollClip.scrollTop === listDivider.offsetTop, "Scroll clip scrolled correctly");
				} else {
					lastChild = contactsUl.children[contactsUl.children.length - 1];
					lastChildOffset = lastChild.offsetTop + lastChild.offsetHeight - listDivider.offsetTop;


					ok((contactsUl.offsetHeight - lastChildOffset) === listDivider.offsetTop, "Scroll clip scrolled correctly");
				}
			} else {
				ej.log("Contacts UL is lower then scroll clip");
			}
		};

		ok(fastScroll.length > 0,"Fastscroll container exists");
		//LI count must be greater by one then contactsDividers.length
		ok(fastScrollDividers.length - 1 === contactsDividers.length, "Dividers number is the same");

		ok(fastScrollDividers[0].innerText === "#", "Check if exists: devider #");

		if (fastScrollDividers.length - 1 === contactsDividers.length && contactsDividers.length > 0) {
			for (i = 1, length = fastScrollDividers.length; i < length; i++) {
				dividerText = fastScrollDividers[i].innerText;
				ok(dividerText === contactsDividers[i - 1].innerText, "Divider " + dividerText + " exists");
				events.trigger(fastScrollDividers[i], "vmouseover");
				ok(popup.style.display === "block", "Popup is visible on mouse over on: divider " + dividerText);

				//TODO this test will fail until scrollview will not be fixed
				// checkIsScrolled(contactsDividers[i - 1]);


				events.trigger(fastScrollDividers[i], "vmouseout");
				ok(popup.style.display === "none", "Popup is visible on mouse over on divider " + dividerText);

			}
		}

		afterDestroy = function (event) {
			start();
			ok(true, '"destroyed" event was triggered on document');
			equal(event.detail.widget, 'Fastscroll', 'destroyed event has detail.widget == "Fastscroll"');
			ok(event.detail.parent !== undefined, 'destroyed event sends parent node as detail.parent');
		};

		document.addEventListener('destroyed', afterDestroy, true);
		$(contactsUl).fastscroll('destroy');
	});
});




