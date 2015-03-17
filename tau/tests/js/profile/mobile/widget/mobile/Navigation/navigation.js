$().ready(function() {
	module("profile/mobile/widget/mobile/Navigation", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});


	test ("Navigation" , function () {
		var navigation = document.getElementsByTagName('nav')[0],
			nvBar = new tau.widget.Navigation(navigation),
			container = navigation.children[0],
			eventsCalled = {},
			item;

		nvBar.push("test1");
		nvBar.push("test2");

		item = container.children;
		$(navigation).on("navigate", function(event){
			eventsCalled[event.type] = true;
		});
		$(item[0]).trigger('vclick');

		equal(eventsCalled.navigate, true, "navigate event is triggered");
		ok(navigation.classList.contains("ui-navigation"), 'nav has ui-navigation class');
		ok(container.classList.contains("ui-navigation-container"), 'ul has ui-navigation-ul class');
		ok(item[0].classList.contains("ui-navigation-item"), 'item has ui-navigation-item class');
		ok(item[0].classList.contains("ui-navigation-active"), 'item has ui-navigation-active class');
		equal(item.length, 1, "Navigation has deleted the next item when click the before item");
		equal(item[0].innerHTML, "test1", "item has appropriate name");

	});
});
