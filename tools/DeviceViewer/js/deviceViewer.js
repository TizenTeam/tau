/*jslint browser: true, white: true */
/*global window */

(function(window) {
	'use strict';

	var DeviceViewer = function() {
			/**
			 * Configuration of Device Viewer
			 */
			this.config = {
				/**
				 * URL to preview page - used by badge
				 */
				previewUrl: '',
				/**
				 * workspace {HTMLElement} workspace container
				 */
				workspace: null,
				/**
				 * appSelect {HTMLElement} select with application list ready to preview
				 */
				appSelect: null,
				/**
				 * root {string} Root path of Device Viewer
				 */
				root: '',
				/**
				 * topPanel {HTMLElement} top panel with icon tools
				 */
				topPanel: null,
				/**
				 * mainPanel {HTMLElement} main panel, contains workspace and columns
				 */
				mainPanel: null
			};

			// Imports
			this.badgePreview = {}; //deviceViewer.badgePreview.js
			return this;
		},
		/**
		 * @param {?HTMLElement} globalBadgeSize
		 * Reference to HTML Element wit global badge size flag
		 */
		globalBadgeSize = null,
		/**
		 * @param {?Object} fixUIBound
		 * Bounding to fix ui method
		 */
		fixUIBound = null;

	/**
	 * @method setBadgeProperties
	 * Changes current badge or all (if globalBadgeSize is set) badges properties
	 * @param {DeviceViewer} self Instance of Device Viewer
	 * @param {Object} properties New badge properties
	 */
	function setBadgeProperties(self, properties) {
		var i,
			badgePreview = self.badgePreview,
			badge,
			badgeList = badgePreview.badgeList,
			width,
			height,
			globalChange = globalBadgeSize.checked;

		if (globalChange) {
			for (i = badgeList.length - 1; i >= 0; i -= 1) {
				badge = badgeList[i].setProperties(properties);
			}
			badge = badgeList[0];
			badgePreview.properties.defaultBadge = properties;
		} else {
			badge = badgePreview.getActive();
			badge.setProperties(properties);
		}

		width = badge.properties.width;
		height = badge.properties.height;
		badgePreview.resizeViewport(width, height, undefined, globalChange);
	}

	/**
	 * @method fixUI
	 * UI Fix. Keep badges and column always visible.
	 * Checks if topPanel doesn't cover it.
	 * @param {Event} event Resize event
	 */
	DeviceViewer.prototype.fixUI = function (event) {
		var self = this,
			config = self.config,
			mainPanelStyle = config.mainPanel.style,
			maxBadgeWidth = self.badgePreview.getMaxBadgeWidth(),
			currentZoom = self.badgePreview.getViewportZoom(),
			innerWidth = (event && event.target.window.innerWidth) || window.innerWidth,
			offset = 100;

		mainPanelStyle.top = config.topPanel.clientHeight + 'px';
		mainPanelStyle.width = innerWidth + 'px';
		mainPanelStyle.minWidth = (Math.round((maxBadgeWidth + offset) * currentZoom)) + 'px';
	}

	/**
	 * @method resolvePath
	 * Resolves path relative to root path
	 * @param {string} rootPath The root path
	 * @param {string} queryPath The path that should be resolved relative to root path
	 * @returns {string} Resolved path
	 */
	DeviceViewer.prototype.resolvePath = function (rootPath, queryPath) {
		var rootPieces,
			queryPieces,
			path = [],
			relative,
			queryPathMatch,
			rootPathMatch,
			i;

		// Check if queryPath is relative or absolute path
		relative = !(/^[a-z]+:\/\//.test(queryPath));

		rootPieces = rootPath.split('/');
		queryPieces = queryPath.split('/');

		rootPathMatch = rootPath.match(/https?:\/\/[^\/]+/);
		queryPathMatch = queryPath.match(/https?:\/\/[^\/]+/);

		// Check if paths are in the same domain
		if (relative !== true && rootPathMatch && queryPathMatch && rootPathMatch[0] !== queryPathMatch[0]) {
			return queryPath;
		}

		// Omit last element (file name)
		rootPieces.pop();

		if (relative) {
			for (i = 0; i < queryPieces.length; i += 1) {
				if (queryPieces[i] === '..') {
					// Go back
					rootPieces.pop();
					// Remove first element
					queryPieces.shift();
					i -= 1;
				}
			}
			return rootPieces.join('/') + '/' + queryPieces.join('/');
		}

		// Find common pieces
		for (i = 0; i < rootPieces.length; i += 1) {
			if (rootPieces[i] !== queryPieces[i]) {
				if (rootPieces[i] === '..') {
					path.pop();
				} else {
					path.push('..');
				}
			}
		}
		return path.concat(queryPieces.splice(i - path.length)).join('/');
	};

	/**
	 * @method alert
	 * Shows an alert
	 * @param {string} message Message text
	 */
	DeviceViewer.prototype.alert = function(message) {
		// TODO: do it more cool
		window.alert(message);
	};

	/**
	 * @method fillDevicePresets
	 * Fills list of preset devices as li elements
	 * @param {Array} devList List of devices
	 * @param {HTMLElement} devListContainer List element
	 */
	DeviceViewer.prototype.fillDevicePresets = function (devList, devListContainer) {
		var devListLength = devList.length,
			self = this,
			tmpElement,
			tmpContainer,
			displayWidth,
			displayHeight,
			i;

		for (i = 0; i < devListLength; i += 1) {
			displayWidth = devList[i].displayWidth;
			displayHeight = devList[i].displayHeight;
			tmpElement = document.createElement('li');
			tmpElement.innerHTML = devList[i].name + ' <br><small>' + displayWidth + ' x ' + displayHeight + '</small> ';
			devListContainer.appendChild(tmpElement);
			tmpElement.addEventListener('click', setBadgeProperties.bind(null, self, devList[i]));
		}

		// Create global badge size container
		tmpContainer = document.createElement('li');
		tmpContainer.className = 'global-settings';

		// Create global badge size checkbox
		tmpElement = document.createElement('input');
		tmpElement.setAttribute('type', 'checkbox');
		tmpElement.setAttribute('id', 'globalBadgeSize');
		tmpContainer.appendChild(tmpElement);

		// Assign checkbox reference to Device Viewer protected variable
		globalBadgeSize = tmpElement;

		// Create global badge size label
		tmpElement = document.createElement('label');
		tmpElement.setAttribute('for', 'globalBadgeSize');
		tmpElement.innerText = 'global';
		tmpContainer.appendChild(tmpElement);

		// Append container to devices list
		devListContainer.appendChild(tmpContainer);
	};

	/**
	 * @method buildAppSelect
	 * Fills select element with application as HTML options
	 * @param {Array} appList List of applications ready to preview
	 * @returns {HTMLElement} Application HTML Select reference
	 */
	DeviceViewer.prototype.buildAppSelect = function (appList) {
		var appSelect,
			appListLength = appList.length,
			tmpElement,
			i;

		if (appListLength <= 0) {
			throw "No preview app was define! You have to define at least one app to preview.";
		}

		appSelect = document.getElementById(this.config.appSelectElementId || 'appSelect');
		for (i = 0; i < appListLength; i += 1) {
			tmpElement = document.createElement('option');
			tmpElement.value = appList[i].path;
			tmpElement.innerText = appList[i].name;
			if (appList[i].selected === true) {
				tmpElement.setAttribute('selected', 'selected');
			}
			appSelect.appendChild(tmpElement);
		}

		if (appListLength === 1) {
			appSelect.disabled = true;
		}

		return appSelect;
	};

	/**
	 * Setup properties and initialize Device Viewer.
	 * @method init
	 * @param {Object} properties
	 */
	DeviceViewer.prototype.init = function(properties) {
		var config = this.config;

		// Set Device's Viewer root path defined by properties or set default (current location href).
		config.root = properties.root || window.location.href.replace(/[^\/]+\.html?$/, '');

		// Set workspace defined by properties or get default workspace
		config.workspace = document.getElementById(properties.workspaceElementId || "workspace");

		// Set topPanel defined by properties or get default top panel
		config.topPanel = document.getElementById(properties.topPanelElementId || "topPanel");

		// Set mainPanel defined by properties or get default main panel
		config.mainPanel = document.getElementById(properties.mainPanelElementId || "mainPanel");

		// Fill select options with app names, that are ready to preview. Assign reference to select with app list.
		config.appSelect = this.buildAppSelect(properties.appList);

		// Set preview url of selected app
		config.previewUrl = config.appSelect.value;

		this.fillDevicePresets(properties.devList, document.getElementById('devicesList'));

		// Ready to go, let's init Badge Preview!
		this.badgePreview.init(properties.previewProperties);

		// Fix UI
		this.fixUI();

		// Add ui fixing after window resize
		fixUIBound = this.fixUI.bind(this);
		window.addEventListener('resize', fixUIBound, false);

	};

	window.deviceViewer = new DeviceViewer();
}(window));