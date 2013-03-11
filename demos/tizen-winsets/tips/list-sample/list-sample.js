$( document ).one( "pagecreate", "#list-sample", function () {
	var id = 0,
		add_item = function () {
			var li = '<li class="ui-li-1line-btn1" id="li' + id + '">' +
				'<span class="ui-li-text-main">Item ' + id + '</span>' +
				'<div data-role="button" data-inline="true" id="' + id + '">delete</div>' +
				'</li>';

			id++;

			$("#mylist").append( li ).trigger("create");
		};

	$("#add").on( "vclick", function ( e ) {
		add_item();
		$("#mylist").listview("refresh");
	});

	$("#add2").on( "vclick", function ( e ) {
		var i;

		for ( i = 0; i < 20; i++ ) {
			add_item();
		}

		$("#mylist").listview("refresh");
	});

	$("#new").on( "vclick", function ( e ) {
		$("#mylist").html("").trigger("create");

		add_item();
		$("#mylist").listview("refresh");
	});

	$("#new2").on( "vclick", function ( e ) {
		var i;

		$("#mylist").html("").trigger("create");

		for ( i = 0; i < 20; i++ ) {
			add_item();
		}

		$("#mylist").listview("refresh");
	});

	$("#mylist").on( "vclick", ".ui-btn", function ( e ) {
		$( "#li" + this.id ).remove();
		$("#mylist").listview("refresh");
	});
});
