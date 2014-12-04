/*jslint browser: true, white: true, regexp: true */
/*global window, $, console */

(function(window, $) {
	'use strict';

	var ThemeEditor = function() {
			/**
			 * Configuration of Device Viewer
			 */
			this.config = {
				/**
				 * Configuration of properties/variables that can be changed by editor
				 */
				themeProperties: {},
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
				 * leftPanel {HTMLElement} left panel container
				 */
				leftPanel: null,
				/**
				 * mainPanel {HTMLElement} main panel, contains workspace and columns
				 */
				mainPanel: null
			};

			this.cssClasses = {
				themeEditor: 'themeEditor',
				categoryPanel: 'category-panel',
				labelName: 'label-name',
				labelSelected: 'label-name-selected'
			};

			/**
			 * Holds all css variables that could by changed
			 */
			this.cssVariables = {};

			// Imports
			this.badgePreview = {}; //themeEditor.badgePreview.js

			this.colorPicker = {};

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
	 * @param {ThemeEditor} self Instance of Device Viewer
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

	function prepareWidgetText(defaultValue) {
		var widget = document.getElementById('widgetText');
		widget.value = defaultValue;
	}

	function prepareWidgetSlider(defaultValue, rangeMin, rangeMax, rangeUnit) {
		var widget = document.getElementById('widgetSlider'),
			parent = widget.parentNode,
			sliderValue;

		sliderValue = (parseInt(defaultValue, 10) - rangeMin) * 100 / (rangeMax - rangeMin);

		widget.setAttribute('data-min', rangeMin);
		widget.setAttribute('data-max', rangeMax);
		widget.setAttribute('data-unit', rangeUnit);

		parent.querySelector('.range-min').innerHTML = rangeMin;
		parent.querySelector('.range-max').innerHTML = rangeMax;
		parent.querySelector('.range-current').innerHTML = defaultValue + rangeUnit;

		widget.value = sliderValue;
	}

	function overwritePreviewUrl(previewProperties, previewUrl) {
		var badges = previewProperties.badges,
			i;

		for (i = 0; i < badges.length; i++) {
			badges[i].previewUrl = previewUrl;
		}
	}

	// TODO: rebuild choosing css variable
	function setCssVariable(self, event) {
		var element = event.currentTarget,
			cssVarName = element.getAttribute('data-css'),
			themeProperties = self.config.themeProperties,
			cssClasses = self.cssClasses,
			categoryProperties,
			categoryKey,
			label,
			labelKey;

		$('.' + cssClasses.labelSelected).removeClass(cssClasses.labelSelected).addClass(cssClasses.labelName);
		element.className = cssClasses.labelSelected;

		if (event.detail.historyAction !== true) {
			self.badgePreview.saveHistory(self.badgePreview.currentCssVar);
		}

		self.parseWidget(self.getCssVariable(cssVarName), cssVarName);
		self.badgePreview.currentCssVar = cssVarName;

		// TODO: do it more efficient
		// Search for all categories
		for (categoryKey in themeProperties) {
			if (themeProperties.hasOwnProperty(categoryKey)) {
				categoryProperties = themeProperties[categoryKey];
				// Search for all labels
				for (labelKey in categoryProperties) {
					if (categoryProperties.hasOwnProperty(labelKey)) {
						label = categoryProperties[labelKey];
						if (label.lessVar === cssVarName) {
							$('.panel-window').removeClass('hidden');
							if (label.widget.type === 'slider') {
								$('#panelColorpicker').closest('.panel-window').addClass('hidden');
							}
							if (label.widget.type === 'color') {
								$('#widgetSlider').closest('.panel-window').addClass('hidden');
							}
							if (label.widget.type === 'text') {
								$('#widgetSlider').closest('.panel-window').addClass('hidden');
								$('#panelColorpicker').closest('.panel-window').addClass('hidden');
							}
						}
					}
				}
			}
		}
	}

	ThemeEditor.prototype.getCssVariable = function(variable) {
		return this.cssVariables[variable] || null;
	};

	/**
	 * @method fixUI
	 * UI Fix. Keep badges and column always visible.
	 * Checks if topPanel doesn't cover it.
	 * @param {Event} event Resize event
	 */
	ThemeEditor.prototype.fixUI = function (event) {
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
	};

	/**
	 * @method resolvePath
	 * Resolves path relative to root path
	 * @param {string} rootPath The root path
	 * @param {string} queryPath The path that should be resolved relative to root path
	 * @returns {string} Resolved path
	 */
	ThemeEditor.prototype.resolvePath = function (rootPath, queryPath) {
		var rootPieces,
			queryPieces,
			path = [],
			relative,
			queryPathMatch,
			rootPathMatch,
			i;

		// Clean hash and query strings
		rootPath = rootPath.replace(/(\?|#).*$/ig, '');

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

	ThemeEditor.prototype.prepareWidgetColorPicker = function(value) {
		this.colorPicker.setColor(value);
	};

	ThemeEditor.prototype.setWidgetProperties = function(widgetParams, widgetDefault, cssVarName) {
		var $widgetText = $('#widgetText'),
			$lessVar = $('#lessVar'),
			$defaultVal = $('#defaultVal');

		$widgetText.val(widgetDefault);
		$widgetText.attr('title', widgetDefault);
		$lessVar.val(cssVarName);
		$lessVar.attr('title', cssVarName);
		$defaultVal.val(widgetParams.default);
		$defaultVal.attr('title', widgetParams.default);
	};

	ThemeEditor.prototype.parseWidget = function(widgetParams, cssVarName) {
		var widgetType = widgetParams.type.toLowerCase(),
			widgetDefault,
			modifiedVariables = this.badgePreview.getActive().modifiedVariables;

		widgetDefault = modifiedVariables[cssVarName] || widgetParams.default;
		switch (widgetType) {
			case 'text':
				prepareWidgetText(widgetDefault);
				break;

			case 'slider':
				prepareWidgetSlider(widgetDefault, widgetParams.min, widgetParams.max, widgetParams.unit);
				break;

			case 'color':
				this.prepareWidgetColorPicker(widgetDefault);
				break;

			default:
				console.warn('Unrecognized widget: ' + widgetType);
		}

		this.setWidgetProperties(widgetParams, widgetDefault, cssVarName);
	};

	/**
	 * Add variable item to panel
	 * @param {type} container
	 * @param {type} labelTitle
	 * @param {type} members
	 */
	ThemeEditor.prototype.addLabel = function(container, labelTitle, members) {
		var label = document.createElement('a'),
			classes = this.cssClasses,
			lessVar = members.lessVar;

		label.className = classes.labelName;
		label.innerHTML = labelTitle;
		label.setAttribute('data-css', lessVar);
		label.setAttribute('title', lessVar);
		container.appendChild(label);


		label.addEventListener('click', setCssVariable.bind(null, this), false);
		this.cssVariables[lessVar] = members.widget;
	};


	ThemeEditor.prototype.addCategoryItem = function(panel, title, members) {
		var panelTitle = document.createElement('h3'),
				panelContent = document.createElement('div'),
				labelName;

		panelTitle.innerHTML = title;

		for (labelName in members) {
			if (members.hasOwnProperty(labelName)) {
				this.addLabel(panelContent, labelName, members[labelName]);
			}
		}

		panel.appendChild(panelTitle);
		panel.appendChild(panelContent);
	};


	/**
	 * Build left column
	 * @method buildVariablePanel
	 */
	ThemeEditor.prototype.buildVariablePanel = function() {
		var themeProperties = this.config.themeProperties,
				classes = this.cssClasses,
				categoryName,
				container = this.config.leftPanel,
				leftColumn = document.createDocumentFragment(),
				categoryPanel = document.querySelector("div." + classes.categoryPanel);//document.createElement('div');

		if (categoryPanel) {
			categoryPanel.parentNode.removeChild(categoryPanel);
		}

		categoryPanel = document.createElement("div");

		categoryPanel.className = classes.categoryPanel;

		for (categoryName in themeProperties) {
			if (themeProperties.hasOwnProperty(categoryName)) {
				this.addCategoryItem(categoryPanel, categoryName, themeProperties[categoryName]);
			}
		}

		leftColumn.appendChild(categoryPanel);

		// Finally add all pannels to container
		container.classList.add(classes.themeEditor);
		container.appendChild(leftColumn);

		//Enhance by UI Widgets
		$(categoryPanel).accordion({
			collapsible: true,
			heightStyle: 'content'
		});
	};

	/**
	 * Builds widgets
	 */
	ThemeEditor.prototype.buildWidgets = function() {
		var widgetText = document.getElementById('widgetText'),
			widgetSlider = document.getElementById('widgetSlider');

		this.colorPicker = new this.ColorPicker(
			$('#panelColorpicker'),
			this.badgePreview.changeColor.bind(this.badgePreview)
		);

		if (widgetText) {
			widgetText.addEventListener('change', this.badgePreview.changeText.bind(this.badgePreview), false);
		}

		if (widgetSlider) {
			widgetSlider.addEventListener('change', this.badgePreview.changeSlider.bind(this.badgePreview), false);
		}
	};

	/**
	 * @method alert
	 * Shows an alert
	 * @param {string} message Message text
	 */
	ThemeEditor.prototype.alert = function(message) {
		// TODO: do it more cool
		window.alert(message);
	};

	/**
	 * @method fillDevicePresets
	 * Fills list of preset devices as li elements
	 * @param {Array} devList List of devices
	 * @param {HTMLElement} devListContainer List element
	 */
	ThemeEditor.prototype.fillDevicePresets = function (devList, devListContainer) {
		var devListLength = devList.length,
			self = this,
			tmpElement,
			tmpContainer,
			displayWidth,
			displayHeight,
			i;

		while (devListContainer.firstChild) {
			devListContainer.removeChild(devListContainer.lastChild);
		}

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
	ThemeEditor.prototype.buildAppSelect = function (appList) {
		var appSelect,
			appListLength = appList.length,
			tmpElement,
			i;

		if (appListLength <= 0) {
			throw 'No preview app was define! You have to define at least one app to preview.';
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

	ThemeEditor.prototype.getProperties = function (fileName) {
		var xhr = new XMLHttpRequest();
		try {
			xhr.open("GET", "json/" + fileName, false);
			xhr.send();
			return JSON.parse(xhr.responseText);
		} catch (e) {
			this.alert(e);
		}
		return {};
	};

	ThemeEditor.prototype.bindEvents = function () {
		var $restoreBtn = $('#action-restore');

		$restoreBtn.on('click', function onClick() {
			prepareWidgetText($('#defaultVal').val());
		}).on('click', this.badgePreview.changeText.bind(this.badgePreview));

	};

	/**
	 * Setup properties and initialize Device Viewer.
	 * @method init
	 * @param {Object} properties
	 */
	ThemeEditor.prototype.init = function(properties) {
		var config = this.config,
			self = this,
			devicesList = document.getElementById('devicesList'),
			currentProfile = "wearable",
			currentTheme = "default",
			configProperties = null;

		// Set Device's Viewer root path defined by properties or set default (current location href).
		config.root = properties.root || window.location.origin + window.location.pathname.replace(/[^\/]+\.html?$/, '');

		// Set workspace defined by properties or get default workspace
		config.workspace = document.getElementById(properties.workspaceElementId || 'workspace');

		// Set topPanel defined by properties or get default top panel
		config.topPanel = document.getElementById(properties.topPanelElementId || 'topPanel');

		// Set leftPanel defined by properties or get default let panel
		config.leftPanel = document.getElementById(properties.leftPanelElementId || 'leftPanel');

		// Set mainPanel defined by properties or get default main panel
		config.mainPanel = document.getElementById(properties.mainPanelElementId || 'mainPanel');

		// Fill select options with app names, that are ready to preview. Assign reference to select with app list.
		config.appSelect = this.buildAppSelect(properties.appList);

		// Set preview url of selected app
		config.previewUrl = this.resolvePath(config.root, config.appSelect.value);

		config.themeProperties = this.getProperties(currentProfile + "." + currentTheme + ".properties.json") || {};

		configProperties = this.getProperties(currentProfile + ".config.json") || {};

		config.themeRoot = this.resolvePath(config.root,  configProperties.themes[currentTheme]);

		config.themeFile = 'theme.less';

		this.fillDevicePresets(configProperties.devList, devicesList);

		// Ready to go, let's init Badge Preview!
		overwritePreviewUrl(configProperties.previewProperties, config.previewUrl);
		this.badgePreview.init(configProperties.previewProperties);

		this.buildVariablePanel();
		document.addEventListener("tauInfo", function (evt) {
			var themeProperties = null,
				tauInfo = evt.detail;

			if (tauInfo) {
				if (currentProfile !== tauInfo.profile || currentTheme !== tauInfo.theme) {
					themeProperties = self.getProperties(tauInfo.profile + "." + tauInfo.theme + ".properties.json");
					configProperties = self.getProperties(tauInfo.profile + ".config.json");

					if (configProperties) {
						self.fillDevicePresets(configProperties.devList, devicesList);
						config.themeRoot = self.resolvePath(config.root,  configProperties.themes[tauInfo.theme]);
						overwritePreviewUrl(configProperties.previewProperties, config.previewUrl);
						self.badgePreview.init(configProperties.previewProperties);
					}

					if (themeProperties) {
						config.themeProperties = themeProperties;
						self.buildVariablePanel();
					}

					currentProfile = tauInfo.profile;
					currentTheme = tauInfo.theme;
				}
			}
		});
		this.buildWidgets();

		// Fix UI
		this.fixUI();

		// Add ui fixing after window resize
		fixUIBound = this.fixUI.bind(this);
		window.addEventListener('resize', fixUIBound, false);

		this.bindEvents();

	};

	window.themeEditor = new ThemeEditor();
}(window, $));
