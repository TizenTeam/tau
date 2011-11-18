/* For phonebook demo, Load dummy data via AJAX */
var pb_dbsrc ="phonebook_data/contacts.js";
var pb_dbtable = $("#all_contacts_page ul").data("dbtable");
var pb_groupdbtable = $("#all_groups_page ul").data("dbtable");

var pb_searchField = "name_first";
var nb_contacts = 0;
var nb_groups = 0;

/* String for items that has no group */
var allContacts = "All contacts";
var noGroup = "Not assigned";

/* Saved Location : Defaults support list */ 
var savedLocationListDB = ["Phone", "Samsung", "Google", "Facebook", "Yahoo", "Service numbers"];

function loadLocalScripts() {
	
	S.load(
			'js/phonebook.js',
			'init.js'
	);
	
	/* link custom stylesheet */
	S.css.load('css/phonebook.css');
};

loadLocalScripts();