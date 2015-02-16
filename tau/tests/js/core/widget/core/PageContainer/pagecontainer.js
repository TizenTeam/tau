module("core/widget/core/PageContainer", {});

var element = document.getElementById('qunit-fixture');
element.addEventListener('widgetbuilt', function() {
	test("tau.widget.core.PageContainer showLoading/hideLoading method", function () {
		var element = document.getElementById('qunit-fixture'),
			widget = tau.engine.instanceWidget(element, "pagecontainer");
		//console.log(widget.getActivePage());
		equal(widget.showLoading(), null, 'PageContainer showLoading');
		equal(widget.hideLoading(), null, 'PageContainer showLoading');
	});
	asyncTest("tau.widget.core.PageContainer change page", function () {
		expect(1);
		var element = document.getElementById('qunit-fixture'),
			nextPage = document.getElementById("page2"),
			widget = tau.engine.instanceWidget(element, "pagecontainer"),
			nextPageWidget = null;
		widget.change(nextPage);
		setTimeout(function(){
			nextPageWidget = tau.engine.getBinding(nextPage);
			equal(widget.getActivePage(), nextPageWidget, 'Page changed properly');
			start();
		}, 10);
	});
	//TODO
	//remove this test after fixing inifinite loop bug
	asyncTest("tau.widget.core.PageContainer change page", function () {
		expect(1);
		var element = document.getElementById('qunit-fixture'),
			nextPage = document.getElementById("page2"),
			widget = tau.engine.instanceWidget(element, "pagecontainer"),
			nextPageWidget = null;
		widget.change(nextPage);
		setTimeout(function(){
			nextPageWidget = tau.engine.getBinding(nextPage);
			equal(widget.getActivePage(), nextPageWidget, 'Page changed properly');
			start();
		}, 10);
	});
	if (!window.navigator.userAgent.match('PhantomJS')) {
		asyncTest("tau.widget.core.PageContainer change page with transition", function () {
			expect(1);
			var element = document.getElementById('qunit-fixture'),
				currentPage = document.getElementById("page3"),
				nextPage = document.getElementById("page4"),
				widget = tau.engine.instanceWidget(element, "pagecontainer"),
				nextPageWidget = null,
				oneEvent = function () {
				document.removeEventListener("pageshow", oneEvent, false);
					nextPageWidget = tau.engine.getBinding(nextPage);
					equal(widget.getActivePage(), nextPageWidget, 'Page changed properly');
					start();
				},
				onPageShow = function () {
					document.addEventListener("pageshow", oneEvent, false);
					document.removeEventListener('pageshow', onPageShow, false);
					tau.engine.getRouter().open(nextPage, {transition : "fade"});
				};
			//set a page if does not have any
			document.addEventListener('pageshow', onPageShow, false);
			tau.engine.getRouter().open(currentPage);
		});
		asyncTest("tau.widget.core.PageContainer change page with transition reverse", function () {
			expect(1);
			var element = document.getElementById('qunit-fixture'),
				currentPage = document.getElementById("page5"),
				nextPage = document.getElementById("page6"),
				widget = tau.engine.instanceWidget(element, "pagecontainer"),
				nextPageWidget = null,
				oneEvent = function () {
				document.removeEventListener("pageshow", oneEvent, false);
					nextPageWidget = tau.engine.getBinding(nextPage);
					equal(widget.getActivePage(), nextPageWidget, 'Page changed properly');
					start();
				},
				onPageShow = function () {
					document.removeEventListener('pageshow', onPageShow, false);
					document.addEventListener("pageshow", oneEvent, false);
					tau.engine.getRouter().open(nextPage, {transition : "fade", reverse : true});
				};
			//set a page if does not have any
			document.addEventListener('pageshow', onPageShow, false);
			tau.engine.getRouter().open(currentPage);
		});
	}
}, false);