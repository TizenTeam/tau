/*global window, define, console */
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
 * # Marquee Text
 * It makes <div> element with text move horizontally like legacy <marquee> tag
 *
 * ## Make Marquee Element
 * If you want to use Marquee widget, you have to declare below attributes in <div> element and make Marquee widget in JS code.
 * To use a Marquee widget in your application, use the following code:
 *
 *	@example
 *	<div class="ui-content">
 *		<ul class="ui-listview">
 *			<li><div class="ui-marquee" id="marquee">Marquee widget code sample</div></li>
 *		</ul>
 *	</div>
 *	<script>
 *		var marqueeEl = document.getElementById("marquee"),
 *			marqueeWidget = new tau.widget.Marquee(marqueeEl, {marqueeStyle: "scroll", delay: "3000"});
 *	</script>
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
			"../BaseWidget"
		],
		function() {
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

				Marquee = function() {
					this._ui = {};
					this._ui.marqueeInnerElement = null;
					this._ui.styleSheelElement = null;

					this._state = states.STOPPED;
					this._hasEllipsisText = false;

					this.options = objectUtils.merge({}, Marquee.defaults);

					// event callbacks
					this._callbacks = {};
				},

				prototype = new BaseWidget(),

				CLASSES_PREFIX = "ui-marquee",

				states = {
					RUNNING: "running",
					STOPPED: "stopped",
					IDLE: "idle"
				},

				eventType = {
					/**
					 * Triggered when the marquee animation end.
					 * @event marqueeend
					 * @memeber ns.widget.core.Marquee
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
					ALTERNATE: "alternate"
				},

				ellipsisEffect = {
					GRADIENT: "gradient",
					ELLIPSIS: "ellipsis",
					NONE: "none"
				},

				/**
				 * Options for widget
				 * @property {Object} options
				 * @property {string|"slide"|"scroll"|"alternate"} [options.marqueeStyle="slide"] Sets the default style for the marquee
				 * @property {number} [options.speed=60] Sets the speed(px/sec) for the marquee
				 * @property {number|"infinite"} [options.iteration=1] Sets the iteration count number for marquee
				 * @property {number} [options.delay=2000] Sets the delay(ms) for marquee
				 * @property {"linear"|"ease"|"ease-in"|"ease-out"|"cubic-bezier(n,n,n,n)"} [options.timingFunction="linear"] Sets the timing function for marquee
				 * @property {"gradient"|"ellipsis"|"none"} [options.ellipsisEffect="gradient"] Sets the end-effect(gradient) of marquee
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
					ellipsisEffect: "gradient",
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
				var marqueeInnerElement = self._ui.marqueeInnerElement,
					textWidth = marqueeInnerElement.scrollWidth,
					duration = textWidth / speed;

				return duration;
			}

			function setMarqueeKeyFrame(self, marqueeStyle) {
				var marqueeInnerElement = self._ui.marqueeInnerElement,
					marqueeContainer = self.element,
					containerWidth = marqueeContainer.offsetWidth,
					textWidth = marqueeInnerElement.scrollWidth,
					styleElement = document.createElement("style"),
					keyFrameName = marqueeStyle + "-" + self.id,
					customKeyFrame;

				switch (marqueeStyle) {
					case style.SLIDE:
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {"
										+ "0% { -webkit-transform: translate3d(0, 0, 0);}"
										+ "95%, 100% { -webkit-transform: translate3d(-" + (textWidth - containerWidth) + "px, 0, 0);} }";
						break;
					case style.SCROLL:
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {"
										+ "0% { -webkit-transform: translate3d(0, 0, 0);}"
										+ "95%, 100% { -webkit-transform: translate3d(-100%, 0, 0);} }";
						break;
					case style.ALTERNATE:
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {"
										+ "0% { -webkit-transform: translate3d(0, 0, 0);}"
										+ "50% { -webkit-transform: translate3d(-" + (textWidth - containerWidth) + "px, 0, 0);}"
										+ "100% { -webkit-transform: translate3d(0, 0, 0);} }";
						break;
					default:
						customKeyFrame = null;
						break;
				}

				if (customKeyFrame) {
					self.element.appendChild(styleElement);
					styleElement.sheet.insertRule(customKeyFrame, 0);

					self._ui.styleSheelElement = styleElement;
				}

				return keyFrameName;
			}

			function setAnimationStyle(self, options) {
				var marqueeInnerElement = self._ui.marqueeInnerElement,
					marqueeInnerElementStyle = marqueeInnerElement.style,
					duration = getAnimationDuration(self, isNaN(parseInt(options.speed))? defaults.speed : options.speed ),
					marqueeKeyFrame = setMarqueeKeyFrame(self, options.marqueeStyle),
					iteration;

				// warning when option value is not correct.
				if (isNaN(parseInt(options.speed))) {
					ns.warn("speed value must be number(px/sec)");
				}
				if ((options.iteration !== "infinite") && isNaN(options.iteration)) {
					ns.warn("iteration count must be number or 'infinite'");
				}
				if (isNaN(options.delay)) {
					ns.warn("delay value must be number");
				}

				marqueeInnerElementStyle.webkitAnimationName = marqueeKeyFrame;
				marqueeInnerElementStyle.webkitAnimationDuration = duration + "s";
				marqueeInnerElementStyle.webkitAnimationIterationCount = options.iteration;
				marqueeInnerElementStyle.webkitAnimationTimingFunction = options.timingFunction;
				marqueeInnerElementStyle.webkitAnimationDelay = options.delay + "ms";
			}

			function setEllipsisEffectStyle(self, ellipsisEffectOption, hasEllipsisText) {
				var marqueeElement = self.element;

				switch (ellipsisEffectOption) {
					case ellipsisEffect.GRADIENT:
						if (hasEllipsisText) {
							marqueeElement.classList.add(classes.MARQUEE_GRADIENT);
						}
						break;
					case ellipsisEffect.ELLIPSIS:
						marqueeElement.classList.add(classes.MARQUEE_ELLIPSIS);
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
			prototype._build = function(element) {
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
			prototype._init = function(element) {
				var self = this;

				self._ui.marqueeInnerElement = self._ui.marqueeInnerElement || element.querySelector(selector.MARQUEE_CONTENT);
				self._hasEllipsisText = element.offsetWidth - domUtil.getCSSProperty(element, "padding-right", null, "float") < self._ui.marqueeInnerElement.scrollWidth;

				if (!(self.options.runOnlyOnEllipsisText && !self._hasEllipsisText)) {
					setEllipsisEffectStyle(self, self.options.ellipsisEffect, self._hasEllipsisText);
					setAnimationStyle(self, self.options);
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
			prototype._bindEvents = function() {
				var self = this,
					marqueeInnerElement = self._ui.marqueeInnerElement,
					animationEndCallback = marqueeEndHandler.bind(null, self);

				self._callbacks.animationEnd = animationEndCallback;

				utilEvent.one(marqueeInnerElement, "webkitAnimationEnd", animationEndCallback)
			};

			/**
			 * Refresh styles
			 * @method _refresh
			 * @protected
		 	 * @memeber ns.widget.core.Marquee
			 */
			prototype._refresh = function() {
				var self = this;

				self._resetStyle();
				self._hasEllipsisText = self.element.offsetWidth < self._ui.marqueeInnerElement.scrollWidth;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				setEllipsisEffectStyle(self, self.options.ellipsisEffect, self._hasEllipsisText);
				setAnimationStyle(self, self.options);
				setAutoRunState(self, self.options.autoRun);
			};

			/**
			 * Reset style of Marquee elements
			 * @method _resetStyle
			 * @protected
			 * @memeber ns.widget.core.Marquee
			 */
			prototype._resetStyle = function() {
				var self = this,
					marqueeContainer = self.element,
					marqueeKeyframeStyleSheet = self._ui.styleSheelElement,
					marqueeInnerElementStyle = self._ui.marqueeInnerElement.style;

				if (marqueeContainer.contains(marqueeKeyframeStyleSheet)) {
					marqueeContainer.removeChild(marqueeKeyframeStyleSheet);
				}

				marqueeInnerElementStyle.webkitAnimationName = "";
				marqueeInnerElementStyle.webkitAnimationDuration = "";
				marqueeInnerElementStyle.webkitAnimationDelay = "";
				marqueeInnerElementStyle.webkitAnimationIterationCount = "";
				marqueeInnerElementStyle.webkitAnimationTimingFunction = "";
			};

			/**
			 * Remove marquee object and Reset DOM structure
			 * @method _resetDOM
			 * @protected
			 * @memeber ns.widget.core.Marquee
			 */
			prototype._resetDOM = function() {
				var ui = this._ui;

				while (ui.marqueeInnerElement.hasChildNodes()) {
					this.element.appendChild(ui.marqueeInnerElement.removeChild(ui.marqueeInnerElement.firstChild));
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
			prototype._destroy = function() {
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
			 * @memeber ns.widget.core.Marquee
			 */
			prototype._animationStart = function() {
				var self = this,
					marqueeElementClassList = self.element.classList,
					marqueeInnerElementClassList = self._ui.marqueeInnerElement.classList;

				self._state = states.RUNNING;

				if (marqueeElementClassList.contains(classes.MARQUEE_ELLIPSIS)) {
					marqueeElementClassList.remove(classes.MARQUEE_ELLIPSIS);
				}

				marqueeInnerElementClassList.remove(classes.ANIMATION_IDLE, classes.ANIMATION_STOPPED);
				marqueeInnerElementClassList.add(classes.ANIMATION_RUNNING);
				self.trigger(eventType.MARQUEE_START);
			};

			/**
			 * Start Marquee animation
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *	@example
			 *	<div class="ui-marquee" id="marquee">
			 *		<p>MarqueeTEST TEST message TEST for marquee</p>
			 *	</div>
			 *	<script>
			 *		var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *		marqueeWidget.start();
			 *	</script>
			 *
			 * @method start
			 * @memeber ns.widget.core.Marquee
			 */
			prototype.start = function() {
				var self = this;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				switch (self._state) {
					case states.IDLE:
						setAnimationStyle(self, self.options);
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
			 *	@example
			 *	<div class="ui-marquee" id="marquee">
			 *		<p>MarqueeTEST TEST message TEST for marquee</p>
			 *	</div>
			 *	<script>
			 *		var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *		marqueeWidget.stop();
			 *	</script>
			 *
			 * @method stop
			 * @member ns.widget.core.Marquee
			 */
			prototype.stop = function() {
				var self = this,
					marqueeInnerElementClassList = self._ui.marqueeInnerElement.classList;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				if (self._state == states.IDLE) {
					return;
				}

				self._state = states.STOPPED;
				marqueeInnerElementClassList.remove(classes.ANIMATION_RUNNING);
				marqueeInnerElementClassList.add(classes.ANIMATION_STOPPED);
				self.trigger(eventType.MARQUEE_STOPPED);
			};

			/**
			 * Reset Marquee animation
			 *
			 * #####Running example in pure JavaScript:
			 *	@example
			 *	<div class="ui-marquee" id="marquee">
			 *		<p>MarqueeTEST TEST message TEST for marquee</p>
			 *	</div>
			 *	<script>
			 *		var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *		marqueeWidget.reset();
			 *	</script>
			 *
			 * @method reset
			 * @member ns.widget.core.Marquee
			 */
			prototype.reset = function() {
				var self = this,
					marqueeElementClassList = self.element.classList,
					marqueeInnerElementClassList = self._ui.marqueeInnerElement.classList;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				if (self._state == states.IDLE) {
					return;
				}

				self._state = states.IDLE;
				marqueeInnerElementClassList.remove(classes.ANIMATION_RUNNING, classes.ANIMATION_STOPPED);
				marqueeInnerElementClassList.add(classes.ANIMATION_IDLE);
				if (self.options.ellipsisEffect == ellipsisEffect.ELLIPSIS) {
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
