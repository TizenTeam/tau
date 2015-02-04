/* global test, equal, ok, tau, module */
(function (tau) {
	"use strict";
	var page = document.getElementById("test_homebar");
	page.addEventListener("pageshow", function() {

		var engine = tau.engine;

		module("profile/tv/widget/HomeBar", {
			setup: function () {
				var drawerElement = document.getElementById("left-drawer"),
					drawer;
				engine.createWidgets(document);
				drawer = tau.widget.Drawer(drawerElement);
				drawer.open(0);
			},
			teardown: function () {
				engine._clearBindings();
			}
		});


		test("HomeBar", function () {
			var homebar = document.getElementById("homebar"),
				homeBarWidget = tau.widget.HomeBar(homebar);

			//after build
			equal(homebar.getAttribute("data-tau-bound"), "HomeBar", "HomeBar widget is created");
			ok(homebar.classList.contains("ui-home-bar"), "HomeBar has ui-home-bar class");
			equal(homebar.getAttribute("data-tau-built"), "HomeBar", "HomeBar widget is built");
			equal(homebar.getAttribute("data-tau-name"), "HomeBar", "HomeBar has correct widget name");
			homeBarWidget.destroy();
		});

		test("HomeBar No Header", function () {
			var homebar = document.getElementById("homebar-no-header"),
				homeBarWidget = tau.widget.HomeBar(homebar);

			//after build
			equal(homebar.getAttribute("data-tau-bound"), "HomeBar", "HomeBar widget is created");
			ok(homebar.classList.contains("ui-home-bar"), "HomeBar has ui-home-bar class");
			equal(homebar.getAttribute("data-tau-built"), "HomeBar", "HomeBar widget is built");
			equal(homebar.getAttribute("data-tau-name"), "HomeBar", "HomeBar has correct widget name");
			homeBarWidget.destroy();
		});

		test("refresh", function () {
			var homebar = document.getElementById("homebar"),
				thirdLi = document.createElement("li"),
				length = homebar.children.length,
				homeBarWidget = tau.widget.HomeBar(homebar);

			thirdLi.innerHTML = "<a>Andrew</a>";
			homebar.appendChild(thirdLi);
			homeBarWidget.refresh();
			equal(homebar.children[length], thirdLi, "New child was adden on end");
			equal(homebar.children.length, length + 1, "Number of children was changed");
			ok(thirdLi.classList.contains("ui-block"), "HomeBar set class ui-block");
			homeBarWidget.destroy();
		});

		test("destroy", function () {
			var homebar = document.getElementById("homebar"),
				homeBarWidget = tau.widget.HomeBar(homebar);

			homeBarWidget.destroy();
			equal(homebar.getAttribute("data-tau-bound"), null, "Widget bound");
			equal(homebar.getAttribute("data-tau-built"), null, "Widget built");
			equal(homebar.getAttribute("data-tau-name"), null, "Widget has proper name");
		});

		test("moveUp", function () {
			var homebar = document.getElementById("homebar"),
				thirdLi = homebar.children[2],
				homeBarWidget = tau.widget.HomeBar(homebar);

			homeBarWidget.moveUp(thirdLi);
			equal(homebar.children[1], thirdLi, "Child was moved to prevoius position");
			homeBarWidget.destroy();
		});

		test("moveDown", function () {
			var homebar = document.getElementById("homebar"),
				thirdLi = homebar.children[2],
				homeBarWidget = tau.widget.HomeBar(homebar);

			homeBarWidget.moveDown(thirdLi);
			equal(homebar.children[3], thirdLi, "Chid was moved to next position");
			homeBarWidget.destroy();
		});

		test("remove", function () {
			var homebar = document.getElementById("homebar"),
				thirdLi = homebar.children[2],
				length = homebar.children.length,
				homeBarWidget = tau.widget.HomeBar(homebar);

			homeBarWidget.remove(thirdLi);
			notEqual(homebar.children[2], thirdLi, "Child was removed");
			equal(homebar.children.length, length - 1, "Number of children was decrement");
			homeBarWidget.destroy();
		});


		test("add", function () {
			var homebar = document.getElementById("homebar"),
				thirdLi = document.createElement("li"),
				length = homebar.children.length,
				homeBarWidget = tau.widget.HomeBar(homebar);

			thirdLi.innerHTML = "<a>Andrew</a>";
			homeBarWidget.add(thirdLi);
			ok(thirdLi.classList.contains("ui-block"), "HomeBar set class ui-block");
			equal(homebar.children[length], thirdLi, "Child was add");
			equal(homebar.children.length, length + 1, "Number of children was changed");
			homeBarWidget.destroy();
		});

		function triggerKeyboardEvent(el, keyCode) {
			var eventObj = document.createEvent("Events");

			if (eventObj.initEvent) {
				eventObj.initEvent("keydown", false, true);
			}

			eventObj.keyCode = keyCode;
			el.dispatchEvent(eventObj);
		}


		test("enable edit mode", function () {
			var homebar = document.getElementById("homebar"),
				thirdLi = homebar.children[2],
				background,
				homeBarWidget = tau.widget.HomeBar(homebar);

			tau.event.trigger(thirdLi, "vclick");
			background = document.getElementById("homebar-bg");
			ok(background, "Background was built");
			ok(background.classList.contains(tau.widget.tv.HomeBar.classes.backgroundActive), "Edit mode was enabled");
			triggerKeyboardEvent(homebar, 13);
			ok(!background.classList.contains(tau.widget.tv.HomeBar.classes.backgroundActive), "Edit mode was desabled");
			homeBarWidget.destroy();
		});

		test("move element by keyboard", function () {
			var homebar = document.getElementById("homebar"),
				thirdLi =  homebar.children[2],
				background,
				homeBarWidget = tau.widget.HomeBar(homebar);

			tau.event.trigger(thirdLi, "vclick");
			background = document.getElementById("homebar-bg");
			ok(background, "Background exists");
			ok(background.classList.contains(tau.widget.tv.HomeBar.classes.backgroundActive), "Background is active");
			triggerKeyboardEvent(homebar, 38);
			equal(thirdLi, homebar.children[1], "Element is moved up");
			ok(background.classList.contains(tau.widget.tv.HomeBar.classes.backgroundActive), "Background is active");
			triggerKeyboardEvent(homebar, 40);
			equal(thirdLi, homebar.children[2], "Element is moved down");
			ok(background.classList.contains(tau.widget.tv.HomeBar.classes.backgroundActive), "Background is active");
			homeBarWidget.destroy();
		});

		test("remove element by keyboard", function () {
			var homebar = document.getElementById("homebar"),
				thirdLi =  homebar.children[2],
				background,
				homeBarWidget = tau.widget.HomeBar(homebar);

			tau.event.trigger(thirdLi, "vclick");
			background = document.getElementById("homebar-bg");
			ok(background, "Background exists");
			ok(background.classList.contains(tau.widget.tv.HomeBar.classes.backgroundActive), "Background is active");
			triggerKeyboardEvent(homebar, 39);
			equal(thirdLi, homebar.children[2], "Element is removed");
			ok(background.classList.contains(tau.widget.tv.HomeBar.classes.backgroundActive), "Background is active");
			triggerKeyboardEvent(homebar, 13);
			notEqual(thirdLi, homebar.children[2], "Element is removed");
			ok(!background.classList.contains(tau.widget.tv.HomeBar.classes.backgroundActive), "Background is  active");
			homeBarWidget.destroy();
		});
	})
}(window.tau));
