/*global window, define, ns */
/*jslint plusplus: true, nomen: true */
/**
 * Chain class for easy multiple animations managment. The chain
 * can be executed as is (animations are concurrent) or in order
 * of adding in which animations are delayed so that the execute
 * in turn
 *
 * @example
 *
 *		var element = document.getElementById("test");
 *		var chain = new ns.util.anim.Chain(
 *			{
 *				concurrent: false,
 *				onPlay: function () {
 *					console.log("chain started to play");
 *				},
 *				onPause: function () {
 *					console.log("chain paused");
 *				},
 *				onEnd: function () {
 *					console.log("chain finished");
 *				}
 *			},
 *			[
 *				{
 *					element: element,
 *					from: { "background-color": "red" }, 
 *					to: { "background-color": "blue"},
 *					duration: "3s",
 *					onPlay: function () {
 *						console.log("animation 1 started to play");
 *					},
 *					onPause: function () {
 *						console.log("animation 1 paused");
 *					},
 *					onEnd: function () {
 *						console.log("animation 1 finished");
 *					}
 *				},
 *				{
 *					element: element,
 *					from: { "-webkit-transform": "translate3d(0,0,0)" }, 
 *					to: { "-webkit-transform": "translate3d(100px, 100px, 0)"},
 *					duration: "3s",
 *					onPlay: function () {
 *						console.log("animation 2 started to play");
 *					},
 *					onPause: function () {
 *						console.log("animation 2 paused");
 *					},
 *					onEnd: function () {
 *						console.log("animation 2 finished");
 *					}
 *				}
 *			]
 *			);
 *		chain.play();
 *
 * @class ns.util.anim.Chain
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../anim",
			"../object",
			"../date",
			"./Animation"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Animation = ns.util.anim.Animation,
				objectUtils = ns.util.object,
				dateUtils = ns.util.date,
				// paused state flag
				PAUSED = 0,
				// playing state flag
				PLAYING = 1,
				// finished state flag
				FINISHED = 2,
				// function type for typeof comparisions
				TYPE_FUNCTION = "function",
				// animation end handler
				handleEnd = function (self, animation) {
					var onEnd = self.options.onEnd,
						animations = self.animations,
						index = animations.indexOf(animation);
					self.current = index;
					if (index === animations.length - 1) {
						self.state = FINISHED;
						if (typeof onEnd === TYPE_FUNCTION) {
							onEnd(self);
						}
					}
				},
				Chain = function (options, animations) {
						/**
						 * @property {Object} options
						 * @property {boolean} [options.concurent='false'] Sets the type of the chain
						 * @property {function(ns.util.anim.Chain)} [options.onPlay=null] a callback for play start
						 * @property {function(ns.util.anim.Chain)} [options.onPause=null] a callback for play pause
						 * @property {function(ns.util.anim.Chain)} [options.onEnd=null] a callback for play end
						 */
					var opts = objectUtils.merge({
							conocurrent: true,
							onPlay: null,
							onPause: null,
							onEnd: null
						}, options || {}),
						self = this;
					/**
					 * @property {number} current Marks current animation
					 * @readonly
					 */
					self.current = null;
					/**
					 * @property {Array.<ns.util.anim.Animation>} animations The animations holder
					 * @readonly
					 */
					self.animations = new Array(0);
					/**
					 * @property {number} totalTime
					 * @readonly
					 */
					self.totalTime = 0;
					self.options = opts;
					/**
					 * @property {number} state=0
					 * @readonly
					 */
					self.state = PAUSED;

					if (animations && animations.length > 0) {
						self.addMultiple(animations);
					}
				},
				proto = {
					/**
					 * Adds animation to chain
					 * @param {ns.util.anim.Animation} animation
					 * @return {ns.util.anim.Chain}
					 * @chainable
					 * @method
					 * @instance
					 */
					add: function (animation) {
						var animationInstance = animation instanceof Animation ?
								animation :
								new Animation(animation),
							animationOptions = animationInstance.options,
							time = dateUtils.convertToMiliseconds(animationOptions.duration),
							delay = dateUtils.convertToMiliseconds(animationOptions.delay),
							onEndCallback = animationOptions.onEnd,
							self = this;

						if (typeof onEndCallback  === TYPE_FUNCTION) {
							animationOptions.onEnd = function (_animation, element, event) {
								onEndCallback(_animation, element, event);
								handleEnd(self, _animation);
							};
						} else {
							animationOptions.onEnd = handleEnd.bind(null, self);
						}

						if (self.options.concurrent === false) {
							animationOptions.delay = (delay + self.totalTime) + "ms";
							self.totalTime += delay + time;
						}

						self.animations.push(animationInstance);
						if (!self.current) {
							self.current = 0;
						}
						return self;
					},

					/**
					 * Adds multiple animations to chain
					 * @param {Array.<ns.util.anim.Animation>} animations
					 * @return {ns.util.anim.Chain}
					 * @method
					 * @chainable
					 * @instance
					 */
					addMultiple: function (animations) {
						var i,
							l;
						for (i = 0, l = animations.length; i < l; ++i) {
							this.add(animations[i]);
						}
						return this;
					},

					/**
					 * Starts playing animation chain
					 * @method
					 * @chainable
					 * @instance
					 */
					play: function () {
						var i,
							l,
							self = this,
							onPlay = self.options.onPlay;
						for (i = self.current, l = self.animations.length; i < l; ++i) {
							self.animations[i].play();
						}
						self.state = PLAYING;
						if (typeof onPlay === TYPE_FUNCTION) {
							onPlay(self);
						}
						return self;
					},

					/**
					 * Pauses playback
					 * @method
					 * @chainable
					 * @instance
					 */
					pause: function () {
						var i,
							l,
							self = this,
							onPause = self.options.onPause;
						for (i = self.current, l = self.animations.length; i < l; ++i) {
							self.animations[i].pause();
						}
						self.state = PAUSED;
						if (typeof onPause === TYPE_FUNCTION) {
							onPause(self);
						}
						return self;
					},
					
					/**
					 * Destroys chain and animations
					 * @method
					 * @instance
					 */
					destroy: function () {
						var i,
							l;
						for (i = 0, l = this.animations.length; i < l; ++i) {
							this.animations[i].destroy();
						}
					}
				};

			/**
			 * @property {Object} states
			 * @property {number} [states.PAUSED = 0]
			 * @property {number} [states.PLAYING = 1]
			 * @property {number} [states.FINISHED = 2]
			 * @readonly
			 * @static
			 */
			Chain.states = {
				"PAUSED": PAUSED,
				"PLAYING": PLAYING,
				"FINISHED": FINISHED
			};
			Chain.prototype = proto;
			ns.util.anim.Chain = Chain;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
