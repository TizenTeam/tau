$( document ).one( "pageshow", ":jqmData(role='page')", function ( ev ) {
    var page = ev.target;

    $( "#" + page.id + "-search-input" ).on( "input change", function ( ev ) {
        var regEx,
            sinput = ev.target,
            content = $( page ).children(":jqmData(role='content')")[0];

        regEx = new RegExp(".*" + $( sinput ).val().toLowerCase());

        $( content ).find( "li" ).each( function () {
            if ( $( this ).text().toLowerCase().match(regEx) ) {
                $( this ).show();
            } else {
                $( this ).hide();
            }
        });

        $( content ).scrollview( "scrollTo", 0, 0, 0 );
    });
});


