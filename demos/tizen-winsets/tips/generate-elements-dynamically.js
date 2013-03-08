var myArray = [];
function addCheckbox(){
	var newhtml,
		i = myArray.length;

	myArray[myArray.length] = 'Item - ' + myArray.length;
		newhtml = '<input type="checkbox" name="checkbox-'+i+'a" id="checkbox-'+i+'a" class="custom" />' ;
		newhtml += '<label for="checkbox-'+i+'a">'+myArray[i]+'</label>';
	$( "#checkboxItems" ).append( newhtml );
	$( "#checkboxItems" ).trigger( "create" );
}


$( document ).on( "vclick", "#bAdd", function () {
	addCheckbox();
} );

$( document ).on( "vclick", "#ButtonAdd", function () {
	/* Append new button */
	var buttonTemplate = "<div data-role='button' data-inline='true' " +
							"data-icon='call' data-style='circle' " +
							"data-theme='s' class='newbutton'></div>";
	$( buttonTemplate ).buttonMarkup().appendTo( "#buttonItems" );

	/* Same works */
	/*$("#buttonItems").trigger("create");*/
} );

$( document ).on( "vclick", "#ListAdd", function () {
	var listTemplate = "<li>Appended New Item</li>";
	$( listTemplate ).appendTo( "#listview" );
	$( "#listview" ).listview( "refresh");
} );
