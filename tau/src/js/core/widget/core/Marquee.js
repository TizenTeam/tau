/*global window, define, console, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Marquee
 * Shows a component which moves left and right.
 *
 * It makes <div> element with text move horizontally like legacy <marquee> tag
 *
 * ## Make Marquee Element
 * If you want to use Marquee widget, you have to declare below attributes in <div> element and make
 * Marquee widget in JS code.
 * To use a Marquee widget in your application, use the following code:
 *
 *    @example
 *    <div class="ui-content">
 *        <ul class="ui-listview">
 *            <li><div class="ui-marquee" id="marquee">Marquee widget code sample</div></li>
 *        </ul>
 *    </div>
 *    <script>
 *        var marqueeEl = document.getElementById("marquee"),
 *            marqueeWidget = new tau.widget.Marquee(marqueeEl,
 *              {marqueeStyle: "scroll", delay: "3000"});
 *    </script>
 *
 * @author Heeju Joo <heeju.joo@samsung.com>
 * @class ns.widget.core.Marquee
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../event",
			"../../util/object",
			"../../util/DOM",
			"../BaseWidget",
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for class ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.core.Marquee
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Alias for class ns.event
				 * @property {ns.event} event
				 * @member ns.widget.core.Marquee
				 * @private
				 */
				utilEvent = ns.event,
				/**
				 * Alias for class ns.util.object
				 * @property {Object} objectUtils
				 * @member ns.widget.core.Marquee
				 * @private
				 */
				objectUtils = ns.util.object,
				/**
				 * Alias for class ns.util.DOM
				 * @property {Object} domUtil
				 * @member ns.widget.core.Marquee
				 * @private
				 */
				domUtil = ns.util.DOM,

				states = {
					RUNNING: "running",
					STOPPED: "stopped",
					IDLE: "idle"
				},

				Marquee = function () {
					this._ui = {};
					this._ui.marqueeInnerElement = null;
					this._ui.styleSheelElement = null;

					this._state = states.STOPPED;
					this._hasEllipsisText = false;

					this.options = objectUtils.copy(Marquee.defaults);

					// event callbacks
					this._callbacks = {};
				},

				prototype = new BaseWidget(),

				CLASSES_PREFIX = "ui-marquee",

				eventType = {
					/**
					 * Triggered when the marquee animation end.
					 * @event marqueeend
					 * @member ns.widget.core.Marquee
					 */
					MARQUEE_START: "marqueestart",
					MARQUEE_END: "marqueeend",
					MARQUEE_STOPPED: "marqueestopped"
				},
				/**
				 * Dictionary for CSS class of marquee play state
				 * @property {Object} classes
				 * @member ns.widget.core.Marquee
				 * @static
				 */
				classes = {
					MARQUEE_CONTENT: CLASSES_PREFIX + "-content",
					MARQUEE_GRADIENT: CLASSES_PREFIX + "-gradient",
					MARQUEE_ELLIPSIS: CLASSES_PREFIX + "-ellipsis",
					ANIMATION_RUNNING: CLASSES_PREFIX + "-anim-running",
					ANIMATION_STOPPED: CLASSES_PREFIX + "-anim-stopped",
					ANIMATION_IDLE: CLASSES_PREFIX + "-anim-idle"
				},

				selector = {
					MARQUEE_CONTENT: "." + CLASSES_PREFIX + "-content"
				},

				/**
				 * Dictionary for marquee style
				 */
				style = {
					SCROLL: "scroll",
					SLIDE: "slide",
					ALTERNATE: "alternate",
					ENDTOEND: "endToEnd"
				},

				ellipsisEffect = {
					GRADIENT: "gradient",
					ELLIPSIS: "ellipsis",
					NONE: "none"
				},

				/**
				 * Options for widget
				 * @property {Object} options
				 * @property {string|"slide"|"scroll"|"alternate"} [options.marqueeStyle="slide"]
				 * Sets the default style for the marquee
				 * @property {number} [options.speed=60] Sets the speed(px/sec) for the marquee
				 * @property {number|"infinite"} [options.iteration=1] Sets the iteration count
				 * number for marquee
				 * @property {number} [options.delay=2000] Sets the delay(ms) for marquee
				 * @property {"linear"|"ease"|"ease-in"|"ease-out"|"cubic-bezier(n,n,n,n)"}
				 * [options.timingFunction="linear"] Sets the timing function for marquee
				 * @property {"gradient"|"ellipsis"|"none"} [options.ellipsisEffect="gradient"] Sets
				 * the end-effect(gradient) of marquee
				 * @property {boolean} [options.autoRun=true] Sets the status of autoRun
				 * @member ns.widget.core.Marquee
				 * @static
				 */
				defaults = {
					marqueeStyle: style.SLIDE,
					speed: 60,
					iteration: 1,
					delay: 0,
					timingFunction: "linear",
					ellipsisEffect: ellipsisEffect.GRADIENT,
					runOnlyOnEllipsisText: true,
					autoRun: true
				};

			Marquee.classes = classes;
			Marquee.defaults = defaults;

			/* Marquee AnimationEnd callback */
			function marqueeEndHandler(self) {
				self.reset();
			}

			function getAnimationDuration(self, speed) {
				return self._ui.marqueeInnerElement.scrollWidth / speed;
			}

			function setMarqueeKeyFrame(self, marqueeStyle) {
				var marqueeInnerElement = self._ui.marqueeInnerElement,
					marqueeContainer = self.element,
					containerWidth = marqueeContainer.offsetWidth,
					textWidth = marqueeInnerElement.scrollWidth,
					styleElement = self._ui.styleSheelElement || document.createElement("style"),
					keyFrameName = marqueeStyle + "-" + self.id,
					customKeyFrame,
					customKeyFrameWithOutWebkitPrefix,
					returnTimeFrame;

				switch (marqueeStyle) {
					case style.SLIDE:
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {" +
							"0% { transform: translate(0, 0);}" +
							"95%, 100% { transform: translate(-" + (textWidth - containerWidth) +
								"px, 0);} }";
						break;
					case style.SCROLL:
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {" +
							"0% { transform: translate(0, 0);}" +
							"95%, 100% { transform: translate(-100%, 0);} }";
						break;
					case style.ALTERNATE:
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {" +
							"0% { transform: translate(0, 0);}" +
							"50% { transform: translate(-" + (textWidth - containerWidth) +
								"px, 0);}" +
							"100% { transform: translate(0, 0);} }";
						break;
					case style.ENDTOEND:
						returnTimeFrame = parseInt((textWidth / (textWidth + containerWidth)) *
							100, 10);
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {" +
							"0% { transform: translate(0, 0);}" +
							returnTimeFrame + "% { transform: translate(-100%, 0); opacity: 1}" +
							(returnTimeFrame + 1) + "% { transform: translate(-100%, 0);" +
								" opacity: 0}" +
							(returnTimeFrame + 2) + "% { transform: translate(" + containerWidth +
								"px, 0); opacity: 0; }" +
							(returnTimeFrame + 3) + "% { transform: translate(" + containerWidth +
								"px, 0); opacity: 1; }" +
							"100% { transform: translate(0, 0);} }";
						break;
					default:
						customKeyFrame = null;
						break;
				}

				if (customKeyFrame) {
					if (!styleElement.parentElement) {
						marqueeContainer.appendChild(styleElement);
					}
					styleElement.sheet.insertRule(customKeyFrame, 0);
					customKeyFrameWithOutWebkitPrefix = customKeyFrame.replace(/-webkit-/g, "");
					styleElement.sheet.insertRule(customKeyFrameWithOutWebkitPrefix, 0);

					self._ui.styleSheelElement = styleElement;
				}

				return keyFrameName;
			}

			function setMarqueeGradientKeyFrame(self, marqueeStyle) {
				var marqueeInnerElement = self._ui.marqueeInnerElement,
					marqueeContainer = self.element,
					containerWidth = marqueeContainer.offsetWidth,
					textWidth = marqueeInnerElement.scrollWidth,
					styleElement = self._ui.styleSheelElement || document.createElement("style"),
					keyFrameName = "gradient-" + self.id,
					customKeyFrame,
					customKeyFrameWithOutWebkitPrefix,
					returnTimeFrame;

				switch (marqueeStyle) {
					case style.SLIDE:
					case style.SCROLL:
					case style.ALTERNATE:
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {" +
							"0% { -webkit-mask-image: -webkit-linear-gradient(left," +
							" transparent 0," +
							" rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 1) 85%," +
							" transparent 100%)}" +
							"100% { -webkit-mask-image: -webkit-linear-gradient(left," +
							" transparent 0," +
							" rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 1) 85%," +
							" transparent 100%)} }";
						break;
					case style.ENDTOEND:
						returnTimeFrame = parseInt((textWidth / (textWidth + containerWidth)) * 100,
							10);
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {" +
							"0% { -webkit-mask-image: -webkit-linear-gradient(left," +
							" rgba(255, 255, 255, 1) 0," +
							" rgba(255, 255, 255, 1) 85%, transparent 100%)}" +
							"1% { -webkit-mask-image: -webkit-linear-gradient(left," +
							" transparent 0," +
							" rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 1) 85%," +
							" transparent 100%)}" +
							returnTimeFrame + "% { -webkit-mask-image:" +
							" -webkit-linear-gradient(left," +
							" transparent 0, rgba(255, 255, 255, 1) 15%," +
							" rgba(255, 255, 255, 1) 85%," +
							" transparent 100%)}" +
							(returnTimeFrame + 1) + "% { -webkit-mask-image:" +
							" -webkit-linear-gradient(left," +
							" rgba(255, 255, 255, 1) 0, rgba(255, 255, 255, 1) 85%," +
							" transparent 100%)}" +
							"100% { -webkit-mask-image: -webkit-linear-gradient(left," +
							" rgba(255, 255, 255, 1) 0," +
							" rgba(255, 255, 255, 1) 85%, transparent 100%) } }";
						break;
					default:
						customKeyFrame = null;
						break;
				}
				if (customKeyFrame) {
					if (!styleElement.parentElement) {
						marqueeContainer.appendChild(styleElement);
					}
					styleElement.sheet.insertRule(customKeyFrame, 0);
					customKeyFrameWithOutWebkitPrefix = customKeyFrame.replace(/-webkit-keyframes/g,
						"keyframes");
					styleElement.sheet.insertRule(customKeyFrameWithOutWebkitPrefix, 0);

					self._ui.styleSheelElement = styleElement;
				}

				return keyFrameName;
			}

			prototype._setAnimationStyle = function (options) {
				var self = this,
					speed = parseInt(options.speed, 10),
					marqueeInnerElement = self._ui.marqueeInnerElement,
					duration = getAnimationDuration(self, isNaN(speed) ? defaults.speed : speed),
					marqueeKeyFrame = setMarqueeKeyFrame(self, options.marqueeStyle),
					marqueeElement = self.element;

				// warning when option value is not correct.
				if (isNaN(speed)) {
					ns.warn("speed value must be number(px/sec)");
				}
				if ((options.iteration !== "infinite") && isNaN(options.iteration)) {
					ns.warn("iteration count must be number or 'infinite'");
				}
				if (isNaN(options.delay)) {
					ns.warn("delay value must be number");
				}

				domUtil.setPrefixedStyle(marqueeInnerElement, "animation-name", marqueeKeyFrame);
				domUtil.setPrefixedStyle(marqueeInnerElement, "animation-duration", duration + "s");
				domUtil.setPrefixedStyle(marqueeInnerElement, "animation-iteration-count",
					options.iteration);
				domUtil.setPrefixedStyle(marqueeInnerElement, "animation-timing-function",
					options.timingFunction);
				domUtil.setPrefixedStyle(marqueeInnerElement, "animation-delay",
					options.delay + "ms");

				if (options.ellipsisEffect === ellipsisEffect.GRADIENT) {
					domUtil.setPrefixedStyle(marqueeElement, "animation-name",
						setMarqueeGradientKeyFrame(self, options.marqueeStyle));
					domUtil.setPrefixedStyle(marqueeElement, "animation-duration", duration + "s");
					domUtil.setPrefixedStyle(marqueeElement, "animation-iteration-count",
						options.iteration);
					domUtil.setPrefixedStyle(marqueeElement, "animation-timing-function",
						options.timingFunction);
					domUtil.setPrefixedStyle(marqueeElement, "animation-delay",
						options.delay + "ms");
				}
			};

			function setEllipsisEffectStyle(self, ellipsisEffectOption, hasEllipsisText) {
				var elementClassList = self.element.classList;

				switch (ellipsisEffectOption) {
					case ellipsisEffect.GRADIENT:
						elementClassList.toggle(classes.MARQUEE_GRADIENT, hasEllipsisText);
						break;
					case ellipsisEffect.ELLIPSIS:
						elementClassList.add(classes.MARQUEE_ELLIPSIS);
						break;
					default :
						break;
				}

			}

			function setAutoRunState(self, autoRunOption) {
				if (autoRunOption) {
					self.start();
				} else {
					self.stop();
				}
			}

			/**
			 * Build Marquee DOM
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._build = function (element) {
				var marqueeInnerElement = document.createElement("div");

				while (element.hasChildNodes()) {
					marqueeInnerElement.appendChild(element.removeChild(element.firstChild));
				}
				marqueeInnerElement.classList.add(classes.MARQUEE_CONTENT);
				element.appendChild(marqueeInnerElement);

				this._ui.marqueeInnerElement = marqueeInnerElement;

				return element;
			};

			/**
			 * Init Marquee Style
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._init = function (element) {
				var self = this;

				self._ui.marqueeInnerElement = self._ui.marqueeInnerElement ||
					element.querySelector(selector.MARQUEE_CONTENT);
				self._hasEllipsisText = element.offsetWidth -
					domUtil.getCSSProperty(element, "padding-right", null, "float") <
					self._ui.marqueeInnerElement.scrollWidth;

				setEllipsisEffectStyle(self, self.options.ellipsisEffect, self._hasEllipsisText);
				if (!(self.options.runOnlyOnEllipsisText && !self._hasEllipsisText)) {
					setEllipsisEffectStyle(self, self.options.ellipsisEffect,
						self._hasEllipsisText);
					self._setAnimationStyle(self.options);
					setAutoRunState(self, self.options.autoRun);
				}

				return element;
			};

			/**
			 * Bind events
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._bindEvents = function () {
				var self = this,
					marqueeInnerElement = self._ui.marqueeInnerElement,
					animationEndCallback = marqueeEndHandler.bind(null, self);

				self._callbacks.animationEnd = animationEndCallback;

				utilEvent.one(marqueeInnerElement, "animationend webkitAnimationEnd",
					animationEndCallback);
			};

			/**
			 * Refresh styles
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._refresh = function () {
				var self = this;

				self._resetStyle();
				self._hasEllipsisText = self.element.offsetWidth <
					self._ui.marqueeInnerElement.scrollWidth;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				setEllipsisEffectStyle(self, self.options.ellipsisEffect, self._hasEllipsisText);
				self._setAnimationStyle(self.options);
				setAutoRunState(self, self.options.autoRun);
			};

			/**
			 * Reset style of Marquee elements
			 * @method _resetStyle
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._resetStyle = function () {
				var self = this,
					marqueeContainer = self.element,
					marqueeKeyframeStyleSheet = self._ui.styleSheelElement;

				if (marqueeContainer.contains(marqueeKeyframeStyleSheet)) {
					marqueeContainer.removeChild(marqueeKeyframeStyleSheet);
					self._ui.styleSheelElement = null;
				}

				domUtil.setPrefixedStyle(self._ui.marqueeInnerElement, "animation", "");
				domUtil.setPrefixedStyle(self.element, "animation", "");
			};

			/**
			 * Remove marquee object and Reset DOM structure
			 * @method _resetDOM
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._resetDOM = function () {
				var ui = this._ui;

				while (ui.marqueeInnerElement.hasChildNodes()) {
					this.element.appendChild(ui.marqueeInnerElement.removeChild(
						ui.marqueeInnerElement.firstChild));
				}
				this.element.removeChild(ui.marqueeInnerElement);
				return null;
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._destroy = function () {
				var self = this;

				self._resetStyle();
				self._resetDOM();
				self._callbacks = null;
				self._ui = null;

				return null;
			};

			/**
			 * Set Marquee animation status Running
			 * @method _animationStart
			 * @member ns.widget.core.Marquee
			 */
			prototype._animationStart = function () {
				var self = this,
					marqueeElementClassList = self.element.classList,
					marqueeInnerElementClassList = self._ui.marqueeInnerElement.classList;

				self._state = states.RUNNING;

				if (marqueeElementClassList.contains(classes.MARQUEE_ELLIPSIS)) {
					marqueeElementClassList.remove(classes.MARQUEE_ELLIPSIS);
				}

				marqueeInnerElementClassList.remove(classes.ANIMATION_IDLE,
					classes.ANIMATION_STOPPED);
				marqueeInnerElementClassList.add(classes.ANIMATION_RUNNING);
				marqueeElementClassList.remove(classes.ANIMATION_IDLE, classes.ANIMATION_STOPPED);
				marqueeElementClassList.add(classes.ANIMATION_RUNNING);

				self.trigger(eventType.MARQUEE_START);
			};

			/**
			 * Start Marquee animation
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *    @example
			 *    <div class="ui-marquee" id="marquee">
			 *        <p>MarqueeTEST TEST message TEST for marquee</p>
			 *    </div>
			 *    <script>
			 *        var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *        marqueeWidget.start();
			 *    </script>
			 *
			 * @method start
			 * @member ns.widget.core.Marquee
			 */
			prototype.start = function () {
				var self = this;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				switch (self._state) {
					case states.IDLE:
						self._setAnimationStyle(self.options);
						self._bindEvents();
						self._animationStart();
						break;
					case states.STOPPED:
						self._state = states.RUNNING;
						self._animationStart();
						break;
					case states.RUNNING:
						break;
				}
			};

			/**
			 * Pause Marquee animation
			 *
			 * #####Running example in pure JavaScript:
			 *    @example
			 *    <div class="ui-marquee" id="marquee">
			 *        <p>MarqueeTEST TEST message TEST for marquee</p>
			 *    </div>
			 *    <script>
			 *        var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *        marqueeWidget.stop();
			 *    </script>
			 *
			 * @method stop
			 * @member ns.widget.core.Marquee
			 */
			prototype.stop = function () {
				var self = this,
					marqueeInnerElementClassList = self._ui.marqueeInnerElement.classList,
					marqueeElementClassList = self.element.classList;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				if (self._state === states.IDLE) {
					return;
				}

				self._state = states.STOPPED;
				marqueeInnerElementClassList.remove(classes.ANIMATION_RUNNING);
				marqueeInnerElementClassList.add(classes.ANIMATION_STOPPED);
				marqueeElementClassList.remove(classes.ANIMATION_RUNNING);
				marqueeElementClassList.add(classes.ANIMATION_STOPPED);

				self.trigger(eventType.MARQUEE_STOPPED);
			};

			/**
			 * Reset Marquee animation
			 *
			 * #####Running example in pure JavaScript:
			 *    @example
			 *    <div class="ui-marquee" id="marquee">
			 *        <p>MarqueeTEST TEST message TEST for marquee</p>
			 *    </div>
			 *    <script>
			 *        var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *        marqueeWidget.reset();
			 *    </script>
			 *
			 * @method reset
			 * @member ns.widget.core.Marquee
			 */
			prototype.reset = function () {
				var self = this,
					ellipsisEffect = self.options.ellipsisEffect,
					marqueeElementClassList = self.element.classList,
					marqueeInnerElementClassList = self._ui.marqueeInnerElement.classList;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				if (self._state === states.IDLE) {
					return;
				}

				self._state = states.IDLE;
				marqueeInnerElementClassList.remove(classes.ANIMATION_RUNNING,
					classes.ANIMATION_STOPPED);
				marqueeInnerElementClassList.add(classes.ANIMATION_IDLE);
				if (ellipsisEffect === ellipsisEffect.ELLIPSIS) {
					marqueeElementClassList.add(classes.MARQUEE_ELLIPSIS);
				}

				self._resetStyle();
				self.trigger(eventType.MARQUEE_END);
			};

			Marquee.prototype = prototype;
			ns.widget.core.Marquee = Marquee;

			engine.defineWidget(
				"Marquee",
				".ui-marquee",
				["start", "stop", "reset"],
				Marquee,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);

			return ns.widget.core.Marquee;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
