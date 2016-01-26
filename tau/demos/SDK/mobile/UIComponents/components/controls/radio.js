(function(){
	var page = document.getElementById("radio-demo"),
		radios = document.querySelectorAll(".choosepet input[type='radio']"),
		radioresult = document.querySelector((".radio-result")),
		idx;

	function onChangeHandler(e) {
		var target = e.target;
		if (target.checked) {
			radioresult.innerHTML = "The Active Radio is " + target.id;
		}
	}

	page.addEventListener("pageshow", function(){
		for ( idx = 0; idx < radios.length; idx++) {
			radios[idx].addEventListener("change", onChangeHandler);
		}
	});
}());



