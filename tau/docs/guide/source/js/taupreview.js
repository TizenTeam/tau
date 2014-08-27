/*global window, console */
/*jslint browser: true, plusplus: true */
(function (document) {
	"use strict";
	var previewIDNum = 0,
		TEXTS = {
			"PREVIEW": "preview",
			"PREVIEW_MOBILE": "Preview mobile version",
			"PREVIEW_TV": "Preview tv version",
			"PREVIEW_WEARABLE": "Preview wearable version"
		},
		previewWindows = {
			"wearable": null,
			"mobile": null,
			"tv": null
		},
		windowOptions = {
			"wearable": "height=320,width=320,menubar=no,resizable=no,scrollbars=yes,status=no,titlebar=no,toolbar=no",
			"mobile": "height=640,width=480,menubar=no,resizable=no,scrollbars=yes,status=no,titlebar=no,toolbar=no",
			"tv": "height=540,width=960,menubar=no,resizable=no,scrollbars=yes,status=no,titlebar=no,toolbar=no"
		},
		prettyPrint = window.prettyPrint;

	function buttonHandler(event) {
		var target = event.target,
			type = target.getAttribute("data-type"),
			previewID = target.getAttribute("data-preview"),
			preview = document.querySelector("code[data-preview=p" + previewID + "]"),
			pwindow = previewWindows[type];

		if (pwindow) {
			pwindow.close();
		}

		pwindow = window.open("/preview/" + type + ".html", "", windowOptions[type]);

		pwindow.addEventListener("load", function () {
			try {
				this.loadExample(preview.textContent);
			} catch (e) {
				window.alert("Problem rendering preview");
			}
		});

		previewWindows[type] = pwindow;

		event.stopPropagation();
		event.preventDefault();

		return true;
	}

	function clickHandler(event) {
		if (event.target && event.target.classList.contains("preview_button")) {
			return buttonHandler(event);
		}
		return false;
	}

	function createButton(container, type, previewID, title) {
		var button = document.createElement("a");
		button.setAttribute("class", "preview_button preview_" + type);
		button.setAttribute("data-type", type);
		button.setAttribute("data-preview", previewID);
		button.setAttribute("title", title);

		container.appendChild(button);
	}

	function createButtons() {
		var previews = document.querySelectorAll("pre > code"),
			i = previews.length,
			preview,
			className,
			buttonContainer,
			parent,
			nextSibling,
			span;

		while (--i >= 0) {
			preview = previews.item(i);
			className = preview.className;
			preview.setAttribute("data-preview", "p" + previewIDNum);

			parent = preview.parentNode;
			nextSibling = preview.nextSibling;

			buttonContainer = document.createElement("div");
			buttonContainer.setAttribute("class", "preview_buttons");

			span = document.createElement("span");
			span.textContent = TEXTS.PREVIEW;

			buttonContainer.appendChild(span);

			if (className.indexOf("mobile") > -1) {
				createButton(buttonContainer, "mobile", previewIDNum, TEXTS.PREVIEW_MOBILE);
			}

			if (className.indexOf("wearable") > -1) {
				createButton(buttonContainer, "wearable", previewIDNum, TEXTS.PREVIEW_WEARABLE);
			}

			if (className.indexOf("tv") > -1) {
				createButton(buttonContainer, "tv", previewIDNum, TEXTS.PREVIEW_TV);
			}

			if (nextSibling) {
				parent.insertBefore(buttonContainer, nextSibling);
			} else {
				parent.appendChild(buttonContainer);
			}

			previewIDNum++;
		}
	}

	function prettyPrintHandler() {
		var code = document.querySelectorAll("pre > code"),
			i = code.length;
		while (--i >= 0) {
			code[i].className = "lang-html prettyprint";
		}
		if (prettyPrint) {
			prettyPrint();
		}
	}

	document.addEventListener("DOMContentLoaded", function () {
		createButtons();
		prettyPrintHandler();
	});
	document.addEventListener("click", clickHandler);
}(window.document));
