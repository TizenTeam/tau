(function () {
	"use strict";

	var handlers = {};

	module('ej.widget.Collapsible', {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	function testCollapsibleBaseStructure(collapsible, name) {
		var chead = collapsible.firstElementChild,
			headLink = chead.firstElementChild;

		name = name ? ' ' + name : '';

		equal(collapsible.classList.contains('ui-collapsible'), true, 'Collapsible widget' + name + ' sets proper class');
		ok(chead.nextElementSibling, 'Sibling of widget' + name + ' content exists');
		equal(chead.nextElementSibling && chead.nextElementSibling.tagName, 'DIV', 'Collapsible' + name + ' sibling is div');
		equal(chead.nextElementSibling && chead.nextElementSibling.classList.contains('ui-collapsible-content'), true, 'Collapsible' + name + ' sibling has class ui-collapsible-content');

		// Check header structure
		strictEqual(chead.children.length, 1, 'Header contains one child');
		equal(headLink && headLink.tagName, 'A', 'Header only child is <a>');
		ok(headLink && headLink.classList.contains('ui-collapsible-heading-toggle'), 'Link has proper heading-toggle class');
		ok(headLink && headLink.classList.contains('ui-btn'), 'Link has ui-btn class');
		//@TODO add tests for all btn options
	}

	test('Widget creates proper structure', function () {
		var collapsible1 = document.getElementById('collapsible1'),
			collapsible2 = document.getElementById('collapsible2'),
			collapsible3 = document.getElementById('collapsible3'),
			collapsible4 = document.getElementById('collapsible4'),
			collapsible5 = document.getElementById('collapsible5'),
			collapsible6 = document.getElementById('collapsible6'),
			collapsible7 = document.getElementById('collapsible7'),
//			chead2 = document.getElementById('c-head-2'),
//			chead3 = document.getElementById('c-head-3'),
//			chead4 = document.getElementById('c-head-4'),
//			chead5 = document.getElementById('c-head-5'),
//			chead6 = document.getElementById('c-head-6'),
			chead7 = document.getElementById('c-head-7'),
			preSwapHTMLRegExp;

		$("#collapsible1").collapsible();
		testCollapsibleBaseStructure(collapsible1, 'with <h1>');

		// wrapps content in div with classes ui-collapsible-content
		$("#collapsible2").collapsible();
		testCollapsibleBaseStructure(collapsible2, 'with <h2>');

		$("#collapsible3").collapsible();
		testCollapsibleBaseStructure(collapsible3, 'with <h3>');

		$("#collapsible4").collapsible();
		testCollapsibleBaseStructure(collapsible4, 'with <h4>');

		$("#collapsible5").collapsible();
		testCollapsibleBaseStructure(collapsible5, 'with <h5>');

		$("#collapsible6").collapsible();
		testCollapsibleBaseStructure(collapsible6, 'with <h6>');

		// Change <legend> header to simple div
		preSwapHTMLRegExp = new RegExp(chead7.innerHTML, 'g');
		$("#collapsible7").collapsible();
		testCollapsibleBaseStructure(collapsible7, 'with <legend>');
		chead7 = collapsible7.children[0];
		equal(chead7.tagName, 'DIV', 'Legend was changed to div');
		// @todo consider changing regex test to something more DOM manipulation friendly
		ok(preSwapHTMLRegExp.test(chead7.innerHTML), 'Heading content after swaping stayed the same');
		strictEqual(chead7.getAttribute('role'), 'heading', 'Widget heading has role="heading" attribute');
	});

	test('Widget wraps collapsible content inside ui-collapsible-content', function () {
		var movedContent = document.getElementById('moved-content');

		equal(movedContent.parentNode.id, 'collapsible8', 'Widget content has parent as authored');
		$("#collapsible8").collapsible();
		notEqual(movedContent.parentNode.id, 'collapsible8', 'Widget content has moved');
		equal(movedContent.parentNode.tagName, 'DIV', 'Content moved to div');
		ok(movedContent.parentNode.classList.contains('ui-collapsible-content'), 'Content moved to parent with class ui-collapsible-content');
		ok(movedContent.parentNode.previousElementSibling.classList.contains('ui-collapsible-heading'), 'Content previous sibling is heading (has ui-collapsible-heading class)');
	});

	test('Widget closed inside set should get `set` properties as options', function () {
		var collapsible9 = document.getElementById('collapsible9'),
			widgetObject,
			widgetOptions;

		$("#collapsible9").collapsible();
		widgetObject = ej.engine.getBinding(collapsible9);
		widgetOptions = widgetObject.options;

		equal(widgetOptions.theme, 'z', 'Option: Theme set from parent `set`');
		equal(widgetOptions.contentTheme, 'x', 'Option: Content theme set from parent `set`');
		equal(widgetOptions.collapsedIcon, 'back', 'Option: Collapsed set icon from parent `set`');
		equal(widgetOptions.expandedIcon, 'forward', 'Option: Expanded set icon from parent `set`');
		equal(widgetOptions.iconpos, 'bottom', 'Option: iconpos set from parent `set`');
		strictEqual(widgetOptions.inset, false, 'Option: inset set from parent `set`');
		strictEqual(widgetOptions.mini, true, 'Option: mini set from parent `set`');
	});

	test('Widget should set default theme to "s" when no options passed and not inside set', function () {
		var collapsible11 = document.getElementById('collapsible11'),
			widgetOptions;

		$("#collapsible11").collapsible();
		widgetOptions = ej.engine.getBinding(collapsible11) && ej.engine.getBinding(collapsible11).options;

		strictEqual(widgetOptions.theme, 's', 'Theme is set to \'s\'');
	});

	test('Widget content should get class based on theme', function () {
		var collapsible11 = document.getElementById('collapsible11'),
			collapsible12 = document.getElementById('collapsible12'),
			widgetOptions11,
			widgetOptions12,
			content11,
			content12;

		$("#collapsible11").collapsible();
		content11 = collapsible11.querySelectorAll('.ui-collapsible-content')[0];
		widgetOptions11 = ej.engine.getBinding(collapsible11) && ej.engine.getBinding(collapsible11).options;

		strictEqual(widgetOptions11.contentTheme, null, 'Content theme is set to null');
		ok(!content11.classList.contains('ui-body-s'), 'Content doesn\'t have default theme class');
		ok(!content11.classList.contains('ui-body-'), 'Content doesn\'t have \'ui-body-\' class');


		$("#collapsible12").collapsible();
		content12 = collapsible12.querySelectorAll('.ui-collapsible-content')[0];
		widgetOptions12 = ej.engine.getBinding(collapsible12) && ej.engine.getBinding(collapsible12).options;

		strictEqual(widgetOptions12.contentTheme, 'f', 'Content theme is set to \'f\'');
		ok(content12.classList.contains('ui-body-f'), 'Content has \'ui-body-f\' class');
	});

	test('Widget should set proper classes when options.inset === true', function () {
		var collapsible12 = document.getElementById('collapsible12'),
			collapsible13 = document.getElementById('collapsible13'),
			widgetOptions12,
			widgetOptions13,
			headerLink12,
			headerLink13,
			btnInner12,
			btnInner13;

		$("#collapsible12").collapsible();
		$("#collapsible13").collapsible();
		widgetOptions12 = ej.engine.getBinding(collapsible12).options;
		widgetOptions13 = ej.engine.getBinding(collapsible13).options;
		headerLink12 = collapsible12.firstElementChild.firstElementChild;
		headerLink13 = collapsible13.firstElementChild.firstElementChild;
		btnInner12 = headerLink12.firstElementChild;
		btnInner13 = headerLink13.firstElementChild;

		strictEqual(widgetOptions12.inset, true, 'Inset option set to true');
		ok(collapsible12.classList.contains('ui-collapsible-inset'), 'Collapsible contains ui-collapsible-inset class');

		ok(headerLink12.classList.contains('ui-corner-top'), 'Header <a> contains ui-corner-top');
		ok(headerLink12.classList.contains('ui-corner-bottom'), 'Header <a> contains ui-corner-bottom');

		ok(btnInner12.classList.contains('ui-corner-top'), 'Header a > span contains ui-corner-top');
		ok(btnInner12.classList.contains('ui-corner-bottom'), 'Header a > span contains ui-corner-bottom');
		//-------------------
		strictEqual(widgetOptions13.inset, false, 'Inset option set to false');
		ok(!collapsible13.classList.contains('ui-collapsible-inset'), 'Collapsible doesn\'t contain ui-collapsible-inset class');

		ok(!headerLink13.classList.contains('ui-corner-top'), 'Header <a> doesn\'t contain ui-corner-top');
		ok(!headerLink13.classList.contains('ui-corner-bottom'), 'Header <a> doesn\'t contain ui-corner-bottom');

		ok(!btnInner13.classList.contains('ui-corner-top'), 'Header a > span doesn\'t contain ui-corner-top');
		ok(!btnInner13.classList.contains('ui-corner-bottom'), 'Header a > span doesn\'t contain ui-corner-bottom');
	});

	asyncTest('Widget destroy', function () {
		var afterDestroy = function (event) {
				ok(true, '"destroyed" event was triggered on document');
				equal(event.detail.widget, 'Collapsible', 'destroyed event has detail.widget == "Collapsible"');
				ok(event.detail.parent !== undefined, 'destroyed event sends parent node as detail.parent');

				start();
			};

		$("#collapsible16").collapsible();

		document.addEventListener('destroyed', afterDestroy, true);
		$("#collapsible16").collapsible('destroy');
	});

	function checkIfProperlyCollapsed(collapsible) {
		var chead = collapsible.querySelectorAll('.ui-collapsible-heading')[0],
			content = collapsible.querySelectorAll('.ui-collapsible-content')[0],
			contentChildrenNotContent = [].filter.call(content.children, function (node) {
				return node && !node.classList.contains('ui-collapsible-content') && node.tagName.toLowerCase() === 'li';
			}),
			headStatus = chead.querySelectorAll('.ui-collapsible-heading-status')[0];
			//headIcon = chead.querySelectorAll('.ui-icon')[0];

		ok(collapsible.classList.contains('ui-collapsible-collapsed'), 'Collapsible has proper ui-collapsible-collapsed class');
		ok(chead.classList.contains('ui-collapsible-heading-collapsed'), 'Header has class ui-collapsible-heading-collapsed');

		// @TODO This tests fail inside console, probably due to instanteWidget call which creates Button widget after assertions below
		//ok(headIcon.classList.contains('ui-icon-arrow-u'), 'Header icon has class ui-icon-arrow-u');
		//ok(!headIcon.classList.contains('ui-icon-arrow-d'), 'Header icon has no class ui-icon-arrow-d');

		equal(headStatus.innerHTML, ' Expandable list, tap to open list', 'Header status text is proper');

		ok(content.classList.contains('ui-collapsible-content-collapsed'), 'Content has ui-collapsible-content-collapsed class');
		equal(content.getAttribute('aria-hidden'), 'true', 'Content has aria-hidden=true attribute');

		contentChildrenNotContent.forEach(function (value, index) {
			ok(value && value.tabIndex === -1, 'Tabindex for children nodes is set to \'-1\'');
		});

		collapsible.removeEventListener('collapsed', handlers.checkIfProperlyCollapsed, false);
		start();
	}

	function checkIfProperlyExpanded(collapsible) {
		var chead = collapsible.querySelectorAll('.ui-collapsible-heading')[0],
			content = collapsible.querySelectorAll('.ui-collapsible-content')[0],
			contentChildrenNotContent = [].filter.call(content.children, function (node) {
				return node && !node.classList.contains('ui-collapsible-content') && node.tagName.toLowerCase() === 'li';
			}),
			headStatus = chead.querySelectorAll('.ui-collapsible-heading-status')[0];
			//headIcon = chead.querySelectorAll('.ui-icon')[0];

		ok(!collapsible.classList.contains('ui-collapsible-collapsed'), 'Collapsible doesn\'t have ui-collapsible-collapsed class');
		ok(!chead.classList.contains('ui-collapsible-heading-collapsed'), 'Header doesn\'t have ui-collapsible-heading-collapsed class');

		// @TODO This tests fail inside console, probably due to instanteWidget call which creates Button widget after assertions below
		//ok(headIcon.classList.contains('ui-icon-arrow-d'), 'Header icon has class ui-icon-arrow-d ');
		//ok(!headIcon.classList.contains('ui-icon-arrow-u'), 'Header icon has no class ui-icon-arrow-u ');

		equal(headStatus.innerHTML, ' Expandable list, tap to close list', 'Header status text is proper');

		ok(!content.classList.contains('ui-collapsible-content-collapsed'), 'Content doesn\'t have ui-collapsible-content-collapsed class');
		equal(content.getAttribute('aria-hidden'), 'false', 'Content has aria-hidden=false attribute');
		contentChildrenNotContent.forEach(function (value, index) {
			ok(value && value.tabIndex === 0, 'Tabindex for children nodes is set to \'0\'');
		});

		collapsible.removeEventListener('expanded', handlers.checkIfProperlyExpanded, false);
		start();
	}

	asyncTest('Triggering `collapse` event adds/removes proper classes', function () {
		var collapsible14 = document.getElementById('collapsible14');

		handlers.checkIfProperlyCollapsed = checkIfProperlyCollapsed.bind(null, collapsible14);

		//collapsible14.addEventListener('widgetbound', function() { console.log('widget got bound')}, false);
		collapsible14.addEventListener('collapsed', handlers.checkIfProperlyCollapsed, false);
		$("#collapsible14").collapsible();

		ej.event.trigger(collapsible14, 'collapse');
		//checkIfProperlyCollapsed(collapsible14);
	});

	asyncTest('Triggering `expand` event adds/removes proper classes', function () {
		var collapsible15 = document.getElementById('collapsible15');

		handlers.checkIfProperlyExpanded = checkIfProperlyExpanded.bind(null, collapsible15);

		//collapsible15.addEventListener('widgetbound', function() { console.log('widget got bound 3')}, false);
		collapsible15.addEventListener('expanded', handlers.checkIfProperlyExpanded, false);

		$("#collapsible15").collapsible();
		ej.event.trigger(collapsible15, 'expand');
		//checkIfProperlyExpanded(collapsible15);
	});
}());