/*
 * Unit Test: Navbar
 */

module("Navbar", {
	teardown: function () {
		ej.engine._clearBindings();
	}
});

	var gridCheckNavbarHTML = [],
		gridClassPrefix = 'ui-grid-',
		gridClassMap = {
			1 : 'solo',
			2 : 'a',
			3 : 'b',
			4 : 'c',
			5 : 'd'
		},
		i,
		ii,
		iii,
		iconCheckIdPrefix = 'navbar-iconpos-',
		iconCheckNavbarHTML = [document.getElementById(iconCheckIdPrefix + 'dflt')],
		iconpos = ['top', 'bottom', 'left', 'right'],
		len,
		len2,
		len3,
		widgetClassName = ['ui-navbar', 'ui-mini'];

	for (i = 1; i < 7; i++) {
		gridCheckNavbarHTML.push(document.getElementById('navbar-' + i + 'item'));
	}

	for (i = 0, len = iconpos.length; i < len; i++) {
		iconCheckNavbarHTML.push(document.getElementById(iconCheckIdPrefix + iconpos[i]));
	}

	test("Navbar - Widget main container class names are added.", function () {

		var contains;

		for (i = 0, len = widgetClassName.length; i < len; i++) {
			for (ii = 0, len2 = gridCheckNavbarHTML.length; ii < len2; ii++) {
				contains = gridCheckNavbarHTML[ii].classList.contains(widgetClassName[i]);
				if (!contains) {
					break;
				}
			}

			equal(contains, true, '"' + widgetClassName[i] + '" class name added to the widget main container. // ' + len2 + ' cases tested');
		}

	});

	test("Navbar - Grids apply to the unordered list.", function () {

		var gridCheck = function (element) {

			var ul = element.firstElementChild,
				liLen = ul.children.length,
				className = [],
				contains;

			liLen <= 5 ? className.push(gridClassPrefix + gridClassMap[liLen]) : className.push(gridClassPrefix + 'duo', gridClassPrefix + gridClassMap[2]);

			for (i = 0, len = className.length; i < len; i++) {
				contains = ul.classList.contains(className[i]);
				if (!contains) {
					break;
				}
			}

			return contains;
		};

		for (i = 0, len = gridCheckNavbarHTML.length; i < len; i++) {
			equal(gridCheck(gridCheckNavbarHTML[i]), true, 'API - Navbar ' + (i + 1) + ' items - a grid has been properly applied');
		}

	});

	test("Navbar - Button widgets are created", function () {

		var cases = 0,
			isButton,
			liList;

		for (i = 0, len = gridCheckNavbarHTML.length; i < len; i++) {
			liList = gridCheckNavbarHTML[i].children[0].children;
			for (ii = 0, len2 = liList.length; ii < len2; ii++) {
				isButton = liList[ii].firstElementChild.getAttribute('data-tau-name') === 'Button';
				cases++;
				if (!isButton) {
					break;
				}
			}
		}

		equal(isButton, true, 'Button widget has been properly applied to the navbar li elements // ' + cases + ' cases tested');

	});

	test("Navbar - Icons are properly set.", function () {

		var btn,
			containsIconAttrLen,
			containsIcon,
			containsIconLen,
			dataIconpos,
			isClassConsist,
			liList,
			liListLen,
			spanList;

		for (i = 0, len = iconCheckNavbarHTML.length; i < len; i++) {
			liList = iconCheckNavbarHTML[i].children[0].children;
			liListLen = liList.length;
			containsIconLen = 0;
			containsIconAttrLen = 0;
			isClassConsist = true;

			dataIconpos = iconCheckNavbarHTML[i].dataset.iconpos;


			for (ii = 0; ii < liListLen; ii++) {

				btn = liList[ii].firstElementChild;
				spanList = btn.firstElementChild.children;

				if (isClassConsist) {
					isClassConsist = dataIconpos ? btn.classList.contains('ui-btn-icon-' + dataIconpos) : btn.classList.contains('ui-btn-icon-top');
				}

				if (btn.dataset.icon) {
					containsIconAttrLen++;
				}

				containsIcon = false;

				for (iii = 0, len3 = spanList.length; iii < len3; iii++) {
					containsIcon = spanList[iii].classList.contains('ui-icon');
					if (containsIcon) {
						containsIconLen++;
					}
				}

			}

			equal(containsIconLen, containsIconAttrLen, "A number of the icons created is equal to the number of data-icon attributes: " + containsIconAttrLen + " / " + containsIconLen);

			if (dataIconpos) {
				ok(isClassConsist, "Icons positions are consistent with the data-iconpos attribute.");
			} else {
				ok(isClassConsist, "data-iconpos attribute is not set, so the icon position is set to default: top");
			}

		}

		test("Navbar - click.", function () {

			var navbar = document.getElementById('navbar-2item'),
				btn = navbar.getElementsByTagName('a')[0],
				btn1 = navbar.getElementsByTagName('a')[1],
				widget = ej.engine.instanceWidget(navbar, 'Navbar');

			ej.utils.events.trigger(btn, 'vclick');
			ok (btn.classList.contains(ej.widget.mobile.Button.classes.uiBtnActive), 'Button has active class');
			ej.utils.events.trigger(btn1, 'vclick');
			ok (!btn.classList.contains(ej.widget.mobile.Button.classes.uiBtnActive), 'Button has not active class');
			ok (btn1.classList.contains(ej.widget.mobile.Button.classes.uiBtnActive), 'Button has active class');
			widget.destroy();
			ej.utils.events.trigger(btn, 'vclick');
			ok (!btn.classList.contains(ej.widget.mobile.Button.classes.uiBtnActive), 'Button has not active class');
			ej.utils.events.trigger(btn1, 'vclick');
			ok (btn1.classList.contains(ej.widget.mobile.Button.classes.uiBtnActive), 'Button has active class');
		});
	});