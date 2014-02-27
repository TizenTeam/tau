/*jslint browser: true */
/*global $, CustomEvent*/
(function (window) {
	'use strict';

	var themeEditor = window.themeEditor,
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
				self.contentWindow.gear.ui.back();
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
			root = themeEditor.config.root,
			badgePreview = self.badgePreview;

		// Add LESS file
		linkTag = frameDocument.createElement('link');
		linkTag.setAttribute('rel', 'stylesheet/less');
		linkTag.setAttribute('type', 'text/css');
		linkTag.setAttribute('href', root + '../../standalone/src/css/themes/black/gear.ui.less');
		frameDocumentHead.appendChild(linkTag);

		// Add LESS configuration
		lessConfig = {
			env: "production", //  production/development
			async: false, // load imports async
			fileAsync: false, // load imports async when in a page under a file protocol
			poll: 1000, // when in watch mode, time in ms between polls
			functions: {}, // user functions, keyed by name
			dumpLineNumbers: "all", // or "mediaQuery" or "all"
			errorReporting: 'console',
			relativeUrls: false // whether to adjust url's to be relative if false, url's are already relative to the entry less file
		};
		scriptTag = frameDocument.createElement('script');
		scriptTag.textContent = 'less = ' + JSON.stringify(lessConfig);
		frameDocumentHead.appendChild(scriptTag);

		styleTag = frameDocument.createElement('style');
		styleTag.textContent = '::-webkit-scrollbar{ width: 5px; border-radius:3px; }' +
			'::-webkit-scrollbar-track{ border-radius:3px; background: transparent; }' +
			'::-webkit-scrollbar-thumb{ border-radius: 2px; background: #777777; }' +
			'::-webkit-scrollbar-track-piece { height: 30px; }';
		frameDocumentHead.appendChild(styleTag);


		// Add LESS library
		scriptTag = frameDocument.createElement('script');
		scriptTag.src = root + 'lib/less-1.6.0.min.js';
		//scriptTag.src = root + 'lib/less-1.6.3.js';
		frameDocumentHead.appendChild(scriptTag);

		// Cache contentWindow
		self.contentWindow = iframe.contentWindow;
		//iframe.contentDocument.addEventListener('click', function(e){console.log(e.srcElement, e)}, false);
		// Refresh baddge if less is loaded
		scriptTag.onload = badgePreview.changeText.bind(badgePreview, true);

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

		this.element.appendChild(container);
	};

	Badge.prototype.build = function (parentElement, url, badgePreview) {
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

		// Append to workspace
		workspace.appendChild(badgeElement);
	};

	Badge.prototype.changeUrl = function (url, root) {
		var self = this,
			element = self.element,
			iframe;


		// Replace current iframe...
		iframe = element.querySelector('iframe');
		iframe.parentNode.removeChild(iframe);

		// ... with new one.
		iframe = document.createElement('iframe');
		iframe.setAttribute('src', url);
		element.appendChild(iframe);

		iframe.onload = badgeLoad.bind('', this);
	};

	Badge.prototype.destroy = function () {
		//@TODO write destroy method
		this.element.removeEventListener('click', badgeClickHandler.bind(null, badgePreview), false);
	};

	themeEditor.Badge = Badge;
}(window));