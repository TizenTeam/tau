/*jslint browser: true, white: true */
/*global $, CustomEvent*/
(function (window) {
	'use strict';
	/**
	 * @property {DeviceViewer} deviceViewer reference to device viewer object
	 */
	var deviceViewer = window.deviceViewer,
		/**
		 * @property {DeviceViewer.config} deviceViewerConfig reference to device viewer configuration
		 */
		deviceViewerConfig = deviceViewer.config,
		/**
		 * @property {Object} cssClasses List of available CSS classes
		 * @property {string} cssClasses.badge CSS Class for not active badge
		 * @property {string} cssClasses.badgeActive CSS Class for active / selected badge
		 * @property {string} cssClasses.navBar CSS Class for navigation bar of badge
		 */
		cssClasses = {
			badge: 'theme-badge',
			badgeActive: 'theme-badge-active',
			navBar: 'theme-badge-navbar'
		},
		/**
		 * @param {number} maxBadgeWidth
		 * Maximum width of badge in pixels
		 */
		maxBadgeWidth = 0,
		/**
		 * @param {number} viewportZoom
		 * Current zoom set for viewport
		 */
		viewportZoom = 1,
		/**
		 * @constructor Badge preview constructor
		 */
		BadgePreview = function () {
			/**
			 * @property {?HTMLElement} workspaceContainer HTMLElement contains all badges
			 */
			this.workspaceContainer = null;
			/**
			 * @property {Badge[]} badgeList List of badges attached to workspace
			 */
			this.badgeList = [];
			/**
			 * @property {?number} activeBadgeIndex Index of active badge
			 */
			this.activeBadgeIndex = null;
			/**
			 * @property {CSSStyleSheet} styleSheet
			 * Reference to Device Viewer style sheet. Global change of badge sizes
			 * affects rule changing in style sheet
			 */
			this.styleSheet = null;
			/**
			 * @property {Object} properties Badge Preview properties
			 * @property {BadgeConfig} properties.defaultBadge Default badge properties is used when badges are created without
			 * defined properties
			 * @property {number} properties.maxBadgeCount Maximum number of badges
			 */
			this.properties = {
				defaultBadge: {},
				maxBadgeCount: 0
			};

		};



	/**
	 * Returns current zoom.
	 * @returns {number} Current zoom
	 */
	BadgePreview.prototype.getViewportZoom = function () {
		return viewportZoom;
	}

	/**
	 * Returns the widest badge
	 * @returns {number} Maximum badge width in pixels
	 */
	BadgePreview.prototype.getMaxBadgeWidth = function () {
		return maxBadgeWidth;
	}

	/**
	 * @method updateMaxBadgeWidth
	 * Updates info about the widest badge
	 * @returns {number} Maximum badge width in pixels
	 */
	BadgePreview.prototype.updateMaxBadgeWidth = function () {
		var badgeList,
			i;

		// Reset max badge width
		maxBadgeWidth = 0;

		// Cache badge list
		badgeList = this.badgeList;

		for (i = badgeList.length - 1; i >= 0; --i) {
			// Get maximum width
			if (badgeList[i].properties.width > maxBadgeWidth) {
				maxBadgeWidth = badgeList[i].properties.width;
			}
		}

		return maxBadgeWidth;
	}

	/**
	 * @method updateDevicePropertiesPanel
	 * Updates device properties box with selected badge properties
	 * @param {Badge} badge Selected badge
	 */
	BadgePreview.prototype.updateDevicePropertiesPanel = function (badge) {
		var badgeProperties = badge.properties,
			element;

		this.updateMaxBadgeWidth();

		document.getElementById('badge-name').innerHTML = badgeProperties.name;
		document.getElementById('badge-width').innerHTML = badgeProperties.width;
		document.getElementById('badge-height').innerHTML = badgeProperties.height;
		document.getElementById('badge-resolution').innerHTML = badgeProperties.displayWidth + ' x ' + badgeProperties.displayHeight;
		document.getElementById('badge-pixel-ratio').innerHTML = badgeProperties.pixelRatio;

		element = document.getElementById('badgeWidthSlider');
		element.value = badgeProperties.width;
		element.parentNode.querySelector('.current-value').value = element.value;

		element = document.getElementById('badgeHeightSlider');
		element.value = badgeProperties.height;
		element.parentNode.querySelector('.current-value').value = element.value;
	};

	/**
	 * @method swapDimensions
	 * Changes orientation of displayed badge from horizontal to vertical and vice versa. It swaps dimensions of badge.
	 */
	BadgePreview.prototype.swapDimensions = function () {
		var badge = this.getActive(),
			badgeElement = badge.iframeElement,
			badgeProperties = badge.properties,
			tmpWidth, tmpHeight;

		// Swapping device resolution
		tmpWidth = badgeProperties.displayWidth;
		tmpHeight = badgeProperties.displayHeight;
		badgeProperties.displayHeight = tmpWidth;
		badgeProperties.displayWidth = tmpHeight;

		// Swapping badge size
		tmpWidth = badgeElement.style.width || (badgeElement.clientWidth + 'px');
		tmpHeight = badgeElement.style.height || (badgeElement.clientHeight + 'px');

		// Update badge size and device properties box
		badge.setSize(tmpHeight, tmpWidth);
		deviceViewer.fixUI();
	};

	/**
	 * @method zoomViewport
	 * Changes zoom of viewport / workspace
	 * @param {string|number} zoomValue Zoom value expressed in percents
	 */
	BadgePreview.prototype.zoomViewport = function (zoomValue) {
		var workspaceStyle = this.workspaceContainer.style;

		// make sure that zoom value is integer
		viewportZoom = parseInt(zoomValue, 10) / 100 || 0;

		workspaceStyle.webkitTransform = 'scale(' + viewportZoom + ')';
		workspaceStyle.webkitTransformOrigin = '0 0';
		workspaceStyle.width = (100 / viewportZoom) + '%';
		workspaceStyle.height = (100 / viewportZoom) + '%';

		// Fix device viewer UI
		deviceViewer.fixUI();
	};

	/**
	 * @method resizeViewport
	 * Changes viewport settings (badge size or zoom) if proper values given. If global settings flag is true, global
	 * changes of badge size will affect.
	 * @param {?number} widthValue Badge width
	 * @param {?number} heightValue Badge height
	 * @param {?number|string} zoomValue Viewport zoom expressed in percents
	 * @param {boolean} globalSettings Flag if changes are global or not
	 */
	BadgePreview.prototype.resizeViewport = function (widthValue, heightValue, zoomValue, globalSettings) {
		var styleSheet = this.styleSheet,
			cssRules = styleSheet.cssRules,
			badgeList = this.badgeList,
			lastStyle = {},
			i,
			ruleTxt = '',
			badge,
			// @TODO Build selector value according to Device Viewer Config
			selector = '#workspace .' + cssClasses.badge + ' iframe, #workspace .' + cssClasses.badgeActive + ' iframe';

		// If globalSettings is true, set size for all badges
		if (globalSettings === true) {
			for (i = cssRules.length - 1; i >= 0; i -= 1) {
				if (cssRules[i].selectorText === selector) {
					lastStyle.width = cssRules[i].style.width;
					lastStyle.height = cssRules[i].style.height;
					lastStyle.webkitTransform = cssRules[i].style.webkitTransform;
					styleSheet.deleteRule(i);
					i = 0;
				}
			}

			if (widthValue) {
				ruleTxt += 'width: ' + (parseInt(widthValue, 10) || 0) + 'px;';
				// Reset custom width of badges
				for (i = badgeList.length - 1; i >= 0; i -= 1) {
					badgeList[i].iframeElement.style.width = '';
				}
			} else {
				ruleTxt += lastStyle.width ? 'width: ' + lastStyle.width + ';' : '';
			}

			if (heightValue) {
				ruleTxt += 'height: ' + (parseInt(heightValue, 10) || 0) + 'px ;';
				// Reset custom height of badges
				for (i = badgeList.length - 1; i >= 0; i -= 1) {
					badgeList[i].iframeElement.style.height = '';
				}
			} else {
				ruleTxt += lastStyle.height ? 'height: ' + lastStyle.height + ';' : '';
			}

			if (zoomValue) {
				viewportZoom = parseInt(zoomValue, 10);
				ruleTxt += '-webkit-transform: scale(' + (viewportZoom / 100 || 0) + ') ;';
			} else {
				ruleTxt += lastStyle.webkitTransform ? '-webkit-transform: ' + lastStyle.webkitTransform + ';' : '';
			}

			styleSheet.insertRule(selector + '{ ' + ruleTxt + ' }', cssRules.length);
		} else {
			badge = this.getActive();
			badge.setSize(widthValue, heightValue);
		}

		// Fix device viewer UI
		deviceViewer.fixUI();
	};

	/**
	 * @method getActive
	 * Returns active badge instance
	 * @returns {Badge} Active badge instance
	 */
	BadgePreview.prototype.getActive = function () {
		return this.badgeList[this.activeBadgeIndex];
	};

	/**
	 * @method remove
	 * Removes selected badge from workspace
	 */
	BadgePreview.prototype.remove = function () {
		var badgeList = this.badgeList,
			activeBadgeIndex = this.activeBadgeIndex,
			badge = this.badgeList[activeBadgeIndex];

		if (badgeList.length > 1) {
			this.workspaceContainer.removeChild(badge.element);
			badgeList.splice(activeBadgeIndex, 1);
			this.setActive(badgeList[activeBadgeIndex] ? activeBadgeIndex : activeBadgeIndex - 1);
		} else {
			deviceViewer.alert('I can\'t remove it! You need to have at least one badge.');
		}
	};

	/**
	 * Builds and adds new badge to badge preview / workspace
	 * @param {?BadgeConfig} badgeProperties Initial badge properties
	 * @returns {Badge} Just created Badge instance
	 */
	BadgePreview.prototype.add = function (badgeProperties) {
		var workspace = this.workspaceContainer,
			badge;

		if (this.badgeList.length >= this.properties.maxBadgeCount) {
			deviceViewer.alert('I can\'t add more badges than ' + this.properties.maxBadgeCount + '!');
			return null;
		}

		// If properties are not set, create empty properties
		badgeProperties = badgeProperties || this.properties.defaultBadge;

		// Assign default preview url if was not set
		if (!badgeProperties.previewUrl) {
			badgeProperties.previewUrl = deviceViewerConfig.previewUrl;
		}

		// Create new Badge instance ...
		badge = new deviceViewer.Badge();
		// ... and build it
		badge.build(workspace, badgeProperties, this);

		// Push badge to badge list
		this.badgeList.push(badge);

		// Return an instance of just created badge
		return badge;
	};

	/**
	 * @method setActive
	 * Sets active badge on given index from {@link BadgePreview#badgeList}
	 * @param {?number} index Index of badge that should be activated. If is not set first badge will be activated.
	 */
	BadgePreview.prototype.setActive = function (index) {
		var badgeList = this.badgeList,
			badge,
			i;

		if (index >= 0) {
			if (badgeList[index]) {
				for (i = badgeList.length - 1; i >= 0; i -= 1) {
					if (i === index) {
						badge = badgeList[i];
						badge.element.className = cssClasses.badgeActive;
						this.updateDevicePropertiesPanel(badge);
						this.activeBadgeIndex = i;
					} else {
						badgeList[i].element.className = cssClasses.badge;
					}
				}
			}
		} else {
			this.setActive(0);
		}

	};

	/**
	 * @method changePreview
	 * Changes app preview on given url.
	 * @param {string} url App url
	 */
	BadgePreview.prototype.changePreview = function (url) {
		var badge;

		badge = this.getActive();
		badge.changeUrl(url);
	};

	/**
	 * @method init
	 * Initialize badge preview
	 * @param {Object} previewProperties Properties of badge preview
	 */
	BadgePreview.prototype.init = function (previewProperties) {
		var styleSheets = document.styleSheets,
			sheet,
			badgeList = previewProperties.badges,
			badgeListLength = badgeList.length || 0,
			properties = this.properties,
			i;

		// Assign workspace container
		this.workspaceContainer = deviceViewerConfig.workspace;

		// Find device viewer style sheet. This style sheet will be used
		// to manipulate badge styling rules. Ex. global badge size change.
		for (i = styleSheets.length - 1; i >= 0; i -= 1) {
			sheet = styleSheets[i];
			if (sheet.title === 'deviceViewer') {
				this.styleSheet = sheet;
				i = 0; // Force loop exit
			}
		}

		// Set default badge properties
		properties.defaultBadge = previewProperties.defaultBadge;

		// Set preview url of selected app
		properties.maxBadgeCount = parseInt(previewProperties.maxBadgeCount, 10) || 0;

		if (badgeListLength <= 0) {
			// Add new default badge ...
			this.add();
		} else {
			for (i = 0; i < badgeListLength; i += 1) {
				// Add new badge ...
				this.add(badgeList[i]);
			}
		}

		// ... and mark first one as active
		this.setActive(0);

	};

	deviceViewer.badgePreview = new BadgePreview();
}(window));