/*jslint browser: true, white: true */
/*global $, CustomEvent*/
(function (window) {
	'use strict';

	var deviceViewer = window.deviceViewer,
		deviceViewerConfig = deviceViewer.config,
		cssClasses = {
			badge: 'theme-badge',
			badgeActive: 'theme-badge-active',
			navBar: 'theme-badge-navbar'
		},
		BadgePreview = function () {
			/**
			 * @type workspaceContainer HTMLElement contains all badges
			 */
			this.workspaceContainer = null;
			this.badgeList = [];
			this.activeBadgeIndex = null;
			this.styleSheet = null;

		};

    BadgePreview.prototype.swapDimensions = function () {
        var badgeElement = this.getActive().iframeElement,
            tmpWidth, tmpHeight;

        tmpWidth = badgeElement.style.width || (badgeElement.clientWidth + 'px');
        tmpHeight = badgeElement.style.height || (badgeElement.clientHeight + 'px');

        badgeElement.style.width = tmpHeight;
        badgeElement.style.height = tmpWidth;
    };

	BadgePreview.prototype.zoomViewport = function (zoomValue) {
		var workspaceStyle = this.workspaceContainer.style;

		zoomValue = parseInt(zoomValue, 10) / 100 || 0;

		workspaceStyle.webkitTransform = 'scale(' + zoomValue + ')';
		workspaceStyle.webkitTransformOrigin = '0 0';
		workspaceStyle.width = (100 / zoomValue) + '%';
		workspaceStyle.height = (100 / zoomValue) + '%';
	};

	BadgePreview.prototype.resizeViewport = function (widthValue, heightValue, zoomValue, globalSettings) {
		var styleSheet = this.styleSheet,
			cssRules = styleSheet.cssRules,
			badgeList = this.badgeList,
			lastStyle = {},
			i,
			ruleTxt = '',
			element,
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
				ruleTxt += '-webkit-transform: scale(' + (parseInt(zoomValue, 10) / 100 || 0) + ') ;';
			} else {
				ruleTxt += lastStyle.webkitTransform ? '-webkit-transform: ' + lastStyle.webkitTransform + ';' : '';
			}

			styleSheet.insertRule(selector + '{ ' + ruleTxt + ' }', cssRules.length);
		} else {
			element = this.getActive().iframeElement;

			if (widthValue) {
				element.style.width = (parseInt(widthValue, 10) || 0) + 'px';
			}
			if (heightValue) {
				element.style.height = (parseInt(heightValue, 10) || 0) + 'px';
			}
		}

	};

	BadgePreview.prototype.getActive = function () {
		return this.badgeList[this.activeBadgeIndex];
	};

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
	 * Build and add new badge to badge preview
	 */
	BadgePreview.prototype.add = function (previewUrl) {
		var workspace = this.workspaceContainer,
			badge,
			self = this;

		if (previewUrl === undefined) {
			previewUrl = deviceViewerConfig.previewUrl;
		}

		// Create new Badge
		badge = new deviceViewer.Badge();
		badge.build(workspace, previewUrl, self);

		// Push badge to list
		this.badgeList.push(badge);

		return badge;
	};

	BadgePreview.prototype.setActive = function (index) {
		var badgeList = this.badgeList,
			i;

		if (index >= 0) {
			if (badgeList[index]) {
				for (i = badgeList.length - 1; i >= 0; i -= 1) {
					if (i === index) {
						badgeList[i].element.className = cssClasses.badgeActive;
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

	BadgePreview.prototype.changePreview = function (url) {
		var badge;

		badge = this.getActive();
		badge.changeUrl(url);
	};

	BadgePreview.prototype.init = function () {
		var styleSheets = document.styleSheets,
			sheet,
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

        // Add new badge ...
		this.add();
        // ... and mark it as active
		this.setActive(0);

	};

	deviceViewer.badgePreview = new BadgePreview();
}(window));