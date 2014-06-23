/*jslint browser: true, white: true, plusplus: true */
/*global deviceViewer, properties, alert*/

window.onload = function () {
	'use strict';

	/**
	 * Changes badge size or viewport zoom.
	 * @param {HTMLElement} element An input element which holds dimension value
	 * @param {String} dimensionType Type of dimension to set, can be one of: width, height, zoom.
	 */
	function badgeResize(element, dimensionType) {
		var badgePreview = deviceViewer.badgePreview,
			value;

		switch (dimensionType) {
			case 'width':
				value = parseInt(element.value, 10) || 160;
				value = value > 1920 ? 1920 : value < 160 ? 160 : value;
				element.value = value;

				badgePreview.resizeViewport(value, undefined, undefined, false);
				break;

			case 'height':
				value = parseInt(element.value, 10) || 160;
				value = value > 1920 ? 1920 : value < 160 ? 160 : value;
				element.value = value;

				badgePreview.resizeViewport(undefined, element.value, undefined, false);
				break;

			case 'zoom':
				badgePreview.zoomViewport(element.value, undefined, undefined, true);
				element.parentNode.querySelector('.current-value').innerHTML = element.value + '%';
				break;
		}

	}

	var locationHash = location.hash.substr(1),
		badgeHeightSlider = document.getElementById('badgeHeightSlider'),
		badgeWidthSlider = document.getElementById('badgeWidthSlider'),
		customBadgeWidth = document.getElementById('customBadgeWidth'),
		customBadgeHeight = document.getElementById('customBadgeHeight'),
		zoomSlider = document.getElementById('zoomSlider');
	/*
	 * Check if viewed application was provided by url
	 * Passed JSON example
	 * {"name":"PathNameToDisplay", "path": "file:///path/to/my/App/"}
	 */
	if (locationHash !== '') {
		try {
			locationHash = JSON.parse(locationHash);
			properties.appList = [{
				name: locationHash.name,
				path: locationHash.path,
				selected: true
			}];
		} catch (e) {
			alert('There is something wrong in JSON passed as URL');
		}
	}

	/*
	 * Initialize device viewer on desired properties
	 */
	deviceViewer.init(properties);

	/*
	 * Change app preview if hash changed
	 */
	window.addEventListener('hashchange', function () {
		var newLocationHash = location.hash.substr(1),
			badgeList,
			option,
			i;
		if (newLocationHash !== '') {
			try {
				newLocationHash = JSON.parse(newLocationHash);
			} catch (e) {
				alert('There is something wrong in JSON passed as URL', newLocationHash);
			}

			badgeList = deviceViewer.badgePreview.badgeList;

			i = badgeList.length;
			while (--i >= 0) {
				badgeList[i].changeUrl(newLocationHash.path);
			}

			option = deviceViewer.config.appSelect.selectedOptions[0];
			option.value = newLocationHash.path;
			option.text = newLocationHash.name;
		}
	}, false);

	// Change height of badge using range slider
	badgeHeightSlider.addEventListener('change', badgeResize.bind(null, badgeHeightSlider, 'height') , false);
	badgeHeightSlider.addEventListener('input', badgeResize.bind(null, badgeHeightSlider, 'height') , false);

	// Change width of badge using range slider
	badgeWidthSlider.addEventListener('change', badgeResize.bind(null, badgeWidthSlider, 'width') , false);
	badgeWidthSlider.addEventListener('input', badgeResize.bind(null, badgeWidthSlider, 'width') , false);

	// Change width of badge using input text
	customBadgeWidth.addEventListener('change', badgeResize.bind(null, customBadgeWidth, 'width') , false);

	// Change height of badge using input text
	customBadgeHeight.addEventListener('change', badgeResize.bind(null, customBadgeHeight, 'width') , false);

	// Change viewport zoom using range slider
	zoomSlider.addEventListener('input', badgeResize.bind(null, zoomSlider, 'zoom') , false);
	zoomSlider.addEventListener('change', badgeResize.bind(null, zoomSlider, 'zoom') , false);
};
