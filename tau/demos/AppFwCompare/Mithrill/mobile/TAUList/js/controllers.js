tau.setConfig("addPageIfNotExist", false);
tau.setConfig("autoBuildOnPageChange", true);

var TodoList = {
	controller: function (args) {
		return {
			items: args,
			createItem: function (player) {
				return m("li", {class: "li-has-multiline" + (player.checked ? " player-checked" : "")}, m("span", null, player.NAME), m("span", {
						class: "li-text-sub"
					}, m("span", null, player.FROM), m("span", null, player.ACTIVE)),
					m("input", {type: "checkbox", onchange: function() {
						player.checked = !player.checked;
					}})
				);
			}
		};
	},
	view: function (ctrl) {
		return m("ul", {
			class: "ui-listview",
			id: "listviewtest"
		}, ctrl.items.map(ctrl.createItem));
	}
};

var model = {
	items: []
};

var TodoApp = {
	componentDidMount: function () {
		//var el = $(this.getDOMNode());
		tau.engine.run();
	},
	controller: function () {
		return {
			items: model.items,
			loadPlayers: function () {
				console.time("templ-a");
				console.time("templ-tau");
				model.items.concat(JSON_DATA);
				m.redraw();
				tau.engine.createWidgets(document.body);
			},
			addPlayers: function () {
				model.items.push(JSON_DATA.shift());
				console.log("add");
				m.redraw();
				tau.engine.createWidgets(document.body);
			},
			deletePlayers: function () {
				JSON_DATA.push(model.items.shift());
				console.log("delete");
				m.redraw();
				tau.engine.createWidgets(document.body);
			}
		};
	},
	view: function (ctrl) {
		return (
			m("div", {class: "ui-page", id: "main"},
				m("header", {class: "ui-header"},
					m("h1", {class: "ui-title"}, "React + TAU")
				),
				m("div", {class: "ui-content"},
					m.component(TodoList, ctrl.items)
				),
				m("footer", {class: "ui-footer"},
					m("a", {
						class: "ui-btn", "data-inline": "true",
						onclick: ctrl.loadPlayers
					}, "load"),
					m("a", {
						class: "ui-btn",
						"data-inline": "true",
						onclick: ctrl.addPlayers
					}, "add"),
					m("a", {
						class: "ui-btn",
						"data-inline": "true",
						onclick: ctrl.deletePlayers
					}, "delete")
				)
			));
	}
};

m.mount(document.body, TodoApp);
