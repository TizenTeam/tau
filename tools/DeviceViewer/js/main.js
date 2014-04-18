/*jslint browser: true, white: true */
/*global deviceViewer, properties*/

window.onload = function () {
	'use strict';

	/*
	 * Initialize device viewer on desired properties
	 */
	deviceViewer.init(properties);

	document.getElementById('badgeHeightSlider').onchange = function (e) {
		var element = e.srcElement || e.target,
			globalSettings = document.getElementById('globalBadgeHeight').checked;

		deviceViewer.badgePreview.resizeViewport(undefined, element.value, undefined, globalSettings);
		element.parentNode.querySelector('.current-value').innerHTML = element.value + 'px';
	};

	document.getElementById('badgeWidthSlider').onchange = function (e) {
		var element = e.srcElement || e.target,
			globalSettings = document.getElementById('globalBadgeWidth').checked;

		deviceViewer.badgePreview.resizeViewport(element.value, undefined, undefined, globalSettings);
		element.parentNode.querySelector('.current-value').innerHTML = element.value + ' px';
	};

	document.getElementById('zoomSlider').onchange = function (e) {
		var element = e.srcElement || e.target;

		deviceViewer.badgePreview.zoomViewport(element.value, undefined, undefined, true);
		element.parentNode.querySelector('.current-value').innerHTML = element.value + '%';
	};


};
