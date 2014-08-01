var selectAll = tau.widget.Checkboxradio(document.getElementsByName("check")[0]),
	check = [];

check[0] = tau.widget.Checkboxradio(document.getElementsByName("select-check1")[0]);
check[1] = tau.widget.Checkboxradio(document.getElementsByName("select-check2")[0]);
check[2] = tau.widget.Checkboxradio(document.getElementsByName("select-check3")[0]);


function checkAllCheckbox() {
	var val = selectAll.value() === null ? false : true;
	for ( var i in check ) {
		if( check.hasOwnProperty(i) ) {
			check[i].element.checked = val;
			check[i].refresh();
		}
	}
}

function checkAll() {
	var val = selectAll.value() === null ? true : false;
	selectAll.element.checked = val;
	selectAll.refresh();
	selectAll.trigger("change");
}

selectAll.on("change", checkAllCheckbox);

