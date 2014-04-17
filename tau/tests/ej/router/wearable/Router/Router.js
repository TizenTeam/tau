/*global $: false, ej: false, document: false, window: false,
 module: false, test:false, equal: false*/
document.addEventListener('DOMContentLoaded', function () {
	'use strict';
	var Router = ej.router.wearable.Router,
		engine = ej.engine,
		utilsEvent = ej.utils.events,
		router = engine.getRouter(),
		helper = {
			createPage: function (id) {
				var template = '<div data-role="page" id="' + id + '" class="ui-page">'
						+ '<div class="content"></div>'
						+ '</div>',
					div = document.createElement('div');
				div.innerHTML = template;
				return div.firstChild;
			}
		};

	module('ej.router.wearable.Router public methods');
	test('init for justBuild:true', function () {
		router.init(true);
		equal(router.justBuild, true, 'Router has set property justBuild:true');
	});

	test('init for justBuild:false', function () {
		router.init(false);
		equal(router.justBuild, false, 'Router has not property justBuild');
	});

    /**
     * not working, wrong logic of test
     * @TODO investigate proper logic of test or add comment
	test('init for justBuild:false and active page', function () {
		var activePage = helper.createPage('activePage'),
			page = document.getElementById('secondPage');
		activePage.classList.add('ui-page-active');
		page.parentNode.appendChild(activePage);

		router.init(false);
		equal(router.getFirstPage(), activePage, 'Active page was proper initialized');
	});
     */

	test('getFirstPage', function () {
		var firstPage = document.getElementById('firstPage');
		router.init(false);
		equal(router.getFirstPage(), firstPage, 'router.getFirstPage()');
	});

	asyncTest('open enbedded #firstPage autoInitializePage:true', function () {
		var onPageShow = function () {
				start();
				equal(router.container.activePage.element, document.getElementById('firstPage'), 'router.open("#firstPage")');
				document.removeEventListener('pageshow', onPageShow, true);
			};
		document.addEventListener('pageshow', onPageShow, true);
		router.init();
	});

	asyncTest('open enbedded #firstPage', function () {
		var onPageShow = function () {
				start();
				equal(router.container.activePage.element, document.getElementById('firstPage'), 'router.open("#firstPage")');
				document.removeEventListener('pageshow', onPageShow, true);
			};
		ej.set('autoInitializePage', false);
		router.init();
		document.addEventListener('pageshow', onPageShow, true);
		router.open('#firstPage');
	});

	asyncTest('open enbedded #secondPage', function () {
		var onPageShow = function () {
				start();
				equal(router.container.activePage.element, document.getElementById('secondPage'), 'router.open("#secondPage")');
				document.removeEventListener('pageshow', onPageShow, true);
			};
		ej.set('autoInitializePage', false);
		router.init();
		document.addEventListener('pageshow', onPageShow, true);
		router.open('#secondPage');
	});

/*
 * #issue: event.which is never equal 1 in method linkClickHandler
 */
/*
	asyncTest('open enbedded #secondPage by click fastOn link', function () {
		var link = document.getElementById('linkToSecondPage'),
			onFirstPageShow = function () {
				document.removeEventListener('pageshow', onFirstPageShow, true);
				document.addEventListener('pageshow', onSecondPageShow, true);
				utilsEvent.trigger(link, 'click');
			},
			onSecondPageShow = function () {
				console.log('onSecondPageShow');
				start();
				equal(router.container.activePage.id, 'secondPage', 'page "secondPage" was opened after click');
				document.removeEventListener('pageshow', onSecondPageShow, true);
			};
		ej.set('autoInitializePage', true);
		document.addEventListener('pageshow', onFirstPageShow, true);
		router.init();
	});
*/

	asyncTest('open externalPage', function () {
		var onPageShow = function () {
				start();
				ok(router.container.activePage.id, 'externalPage', 'router.open("test-data/externalPage.html")');
				document.removeEventListener('pageshow', onPageShow, true);
			};
		ej.set('autoInitializePage', false);
		router.init();
		document.addEventListener('pageshow', onPageShow, true);
		router.open('test-data/externalPage.html')
	});

	test('destroy', function () {
		router.destroy();
		ok(true, 'router.destroy()');
	});

	test('setContainer', function () {
		var containerElement = document.getElementById('qunit-fixture'),
			container = engine.instanceWidget(containerElement, 'pagecontainer');
		router.setContainer(container);
		equal(router.container, container, 'router.setContainer()');
	});

	test('getContainer', function () {
		var containerElement = document.getElementById('qunit-fixture'),
			container = engine.instanceWidget(containerElement, 'pagecontainer');
		router.setContainer(container);
		equal(router.getContainer(), container, 'router.getContainer()');
	});

	test('register', function () {
		var containerElement = document.getElementById('qunit-fixture'),
			container = engine.instanceWidget(containerElement, 'pagecontainer'),
			firstPage = document.getElementById('firstPage');
		router.register(container, firstPage);
		equal(router.container, container, 'is container');
		equal(router.firstPage, firstPage, 'is firstPage');
	});

	asyncTest('openPopup', function () {
		var onPageShow = function () {
				document.removeEventListener('pageshow', onPageShow, true);
				router.openPopup('#firstPopup');
			},
			onPopupShow = function (event) {
				start();
				ok(event.target.classList.contains('ui-popup-active'), 'router.openPopup("#firstPopup")');
				document.getElementById('firstPopup').removeEventListener('popupshow', onPopupShow);
			};
		document.addEventListener('pageshow', onPageShow, true);
		document.getElementById('firstPopup').addEventListener('popupshow', onPopupShow);
		ej.set('autoInitializePage', true);
		router.init();
	});

	asyncTest('openPopup from externalPage', function () {
		var onPageShow = function () {
				document.removeEventListener('pageshow', onPageShow, true);
				router.openPopup('#externalPopup');
			},
			onPopupShow = function (event) {
				start();
				ok(event.target.classList.contains('ui-popup-active'), 'router.openPopup("#externalPopup")');
				document.removeEventListener('popupshow', onPopupShow, true);
			};
		router.init();
		document.addEventListener('pageshow', onPageShow, true);
		document.addEventListener('popupshow', onPopupShow, true);
		router.open('test-data/externalPage.html')
	});

	asyncTest('closePopup', function () {
		var onPageShow = function () {
				document.removeEventListener('pageshow', onPageShow, true);
				router.openPopup('#firstPopup');
			},
			onPopupShow = function () {
				document.getElementById('firstPopup').removeEventListener('popupshow', onPopupShow);
				router.closePopup();
			},
			onPopupHide = function (event) {
				start();
				equal(event.target.classList.contains('ui-popup-active'), false, 'router.closePopup("#firstPopup")');
				document.getElementById('firstPopup').removeEventListener('popuphide', onPopupHide);
			};
		document.addEventListener('pageshow', onPageShow, true);
		document.getElementById('firstPopup').addEventListener('popupshow', onPopupShow);
		document.getElementById('firstPopup').addEventListener('popuphide', onPopupHide);
		router.init();
	});

	asyncTest('open externalPage (load error)', function () {
		var onChangeFailed = function () {
				start();
				ok(true, 'router.open("test-data/not-exists-page.html") "changefailed" event triggered');
				document.removeEventListener('changefailed', onChangeFailed, true);
			};
		router.init();
		document.addEventListener('changefailed', onChangeFailed, true);
		router.open('test-data/not-exists-page.html')
	});

	test('open enbedded #not-embedded-page (change failed expected)', function () {
		var onChangeFailed = function () {
				ok(true, 'router.open("#not-embedded-page") "changefailed" event triggered');
				document.removeEventListener('changefailed', onChangeFailed, true);
			};
		router.init();
		document.addEventListener('changefailed', onChangeFailed, true);
		router.open('#not-embedded-page')
	});

	test('open enbedded (unknown rule)', function () {
		router.init();
		throws(function () {
				router.open('#firstPage', {rel: 'unknown-rule'})
			},
			Error,
			'Throw exception: Not defined router rule ["unknown-rule"]'
		);
	});

	/* protected */
	test('(protected method) _getInitialContent', function () {
		router.init();
		equal(router._getInitialContent(), router.firstPage, 'router');
	});

});