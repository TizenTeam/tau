$().ready(function() {
	module("profile/mobile/widget/mobile/Navigation", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test ("Navigation" , function () {
		var navigation = document.getElementsByTagName('nav')[0],
			nvBar = tau.widget.Navigation(navigation),
			header = navigation.parentNode,
			ul = navigation.children[0],
			eventsCalled = {},
			li,
			historyArray = [{pageId: "test1"}, {pageId: "test2"}];

		nvBar.create(historyArray);

		li = ul.children;
		$(li[0]).on("navigate", function(event){
			eventsCalled[event.type] = true;
		});
		$(li[0]).trigger('vclick');

		equal(eventsCalled.navigate, true, "navigate event is triggered");
		ok(navigation.classList.contains("ui-navigation"), 'nav has ui-navigation class');
		ok(header.classList.contains("ui-title-navigation"), 'header has ui-title-navigation class');
		ok(ul.classList.contains("ui-navigation-ul"), 'ul has ui-navigation-ul class');
		ok(li[0].classList.contains("ui-navigation-li"), 'li has ui-navigation-li class');
		equal(li.length, historyArray.length, "li-cluster has created well");
		equal(li[0].innerHTML, "test1", "li has appropriate name");

	});
});
