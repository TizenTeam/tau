/*global window, ns, define*/
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util",
			"./object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var PI = Math.PI,
				cos = Math.cos,
				sin = Math.sin,
				SVGNS = "http://www.w3.org/2000/svg",
				objectUtils = ns.util.object,
				classes = {
					polar: "ui-polar",
					animated: "ui-animated"
				},
				defaults = {
					color: "black",
					width: 5,
					x: 180,
					y: 180,
					r: 170,
					arcStart: 0,
					arcEnd: 90,
					animation: false,
					referenceDegree: 0,
					linecap: "butt"
				},
				polar;

			/**
			 * Calculate polar coords to cartesian
			 * @param centerX
			 * @param centerY
			 * @param radius
			 * @param angleInDegrees
			 * @returns {{x: number, y: number}}
			 */
			function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
				var angleInRadians = angleInDegrees * PI / 180.0;

				return {
					x: centerX + (radius * sin(angleInRadians)),
					y: centerY - (radius * cos(angleInRadians))
				};
			}

			/**
			 * Create description of path for arc
			 * @param x
			 * @param y
			 * @param radius
			 * @param startAngle Angle in degrees where arc starts
			 * @param endAngle Angle in degrees where arc ends
			 * @returns {string}
			 */
			function describeArc(x, y, radius, startAngle, endAngle) {
				var start = polarToCartesian(x, y, radius, endAngle),
					end = polarToCartesian(x, y, radius, startAngle),
					arcSweep = endAngle - startAngle <= 180 ? "0" : "1",
					clockWise = 0;

				return [
					"M", start.x, start.y,
					"A", radius, radius, 0, arcSweep, clockWise, end.x, end.y
				].join(" ");
			}

			function addPath(svg, options) {
				var path = document.createElementNS(SVGNS, "path");

				path.setAttribute("class", options.classes);
				path.setAttribute("fill", "none");
				path.setAttribute("stroke", options.color);
				path.setAttribute("stroke-width", options.width);
				path.setAttribute("d", describeArc(options.x, options.y, options.r,
					options.referenceDegree + options.arcStart, options.referenceDegree + options.arcEnd));
				path.setAttribute("data-initial-degree", options.referenceDegree);
				path.setAttribute("stroke-linecap", options.linecap);

				svg.appendChild(path);
			}

			function addAnimation(element, options) {
				var style = element.style,
					value = options.x + "px " + options.y + "px",
					degrees = options.referenceDegree + options.arcStart;

				// add class for transition
				element.classList.add(classes.animated);

				// set transform
				style.webkitTransformOrgin = value;
				style.mozTransformOrgin = value;
				style.transformOrigin = value;

				value = "rotate(" + degrees + "deg)";
				style.webkitTransform = value;
				style.mozTransform = value;
				style.transform = value;
			}

			function updatePathPosition(path, options) {
				var reference = 0;
				if (options.animation) {
					addAnimation(path, options);
				} else {
					if (path) {
						reference = parseInt(path.getAttribute("data-initial-degree"), 10) || options.referenceDegree;
						path.setAttribute("d", describeArc(options.x, options.y, options.r,
							reference + options.arcStart, reference + options.arcEnd));
					}
				}
			}

			polar = {
				default: defaults,
				classes: classes,

				createSVG: function (element) {
					var svg = document.createElementNS(SVGNS, "svg");
					// add class to svg element
					svg.classList.add(classes.polar);
					// if element is set, add svg as child node
					if (element) {
						element.appendChild(svg);
					}
					return svg;
				},

				addArc: function (svg, options) {
					// read or create new svg
					svg = svg || this.createSVG();
					// set options
					options = objectUtils.merge({}, defaults, options || {});
					// add path with arc
					addPath(svg, options);

					return svg;
				},

				updatePosition: function (svg, selector, options) {
					var path = svg && svg.querySelector("path" + selector);

					if (path) {
						// set options
						options = objectUtils.merge({}, defaults, options || {});

						updatePathPosition(path, options);
					}
				},

				addCircle: function (svg, options) {
					var self = this;

					// read or create svg
					svg = svg || self.createSVG();
					// set options
					options = objectUtils.merge({}, defaults, options || {});
					// add first part of circle
					options.arcStart = 0;
					options.arcEnd = 180;
					self.addArc(svg, options);
					// add second part of cicle
					options.arcStart = 180;
					options.arcEnd = 360;
					self.addArc(svg, options);

					return svg;
				}
			};

			ns.util.polar = polar;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.polar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));