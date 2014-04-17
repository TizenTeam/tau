/*jslint browser: true, white: true */
/*global $, CustomEvent, Uint8Array, JSZip*/
(function (window) {
	'use strict';

	var themeEditor = window.themeEditor,
		saveAs = window.saveAs,
		Blob = window.Blob,
		themeEditorConfig = themeEditor.config,
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
			this.cachedRules = {};
			this.colorSwatches = {};

			/**
			 * Current modified CSS / Less variable
			 */
			this.currentCssVar = null;
		},
		// Number of files needed to be load for ZIP archive
		filesToLoad = 0;

	function addToZip(httpRequest, fileName, zipFolder, zipRoot) {
		if (httpRequest.readyState === 4) {
			var fileData = new Uint8Array(httpRequest.response);

			// Add new file to zip
			zipFolder.file(fileName, fileData, {base64: true, binary: true});

			// Decrement number of files to load
			filesToLoad -= 1;

			// Download ZIP file if all files were downloaded
			if (filesToLoad === 0) {
				saveAs(new Blob([zipRoot.generate({type:"blob"})], {type: "application/zip;base64"}), "custom-theme.zip");
			}
		}

	}

	function prepareToZip(url, destinationPath, zip, zipDir) {
		var httpRequest,
			path,
			fileName,
			dirName = '',
			zipRoot,
			i;

		path = destinationPath.split('/');

		// remove '..'
		path.shift();
		fileName = path.pop();

		// Save root of a ZIP archive
		zipRoot = zip;
		for (i = 0; i < path.length; i += 1) {
			dirName = dirName + '/' + path[i];
			if (zipDir[dirName] === undefined) {
				zipDir[dirName] = zip.folder(path[i]);
			}
			zip = zipDir[dirName];
		}

		httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = addToZip.bind('', httpRequest, fileName, zip, zipRoot);
		httpRequest.open("GET", url, true);
		httpRequest.setRequestHeader("Cache-Control", "no-cache");
		httpRequest.responseType = "arraybuffer";
		httpRequest.send();
	}

	BadgePreview.prototype.historyJump = function (jump) {
		var badge = this.getActive(),
			modifiedVariables,
			historyEntry,
			variable,
			element;

		badge.modificationHistoryIndex += jump;

		if (badge.modificationHistoryIndex < 0) {
			themeEditor.alert('I can\'t undo! No history entires available!');
			badge.modificationHistoryIndex -= jump;
		} else if (badge.modificationHistoryIndex >= badge.modificationHistory.length) {
			themeEditor.alert('I can\'t redo! No history entires available!');
			badge.modificationHistoryIndex -= jump;
		} else {
			historyEntry = badge.modificationHistory[badge.modificationHistoryIndex];
			modifiedVariables = badge.modifiedVariables;
			for (variable in modifiedVariables) {
				if (modifiedVariables.hasOwnProperty(variable)) {
					if (!historyEntry.variableList || !historyEntry.variableList[variable]) {
						delete modifiedVariables[variable];
					}
				}
			}

			modifiedVariables[historyEntry.cssVar] = historyEntry.value;
			if (historyEntry.cssVar) {
				element = document.querySelector('[data-css="' + historyEntry.cssVar + '"]');
			} else {
				element = document.querySelector('[data-css]');
			}
			element.dispatchEvent(new CustomEvent('click', {"detail": {"historyAction": true}}));

			this.changeText(true);

			//Navigation
			if (badge.modificationHistoryIndex > 0 && badge.modificationHistory.length > 0) {
				document.getElementById('historyUndo').classList.remove('disabled');
			} else {
				document.getElementById('historyUndo').classList.add('disabled');
			}


			if (badge.modificationHistoryIndex < badge.modificationHistory.length - 1 &&  badge.modificationHistory.length > 0) {
				document.getElementById('historyRedo').classList.remove('disabled');
			} else {
				document.getElementById('historyRedo').classList.add('disabled');
			}

		}
	};

	BadgePreview.prototype.historyUndo = function () {
		this.historyJump(-1);
	};

	BadgePreview.prototype.historyRedo = function () {
		this.historyJump(1);
	};

	BadgePreview.prototype.saveHistory = function (currentCssVar) {
		var badge = this.getActive(),
			currentCssValue,
			modificationHistory,
			modifiedVariables,
			lastEntry = {},
			i,
			tmp,
			variableList = {},
			historyLength;

		if (badge) {
			modifiedVariables = badge.modifiedVariables;
			currentCssVar = this.currentCssVar;
			currentCssValue = modifiedVariables[currentCssVar];
			modificationHistory = badge.modificationHistory;

			//Find last current css variable modification
			historyLength = modificationHistory.length;
			for (i = 0; i < historyLength; i += 1) {
				if (modificationHistory[i].cssVar === currentCssVar) {
					lastEntry = modificationHistory[i];
				}
			}

			if ((lastEntry.cssVar !== currentCssVar || lastEntry.value !== currentCssValue) && currentCssValue) {
				//Remove further history
				modificationHistory.splice(badge.modificationHistoryIndex + 1);

				for (tmp in modifiedVariables) {
					if (modifiedVariables.hasOwnProperty(tmp)) {
						variableList[tmp] = true;
					}
				}
				//Add new entry
				modificationHistory.push({
					'cssVar': currentCssVar,
					'value': currentCssValue,
					'variableList': variableList
				});
				//Update history index
				badge.modificationHistoryIndex = modificationHistory.length - 1;

				//Navigation
				document.getElementById('historyRedo').classList.add('disabled');
				document.getElementById('historyUndo').classList.remove('disabled');
			}
		}

	};

	BadgePreview.prototype.updateLabels = function () {
		var modifiedVariables = this.getActive().modifiedVariables,
			themeProperties = themeEditor.config.themeProperties,
			categoryProperties,
			categoryKey,
			label,
			labelKey,
			defaultVar,
			lessVar;

		// TODO: do it more efficient
		// Search for all categories
		for (categoryKey in themeProperties) {
			if (themeProperties.hasOwnProperty(categoryKey)) {
				categoryProperties = themeProperties[categoryKey];
				// Search for all labels
				for (labelKey in categoryProperties) {
					if (categoryProperties.hasOwnProperty(labelKey)) {
						label = categoryProperties[labelKey];
						defaultVar = label.widget.default;
						lessVar = label.lessVar;

						$('[data-css="' + lessVar + '"]').tooltip('option', 'content', 'Less variable: <b>' + lessVar + '</b>' +
								'<br>Default Value: <b>' + defaultVar + '</b>' +
								(modifiedVariables[lessVar] ? '<br>Current Value: <b data-bind="current-value">' + modifiedVariables[lessVar] + '</b>' : ''));
					}
				}
			}
		}
	};
	/* **********************************************
	 *             VARIABLE MANIPULATING
	 ***********************************************/
	BadgePreview.prototype.changeColor = function (hsb, hex, rgb) {
		document.getElementById('widgetText').value = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
		this.changeText();
	};

	BadgePreview.prototype.changeSlider = function (event) {
		var handler = event.currentTarget,
			parent = handler.parentNode,
			rangeMin = parseFloat(handler.getAttribute('data-min')),
			rangeMax = parseFloat(handler.getAttribute('data-max')),
			rangeUnit = handler.getAttribute('data-unit'),
			value = parseInt(handler.value, 10);

		value = (rangeMax - rangeMin) * value / 100 + rangeMin;

		parent.querySelector('.range-current').innerHTML = value + rangeUnit;
		document.getElementById('widgetText').value = value + rangeUnit;
		this.changeText();
	};


	BadgePreview.prototype.changeText = function (refresh) {
		var cssVar = this.currentCssVar,
			activeBadge = this.getActive(),
			modifiedVariables = activeBadge.modifiedVariables,
			lessFrame = activeBadge.iframeElement.contentWindow.less,
			handler = document.getElementById('widgetText');

		if (cssVar) {
			if (modifiedVariables[cssVar] !== handler.value || refresh) {
				modifiedVariables[cssVar] = handler.value;
				lessFrame.modifyVars(modifiedVariables);
			}
		} else {
			lessFrame.modifyVars(modifiedVariables);
		}
	};

	/* **********************************************
	 *
	 ***********************************************/
    BadgePreview.prototype.importTheme = function (txt) {
        var activeBadge = this.getActive(),
            lines,
            line,
            importedVariables = {},
            i;

        txt = txt.previousElementSibling.value;
        lines = txt.split(/\r?\n/ig);

        for (i = lines.length - 1; i >= 0; i -= 1) {
            line = lines[i].trim();

            if (line.match(/^@[a-z0-9_\-]/i)) {
                line = line.split(':', 2);
                importedVariables[line[0]] = line[1].replace(';\s?$', '');
            }
        }

        activeBadge.modifiedVariables = importedVariables;
        this.changeText(true);
    }

	BadgePreview.prototype.saveFile = function () {
		var self = this,
			themeRoot = themeEditorConfig.themeRoot;

		// Load less file to be parsed
		$.get(themeRoot + 'tau.less', function(data){
			var badgeLess,
				badgeLessParser,
				lessString = '',
                cssHeader = '',
				activeBadge = self.getActive(),
				modifiedVariables,
				tmpName;

			// Retrieve less object from badge
			badgeLess = activeBadge.contentWindow.less;

			// Create less parser
			badgeLessParser = new(badgeLess.Parser)({
				filename: themeRoot + 'tau.less'
			});

			// Get modified less variables
			modifiedVariables = activeBadge.modifiedVariables;

			// Overwrite less variables
			for(tmpName in modifiedVariables) {
				if (modifiedVariables.hasOwnProperty(tmpName)) {
					lessString += '\n' + tmpName + ': ' + modifiedVariables[tmpName];
				}
			}

            // Prepare header for css file
            cssHeader += '/*\nThis file was generated by Theme Editor at ' + (new Date());
            cssHeader += '\nTo import this theme paste the code between marks to import window\n\n--------------------  ---------------------\n';
            cssHeader += lessString;
            cssHeader += '\n\n--------------------  ---------------------\n*/\n\n';

            // Assign response less
            lessString = data;

			// Parse received less file and finally save response with resources in ZIP file
			badgeLessParser.parse(lessString, function (e, tree) {
				var cssContent,
					absolutePaths,
					fileRelativePath,
					filePath,
					zipDir = {},
					zip,
					i;

				// Get css content
				cssContent = cssHeader + tree.toCSS();

				// Init ZIP archive
				zip = new JSZip();

				// Match urls - search for resources
				absolutePaths = cssContent.match(/url\(([^)]+)\)/gi) || [];

				// Remove duplicates
				absolutePaths = absolutePaths.filter(function(value, index, array){
					return array.indexOf(value) === index;
				});

				filesToLoad = absolutePaths.length;
				for (i = filesToLoad - 1; i >= 0; i -= 1) {
					// Remove url() wrapper
					filePath = absolutePaths[i].replace(/^url *\(['|"]?/i, '').replace(/['|"]?\)$/, '');

					// Check if filePath has relative path
					if (!(/^[a-z]+:\/\//.test(filePath))) {
						// Remove first first / sign
						filePath = filePath.replace('^\/', '');
						filePath = themeRoot + filePath;
					}

					// Resolve relative path to themeRoot
					fileRelativePath = themeEditor.resolvePath(themeRoot + 'css/', filePath);

					// Prepare file to adding it to ZIP archive
					prepareToZip(filePath, fileRelativePath, zip, zipDir);

				}
				// Add css file
				zip.folder('css').file('tau.css', cssContent);

			});
		});
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
			themeEditor.alert('I can\'t remove it! You need to have at least one badge.');
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
			previewUrl = themeEditorConfig.previewUrl;
		}

		// Create new Badge
		badge = new themeEditor.Badge();
		badge.build(workspace, previewUrl, self);

		// Push badge to list
		this.badgeList.push(badge);

		return badge;
	};

	BadgePreview.prototype.setActive = function (index) {
		var badgeList = this.badgeList,
			i;

		this.saveHistory();
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

		this.workspaceContainer = themeEditorConfig.workspace;
		for (i = styleSheets.length - 1; i >= 0; i -= 1) {
			sheet = styleSheets[i];
			if (sheet.title === 'themeEditor') {
				this.styleSheet = sheet;
				i = 0;
			}
		}

		this.add();
		this.setActive(0);

	};

	themeEditor.badgePreview = new BadgePreview();
}(window));