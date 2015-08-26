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
		return m("div", {class: "ui-page ui-page-active"}, [
			m("header", {class: "ui-header"}, [
				m("h2", {class: "ui-title"}, "UI Components")
			]),
			m("div", {class: "ui-content"}, [
				m("ul", {class: "ui-listview"}, [
					m("li", {}, [
						m("a", {href: "#"}, "Header")
					]),
					m("li", {}, [
						m("a", {href: "#"}, "Footer")
					]),
					m("li", {}, [
						m("a", {href: "#"}, "Content")
					]),
					m("li", {}, [
						m("a", {href: "#"}, "List")
					]),
					m("li", {}, [
						m("a", {href: "#"}, "Popup")
					]),
					m("li", {}, [
						m("a", {href: "#"}, "Controls")
					]),
					m("li", {}, [
						m("a", {href: "#"}, "Indicator")
					]),
					m("li", {}, [
						m("a", {href: "#"}, "Processing")
					]),
					m("li", {}, [
						m("a", {href: "#"}, "Marquee")
					])
				])
			])
		]);
	}
};


//initialize
m.mount(document.body, Demo);