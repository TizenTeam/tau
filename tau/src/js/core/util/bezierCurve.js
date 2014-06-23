/*global window: false, define: false, Math: false */
/**
 * #Bezier Curves utilities
 * @class ns.util.bezierCurve
 */
(function (ns) {
	'use strict';
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../util" // fetch namespace
	], function () {
		//>>excludeEnd("tauBuildExclude");
		var HALF_PI = Math.PI / 2,
			DEFAULT_STEP = 0.001,
			BezierCurve,
			arcLength3d = function (p0, p1) {
				var d = [ p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2] ];
				return Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
			};
		BezierCurve = function () {
			return this;
		};
		BezierCurve.prototype = {
			points: [],
			step: DEFAULT_STEP,
			length: 0,
			levels: [],
			init: function (data) {
				this.points = data.points;
				this.step = data.step || DEFAULT_STEP;
				this.length = this.calculateTotalLength();
				this.levels = this.calculateLevel(data.maxLevel) || [];
				return this;
			},

			calculateLevel: function (maxLevel) {
				var totalLength = this.length,
					interval = totalLength / maxLevel,
					levels = [],
					i;

				if (!maxLevel) {
					return null;
				}

				for (i = 0; i < maxLevel; i += 1) {
					levels[maxLevel - i] = this.getPercent(0, interval * i);
				}

				return levels;
			},

			calculateTotalLength: function () {
				var step = this.step,
					current = this.getPosition(0),
					last = current,
					length = 0,
					percent;
				for (percent = step; percent <= 1; percent += step) {
					current = this.getPosition(percent);
					length += arcLength3d(last, current);
					last = current;
				}
				return length;
			},

			getPosition: function (percent) {
				var points = this.points,
					getValue = function (p1, c1, c2, p2, t) {
						return Math.pow(1 - t, 3) * p1 +
							3 * t * Math.pow(1 - t, 2) * c1 +
							3 * Math.pow(t, 2) * (1 - t) * c2 +
							Math.pow(t, 3) * p2;
					},
					result = [
						getValue(points[0][0], points[1][0], points[2][0], points[3][0], percent),
						getValue(points[0][2], points[1][2], points[2][2], points[3][2], percent)
					];
				return [ result[0], 0, result[1] ];
			},

			getPercent: function (start, interval) {
				var step = this.step,
					current,
					last,
					targetLength,
					length = 0,
					percent;
				start = start || 0;
				current = this.getPosition(start);
				last = current;
				targetLength = start + interval;
				for (percent = start + step; percent <= 1; percent += step) {
					current = this.getPosition(percent);
					length += arcLength3d(last, current);
					if (length >= targetLength) {
						return percent;
					}
					last = current;
				}
				return 1;
			},

			getAngle: function (percent) {
				var points = this.points,
					getTangent = function (p1, c1, c2, p2, t) {
						return 3 * t * t * (-p1 + 3 * c1 - 3 * c2 + p2) + 6 * t * (p1 - 2 * c1 + c2) + 3 * (-p1 + c1);
					},
					tx = getTangent(points[0][0], points[1][0], points[2][0], points[3][0], percent),
					ty = getTangent(points[0][2], points[1][2], points[2][2], points[3][2], percent);
				return Math.atan2(tx, ty) - HALF_PI;
			}
		};
		ns.util.bezierCurve =  new BezierCurve();

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		return ns.util.bezierCurve;
	});
	//>>excludeEnd("tauBuildExclude");
}(ns));
