var page = document.getElementById("listcheck"),
	selectAll = tau.widget.Checkboxradio(document.getElementsByName("check")[0]),
	navSelectAll = document.getElementById("navSelectAll"),
	check = [],
	isAll = false;

check[0] = tau.widget.Checkboxradio(document.getElementsByName("select-check1")[0]);
check[1] = tau.widget.Checkboxradio(document.getElementsByName("select-check2")[0]);
check[2] = tau.widget.Checkboxradio(document.getElementsByName("select-check3")[0]);


function checkAllCheckbox() {
	var val = selectAll.value() === null ? false : true,
		i;
	for ( i in check ) {
		if( check.hasOwnProperty(i) ) {
			check[i].element.checked = val;
			check[i].refresh();
		}
	}
	isAll = val === true ? true : false;
}

function checkCheckboxs(event) {
	if (!isAll) {
		if (event.target.getAttribute("name") !== "check") {
			selectAll.element.checked = false;
			selectAll.refresh();
		}
		return;
	}
	isAll = false;
}

function onNavBtnClick() {
	var val = selectAll.value() === null ? true : false;
	selectAll.element.checked = val;
	selectAll.refresh();
	selectAll.trigger("change");
}

selectAll.on("change", checkAllCheckbox);
page.addEventListener("change", checkCheckboxs);
navSelectAll.addEventListener("click", onNavBtnClick);