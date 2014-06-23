/*global ok, equal, module, test, $, jQM2, Element, Window, Document, ej, console */
/*jslint forin: true*/
module("docs");

(function () {
	"use strict";
	var xhrObj = new XMLHttpRequest(),
		docs,
		structureDocs = {},
		key,
		key2;
	// open and send a synchronous request
	xhrObj.open('GET', '../../../tmp/dox.json', false);
	xhrObj.send();
	// add the returned content to a newly created script tag
	docs = JSON.parse(xhrObj.responseText);
	console.log(docs);

	function checkProperty(orginalObject, docsObject, name, message, key, inClass) {
		var key2,
			object,
			fullName = name + (key ? '.' + key : ''),
			messageFullName = message + (key ? '.' + key : '');
		if (typeof orginalObject === 'object' && !inClass) {
			test(messageFullName, function () {
				var i;
				ok(docsObject[name], message + ' exists');
				for (i in orginalObject) {
					checkProperty(orginalObject[i], docsObject, fullName, messageFullName, i, false);
				}
			});
		} else if (((typeof orginalObject === 'function') && docsObject[fullName]) && !inClass) {
			test(messageFullName, function () {
				var i;
				ok(docsObject[fullName], messageFullName + ' exists');
				for (i in orginalObject.prototype) {
					if (orginalObject.prototype.hasOwnProperty(i)) {
						checkProperty(orginalObject.prototype[i], docsObject, fullName, messageFullName, i, true)
					}
				}
			});
		} else {
			ok(docsObject[name] && docsObject[name][key], message + '#' + key + ' exists');
		}
	}

	for (key in docs) {
		if (docs.hasOwnProperty(key)) {
			structureDocs[docs[key].name] = {};
			for (key2 in docs[key].methods) {
				if (docs[key].methods.hasOwnProperty(key2)) {
					structureDocs[docs[key].name][docs[key].methods[key2].name] = docs[key];
				}
			}
			for (key2 in docs[key].properties) {
				if (docs[key].properties.hasOwnProperty(key2)) {
					structureDocs[docs[key].name][docs[key].properties[key2].name] = docs[key];
				}
			}
		}
	}

	checkProperty(ej, structureDocs, 'ns', 'ej');
}());