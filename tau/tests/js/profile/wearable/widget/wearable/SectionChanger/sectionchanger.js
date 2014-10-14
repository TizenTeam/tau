/*global document, window, module, test, asyncTest, ok, setTimeout, start, equal, expect,
QUnit, suites */
/*
* Unit Test: SectionChanger
*/
QUnit.config.reorder = false;

(function (ns) {
	"use strict";

	var page = document.getElementById("page"),
		testContent = document.getElementById("testContent"),
		tapholdThreshold = 200,
		sectionContent = page.querySelector(".ui-content"),
		i = 1, j = 1,

		CSS_ACTIVE = "ui-section-active";

	/*
	 * Function triggering touch event
	 */
	function triggerTouchEvent(el, event, clientXY) {
		var ev = document.createEvent("MouseEvent"),
			move = clientXY || {clientX: 0, clientY: 0};

		ev.initMouseEvent(
			event, /* type */
			true, /* bubble */
			true, /* cancelable */
			window, /* view */
			null, /* detail */
			0, 0, 0, 0, /* coordinates */
			false, false, false, false, /* modifier keys */
			0, /* button, left */
			null /* related target */
		);
		ev.touches = [{clientX: move.clientX, clientY: move.clientY}];
		if (event === "touchend") {
			ev.touches = [];
		}
		ev.changedTouches = [{clientX: move.clientX, clientY: move.clientY}];
		el.dispatchEvent(ev);
	}

	/**
	 * Setup callback
	 */
	function setupModule(scope, options, once) {

		if ((once === true && i === 1) || once === undefined) {
			// Fill up sections with content
			sectionContent.innerHTML = testContent.innerHTML;
		}

		// Create SectionChanger widget
		scope.sectionChanger = new ns.widget.SectionChanger(sectionContent, options);

		scope.scroller = document.querySelectorAll(".scroller")[1];
		scope.sections = scope.scroller.children;

		scope.left = ns.util.DOM.getElementOffset(scope.scroller).left;
		scope.top = ns.util.DOM.getElementOffset(scope.scroller).top;
		scope.clientXY = {clientX: scope.left, clientY: scope.top};

		scope.isActive = function isActive(i) {
			return scope.sections[i].classList.contains(CSS_ACTIVE);
		};

		i = i + 1;
	}

	/**
	 * Teardown callback
	 */
	function teardownModule(scope, expected) {
		if (expected === j || expected === undefined) {
			// Clean up
			scope.sectionChanger.destroy();
			sectionContent.innerHTML = "";
			i = 1;
			j = 0;
		}
		j = j + 1;
	}

	page.addEventListener("pageshow", function pageShow() {


		suites.orientation.forEach(function each(suite) {

			module("tau.widget.SectionChanger orientation " + suite.name, {
				setup: function setup() {
					setupModule(this, suite.options);
				},
				teardown: function teardown() {
					teardownModule(this);
				}
			});

			suite.moves.forEach(function each(move) {

				asyncTest(move.name, 6, function swipe() {

					var clientMoveXY = {
							clientX: this.left + move.cord.x,
							clientY: this.top + move.cord.y
						},
						sections = move.sections.before,
						i = sections.length;

					sections = move.sections.before;
					while (i--) {
						equal(this.isActive(i), sections[i], "Section " + i + " before visible: " + sections[i]);
					}

					// Simulate swiping
					triggerTouchEvent(this.scroller, "touchstart", this.clientXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);

					setTimeout(function setTimeout() {

						// End swiping
						triggerTouchEvent(this.scroller, "touchend", clientMoveXY);

						sections = move.sections.after;
						i = sections.length;
						while (i--) {
							equal(this.isActive(i), sections[i], "Section " + i + " after visible: " + sections[i]);
						}

						start();

					}.bind(this), tapholdThreshold);
				});

			});

		});


		module("tau.widget.SectionChanger circular", {
			setup: function setup() {
				setupModule(this, suites.circular.options, true);
			},
			teardown: function teardown() {
				teardownModule(this, suites.circular.moves.length);
			}
		});

		suites.circular.moves.forEach(function each(move) {

			asyncTest(move.name, 6, function swipe() {

				var clientMoveXY = {
						clientX: this.left + move.cord.x,
						clientY: this.top + move.cord.y
					},
					sections = move.sections.before;
					i = sections.length;

				while (i--) {
					equal(this.isActive(i), sections[i], "Section " + i + " before visible: " + sections[i]);
				}

				setTimeout(function setTimeout() {

					// Simulate swiping
					triggerTouchEvent(this.scroller, "touchstart", this.clientXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);
					// End swiping
					triggerTouchEvent(this.scroller, "touchend", clientMoveXY);

					sections = move.sections.after;
					i = sections.length;
					while (i--) {
						equal(this.isActive(i), sections[i], "Section " + i + " after visible: " + sections[i]);
					}

					start();

				}.bind(this), tapholdThreshold);

			});

		});

		module("tau.widget.SectionChanger bouncing", {
			setup: function setup() {
				setupModule(this, suites.bouncing.options, true);
				this.scrollbars = page.querySelectorAll(".ui-scrollbar-bouncing-effect");
			},
			teardown: function teardown() {
				teardownModule(this, suites.bouncing.moves.length + 1);
			}
		});

		test("bouncing elements", 1, function test() {
			equal(this.scrollbars.length, 2, "Scrollbar bouncing elements is 2");
		});

		suites.bouncing.moves.forEach(function each(move, step) {

			asyncTest(move.name, function swipe() {

				expect(6);
				if (step === 1) {
					expect(7);
				}

				var clientMoveXY = {
						clientX: this.left + move.cord.x,
						clientY: this.top + move.cord.y
					},
					sections = move.sections.before;
					i = sections.length;

				while (i--) {
					equal(this.isActive(i), sections[i], "Section " + i + " before visible: " + sections[i]);
				}

				setTimeout(function setTimeout() {

					// Simulate swiping
					triggerTouchEvent(this.scroller, "touchstart", this.clientXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);
					// End swiping
					triggerTouchEvent(this.scroller, "touchend", clientMoveXY);

					sections = move.sections.after;
					i = sections.length;
					while (i--) {
						equal(this.isActive(i), sections[i], "Section " + i + " after visible: " + sections[i]);
					}

					if (step === 1) {
						ok(this.scrollbars[0].classList.contains("ui-show"), "Left scrollbar bouncing is visibile");
					}

					start();

				}.bind(this), tapholdThreshold);

			});

		});


		suites.scrollbar.forEach(function each(suite) {

			module("tau.widget.SectionChanger scrollbar " + suite.name, {
				setup: function setup() {
					setupModule(this, suite.options);
				},
				teardown: function teardown() {
					teardownModule(this);
				}
			});

			test("elements", function test() {
				var contains  = suite.contains,
					i = suite.contains.length;

					expect(i);

				while (i--) {
					ok(page.querySelectorAll(contains[i]).length > 0, "Element " + contains[i] + " exists");
				}

			});

		});


		module("tau.widget.SectionChanger active section", {
			setup: function setup() {
				setupModule(this, suites.def.options);
			},
			teardown: function teardown() {
				teardownModule(this);
			}
		});

		test("getActiveSectionIndex", 1, function test() {
			var i = this.sections.length,
				activeId = null;

			while (i--) {
				if(this.isActive(i)) {
					activeId = i;
					break;
				}
			}

			equal(this.sectionChanger.getActiveSectionIndex(), activeId, "Active section has correct class");
		});

		test("setActiveSection", 2, function test() {
			var i = this.sections.length,
				newActiveId = 0,
				activeId = null;

			this.sectionChanger.setActiveSection(newActiveId);

			while (i--) {
				if(this.isActive(i)) {
					activeId = i;
					break;
				}
			}

			equal(this.sectionChanger.getActiveSectionIndex(), activeId, "Active section has correct class");
			equal(this.sectionChanger.getActiveSectionIndex(), newActiveId, "Active section index is correct");
		});


	}, false);

}(window.tau));
