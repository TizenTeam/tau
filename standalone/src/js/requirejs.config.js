requirejs.config({
	"paths": {
		"jquery": "../../libs/jquery",
		"jquery.ui.core": "../../libs/jquery.ui.core",
		"jquery.ui.widget": "../../libs/jquery.ui.widget"
	},
	"shim": {
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
