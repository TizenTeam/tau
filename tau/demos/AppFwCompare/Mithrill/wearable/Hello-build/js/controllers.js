var model = {
		secondsElapsed: 0,
		objectChanged: false
	},
	referencedObject = document.body.firstElementChild;

function tick() {
	model.secondsElapsed = model.secondsElapsed + 1;
	model.objectChanged = referencedObject === document.body.firstElementChild
	m.redraw();
}

var Demo = {
	//controller
	controller: function() {
		var secondsElapsed = 0;
		setInterval(tick, 1000);
		return {
			name: "John JS",
			model: model
		}
	},

	//view
	view: function(ctrl) {
		return m("div", {
			class: "built"
		}, ["Hello ", ctrl.name, " ", ctrl.model.secondsElapsed, " ", ctrl.model.objectChanged]);
	}
};


//initialize
m.mount(document.body, Demo);