/* For phonebook demo, Load dummy data via AJAX */
var pb_dbsrc =$("#all_contacts_page ul").data("src");
var pb_dbtable = $("#all_contacts_page ul").data("dbtable");
var pb_searchField = "name_first";


function loadLocalScripts() {
	
	S.load(
			'js/phonebook.js',
			'init.js'
	);
	
	/* link custom stylesheet */
	S.css.load('css/phonebook.css');
};

loadLocalScripts();