//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"require",
	"jquery",
	"jquery.ui.core",
	"jquery.ui.widget",
	"./ns"
], function( require ) {
	require( [ "./init",
				"./widget/indexScrollbar",
				"./widget/scroller",
				"./widget/sectionchanger",
				"./utils/listHighlightController" ], function() {} );
});
//>>excludeEnd("microBuildExclude");
