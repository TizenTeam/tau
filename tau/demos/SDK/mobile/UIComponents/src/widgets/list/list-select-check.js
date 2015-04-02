/* global tau*/
var selectAll = tau.widget.Checkboxradio(document.getElementsByName("check")[0]),
	checkboxWidgets = [
		tau.widget.Checkboxradio(document.getElementsByName("select-check1")[0]),
		tau.widget.Checkboxradio(document.getElementsByName("select-check2")[0]),
		tau.widget.Checkboxradio(document.getElementsByName("select-check3")[0])
	];

function checkAllCheckbox() {
	var val = selectAll.value() === null,
		len = checkboxWidgets.length,
		i;

	for (i = 0; i < len; i++) {
		checkboxWidgets[i].element.checked = !val;
		checkboxWidgets[i].refresh();
	}
}

function checkAll() {
	selectAll.element.checked = (selectAll.value() === null);
	selectAll.refresh();
	selectAll.trigger("change");
}

function watchCheckboxes() {
	"use strict";
	var allSelected = true,
		i = checkboxWidgets.length - 1;

	while(i >= 0 && allSelected) {
		allSelected = checkboxWidgets[i].value() !== null;
		i--;
	}

	selectAll.element.checked = allSelected;
	selectAll.refresh();
}

// Attach event listeners
selectAll.on("change", checkAllCheckbox);

// Listen to every checkbox and check/uncheck "select all" on change
checkboxWidgets.forEach(function (checkbox) {
	checkbox.on("change", watchCheckboxes);
});