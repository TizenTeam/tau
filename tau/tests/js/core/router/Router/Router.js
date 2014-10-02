/*global $: false, tau: false, document: false, window: false,
 module: false, test:false, equal: false*/
document.addEventListener('DOMContentLoaded', function () {
	'use strict';
	var Router = tau.router.Router,
		engine = tau.engine,
		router = engine.getRouter();

	module('tau.router.wearable.Router public methods', {
		teardown: function () {
			tau.engine._clearBindings();
			router.destroy();
		},
		setup: function() {

		}
	});
	test('init for justBuild:true', function () {
		router.init(true);
		equal(router.justBuild, true, 'Router has set property justBuild:true');
	});

	test('init for justBuild:false', function () {
		router.init(false);
		equal(router.justBuild, false, 'Router has not property justBuild');
	});
/*
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
				equal(router.container.activePage.element.id, 'firstPage', 'router.open("#firstPage")');
				document.removeEventListener('pageshow', onPageShow, true);
			};
		document.addEventListener('pageshow', onPageShow, true);
		router.init();
	});

	asyncTest('open enbedded #firstPage', function () {
		var onPageShow = function () {
				start();
				equal(router.container.activePage.element.id, 'firstPage', 'router.open("#firstPage")');
				document.removeEventListener('pageshow', onPageShow, true);
			};
		tau.set('autoInitializePage', false);
		router.init();
		document.addEventListener('pageshow', onPageShow, true);
		router.open('#firstPage');
	});

	asyncTest('open enbedded #secondPage', function () {
		var onPageShow = function () {
				start();
				equal(router.container.activePage.element.id, 'secondPage', 'router.open("#secondPage")');
				document.removeEventListener('pageshow', onPageShow, true);
			};
		tau.set('autoInitializePage', false);
		router.init();
		document.addEventListener('pageshow', onPageShow, true);
		router.open('#secondPage');
	});

	asyncTest('open enbedded #thirdPage', function () {
		var onPageShow = function () {
				start();
				equal(router.container.activePage.element, document.getElementById('thirdPage'), 'router.open("#thirdPage")');
				document.removeEventListener('pageshow', onPageShow, true);
			};
		tau.set('autoInitializePage', false);
		router.init();
		document.addEventListener('pageshow', onPageShow, true);
		router.open('#thirdPage');
	});

/*
 * #issue: event.which is never equal 1 in method linkClickHandler
 */
/*
	asyncTest('open enbedded #secondPage by click on link', function () {
		var link = document.getElementById('linkToSecondPage'),
			onFirstPageShow = function () {
				document.removeEventListener('pageshow', onFirstPageShow, true);
				document.addEventListener('pageshow', onSecondPageShow, true);
				utilsEvent.trigger(link, 'click');
			},
			onSecondPageShow = function () {
				start();
				equal(router.container.activePage.id, 'secondPage', 'page "secondPage" was opened after click');
				document.removeEventListener('pageshow', onSecondPageShow, true);
			};
		tau.set('autoInitializePage', true);
		document.addEventListener('pageshow', onFirstPageShow, true);
		router.init();
	});
*/
	if (!window.navigator.userAgent.match("PhantomJS")) {
		asyncTest('open externalPage', function () {
			var onPageShow = function () {
				start();
				ok(router.container.activePage.id, 'externalPage', 'router.open("test-data/externalPage.html")');
				document.removeEventListener('pageshow', onPageShow, true);
			};
			tau.set('autoInitializePage', false);
			router.init();
			document.addEventListener('pageshow', onPageShow, true);
			router.open('test-data/externalPage.html')
		});
	}

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
				ok("Page was opened");
			},
			onPopupShow = function (event) {
				start();
				ok(document.querySelector('.ui-popup-active'), 'router.openPopup("#firstPopup")');
				document.getElementById('firstPopup').removeEventListener('popupshow', onPopupShow);
			};
		document.addEventListener('pageshow', onPageShow, true);
		document.getElementById('firstPopup').addEventListener('popupshow', onPopupShow);
		tau.set('autoInitializePage', true);
		router.init();
	});

	if (!window.navigator.userAgent.match("PhantomJS")) {
		asyncTest('openPopup from externalPage', 2, function () {
			var onPageShow = function () {
					document.removeEventListener('pageshow', onPageShow, true);
					router.openPopup('#externalPopup');
					ok("Page was opened");
				},
				onPopupShow = function (event) {
					start();
					ok(document.querySelector('.ui-popup-active'), 'router.openPopup("#externalPopup")');
					document.removeEventListener('popupshow', onPopupShow, true);
				};
			router.init();
			setTimeout(function() {
			document.addEventListener('pageshow', onPageShow, true);
			document.addEventListener('popupshow', onPopupShow, true);
			router.open('test-data/externalPage.html');
			}, 1000);
		});
	}

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

	if (!window.navigator.userAgent.match("PhantomJS")) {
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
	}

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