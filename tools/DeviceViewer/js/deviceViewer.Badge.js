/*jslint browser: true, white: true */
/*global CustomEvent*/
(function (window) {
	'use strict';

	var deviceViewer = window.deviceViewer,
		cssClasses = {
			badge: 'theme-badge',
			badgeActive: 'theme-badge-active',
			navBar: 'badge-navbar',
			historyBack: 'badge-history-back',
			historyForward: 'badge-history-forward'
		},
		Badge = function () {
			this.badgePreview = null;
			this.element = null;
            this.iframeElement = null;
			this.modifiedVariables = {};
			this.modificationHistory = [{}]; // {cssVar: value}
			this.modificationHistoryIndex = 0;
			this.contentWindow = null;
			this.historyPosition = 0;

			this.historyBackBound = null;
			this.historyForwardBound = null;

			return this;
		};


	function badgeClickHandler(badgePreview, event) {
		var badgeList = badgePreview.badgeList,
			currentBadge = event.currentTarget,
			index = 0,
			i;

		// Find current badge
		for (i = badgeList.length - 1; i >= 0; i -= 1) {
			if (badgeList[i].element === currentBadge) {
				index = i;
				i = 0;
			}
		}
		badgePreview.setActive(index);
	}

	function historyTraverse (self, direction) {
		var history = self.contentWindow.history;

		switch (direction) {
			case 'back':
				self.contentWindow.tau.back();
				break;
			case 'forward':
				history.forward();
				break;
		}
	}

	function badgeLoad (self, event) {
		var iframe = event.srcElement,
			scriptTag,
			styleTag,
			linkTag,
			lessConfig,
			frameDocument = iframe.contentDocument,
			frameDocumentHead = frameDocument.head,
			frameStyleSheets = frameDocument.styleSheets,
			root = deviceViewer.config.root,
			themeRoot = deviceViewer.config.themeRoot,
			badgePreview = self.badgePreview,
			i;

		styleTag = frameDocument.createElement('style');
		// @TODO: remove when scrollbar will be styled in tau less files
		styleTag.textContent = '::-webkit-scrollbar{ width: 5px; border-radius:3px; }' +
			'::-webkit-scrollbar-track{ border-radius:3px; background: transparent; }' +
			'::-webkit-scrollbar-thumb{ border-radius: 2px; background: #777777; }' +
			'::-webkit-scrollbar-track-piece { height: 30px; }';

		frameDocumentHead.appendChild(styleTag);

		// Cache contentWindow
		self.contentWindow = iframe.contentWindow;
	}

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

	Badge.prototype.build = function (workspace, url, badgePreview) {
		var badgeElement,
			iframe;

		this.badgePreview = badgePreview;

		// Create badge container
		badgeElement = document.createElement('div');
		badgeElement.className = cssClasses.badge;
		badgeElement.addEventListener('click', badgeClickHandler.bind(null, badgePreview), false);
		this.element = badgeElement;

		// Build navigation bar
		this.buildNavigationBar();

		// Create iframe - theme holder
		iframe = document.createElement('iframe');
		iframe.setAttribute('src', url);
		badgeElement.appendChild(iframe);
		iframe.onload = badgeLoad.bind('', this);
        this.iframeElement = iframe;

		// Append to workspace
		workspace.appendChild(badgeElement);
	};

	Badge.prototype.changeUrl = function (url) {
		var self = this,
			element = self.element,
			iframe;


		// Replace current iframe...
		iframe = this.iframeElement;
		iframe.parentNode.removeChild(iframe);

		// ... with new one.
		iframe = document.createElement('iframe');
		iframe.setAttribute('src', url);
		element.appendChild(iframe);
        this.iframeElement = iframe;

		iframe.onload = badgeLoad.bind('', this);
	};

	Badge.prototype.destroy = function () {
		//@TODO write destroy method
		this.element.removeEventListener('click', badgeClickHandler.bind(null, this.badgePreview), false);
	};

	deviceViewer.Badge = Badge;
}(window));