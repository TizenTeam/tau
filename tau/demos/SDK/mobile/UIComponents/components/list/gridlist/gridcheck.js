(function() {
	var list = document.getElementById("gridlist"),
		checkboxes = list.querySelectorAll("input[type='checkbox']"),
		elSelectAll = document.getElementById("select-all"),
		isAll = false;


	function selectAll() {
		var i, len;
		for(i=0,len=checkboxes.length;i<len;i++) {
			checkboxes[i].checked = !isAll;
		}
		isAll = !isAll;
	}

	elSelectAll.addEventListener("change", selectAll);
})();

