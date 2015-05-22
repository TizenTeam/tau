(function () {
	"use strict";

	var handlers = {};

	module('profile/mobile/widget/mobile/GroupIndex', {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	function testGroupIndexBaseStructure(GroupIndex, name) {
		var chead = GroupIndex.firstElementChild,
			headLink = chead.firstElementChild;

		name = name ? ' ' + name : '';

		equal(GroupIndex.classList.contains('ui-group-index'), true, 'GroupIndex widget' + name + ' sets proper class');
		ok(chead.nextElementSibling, 'Sibling of widget' + name + ' content exists');
		equal(chead.nextElementSibling && chead.nextElementSibling.tagName, 'DIV', 'GroupIndex' + name + ' sibling is div');
		equal(chead.nextElementSibling && chead.nextElementSibling.classList.contains('ui-group-index-content'), true, 'GroupIndex' + name + ' sibling has class ui-group-index-content');

		// Check header structure
		strictEqual(chead.children.length, 1, 'Header contains one child');
		equal(headLink && headLink.tagName, 'A', 'Header only child is <a>');
		ok(headLink && headLink.classList.contains('ui-group-index-heading-toggle'), 'Link has proper heading-toggle class');
		//ok(headLink && headLink.classList.contains('ui-btn'), 'Link has ui-btn class');
		//@TODO add tests for all btn options
	}

	test('Widget creates proper structure', function () {
		var groupindex1 = document.getElementById('groupindex1'),
			groupindex2 = document.getElementById('groupindex2'),
			groupindex3 = document.getElementById('groupindex3'),
			groupindex4 = document.getElementById('groupindex4'),
			groupindex5 = document.getElementById('groupindex5'),
			groupindex6 = document.getElementById('groupindex6'),
			groupindex7 = document.getElementById('groupindex7'),
//			chead2 = document.getElementById('c-head-2'),
//			chead3 = document.getElementById('c-head-3'),
//			chead4 = document.getElementById('c-head-4'),
//			chead5 = document.getElementById('c-head-5'),
//			chead6 = document.getElementById('c-head-6'),
			chead7 = document.getElementById('c-head-7'),
			preSwapHTMLRegExp;

		$("#groupindex1").GroupIndex();
		testGroupIndexBaseStructure(groupindex1, 'with <h1>');

		// wrapps content in div with classes ui-group-index-content
		$("#groupindex2").GroupIndex();
		testGroupIndexBaseStructure(groupindex2, 'with <h2>');

		$("#groupindex3").GroupIndex();
		testGroupIndexBaseStructure(groupindex3, 'with <h3>');

		$("#groupindex4").GroupIndex();
		testGroupIndexBaseStructure(groupindex4, 'with <h4>');

		$("#groupindex5").GroupIndex();
		testGroupIndexBaseStructure(groupindex5, 'with <h5>');

		$("#groupindex6").GroupIndex();
		testGroupIndexBaseStructure(groupindex6, 'with <h6>');

		// Change <legend> header to simple div
		preSwapHTMLRegExp = new RegExp(chead7.innerHTML, 'g');
		$("#groupindex7").GroupIndex();
		testGroupIndexBaseStructure(groupindex7, 'with <legend>');
		chead7 = groupindex7.children[0];
		equal(chead7.tagName, 'DIV', 'Legend was changed to div');
		// @todo consider changing regex test to something more DOM manipulation friendly
		ok(preSwapHTMLRegExp.test(chead7.innerHTML), 'Heading content after swaping stayed the same');
		strictEqual(chead7.getAttribute('role'), 'heading', 'Widget heading has role="heading" attribute');
	});

	test('Widget wraps groupindex content inside ui-group-index-content', function () {
		var movedContent = document.getElementById('moved-content');

		equal(movedContent.parentNode.id, 'groupindex8', 'Widget content has parent as authored');
		$("#groupindex8").GroupIndex();
		notEqual(movedContent.parentNode.id, 'groupindex8', 'Widget content has moved');
		equal(movedContent.parentNode.tagName, 'DIV', 'Content moved to div');
		ok(movedContent.parentNode.classList.contains('ui-group-index-content'), 'Content moved to parent with class ui-group-index-content');
		ok(movedContent.parentNode.previousElementSibling.classList.contains('ui-group-index-heading'), 'Content previous sibling is heading (has ui-group-index-heading class)');
	});

	asyncTest('Widget destroy', function () {
		var afterDestroy = function (event) {
				ok(true, '"destroyed" event was triggered on document');
				equal(event.detail.widget, 'GroupIndex', 'destroyed event has detail.widget == "GroupIndex"');
				ok(event.detail.parent !== undefined, 'destroyed event sends parent node as detail.parent');

				start();
			};

		$("#groupindex16").GroupIndex();

		document.addEventListener('destroyed', afterDestroy, true);
		$("#groupindex16").GroupIndex('destroy');
	});

	function checkIfProperlyCollapsed(groupindex) {
		var chead = groupindex.querySelectorAll('.ui-group-index-heading')[0],
			content = groupindex.querySelectorAll('.ui-group-index-content')[0],
			contentChildrenNotContent = [].filter.call(content.children, function (node) {
				return node && !node.classList.contains('ui-group-index-content') && node.tagName.toLowerCase() === 'li';
			}),
			headStatus = chead.querySelectorAll('.ui-group-index-heading-status')[0];
			//headIcon = chead.querySelectorAll('.ui-icon')[0];

		ok(groupindex.classList.contains('ui-group-index-collapsed'), 'groupindex has proper ui-group-index-collapsed class');
		ok(chead.classList.contains('ui-group-index-heading-collapsed'), 'Header has class ui-group-index-heading-collapsed');

		// @TODO This tests fail inside console, probably due to instanteWidget call which creates Button widget after assertions below
		//ok(headIcon.classList.contains('ui-icon-arrow-u'), 'Header icon has class ui-icon-arrow-u');
		//ok(!headIcon.classList.contains('ui-icon-arrow-d'), 'Header icon has no class ui-icon-arrow-d');

		ok(content.classList.contains('ui-group-index-content-collapsed'), 'Content has ui-group-index-content-collapsed class');
		equal(content.getAttribute('aria-hidden'), 'true', 'Content has aria-hidden=true attribute');

		contentChildrenNotContent.forEach(function (value, index) {
			ok(value && value.tabIndex === -1, 'Tabindex for children nodes is set to \'-1\'');
		});

		groupindex.removeEventListener('collapsed', handlers.checkIfProperlyCollapsed, false);
		start();
	}

	function checkIfProperlyExpanded(groupindex) {
		var chead = groupindex.querySelectorAll('.ui-group-index-heading')[0],
			content = groupindex.querySelectorAll('.ui-group-index-content')[0],
			contentChildrenNotContent = [].filter.call(content.children, function (node) {
				return node && !node.classList.contains('ui-group-index-content') && node.tagName.toLowerCase() === 'li';
			}),
			headStatus = chead.querySelectorAll('.ui-group-index-heading-status')[0];
			//headIcon = chead.querySelectorAll('.ui-icon')[0];

		ok(!groupindex.classList.contains('ui-group-index-collapsed'), 'groupindex doesn\'t have ui-group-index-collapsed class');
		ok(!chead.classList.contains('ui-group-index-heading-collapsed'), 'Header doesn\'t have ui-group-index-heading-collapsed class');

		// @TODO This tests fail inside console, probably due to instanteWidget call which creates Button widget after assertions below
		//ok(headIcon.classList.contains('ui-icon-arrow-d'), 'Header icon has class ui-icon-arrow-d ');
		//ok(!headIcon.classList.contains('ui-icon-arrow-u'), 'Header icon has no class ui-icon-arrow-u ');

		ok(!content.classList.contains('ui-group-index-content-collapsed'), 'Content doesn\'t have ui-group-index-content-collapsed class');
		equal(content.getAttribute('aria-hidden'), 'false', 'Content has aria-hidden=false attribute');
		contentChildrenNotContent.forEach(function (value, index) {
			ok(value && value.tabIndex === 0, 'Tabindex for children nodes is set to \'0\'');
		});

		groupindex.removeEventListener('expanded', handlers.checkIfProperlyExpanded, false);
		start();
	}

	asyncTest('Triggering `collapse` event adds/removes proper classes', function () {
		var groupindex14 = document.getElementById('groupindex14');

		handlers.checkIfProperlyCollapsed = checkIfProperlyCollapsed.bind(null, groupindex14);

		//groupindex14.addEventListener('widgetbound', function() { console.log('widget got bound')}, false);
		groupindex14.addEventListener('collapsed', handlers.checkIfProperlyCollapsed, false);
		$("#groupindex14").GroupIndex();

		ej.event.trigger(groupindex14, 'collapse');
		//checkIfProperlyCollapsed(groupindex14);
	});

	asyncTest('Triggering `expand` event adds/removes proper classes', function () {
		var groupindex15 = document.getElementById('groupindex15');

		handlers.checkIfProperlyExpanded = checkIfProperlyExpanded.bind(null, groupindex15);

		//groupindex15.addEventListener('widgetbound', function() { console.log('widget got bound 3')}, false);
		groupindex15.addEventListener('expanded', handlers.checkIfProperlyExpanded, false);

		$("#groupindex15").GroupIndex();
		ej.event.trigger(groupindex15, 'expand');
		//checkIfProperlyExpanded(groupindex15);
	});
}());
