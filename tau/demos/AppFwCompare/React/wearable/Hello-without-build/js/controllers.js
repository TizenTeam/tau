var HelloMessage = React.createClass({displayName: "HelloMessage",
	render: function() {
		return React.createElement("div", {className: "built"}, "Hello ", this.props.name);
	}
});

React.render(React.createElement(HelloMessage, {name: "John"}), document.body);