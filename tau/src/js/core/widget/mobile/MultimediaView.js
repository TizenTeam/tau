/*global window, define, ns */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
* MultimediaView widget
* @class ns.widget.MultimediaView
* @extends ns.widget.mobile.BaseWidgetMobile
* @author Maciej Urbanski <m.urbanski@samsung.com>
* @author Tomasz Lukawski <t.lukawski@samsung.com>
*/
(function (window, document, ns) {
	'use strict';
	//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
	define(
		[
			'../../engine',
			'../../events',
			'../../widget',
			'../../theme',
			'../../support',
			'../../utils/DOM/manipulation',
			'../../utils/DOM/css',
			'../../utils/DOM/attributes',
			'../../utils/selectors',
			'../../utils/object',
			'../../utils/events',
			'./BaseWidgetMobile',
			"../../../profile/mobile/widget/mobile/Button",
			'../../../profile/mobile/widget/mobile/Page',
			'../../../profile/mobile/widget/mobile/Scrollview',
			'../../../profile/mobile/widget/mobile/Slider',
			'../../../profile/mobile/widget/mobile/Progressbar'
		],
		function () {
			//>>excludeEnd('tauBuildExclude');
				/**
				* Local alias for ns.widget.mobile.BaseWidgetMobile
				* @property {Function} BaseWidgetMobile Alias for {@link ns.widget.mobile.BaseWidgetMobile}
				* @member ns.widget.MultimediaView
				* @static
				* @private
				*/
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* Local alias for ns.engine
				* @property {Object} engine Alias for {@link ns.engine}
				* @member ns.widget.MultimediaView
				* @static
				* @private
				*/
				engine = ns.engine,
				/**
				* Local alias for ns.utils.events
				* @property {Object} engine Alias for {@link ns.utils.events}
				* @member ns.widget.MultimediaView
				* @static
				* @private
				*/
				events = ns.utils.events,
				/**
				* Local alias for ns.utils
				* @property {Object} engine Alias for {@link ns.utils}
				* @member ns.widget.MultimediaView
				* @static
				* @private
				*/
				utils = ns.utils,
				/**
				* Local alias for ns.utilsTheme
				* @property {Object} engine Alias for {@link ns.theme}
				* @member ns.widget.MultimediaView
				* @static
				* @private
				*/
				utilsTheme = ns.theme,
				/**
				* Local alias for ns.utils.object
				* @property {Object} utilsDOM Alias for {@link ns.utils.object}
				* @member ns.widget.MultimediaView
				* @static
				* @private
				*/
				utilsObject = ns.utils.object,
				/**
				* Local alias for ns.utils.DOM.manipulation & ns.utils.DOM.css & ns.utils.DOM.attributes
				* @property {Object} utilsDOM Alias for {@link ns.utils.DOM.*}
				* @member ns.widget.MultimediaView
				* @static
				* @private
				*/
				utilsDOM = ns.utils.DOM,
				/**
				* Local alias for ns.utils.selectors
				* @property {Object} utilsSelectors Alias for {@link ns.utils.selectors}
				* @member ns.widget.MultimediaView
				* @static
				* @private
				*/
				utilsSelectors = ns.utils.selectors,
				/**
				 * Local alias for classes of Page widget
				 * @property {Object} Page Alias for {@link ns.widget.mobile.Page}
				 */
				pageClasses = ns.widget.mobile.Page.classes,
				/**
				 * Local alias for classes of Button widget
				 * @property {Object} Button Alias for {@link ns.widget.mobile.Button}
				 */
				buttonClasses = ns.widget.mobile.Button.classes,
				/**
				 * Local alias for classes of Scrollview widget
				 * @property {Object} Scrollview Alias for {@link ns.widget.mobile.Scrollview}
				 */
				scrollviewClasses = ns.widget.mobile.Scrollview.classes,
				/**
				 * Local alias for classes of Progressbar widget
				 * @property {Object} Progressbar Alias for {@link ns.widget.mobile.Progressbar}
				 */
				progressbarClasses = ns.widget.mobile.Progressbar.classes,
				/**
				 * Local alias for classes of Progressbar widget
				 * @property {Object} Progressbar Alias for {@link ns.widget.mobile.Progressbar}
				 */
				sliderClasses = ns.widget.mobile.Slider.classes,
				/**
				* Alias to Array.slice
				* @method slice
				* @member ns.widget.MultimediaView
				* @static
				* @private
				*/
				slice = [].slice,

				POINTER_CLICK_EVENT = 'vclick',
				POINTER_MOVE_EVENT = 'vmousemove',
				POINTER_DOWN_EVENT = 'vmousedown',
				POINTER_UP_EVENT = 'vmouseup',
				MEDIA_POSITION_CHANGE_TIMEOUT = 200, //[ms]
				FULLSCREEN_DELAY = 300, //[]ms

				MultimediaView = function () {
					var self = this;
					/**
					* @property {Object} options
					* @property {Object} options.controls=true Sets the controls for the widget.
					* @property {Object} options.fullScreen=false Defines whether the widget opens in the fullscreen view mode.
					* @property {Object} [options.theme] Sets the widget theme. If the value is not set, the parent control's theme is used.
					*/
					self.options = {
						controls: true,
						fullScreen: false,
						theme: ''
					};
					self.role = null;
					self.controlTimer = null;
					self.isVolumeHide = true;
					self.backupView = null;
					self._reserveVolume = -1;
					self._isVideo = false;
					self.isVolumeHide = false;
					self._progressBarPressed = false;
					self._changeMediaPositionTimeout = null;
				},
				/**
				 * Local variable for MultimediaView prototype object
				 * @property {ns.widget.mobile.BaseWidgetMobile} MultimediaViewPrototype
				 * @member ns.widget.MultimediaView
				 * @private
				 * @static
				 */
				MultimediaViewPrototype = new BaseWidget(),
				/**
				 * Prefix of classes
				 * @property PREFIX
				 * @member ns.widget.MultimediaView
				 * @private
				 * @static
				 */
				PREFIX = 'ui-multimediaview',
				/**
				 * Local alias for MultimediaView.classes
				 * @property {Object} classes {@link ns.widget.MultimediaView.classes}
				 * @static
				 * @private
				 */
				classes = {
					VIEW: PREFIX,
					VIDEO: PREFIX + '-video',
					WRAP: PREFIX + '-wrap',
					THEME_PREFIX: PREFIX + '-',
					BAR: PREFIX + '-bar',
					BAR_BACKGROUND: PREFIX + '-bar-bg',
					BAR_HIGHLIGHT: PREFIX + '-bar-highlight',
					// control bar
					CONTROL: PREFIX + '-control',
					PLAY_PAUSE: 'ui-playpausebutton',
					MUTE_ICON: 'ui-mute-icon',
					SEEK_BAR: 'ui-seekbar',
					DURATION_LABEL: 'ui-durationlabel',
					PLAY_ICON: 'ui-play-icon',
					PAUSE_ICON: 'ui-pause-icon',
					TIMESTAMP_LABEL: 'ui-timestamplabel',
					VOLUME_BAR: 'ui-volumebar',
					VOLUME_ICON: 'ui-volume-icon',
					VOLUME_BUTTON: 'ui-volumebutton',
					VOLUME_CONTROL: 'ui-volumecontrol',
					VOLUME_VALUE: 'ui-value',
					VOLUME_HANDLE: 'ui-handle',
					VOLUME_GUIDE: 'ui-guide',
					FULLSCREEN_BUTTON: 'ui-fullscreenbutton',
					FULLSCREEN_ON: 'ui-fullscreen-on',
					FULLSCREEN_OFF: 'ui-fullscreen-off',
					DURATION: 'ui-duration',
					CURRENT_TIME: 'ui-currenttime',
					BUTTON: 'ui-button',
					BUTTON_DOWN: 'ui-button-down',
					BUTTON_CORNER_ALL: buttonClasses.uiBtnCornerAll,
					BUTTON_CORNER_CIRCLE: buttonClasses.uiBtnCornerCircle,
					SHADOW: buttonClasses.uiShadow,
					PAGE_ACTIVE: pageClasses.uiPageActive,
					PAGE: pageClasses.uiPage
				},
				/**
				 * Selectors using in MultimediaView widget
				 * @property {Object} classes {@link ns.widget.MultimediaView.classes}
				 * @static
				 * @private
				 */
				selectors = {
					BUTTONS: '.' + classes.BUTTON,
					VOLUME_HANDLE: '.' + classes.VOLUME_CONTROL + ' .' + classes.VOLUME_HANDLE,
					WRAP: '.' + classes.WRAP,
					CONTROL: '.' + classes.CONTROL,
					SCROLLVIEW_CLIP: '.' + scrollviewClasses.clip,
					PROGRESS_BAR_BG: '.' + progressbarClasses.uiProgressbarBg,
					PROGRESS_BAR_VALUE: '.' + progressbarClasses.uiProgressbarValue,
					SLIDER_CONTAINER: '.' + sliderClasses.sliderContainer,
					SLIDER: '.' + sliderClasses.sliderContainer + ' .' + sliderClasses.slider
				},
				/**
				 * Name of video tag
				 * @property {string} VIDEO_TAG_NAME
				 */
				VIDEO_TAG_NAME = 'VIDEO',
				/**
				 * Tag for label of media duration
				 * @property {string} DURATION_LABEL_TAG_NAME
				 */
				DURATION_LABEL_TAG_NAME = 'p';

			/**
			* @property {Object} classes
			* @member ns.widget.MultimediaView
			* @static
			*/
			MultimediaView.classes = classes;

			/**
			* The method builds HTML structure of control panel
			* @method _createControl
			* @return {HTMLElement}
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			*/
			MultimediaViewPrototype._createControl = function () {
				var self = this,
					view = self.element,
					control = document.createElement('span'),
					playpauseButton = control.cloneNode(),
					seekBar = control.cloneNode(),
					timestampLabel = control.cloneNode(),
					durationLabel = control.cloneNode(),
					volumeButton = control.cloneNode(),
					volumeControl = control.cloneNode(),
					volumeBar = control.cloneNode(),
					fullscreenButton = control.cloneNode(),
					durationBar = control.cloneNode();

				volumeBar.innerHTML = '<input type="range" value="25" min="0" max="100" data-highlight="true" >';
				volumeBar = volumeBar.childNodes[0];

				self.ui = utilsObject.merge(self.ui, {
					control: control,
					playpauseButton: playpauseButton,
					seekBar: seekBar,
					timestampLabel: timestampLabel,
					durationLabel: durationLabel,
					volumeButton: volumeButton,
					volumeControl: volumeControl,
					volumeBar: volumeBar,
					fullscreenButton: fullscreenButton,
					durationBar: durationBar
				});

				timestampLabel.innerHTML = '<p>00:00:00</p>';
				durationLabel.innerHTML = '<p>00:00:00</p>';

				control.classList.add(classes.CONTROL, 'fade-out');

				durationLabel.classList.add(classes.DURATION_LABEL);
				playpauseButton.classList.add(classes.PLAY_PAUSE);
				playpauseButton.classList.add(classes.BUTTON);
				playpauseButton.classList.add(classes.PLAY_ICON);
				seekBar.classList.add(classes.SEEK_BAR);
				seekBar.classList.add(classes.BAR);
				timestampLabel.classList.add(classes.TIMESTAMP_LABEL);
				durationLabel.classList.add(classes.DURATION_LABEL);
				volumeButton.classList.add(classes.VOLUME_BUTTON);
				volumeButton.classList.add(classes.BUTTON);
				volumeControl.classList.add(classes.VOLUME_CONTROL);
				volumeBar.classList.add(classes.VOLUME_BAR);
				volumeBar.classList.add(classes.BAR);
				fullscreenButton.classList.add(classes.FULLSCREEN_BUTTON);
				fullscreenButton.classList.add(classes.BUTTON);
				durationBar.classList.add(classes.DURATION);

				seekBar.appendChild(durationBar);
				seekBar.appendChild(durationLabel);
				seekBar.appendChild(timestampLabel);

				volumeButton.classList.add(view.muted ? classes.MUTE_ICON : classes.VOLUME_ICON);

				volumeControl.appendChild(volumeBar);

				control.appendChild(playpauseButton);
				control.appendChild(seekBar);
				control.appendChild(volumeControl);
				control.appendChild(volumeButton);

				if (self._isVideo) {
					fullscreenButton.classList.add(classes.FULLSCREEN_ON);
					control.appendChild(fullscreenButton);
				}

				slice.call(control.querySelectorAll(selectors.BUTTONS), 0).forEach(function (element) {
					element.classList.add(classes.SHADOW);
					element.classList.add(classes.BUTTON_CORNER_ALL);
				});

				return control;
			};

			/**
			* The width method is used to get (if no value is defined)
			*  or set the multimedia view widget width
			* @method width
			* @param {number} [value=undefined]
			* @return {number|null} width Width value or null if fullScreen option is enabled
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			*/
			MultimediaViewPrototype.width = function (value) {
				var self = this,
					view,
					wrap;

				if (self.options.fullScreen) {
					return null;
				}

				view = self.element;
				wrap = self.ui.wrap;

				if (value === undefined) {
					return utilsDOM.getElementWidth(view);
				}

				if (!self._isVideo) {
					wrap.style.width = value + 'px';
				}

				view.style.width = value + 'px';
				self._resize();
			};

			/**
			* The height method is used to get (if no value is defined)
			*  or set the multimedia view widget height
			* @method height
			* @param {number} [value=undefined]
			* @return {number|null} height Height value or null if fullScreen option is enabled or element is not video
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			*/
			MultimediaViewPrototype.height = function (value) {
				var self = this,
					view = self.element;

				if (!self._isVideo || self.options.fullScreen) {
					return null;
				}

				if (value === undefined) {
					return view.getElementHeight();
				}

				view.style.height = value + 'px';
				self._resize();
			};

			/**
			* The fullScreen method is used to get (if no value is defined)
			*  or set the fullscreen mode of the multimedia view widget.
			* If the value is true, the fullscreen mode is used;
			*  otherwise the multimedia view widget runs in the normal mode
			* @method fullScreen
			* @param {boolean} value
			* @return {boolean}
			* @member ns.widget.MultimediaView
			* @instance
			*/
			MultimediaViewPrototype.fullScreen = function (value) {
				var self = this,
					control = self.ui.control,
					fbClasses = self.ui.fullscreenButton.classList;
				if (!self._isVideo) {
					return;
				}
				if (value === undefined) {
					return self.options.fullScreen;
				}
				// change icon class
				if (value) {
					fbClasses.remove(classes.FULLSCREEN_ON);
					fbClasses.add(classes.FULLSCREEN_OFF);
				} else {
					fbClasses.add(classes.FULLSCREEN_ON);
					fbClasses.remove(classes.FULLSCREEN_OFF);
				}
				if (self.options.fullScreen === value) {
					return;
				}
				self.options.fullScreen = value;
				if (value) {
					control.style.opacity = 0;
					setTimeout(function () {
						self.ui.wrap.webkitRequestFullScreen();
					}, FULLSCREEN_DELAY);
				} else {
					control.style.opacity = 1.0;
					setTimeout(function () {
						document.webkitCancelFullScreen();
					}, FULLSCREEN_DELAY);
				}
				self._resize();
			};

			/**
			* Resize view
			* @method fullScreen
			* @return {boolean}
			* @member ns.widget.MultimediaView
			* @instance
			* @protected
			*/
			MultimediaViewPrototype._resize = function () {
				this._resizeControl();
				this.trigger('updatelayout');
			};

			/**
			* The method builds HTML structure of widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			*/
			MultimediaViewPrototype._build = function (element) {
				var self = this,
					view = element || self.element,
					viewClasslist = view.classList,
					isVideo = (view.nodeName === VIDEO_TAG_NAME),
					options = self.options,
					parentTheme = utilsTheme.getInheritedTheme(view, utilsTheme.theme),
					theme = options.theme || parentTheme,
					wrap = null,
					control = null;

				// The creating of object that contains aliases for widget's HTML elements
				self.ui = {
					wrap: null,
					control: null
				};
				self.element = element;
				self._isVideo = isVideo;

				viewClasslist.add(classes.VIEW);

				control = self._createControl();
				// on build stage control panel is hidden,
				// control is showing on event "onLoadedMetadata"
				control.style.opacity = 0;
				self.ui.control = control;


				wrap = document.createElement('div');
				wrap.classList.add(classes.WRAP);
				wrap.classList.add(classes.THEME_PREFIX + theme);
				view.parentNode.replaceChild(wrap, view);
				wrap.appendChild(view);
				wrap.appendChild(control);
				self.ui.wrap = wrap;

				engine.instanceWidget(self.ui.volumeBar, 'Slider');
				engine.instanceWidget(self.ui.durationBar, 'Progressbar');

				// customizing
				// progressBar
				self.ui.durationBar.classList.remove(progressbarClasses.uiProgressbar);
				//-- binding
				self.ui.progressBar = self.ui.durationBar.querySelector(selectors.PROGRESS_BAR_BG);

				if (isVideo) {
					control.classList.add(classes.VIDEO);
				} else {
					self.options.fullScreen = false;
				}

				if (options.controls && utilsDOM.getNSData(view, 'controls')) {
					utilsDOM.removeNSData(view, 'controls');
				}

				return element;
			};

			/**
			* The method initializing widget properties
			* @method _initControl
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			*/
			MultimediaViewPrototype._initControl = function () {
				var self = this,
					control = self.ui.control;
				// @todo: check binding;
				self.ui = utilsObject.merge(self.ui, {
					playpauseButton: control.querySelector('.' + classes.PLAY_PAUSE),
					seekBar: control.querySelector('.' + classes.SEEK_BAR),
					timestampLabel: control.querySelector('.' + classes.TIMESTAMP_LABEL),
					durationLabel: control.querySelector('.' + classes.DURATION_LABEL),
					volumeButton: control.querySelector('.' + classes.VOLUME_BUTTON),
					volumeControl: control.querySelector('.' + classes.VOLUME_CONTROL),
					volumeBar: control.querySelector('.' + classes.VOLUME_BAR),
					fullscreenButton: control.querySelector('.' + classes.FULLSCREEN_BUTTON),
					durationBar: control.querySelector('.' + classes.DURATION),
				});
				self.ui.progressBar = self.ui.durationBar.querySelector(selectors.PROGRESS_BAR_BG);
			};

			/**
			* The method initializing widget properties
			* @method _init
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			*/
			MultimediaViewPrototype._init = function (element) {
				var self = this;
				if (self.ui === undefined) {
					self.element = element;
					self.ui = {};
					self.ui.wrap = utilsSelectors.getParentsBySelector(element, selectors.WRAP);
					self.ui.control = utilsSelectors.getParentsBySelector(element, selectors.CONTROL);
					self._isVideo = (element.nodeName === VIDEO_TAG_NAME);
					self.options.fullScreen = false;
				}

				return element;
			};

			/**
			* The method configuring base options of widget
			* @method _configure
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			*/
			MultimediaViewPrototype._configure = function (element) {
				// @todo: make body of method;
				return element;
			};

			/**
			* The method destroy widget and unbinds event listeners
			* @method _destroy
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			*/
			MultimediaViewPrototype._destroy = function () {
				var self = this;
				self._unbindEvents();
			};

			/**
			* Resizing of controlBar
			* @method _resizeControl
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			 */
			MultimediaViewPrototype._resizeControl = function () {
				var self = this,
					view = self.element,
					isVideo = self._isVideo,
					wrap = self.ui.wrap,
					control = self.ui.control,
					buttons = slice.call(control.querySelectorAll(selectors.BUTTONS), 0),
					playpauseButton = self.ui.playpauseButton,
					seekBar = self.ui.seekBar,
					durationLabel = self.ui.durationLabel,
					timestampLabel = self.ui.timestampLabel,
					volumeControl = self.ui.volumeControl,
					volumeBar = self.ui.volumeBar,

					width = isVideo ? utilsDOM.getElementWidth(view) : utilsDOM.getElementWidth(wrap),
					offset = utilsDOM.getElementOffset(view),
					buttonWidth,
					availableWidth = 0;

				if (control) {
					if (isVideo) {
						control.style.left = offset.left + 'px';
					}
					control.style.width = width + 'px';
				}

				if (seekBar) {
					buttonWidth = utilsDOM.getElementWidth(buttons[0], 'outer', false, true);
					availableWidth = utilsDOM.getElementWidth(control) - (buttonWidth * buttons.length);
					if (!self.isVolumeHide) {
						availableWidth -= utilsDOM.getElementWidth(volumeControl, 'outer', false, true);
					}
					availableWidth -= utilsDOM.getCSSProperty(seekBar, 'margin-left', 0, "integer");
					seekBar.style.width = availableWidth + 'px';
				}

				if (durationLabel && !isNaN(view.duration)) {
					durationLabel.querySelector(DURATION_LABEL_TAG_NAME).innerHTML = convertTimeFormat(view.duration);
				}

				if (view.autoplay && view.paused === false) {
					playpauseButton.classList.remove(classes.PLAY_ICON);
					playpauseButton.classList.add(classes.PAUSE_ICON);
				}

				if (utilsDOM.getElementWidth(seekBar) < (utilsDOM.getElementWidth(volumeBar) + utilsDOM.getElementWidth(timestampLabel) + utilsDOM.getElementWidth(durationLabel))) {
					durationLabel.classList.add('hidden');
				} else {
					durationLabel.classList.remove('hidden');
				}
			};

			/**
			* Convert time format, from timestamp [s] to string
			* @method convertTimeFormat
			* @member ns.widget.MultimediaView
			* @param {number} systime
			* @return {string} time time as format HH:mm:ss
			* @private
			* @static
			 */
			function convertTimeFormat(systime) {
				if (!utils.isNumber(systime)) {
					return "Playback Error";
				}

				var ss = parseInt(systime % 60, 10).toString(),
					mm = parseInt((systime / 60) % 60, 10).toString(),
					hh = parseInt(systime / 3600, 10).toString(),
					time = ((hh.length < 2) ? "0" + hh : hh) + ":" +
							((mm.length < 2) ? "0" + mm : mm) + ":" +
							((ss.length < 2) ? "0" + ss : ss);

				return time;
			}

			/**
			* Update the position of progress Bar
			* @method _updateSeekBar
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			 */
			MultimediaViewPrototype._updateSeekBar = function (currenttime) {
				var self = this,
					view = self.element,
					durationBarWidget = engine.getBinding(self.ui.durationBar),
					duration = view.duration,
					timestampLabel = self.ui.timestampLabel;

				if (currenttime === undefined) {
					currenttime = view.currentTime;
				}
				durationBarWidget.value(currenttime / duration * 100);
				timestampLabel.querySelector(DURATION_LABEL_TAG_NAME).innerHTML = convertTimeFormat(currenttime);
			};

			/**
			* Update the position of Volume Bar eg. after volume change on VIDEO element
			* @method _updateVolumeBarState
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			 */
			MultimediaViewPrototype._updateVolumeBarState = function () {
				var self = this,
					volume = engine.getBinding(self.ui.volumeBar);
				volume.element.value = self.element.volume * 100;
				volume.refresh();
			};

			/**
			 * Set volume
			 * @param {number} value
			 */
			MultimediaViewPrototype._setVolume = function (value) {
				if (value >= 0.0 && value <= 1.0) {
					this.element.volume = value;
				}
			};

			/**
			 * Toggle control panel visibility
			 */
			MultimediaViewPrototype._toggleControlPanel = function () {
				var controlStyle = this.ui.control.style;
				controlStyle.opacity = (parseFloat(controlStyle.opacity) | 0) === 0 ? 1.0: 0;
			};

			/**
			 * Called when metadata was loaded
			 * @param {ns.widget.MultimediaView} self
			 * @static
			 * @private
			 */
			function onLoadedMetadata(self) {
				var options = self.options,
					control = self.ui.control,
					durationLabel = self.ui.durationLabel,
					view = self.element;

				if (!isNaN(view.duration)) {
					durationLabel.querySelector(DURATION_LABEL_TAG_NAME).innerHTML = convertTimeFormat(view.duration);
				}
				// show control bar
				if (options.controls) {
					control.style.opacity = 1.0;
				}
				self._resize();
			}

			function onTimeUpdate(self) {
				var view = self.element;
				self._updateSeekBar();
				if (view.currentTime >= view.duration && !view.loop) {
					view.pause();
				}
			}

			function onPlay(self) {
				var playpauseButtonClassList = self.ui.playpauseButton.classList;
				playpauseButtonClassList.remove(classes.PLAY_ICON);
				playpauseButtonClassList.add(classes.PAUSE_ICON);
			}

			function onPause(self) {
				var playpauseButtonClassList = self.ui.playpauseButton.classList;
				playpauseButtonClassList.remove(classes.PAUSE_ICON);
				playpauseButtonClassList.add(classes.PLAY_ICON);
			}

			function onVolumeChange(self) {
				var view = self.element,
					volumeButtonClassList = self.ui.volumeButton.classList;
				if (view.muted && view.volume > 0.1) {
					volumeButtonClassList.remove(classes.VOLUME_ICON);
					volumeButtonClassList.add(classes.MUTE_ICON);
					self._reserveVolume = view.volume;
					view.volume = 0;
				} else if (self._reserveVolume !== -1 && !view.muted) {
					volumeButtonClassList.remove(classes.MUTE_ICON);
					volumeButtonClassList.add(classes.VOLUME_ICON);
					view.volume = self._reserveVolume;
					self._reserveVolume = -1;
				} else if (view.volume < 0.1) {
					volumeButtonClassList.remove(classes.VOLUME_ICON);
					volumeButtonClassList.add(classes.MUTE_ICON);
				} else {
					volumeButtonClassList.remove(classes.MUTE_ICON);
					volumeButtonClassList.add(classes.VOLUME_ICON);
				}

				self._updateVolumeBarState();
			}

			function onDurationChange(self) {
				var view = self.element,
					durationLabel = self.ui.durationLabel;
				if (!isNaN(view.duration)) {
					durationLabel.querySelector(DURATION_LABEL_TAG_NAME).innerHTML = convertTimeFormat(view.duration);
				}
				self._resize();
			}

			function onViewClick(self) {
				if (!self.options.controls) {
					return;
				}
				self._toggleControlPanel();
				self._resize();
			}

			function onViewInit(self) {
				self._resize();
			}

			function onPlayPauseButtonClick(self) {
				var view = self.element;

				if (view.paused) {
					view.play();
				} else {
					view.pause();
				}
			}

			function onFullScreenButton(self) {
				self.fullScreen(!self.options.fullScreen);
			}

			function onVolumeButtonClick(self) {
				var volumeStyle = self.ui.volumeControl.style;

				if (self.isVolumeHide) {
					self.isVolumeHide = false;
					// @todo: fadeIn
					volumeStyle.display = 'initial';
				} else {
					self.isVolumeHide = true;
					// @todo: fadeOut
					volumeStyle.display = 'none';
				}
				self._resize();
			}

			function onVolumeBarChange(self, event) {
				var volume = engine.getBinding(self.ui.volumeBar);
				self._setVolume(volume.element.value / 100);
			}

			function setViewPositionFromEvent(self, event) {
				var value =  getProgressByPointerEvent(event),
					progressBar = engine.getBinding(self.ui.durationBar);
				progressBar.value(value);
				//clearTimeout(self._changeMediaPositionTimeout);
				//self._changeMediaPositionTimeout = setTimeout(function () {
					setViewPositionByPercent(self, value);
				//}, MEDIA_POSITION_CHANGE_TIMEOUT);
			}

			function setViewPositionByPercent(self, percent) {
				var view = self.element;
				view.currentTime = view.duration * percent / 100;
			}

			function getProgressByPointerEvent(event) {
				var target = event.target;
				return (event.clientX - target.offsetLeft) / target.offsetWidth * 100;
			}
			function onProgressBarMove(self, event) {
				if (self._progressBarPressed) {
					setViewPositionFromEvent(self, event);
				}
			}
			function onProgressBarDown(self, event) {
				self._progressBarPressed = true;
				setViewPositionFromEvent(self, event);
			}
			function onProgressBarUp(self) {
				self._progressBarPressed = false;
			}
			function onButtonDown(button) {
				button.classList.add(classes.BUTTON_DOWN);
			}
			function onButtonUp(button) {
				button.classList.remove(classes.BUTTON_DOWN);
			}

			function onClick(self, event) {
				var view = self.element,
					playpauseButton = self.ui.playpauseButton,
					volumeButton = self.ui.volumeButton,
					fullscreenButton = self.ui.fullscreenButton;

				switch (event.target) {
					case playpauseButton:
						return onPlayPauseButtonClick(self, event);
					case volumeButton:
						return onVolumeButtonClick(self, event);
					case fullscreenButton:
						return onFullScreenButton(self, event);
					case view:
						return onViewClick(self, event);
				}
			}

			function onPointerMove(self, event) {
				var progressBarBackgruond = self.ui.progressBar;

				switch (event.target) {
					case progressBarBackgruond:
						return onProgressBarMove(self, event);
				}
			}
			function onPointerDown(self, event) {
				var progressBarBackgruond = self.ui.progressBar;

				switch (event.target) {
					case progressBarBackgruond:
						return onProgressBarDown(self, event);
					case self.ui.playpauseButton:
					case self.ui.fullscreenButton:
					case self.ui.volumeButton:
						return onButtonDown(event.target);
				}
			}
			function onPointerUp(self, event) {
				var progressBarBackgruond = self.ui.progressBar;

				switch (event.target) {
					case progressBarBackgruond:
						return onProgressBarUp(self, event);
					case self.ui.playpauseButton:
					case self.ui.fullscreenButton:
					case self.ui.volumeButton:
						return onButtonUp(event.target);
				}
			}
			function onChange(self, event) {
				var volumeBar = self.ui.volumeBar;

				switch (event.target) {
					case volumeBar:
						return onVolumeBarChange(self, event);
				}
			}
			function onResize(self, event) {
				switch (event.target) {
					case window:
						return self._resize();
				}
			}

			MultimediaViewPrototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case 'loadedmetadata':
						return onLoadedMetadata(self, event);
					case 'timeupdate':
						return onTimeUpdate(self, event);
					case 'play':
						return onPlay(self, event);
					case 'pause':
						return onPause(self, event);
					case 'volumechange':
						return onVolumeChange(self, event);
					case 'change':
						return onChange(self, event);
					case 'durationchange':
						return onDurationChange(self, event);
					case POINTER_CLICK_EVENT:
						return onClick(self, event);
					case POINTER_MOVE_EVENT:
						return onPointerMove(self, event);
					case POINTER_DOWN_EVENT:
						return onPointerDown(self, event);
					case POINTER_UP_EVENT:
						return onPointerUp(self, event);
					case 'multimediaviewinit':
						return onViewInit(self, event);
					case 'resize':
						return onResize(self, event);
				}
			};

			/**
			* The method binding event handlers to widget
			* @method _bindEvents
			* @param {HTMLElement} element
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			*/
			MultimediaViewPrototype._bindEvents = function (element) {
				var self = this,
					view = self.element,
					control = self.ui.control,
					seekBar = self.ui.seekBar,
					volumeBar = self.ui.volumeBar,
					progressBarBackgruond = self.ui.progressBar;

				events.on(
					view,
					["loadedmetadata", "timeupdate", "play", "pause", "volumechange", "durationchange", POINTER_CLICK_EVENT, "multimediaviewinit"],
					self,
					true
				);
				events.on(
					progressBarBackgruond,
					[POINTER_MOVE_EVENT, POINTER_DOWN_EVENT, POINTER_UP_EVENT],
					self,
					true
				);
				events.on(
					control,
					[POINTER_CLICK_EVENT, POINTER_DOWN_EVENT, POINTER_UP_EVENT],
					self,
					true
				);
				seekBar.addEventListener(POINTER_CLICK_EVENT, self, true);
				volumeBar.addEventListener('change', self, true);
				window.addEventListener('resize', self, true);

				return element;
			};

			/**
			* The method unbinds event listeners
			* @method _unbindEvents
			* @member ns.widget.MultimediaView
			* @protected
			* @instance
			*/
			MultimediaViewPrototype._unbindEvents = function () {
				var self = this,
					view = self.element,
					control = self.ui.control,
					seekBar = self.ui.seekBar,
					volumeBar = self.ui.volumeBar,
					progressBarBackgruond = self.ui.progressBar;

				events.off(
					view,
					["loadedmetadata", "timeupdate", "play", "pause", "volumechange", "durationchange", POINTER_CLICK_EVENT, "multimediaviewinit"],
					self,
					true
				);
				events.off(
					progressBarBackgruond,
					[POINTER_MOVE_EVENT, POINTER_DOWN_EVENT, POINTER_UP_EVENT],
					self,
					true
				);
				events.off(
					control,
					[POINTER_CLICK_EVENT, POINTER_DOWN_EVENT, POINTER_UP_EVENT],
					self,
					true
				);
				seekBar.removeEventListener(POINTER_CLICK_EVENT, self, true);
				volumeBar.removeEventListener('change', self, true);

				window.addEventListener('resize', self, true);
			};

			MultimediaView.prototype = MultimediaViewPrototype;

			ns.widget.mobile.MultimediaView = MultimediaView;
			engine.defineWidget(
				'MultimediaView',
				'video, audio, .ui-multimediaview',
				['width', 'height', 'fullScreen'],
				MultimediaView,
				'tizen'
			);
			//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
			return ns.widget.mobile.MultimediaView;
		}
	);
	//>>excludeEnd('tauBuildExclude');
}(window, window.document, ns));
