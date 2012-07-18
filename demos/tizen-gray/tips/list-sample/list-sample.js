$( document ).bind( "pagecreate", function () {
	var id = 0;

	$("#add").bind( "vclick", function ( e ) {
		var li;

		li = '<li class="ui-li-1line-btn1" id="li' + id + '">' +
				'<span class="ui-li-text-main">Item ' + id + '</span>' +
				'<div data-role="button" data-inline="true" id="' + id + '">delete</div>'+
			'</li>';

		$("#mylist").append( li ).trigger("create").listview("refresh");

		id++;
	});

	$("#mylist").delegate( ".ui-btn", "vclick", function ( e ) {
		$( "#li" + this.id ).remove();
		$("#mylist").listview("refresh");
	});

	$("#new").bind( "vclick", function ( e ) {
		var li;

		li = '<li class="ui-li-1line-btn1" id="li' + id + '">' +
				'<span class="ui-li-text-main">Item ' + id + '</span>' +
				'<div data-role="button" data-inline="true" id="' + id + '">delete</div>'+
			'</li>';

		$("#mylist").html( li ).trigger("create").listview("refresh");
	});
});
