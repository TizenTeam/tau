var HelloMessage = React.createClass({displayName: "HelloMessage",
	render: function() {
		return React.createElement("div", {className: "ui-page ui-page-active"}, [
			React.createElement("header", {className: "ui-header"}, [
				React.createElement("h2", {className: "ui-title"}, "UI Components")
			]),
			React.createElement("div", {className: "ui-content"}, [
				React.createElement("ul", {className: "ui-listview"}, [
					React.createElement("li", {}, [
						React.createElement("a", {href: "#"}, "Header")
					]),
					React.createElement("li", {}, [
						React.createElement("a", {href: "#"}, "Footer")
					]),
					React.createElement("li", {}, [
						React.createElement("a", {href: "#"}, "Content")
					]),
					React.createElement("li", {}, [
						React.createElement("a", {href: "#"}, "List")
					]),
					React.createElement("li", {}, [
						React.createElement("a", {href: "#"}, "Popup")
					]),
					React.createElement("li", {}, [
						React.createElement("a", {href: "#"}, "Controls")
					]),
					React.createElement("li", {}, [
						React.createElement("a", {href: "#"}, "Indicator")
					]),
					React.createElement("li", {}, [
						React.createElement("a", {href: "#"}, "Processing")
					]),
					React.createElement("li", {}, [
						React.createElement("a", {href: "#"}, "Marquee")
					])
				])
			])
		]);
	}
});


React.render(React.createElement(HelloMessage), document.body);