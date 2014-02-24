/*jslint browser: true */
/*global $, CustomEvent*/
(function (window) {
    'use strict';

    var themeEditor = window.themeEditor,
        saveAs = window.saveAs,
        Blob = window.Blob,
        themeEditorConfig = themeEditor.config,
        cssClasses = {
            badge: 'theme-badge',
            badgeActive: 'theme-badge-active'
        },
        Badge = function () {
            this.element = null;
            this.modifiedVariables = {};
            this.modificationHistory = [{}]; // {cssVar: value}
            this.modificationHistoryIndex = 0;
            return this;
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

            /**
             * Current modified CSS / Less variable
             */
            this.currentCssVar = null;
        };

    function badgeClickHandler(self, event) {
        var badgeList = self.badgeList,
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
        self.setActive(index);
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

            console.log('Indeks', badge.modificationHistoryIndex, 'historyLength', badge.modificationHistory.length);
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

                        $('[data-css="' + lessVar + '"]').tooltip('option', 'content', 'Less variable: <b>' + lessVar + '</b>'
                                + '<br>Default Value: <b>' + defaultVar + '</b>'
                                + (modifiedVariables[lessVar] ? '<br>Current Value: <b data-bind="current-value">' + modifiedVariables[lessVar] + '</b>' : ''));
                    }
                }
            }
        }
    };
    /* **********************************************
     *             VARIABLE MANIPULATING
     ***********************************************/
    BadgePreview.prototype.changeColor = function (hsb, hex, rgb) {
        $('#widgetText').val('#' + hex);
        this.changeText();
    };

    BadgePreview.prototype.changeSlider = function (event) {
        var handler = event.currentTarget,
            parent = handler.parentNode,
            rangeMin = parseFloat(handler.getAttribute('data-min')),
            rangeMax = parseFloat(handler.getAttribute('data-max')),
            value = parseInt(handler.value, 10);

        value = (value + rangeMin) * (rangeMax - rangeMin) / 100;
        parent.querySelector('.range-current').innerHTML = value;

        $('#widgetText').val(value + 'px');
        this.changeText();
    };


    BadgePreview.prototype.changeText = function (refresh) {
        var cssVar = this.currentCssVar,
            activeBadge = this.getActive(),
            modifiedVariables = activeBadge.modifiedVariables,
            lessFrame = activeBadge.element.querySelector('iframe').contentWindow.less,
            handler = document.getElementById('widgetText');
        if (cssVar) {
            if (modifiedVariables[cssVar] !== handler.value || refresh) {
                modifiedVariables[cssVar] = handler.value;
                lessFrame.modifyVars(modifiedVariables);
            }
        } else {
            console.warn('Variable not selected!', cssVar, this);
        }

    };

    /* **********************************************
     *
     ***********************************************/
    BadgePreview.prototype.saveFile = function () {
        var documentFrame = this.getActive().element.querySelector('iframe').contentWindow.document,
            styleSheets = documentFrame.styleSheets,
            cssRules,
            css,
            i,
            j;

        // TODO fix absolute to relative paths
        css = '';
        for (i = styleSheets.length - 1; i >= 0; i -= 1) {
            cssRules = styleSheets[i].cssRules;
            for (j = cssRules.length - 1; j >= 0; j -= 1) {
                css += cssRules[j].cssText + "\n";
            }
        }
        saveAs(new Blob([css], {type: "text/css;charset=utf-8"}), "style.css");
    };

    BadgePreview.prototype.resizeViewport = function (widthValue, heightValue) {
        var styleSheet = this.styleSheet,
            cssRules = styleSheet.cssRules,
            lastStyle = {},
            i,
            ruleTxt = '',
            selector = '#workspace .' + cssClasses.badge + ', #workspace .' + cssClasses.badgeActive;

        for (i = cssRules.length - 1; i >= 0; i -= 1) {
            if (cssRules[i].selectorText === selector) {
                lastStyle.width = cssRules[i].style.width;
                lastStyle.height = cssRules[i].style.height;
                styleSheet.deleteRule(i);
                i = 0;
            }
        }

        if (widthValue) {
            ruleTxt += 'width: ' + (parseInt(widthValue, 10) || 0) + 'px !important;';
        } else {
            ruleTxt += lastStyle.width ? 'width: ' + lastStyle.width + '!important;' : '';
        }

        if (heightValue) {
            ruleTxt += 'height: ' + (parseInt(heightValue, 10) || 0) + 'px !important;';
        } else {
            ruleTxt += lastStyle.height ? 'height: ' + lastStyle.height + '!important;' : '';
        }

        styleSheet.insertRule(selector + '{ ' + ruleTxt + ' }', cssRules.length);

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

    BadgePreview.prototype.add = function (previewUrl) {
        var workspace = this.workspaceContainer,
            badge = new Badge(),
            badgeElement = document.createElement('div'),
            iframe = document.createElement('iframe');

        if (previewUrl === undefined) {
            previewUrl = themeEditorConfig.previewUrl;
        }

        badgeElement.className = cssClasses.badge;
        iframe.setAttribute('src', previewUrl);
        badgeElement.appendChild(iframe);

        badgeElement.addEventListener('click', badgeClickHandler.bind(null, this), false);


        workspace.appendChild(badgeElement);
        badge.element = badgeElement;

        this.badgeList.push(badge);
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

        // TODO: wrap it in loop with variable how many badges on init
        this.add();
        this.add();
        this.add();

        this.setActive(0);

    };

    themeEditor.badgePreview = new BadgePreview();
}(window));