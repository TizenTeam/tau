/*jslint browser: true */
/*global themeEditor, properties*/

window.onload = function () {
	'use strict';
	themeEditor.init(properties);

	document.getElementById('badgeHeightSlider').onchange = function (e) {
		var element = e.srcElement || e.target,
			globalSettings = document.getElementById('globalBadgeHeight').checked;

		themeEditor.badgePreview.resizeViewport(undefined, element.value, undefined, globalSettings);
		element.parentNode.querySelector('.current-value').innerHTML = element.value + 'px';
	};

	document.getElementById('badgeWidthSlider').onchange = function (e) {
		var element = e.srcElement || e.target,
			globalSettings = document.getElementById('globalBadgeWidth').checked;

		themeEditor.badgePreview.resizeViewport(element.value, undefined, undefined, globalSettings);
		element.parentNode.querySelector('.current-value').innerHTML = element.value + ' px';
	};

	document.getElementById('zoomSlider').onchange = function (e) {
		var element = e.srcElement || e.target;

		themeEditor.badgePreview.zoomViewport(element.value, undefined, undefined, true);
		element.parentNode.querySelector('.current-value').innerHTML = element.value + '%';
	};


};
