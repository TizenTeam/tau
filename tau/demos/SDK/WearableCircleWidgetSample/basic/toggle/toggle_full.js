(function(){
	var toggleSwitch = document.getElementById("toggle-full"),
		subText = document.getElementsByClassName("ui-switch-sub-text")[0];

	toggleSwitch.addEventListener("change", function(){
		subText.innerText =
			toggleSwitch.checked === true ? "On" : "Off";
	});
})();
