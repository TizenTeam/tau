requirejs.config({
	"paths": {
		"jquery": "../../libs/jquery",
		"jquery.ui.core": "../../libs/jquery.ui.core",
		"jquery.ui.widget": "../../libs/jquery.ui.widget",
		"jquery.hashchange": "../../libs/jquery.hashchange"
	},
	"shim": {
		"jquery.hashchange": {
			deps: [ "jquery" ]
		},
		"jquery.ui.widget": {
			deps: [ "jquery", "jquery.ui.core" ],
			exports: "$.widget"
		},
		"jquery.ui.core": {
			deps: [ "jquery" ],
			exports: "$.ui"
		}
	}
});
