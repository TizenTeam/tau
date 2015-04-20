
Player = can.Model({
	findAll: 'GET /list_players',
	findOne: "GET /list_players/{id}",
	create  : "POST /list_players",
	update  : "PUT /list_players/{id}",
	destroy : "DELETE /list_players/{id}"
},{});


var Players = can.Control({
	init:function(element,options){
		var el = this.element;
		this.render(el);
	},

	render : function(el){
		var button = document.getElementById("show");

		button.addEventListener("click", function () {
			console.time("createlist");
			
			can.fixture('GET /list_players', function(){
				return JSON_DATA;
			});
			
			Player.findAll({},function(list_players){
				el.html(can.view('views/viewmars.ejs',{
					list_players: list_players,
				}));
				tau.engine.getBinding(document.getElementsByClassName("ui-listview")[0], "Listview").refresh();
				console.timeEnd("createlist");
			});

		}, false)
	},

});

$(document).ready(function () {
	var contactControl = new Players('#playerlist');
});


//Initialize function
var init = function () {
	// TODO:: Do your initialization job

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