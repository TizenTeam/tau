/*jslint browser: true, white: true */
/*global deviceViewer, properties*/


window.onload = function () {
	'use strict';

	var locationHash = location.hash.substr(1);
	/*
	 * Check if viewed application was provided by url
	 * Passed JSON example
	 * {"name":"PathNameToDisplay", "path": "file:///path/to/my/App/"}
	 */
	if (locationHash != '') {
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
	window.addEventListener('hashchange', function (e) {
		var locationHash = location.hash.substr(1),
			badgeList,
			option,
			i;
		if (locationHash !== '') {
			try {
				locationHash = JSON.parse(locationHash);
			} catch (e) {
				alert('There is something wrong in JSON passed as URL', locationHash);
			}

			badgeList = deviceViewer.badgePreview.badgeList;

			i = badgeList.length;
			while (--i >= 0) {
				badgeList[i].changeUrl(locationHash.path);
			}

			option = deviceViewer.config.appSelect.selectedOptions[0];
			option.value = locationHash.path;
			option.text = locationHash.name;
		}
	}, false);

	document.getElementById('badgeHeightSlider').onchange = function (e) {
		var element = e.srcElement || e.target;

		deviceViewer.badgePreview.resizeViewport(undefined, element.value, undefined, false);
	};

	document.getElementById('badgeWidthSlider').onchange = function (e) {
		var element = e.srcElement || e.target;

		deviceViewer.badgePreview.resizeViewport(element.value, undefined, undefined, false);
	};

	document.getElementById('customBadgeWidth').onchange = function (e) {
		var element = e.srcElement || e.target,
			value = parseInt(element.value, 10) || 160;

		value = value > 1920 ? 1920 : value < 160 ? 160 : value;
		deviceViewer.badgePreview.resizeViewport(value, undefined, undefined, false);
	};

	document.getElementById('customBadgeHeight').onchange = function (e) {
		var element = e.srcElement || e.target,
			value = parseInt(element.value, 10) || 160;

		value = value > 1920 ? 1920 : value < 160 ? 160 : value;
		deviceViewer.badgePreview.resizeViewport(undefined, value, undefined, false);
	};

	document.getElementById('zoomSlider').onchange = function (e) {
		var element = e.srcElement || e.target;

		deviceViewer.badgePreview.zoomViewport(element.value, undefined, undefined, true);
		element.parentNode.querySelector('.current-value').innerHTML = element.value + '%';
	};
};
