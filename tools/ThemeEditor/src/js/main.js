/*jslint browser: true, white: true, plusplus: true */
/*global themeEditor, properties, alert*/

window.onload = function () {
	'use strict';

	/**
	 * Changes badge size or viewport zoom.
	 * @param {HTMLElement} element An input element which holds dimension value
	 * @param {String} dimensionType Type of dimension to set, can be one of: width, height, zoom.
	 */
	function badgeResize(element, dimensionType) {
		var badgePreview = themeEditor.badgePreview,
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

	/*
	 * Parses URL params
	 * @param {String} searchQuery Search query to parse.
	 * @return {Object} params Params object with param name (key) and value (key value).
	 */
	function parseParams(searchQuery) {
		var hashes = searchQuery.slice(searchQuery.indexOf('?') + 1).split('&'),
			len = hashes.length,
			hash = [],
			params = {},
			i;

		for (i = 0; i < len; i++) {
			hash = hashes[i].split('=');
			params[hash[0]] = hash[1];
		}
		return params;
	}

	var locationSearch = location.search,
		params = [],
		badgeHeightSlider = document.getElementById('badgeHeightSlider'),
		badgeWidthSlider = document.getElementById('badgeWidthSlider'),
		customBadgeWidth = document.getElementById('customBadgeWidth'),
		customBadgeHeight = document.getElementById('customBadgeHeight'),
		zoomSlider = document.getElementById('zoomSlider');
	/*
	 * Check if viewed application was provided by url
	 * Passed params
	 * ?name=DisplayedAppName&path=pathToApp
	 */
	if (locationSearch !== '') {
		try {
			params = parseParams(locationSearch);
			properties.appList = [{
				name: params.name,
				path: params.path,
				selected: true
			}];
		} catch (e) {
			alert('There is something wrong in passed params in URL');
		}
	}

	/*
	 * Initialize device viewer on desired properties
	 */
	themeEditor.init(properties);

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
