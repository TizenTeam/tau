var myArray = [];
function addCheckbox(){
	var newhtml;
	var i = myArray.length;
	myArray[myArray.length] = 'Item - ' + myArray.length;
		newhtml = '<input type="checkbox" name="checkbox-'+i+'a" id="checkbox-'+i+'a" class="custom" />' ;
		newhtml += '<label for="checkbox-'+i+'a">'+myArray[i]+'</label>';
	$("#checkboxItems").append(newhtml);
	$("#checkboxItems").trigger( "create" );
}


$('#bAdd').live('vclick', function () {
		addCheckbox();
});
