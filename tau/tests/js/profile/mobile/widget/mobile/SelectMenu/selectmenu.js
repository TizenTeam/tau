$().ready(function() {
	module("SelectMenu", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test ( "SelectMenu" , function () {
		var selectTag = document.getElementById("select"),
			widget = tau.widget.SelectMenu(selectTag),
			eventsCalled = {},
			id = selectTag.id,
			placeHolder = document.getElementById(id+"-placeholder"),
			options = document.getElementById(id+"-options"),
			wrapper = document.getElementById(id+"-selectmenu"),
			changeValue = options.children[3],
			screenFilter = document.getElementById(id+"-screen");

		$(selectTag).on("change", function(e) {
			eventsCalled[e.type] = true;
		});

		$(changeValue).trigger('vclick');

		ok(eventsCalled.change, 'change event is triggered.');
		ok(wrapper.classList.contains("ui-selectmenu"), 'SelectMenu wrapper has ui-selectmenu class');
		ok(placeHolder.classList.contains("ui-selectmenu-placeholder"), "Placeholder has ui-selectmenu-placeholder class");
		ok(options.classList.contains("ui-selectmenu-options"), "Options container has ui-selectmenu-options class");
		ok(screenFilter.classList.contains("ui-selectmenu-screen-filter"), "Screen Filter has ui-selectmenu-screen-filter class");
	});


});
