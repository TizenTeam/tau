/* global SVGElement, test, ok, equal, define, tau, strictEqual */

function polarTests(polar) {

	module("core/util/polar");

	test("createSVG", function () {
		var svg = polar.createSVG();

		ok(svg instanceof SVGElement, "Create correct SVG");
		if (!window.navigator.userAgent.match("PhantomJS")) {
			ok(svg.classList.contains(polar.classes.polar), "svg has correct class");
		}

		svg = polar.createSVG(document.body);

		ok(svg instanceof SVGElement, "Create correct SVG");
		if (!window.navigator.userAgent.match("PhantomJS")) {
			ok(svg.classList.contains(polar.classes.polar), "svg has correct class");
		}
		equal(svg.parentElement, document.body, "svg is append to body");
	});

	test("addArc", function () {
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
			svg2 = null,
			path = null,
			options = {
				classes: "a",
				color: "red",
				width: 5,
				x: 0,
				y: 1,
				r: 3,
				linecap: 6,
				referenceDegree: 5
			};

		ok(svg instanceof SVGElement, "Create correct SVG");

		svg2 = polar.addArc(svg, options);

		path = svg2.firstChild;

		strictEqual(svg2, svg, "return SVG");

		equal(path.getAttribute("class"), options.classes, "Classes on path is correct set");
		equal(path.getAttribute("fill"), "none", "fill on path is correct set");
		equal(path.getAttribute("stroke"), options.color, "stroke on path is correct set");
		equal(path.getAttribute("stroke-width"), options.width, "stroke-width on path is correct set");
		equal(path.getAttribute("d"), "M 2.988584094275237 1.2614672282429746 A 3 3 0 0 0 0.2614672282429745 -1.9885840942752369", "d on path is correct set");
		equal(path.getAttribute("data-initial-degree"), options.referenceDegree, "data-initial-degree on path is correct set");
		equal(path.getAttribute("stroke-linecap"), options.linecap, "stroke-linecap on path is correct set");
		ok(path instanceof SVGPathElement, "Create correct SVG", "Classes on path is correct set");
	});

	test("addCircle", function () {
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
			svg2 = null,
			path = null,
			options = {
				classes: "a",
				color: "red",
				width: 5,
				x: 0,
				y: 1,
				r: 3,
				linecap: 6,
				referenceDegree: 5
			};

		ok(svg instanceof SVGElement, "Create correct SVG");

		svg2 = polar.addCircle(svg, options);

		path = svg2.firstChild;

		strictEqual(svg2, svg, "return SVG");

		equal(path.getAttribute("class"), options.classes, "Classes on path is correct set (1)");
		equal(path.getAttribute("fill"), "none", "fill on path is correct set (1)");
		equal(path.getAttribute("stroke"), options.color, "stroke on path is correct set (1)");
		equal(path.getAttribute("stroke-width"), options.width, "stroke-width on path is correct set (1)");
		equal(path.getAttribute("d"), "M -0.26146722824297386 3.988584094275237 A 3 3 0 0 0 0.2614672282429745 -1.9885840942752369", "d on path is correct set (1)");
		equal(path.getAttribute("data-initial-degree"), options.referenceDegree, "data-initial-degree on path is correct set (1)");
		equal(path.getAttribute("stroke-linecap"), options.linecap, "stroke-linecap on path is correct set (1)");
		ok(path instanceof SVGPathElement, "Create correct SVG", "Classes on path is correct set (1)");

		path = path.nextSibling;

		strictEqual(svg2, svg, "return SVG");

		equal(path.getAttribute("class"), options.classes, "Classes on path is correct set (2)");
		equal(path.getAttribute("fill"), "none", "fill on path is correct set (2)");
		equal(path.getAttribute("stroke"), options.color, "stroke on path is correct set (2)");
		equal(path.getAttribute("stroke-width"), options.width, "stroke-width on path is correct set (2)");
		equal(path.getAttribute("d"), "M 0.26146722824297614 -1.9885840942752364 A 3 3 0 0 0 -0.26146722824297386 3.988584094275237", "d on path is correct set (2)");
		equal(path.getAttribute("data-initial-degree"), options.referenceDegree, "data-initial-degree on path is correct set (2)");
		equal(path.getAttribute("stroke-linecap"), options.linecap, "stroke-linecap on path is correct set (2)");
		ok(path instanceof SVGPathElement, "Create correct SVG", "Classes on path is correct set (2)");
	});

	test("updatePosition", function () {
		var doc = new DOMParser().parseFromString(
			"<svg xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10 10 C 20 20, 40 20, 50 10\" stroke=\"black\" fill=\"transparent\" class=\"path\"/></svg>",
			"application/xml"),
			svg = doc.documentElement,
			options = {
				referenceDegree: 0,
				arcStart: 10,
				arcEnd: 30,
				x: 20,
				y: 40,
				r: 50
			},
			path = svg.firstChild;

		ok(svg instanceof SVGElement, "Create correct SVG");

		polar.updatePosition(svg, ".path", options);

		equal(path.getAttribute("d"), "M 45 -3.3012701892219383 A 50 50 0 0 0 28.68240888334652 -9.240387650610401", "d on path is correct set");
		equal(path.getAttribute("data-initial-degree"), "0", "data-initial-degree on path is correct set");

		options.animation = true;
		options.x = 120;
		options.y = 140;
		options.arcStart = 40;
		options.referenceDegree = 60;

		polar.updatePosition(svg, ".path", options);

		if (!window.navigator.userAgent.match("PhantomJS")) {
			ok(path.classList.contains("ui-animated"), "animated class on path is correct set");
			equal(path.style.transformOrigin, "120px 140px 0px", "style transform origin on path is correct set");
		} else {
			equal(path.style.transformOrigin, "120px 140px", "style transform origin on path is correct set");
		}
		equal(path.style.transform, "rotate(100deg)", "transform on path is correct set");
	});
}

if (typeof define === "function") {
	define(function () {
		return polarTests;
	});
} else {
	polarTests(tau.util.polar);
}