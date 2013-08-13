/*
* Module Name : jquery.mobile.tizen.label
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Add markup for labels
//>>label: Label
//>>group: Tizen:Core

define( [
	'./license/MIT',
	"jquery",
	"jqm/jquery.mobile.core"
	], function ( jQuery ) {

//>>excludeEnd("jqmBuildExclude");

// Add markup for labels


(function($, undefined) {

$(document).bind("pagecreate create", function(e) {
    $(":jqmData(role='label')", e.target).not(":jqmData(role='none'), :jqmData(role='nojs')").each(function() {
        $(this).addClass("jquery-mobile-ui-label")
               .html($("<span>", {"class": "jquery-mobile-ui-label-text"}).text($(this).text()));
    });
});

})(jQuery);

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
} );
//>>excludeEnd("jqmBuildExclude");

