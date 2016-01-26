(function(){
	var page = document.getElementById("checkbox-demo"),
		checkone = document.getElementById("checkbox-1"),
		checkboxResult = document.querySelector(".checkbox-result"),
		favortieone = document.getElementById("favorite-1"),
		favoriteResult = document.querySelector(".favorite-result");

	page.addEventListener("pageshow", function(){

		checkone.addEventListener("click", function(){
			var value = checkone.checked;
			checkboxResult.innerHTML = "The First Checkbox is " + value;
		});

		favortieone.addEventListener("click", function(){
			var value = favortieone.checked;
			favoriteResult.innerHTML = "The First Favorite is " + value;
		});
	});
}());