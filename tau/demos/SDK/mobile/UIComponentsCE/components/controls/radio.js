(function(){
	var page = document.getElementById("radio-demo"),
		radios = document.querySelectorAll(".choosepet input[type='radio']"),
		radioresult = document.querySelector((".radio-result")),
		idx;

	page.addEventListener("pageshow", function(){
		for ( idx = 0; idx < radios.length; idx++) {
			radios[idx].addEventListener("change", function(){
				if (this.checked) {
					radioresult.innerHTML = "The Active Radio is " + this.id;
				}
			});
		}
	});
})();



