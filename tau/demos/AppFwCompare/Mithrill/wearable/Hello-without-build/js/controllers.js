var Demo = {
	//controller
	controller: function() {
		return {
			name: "John"
		}
	},

	//view
	view: function(ctrl) {
		return m("div", {
			class: "built"
		}, "Hello " + ctrl.name);
	}
};


//initialize
m.mount(document.body, Demo);