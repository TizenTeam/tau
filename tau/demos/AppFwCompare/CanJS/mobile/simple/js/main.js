(function(){

	var planet = [{name: "Mars"}];

	can.fixture('GET /planets', function(){
		return planet;
	});
 }());

Planet = can.Model({
	findAll: 'GET /planets',
	findOne: "GET /planets/{id}",
	create  : "POST /planets",
	update  : "PUT /planets/{id}",
	destroy : "DELETE /planets/{id}"
},{});


Planet.findAll({}, function(planets){
	var frag = can.view("views/viewmars.ejs", planets);
	document.getElementById("planetList").appendChild(frag);
});


//Initialize function
var init = function () {
	// TODO:: Do your initialization job
	console.log("init() called");

	// add eventListener for tizenhwkey
	document.addEventListener('tizenhwkey', function(e) {
		if(e.keyName == "back") {
			try {
				tizen.application.getCurrentApplication().exit();
			} catch (error) {
				console.error("getCurrentApplication(): " + error.message);
			}
		}
	});
};
//window.onload can work without <body onload="">
window.onload = init;