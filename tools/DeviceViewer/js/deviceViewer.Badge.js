/*jslint browser: true, white: true */
/*global CustomEvent*/
(function (window) {
	'use strict';

	/**
	 * @property {DeviceViewer} deviceViewer reference to device viewer object
	 */
	var deviceViewer = window.deviceViewer,
		/**
		 * @property {Object} cssClasses List of available CSS classes for Badge object
		 * @property {string} cssClasses.badge CSS Class for not active badge
		 * @property {string} cssClasses.badgeActive CSS Class for active / selected badge
		 * @property {string} cssClasses.historyBack CSS Class for history back button in navigation bar of badge
		 * @property {string} cssClasses.historyForward CSS Class for history forward button navigation bar of badge
		 */
		cssClasses = {
			badge: 'theme-badge',
			badgeActive: 'theme-badge-active',
			navBar: 'badge-navbar',
			historyBack: 'badge-history-back',
			historyForward: 'badge-history-forward'
		},
		/**
		 * Creates new badge
		 * @returns {Badge} New instance of badge
		 * @constructor
		 */
		Badge = function () {
			/**
			 * @property {BadgeConfig} properties Badge properties
			 */
			 this.properties = {
				name: 'Initial',
				displayWidth: 0,
				displayHeight: 0,
				pixelRatio: 1,
				width: 0,
				height: 0
			};

			/**
			 * @param {?BadgePreview} badgePreview Instance of badge preview
			 */
			this.badgePreview = null;
			/**
			 * @param {?HTMLElement} element Badge container HTML Element
			 */
			this.element = null;
			/**
			 * @param {?HTMLElement} iframeElement Badge viewport the iframe element
			 */
			this.iframeElement = null;
			/**
			 * @param {?Window} contentWindow Reference to badge viewport's window object
			 */
			this.contentWindow = null;

			/**
			 *
			 * @type {Array}
			 */
			this.history = [];
			this.historyLock = false;
			this.currentHistoryIndex = -1;


			/**
			 * @param {?Object} historyBackBound Binding for history back click event
			 */
			this.historyBackBound = null;
			/**
			 * @param {?Object} historyBackBound Binding for history forward click event
			 */
			this.historyForwardBound = null;

			return this;
		};

	/**
	 * @method badgeClickHandler
	 * Helper function to activate badge on click
	 * @param {BadgePreview} badgePreview Reference to Badge Preview object
	 * @param {Event} event Click event
	 */
	function badgeClickHandler(badgePreview, event) {
		var badgeList = badgePreview.badgeList,
			currentBadge = event.currentTarget || event.target.ownerDocument,
			index = 0,
			i;

		// Find current badge
		for (i = badgeList.length - 1; i >= 0; i -= 1) {
			if (badgeList[i].element === currentBadge || badgeList[i].contentWindow === currentBadge) {
				index = i;
				i = 0;
			}
		}
		badgePreview.setActive(index);
	}

	/**
	 * Pushes new badge history
	 * @param {Badge} self
	 * @param {string} type
	 */
	function pushBadgeHistory (self, type) {
		var contentWindow = self.iframeElement.contentWindow;

		if (!self.historyLock) {
			//Remove further history if exists
			self.history.splice(self.currentHistoryIndex + 1);

			self.history.push({
				href: contentWindow.location.href,
				state: contentWindow.history.state,
				type: type
			});
			self.currentHistoryIndex += 1;
		}
	}

	/**
	 * @method historyTraverse
	 * Traverse badge history. History is built on following events: load, hashChange and pageChange.
	 * @param {Badge} self Badge instance
	 * @param {string} direction History traverse direction (back or forward)
	 */
	function historyTraverse (self, direction) {
		var badgeHistory = self.history,
			contentWindow = self.contentWindow,
			currentHistoryIndex = self.currentHistoryIndex,
			contentWindowHistory = contentWindow.history,
			targetHistoryState;

		// Prevent adding new badge history entry
		self.historyLock = true;

		// Calculate current history index
		currentHistoryIndex += direction === 'forward' ? 1 : -1;

		// Check if badge history index is not out of range
		if (currentHistoryIndex >= 0 && currentHistoryIndex < badgeHistory.length) {

			// Assign history state, that we want to achieve
			targetHistoryState = badgeHistory[currentHistoryIndex];

			// Check type of history state
			switch (targetHistoryState.type) {
				case 'loadEvent':
					// Jump to target location
					contentWindow.location.href = targetHistoryState.href;
					break;
				case 'hashChangeEvent':
				case 'pageChangeEvent':
					// Push new state to contentWindow history object. This state is a target state.
					contentWindowHistory.pushState(targetHistoryState.state, '', targetHistoryState.href);

					// Add a "fake" state. This state is only added to force browser to popState behaviour by "history jump" method.
					contentWindowHistory.pushState(null, '', '');

					// Do history jump
					contentWindowHistory.go(-1);
					break;
			}
		} else {
			// Correct history index
			currentHistoryIndex = currentHistoryIndex >= 0 ? badgeHistory.length - 1 : 0;
		}
		// Save badge history index
		self.currentHistoryIndex = currentHistoryIndex;
	}

	/**
	 * @method overrideStyleSheet
	 * Overrides media queries in given style sheet. It "emulates" device-width property in very simple way.
	 * @param {CSSStyleSheet} styleSheet Style sheet that should overridden
	 */
	function overrideStyleSheet(styleSheet) {
		var i,
			mediaRuleType = window.CSSRule.MEDIA_RULE,
			cssRules = styleSheet.cssRules,
			cssRulesLength = cssRules.length,
			media,
			stack,
			tmpString,
			j;

		// Iterate for all rules in style sheet
		for (i = cssRulesLength - 1; i >= 0; i -= 1) {
			// Get only media rules
			if (cssRules[i].type === mediaRuleType) {
				media = cssRules[i].media;
				stack = [];
				// Iterate for all rules in media rules to get media that has to be overridden
				for (j = media.length - 1; j >= 0; j -= 1 ) {
					if (media[j].indexOf('device-') > 0) {
						stack.push(media[j]);
					}
				}
				// Remove media ...
				for (j = stack.length - 1; j >= 0; j -= 1 ) {
					media.deleteMedium(stack[j]);
				}
				// ... and add overridden one
				for (j = stack.length - 1; j >= 0; j -= 1 ) {
					tmpString = stack[j].split('device-').join('');
					media.appendMedium(tmpString);
				}
			}

		}
	}

	/**
	 * @method badgeLoad
	 * This method is fired after document is loaded in badge.
	 * @param {Badge} self Badge instance
	 * @param {Event} event Load Event
	 */
	function badgeLoad(self, event) {
		var iframe = event.srcElement,
			styleTag,
			frameDocument = iframe.contentDocument,
			frameWindow = iframe.contentWindow,
			frameDocumentHead = frameDocument.head,
			frameStyleSheets = frameDocument.styleSheets,
			sheet,
			i;

		// Override app style sheet
		for (i = 0; i < frameStyleSheets.length; i += 1) {
			overrideStyleSheet(frameStyleSheets[i]);
		}

		// Add custom styling
		styleTag = frameDocument.createElement('style');
		// Little hack, do not let style tag to be empty
		styleTag.appendChild(document.createTextNode(''));
		// Append style tag to document
		frameDocumentHead.appendChild(styleTag);
		sheet = styleTag.sheet;

		// @TODO: remove when scrollbar will be styled in tau less files
		sheet.insertRule('::-webkit-scrollbar{ width: 5px; border-radius:3px; }', 0);
		sheet.insertRule('::-webkit-scrollbar-track{ border-radius:3px; background: transparent; }', 0);
		sheet.insertRule('::-webkit-scrollbar-thumb{ border-radius: 2px; background: #777777; }', 0);
		sheet.insertRule('::-webkit-scrollbar-track-piece { height: 30px; }', 0);

		// Add new badge history entry
		pushBadgeHistory(self, 'loadEvent');

		// Helper for badge focus change
		frameWindow.addEventListener('click', badgeClickHandler.bind(null, self.badgePreview), true);

		// Track change hash event
		frameWindow.addEventListener('hashchange', function() {
			// Add new badge history entry
			pushBadgeHistory(self, 'hashChangeEvent');

			// Unlock history
			self.historyLock = false;
		}, true);

		// Track pageChange event for frameworks based on this event
		frameWindow.document.addEventListener('pagechange', function() {
			// Add new badge history entry
			pushBadgeHistory(self, 'pageChangeEvent');

			// Unlock history
			self.historyLock = false;
		}, true);

		// Cache contentWindow
		self.contentWindow = frameWindow;

		// Unlock history
		self.historyLock = false;
	}

	/**
	 * @method setProperties
	 * Sets properties to badge.
	 * @param {BadgeConfig} badgeProperties Badge new properties
	 */
	Badge.prototype.setProperties = function (badgeProperties) {
		var properties = this.properties;

		// Update name of badge
		if (badgeProperties.name) {
			properties.name = badgeProperties.name;
		}

		// Update display width
		if (badgeProperties.displayWidth) {
			properties.displayWidth = parseInt(badgeProperties.displayWidth, 10) || 0;
		}

		// Update display height
		if (badgeProperties.displayHeight) {
			properties.displayHeight = parseInt(badgeProperties.displayHeight, 10) || 0;
		}

		// Update pixel ratio
		if (badgeProperties.pixelRatio) {
			properties.pixelRatio = parseInt(badgeProperties.pixelRatio, 10) || 0;
		}

		// Compute width of display container (iframe)
		properties.width = Math.round(properties.displayWidth / properties.pixelRatio);

		// Compute height of display container (iframe)
		properties.height = Math.round(properties.displayHeight / properties.pixelRatio);

		// Update badge size and device box
		this.setSize(properties.width, properties.height);
	};

	/**
	 * @method setSize
	 * Sets size of badge viewport
	 * @param {number} widthValue Viewport width
	 * @param {number} heightValue Viewport height
	 */
	Badge.prototype.setSize = function (widthValue, heightValue) {
		var elementStyle = this.iframeElement.style,
			properties = this.properties;

		if (widthValue) {
			properties.width = parseInt(widthValue, 10) || 0;
			properties.displayWidth = Math.round(properties.width * properties.pixelRatio);
			elementStyle.width = properties.width + 'px';
		}

		if (heightValue) {
			properties.height = parseInt(heightValue, 10) || 0;
			properties.displayHeight = Math.round(properties.height * properties.pixelRatio);
			elementStyle.height = properties.height + 'px';
		}
		this.badgePreview.updateDevicePropertiesPanel(this);
	};

	/**
	 * @method buildNavigationBar
	 * Builds navigation bar for a badge
	 */
	Badge.prototype.buildNavigationBar = function () {
		var container = document.createElement('div'),
				self = this,
				el;

		container.classList.add(cssClasses.navBar);

		self.historyBackBound = historyTraverse.bind('', self, 'back');
		el = document.createElement('a');
		el.innerHTML = '&laquo';
		el.classList.add(cssClasses.historyBack);
		el.addEventListener('click', self.historyBackBound);
		container.appendChild(el);

		self.historyForwardBound = historyTraverse.bind('', self, 'forward');
		el = document.createElement('a');
		el.innerHTML = '&raquo';
		el.classList.add(cssClasses.historyForward);
		el.addEventListener('click', self.historyForwardBound);
		container.appendChild(el);

		el = document.createElement('span');
		el.className = 'badge-size';
		container.appendChild(el);

		this.element.appendChild(container);
	};

	/**
	 * Builds badge container in workspace.
	 * @param workspace {HTMLElement} workspace Workspace where badge should be build
	 * @param badgeProperties {Object} Badge properties
	 * @param badgePreview {BadgePreview} Instance of badge preview
	 */
	Badge.prototype.build = function (workspace, badgeProperties, badgePreview) {
		var badgeElement,
			iframe,
			previewUrl;

		// Assign badgePreview object reference
		this.badgePreview = badgePreview;

		// Get preview URL, if not preview was not set, set default value.
		previewUrl = badgeProperties.previewUrl || badgePreview.deviceViewerConfig.previewUrl;

		// Create badge container
		badgeElement = document.createElement('div');
		badgeElement.className = cssClasses.badge;
		badgeElement.addEventListener('click', badgeClickHandler.bind(null, badgePreview), false);
		// Assign reference to HTML element of badge container
		this.element = badgeElement;

		// Build navigation bar
		this.buildNavigationBar();

		// Create iframe - theme holder
		iframe = document.createElement('iframe');
		iframe.setAttribute('src', previewUrl);
		badgeElement.appendChild(iframe);
		iframe.onload = badgeLoad.bind('', this);
		this.iframeElement = iframe;

		// Append to workspace
		workspace.appendChild(badgeElement);

		// Set properties
		this.setProperties(badgeProperties || {});
	};

	/**
	 * @method changeUrl
	 * Sets badge app preview by given url
	 * @param {string} url New badge preview url
	 */
	Badge.prototype.changeUrl = function (url) {
		var iframe = this.iframeElement;

		// Replace current iframe...
		iframe.setAttribute('src', url);
		iframe.onload = badgeLoad.bind('', this);

		// Clear history and ...
		this.history = [];

		// ... reset current index and ...
		this.currentHistoryIndex = -1;

		// ... unlock
		this.historyLock = false;

	};

	Badge.prototype.destroy = function () {
		//@TODO write destroy method
		this.element.removeEventListener('click', badgeClickHandler.bind(null, this.badgePreview), false);
	};

	deviceViewer.Badge = Badge;
}(window));