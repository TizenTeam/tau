$( document ).bind( "pagebeforeshow", function () {
	var id = 0,
		add_ex = function () {
			var li = '<li class="ui-li-1line ui-li-dialogue" data-expandable="true" id="exp1" data-initial-expansion="true">exp1 parent</li>' +
				'<li class="ui-li-1line ui-li-dialogue" data-expanded-by="exp1">exp1-sub 1</li>' +
				'<li class="ui-li-1line ui-li-dialogue" data-expanded-by="exp1">exp1-sub 2</li>';

			$("#mylist").append( li ).trigger("create");
		},
		add_item = function () {
			var li = '<li class="ui-li-1line ui-li-dialogue" data-expanded-by="exp1">exp1-sub 3</li>';

			$("#mylist").append( li ).trigger("create");
		};

	add_ex();
	$("#mylist").listview("refresh");

	add_item();
	$("#mylist").listview("refresh");
	$("#exp1").expandablelist("refresh");
});
