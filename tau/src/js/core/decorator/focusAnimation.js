/*global define, window, ns */

/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Dectorator for animation
 *
 * @class ns.decorator.focusAnimation
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../decorator"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var animation,
				classes = {
					focusPrefix: "ui-focus-",
					blurPrefix: "ui-blur-",
					up: "up",
					down: "down",
					left: "left",
					right: "right",
					background: "ui-background"
				},
				status,
				ANIMATION_DELAY = 200;

			function removeAnimationClasses(element, prefix) {
				var elementClasses = element.classList;

				elementClasses.remove(prefix + classes.left);
				elementClasses.remove(prefix + classes.up);
				elementClasses.remove(prefix + classes.right);
				elementClasses.remove(prefix + classes.down);
			}

			function setAnimation(element, delay) {
				var backgrounds = element.querySelectorAll("." + classes.background),
					length = backgrounds.length,
					style,
					transition,
					i;

				for (i = 0; i < length; i++) {
					style = backgrounds[i].style;
					transition = (delay || ANIMATION_DELAY) + "ms";
					style.webkitTransitionDuration = transition;
					style.mozTransitionDuration = transition;
					style.oTransitionDuration = transition;
					style.msTransitionDuration = transition;
					style.transitionDuration = transition;
				}
			}

			function prepareFocusAnimation(event) {
				var options = event.detail || {},
					element = options.element,
					direction = options.direction;

				if (element) {
					setAnimation(element, options.duration);
					removeAnimationClasses(element, classes.blurPrefix);
					removeAnimationClasses(element, classes.focusPrefix);
					if (direction) {
						element.classList.add(classes.focusPrefix + direction);
					}
				}
			}

			function prepareBlurAnimation(event) {
				var options = event.detail || {},
					element = options.element,
					direction = options.direction;

				if (element) {
					setAnimation(element, options.duration);
					removeAnimationClasses(element, classes.focusPrefix);
					removeAnimationClasses(element, classes.blurPrefix);
					if (direction) {
						element.classList.add(classes.blurPrefix + direction);
					}
				}
			}

			function enable() {
				status = true;
				document.addEventListener("taufocus", prepareFocusAnimation, false);
				document.addEventListener("taublur", prepareBlurAnimation, false);
			}

			function disable() {
				status = false;
				document.removeEventListener("taufocus", prepareFocusAnimation, false);
				document.removeEventListener("taublur", prepareBlurAnimation, false);
			}

			animation = {
				classes: classes,

				enable: enable,
				disable: disable,
				isEnabled: function () {
					return status;
				}
			};

			ns.decorator.focusAnimation = animation;

			enable();

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return animation;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
