var referencedObject = document.body.firstElementChild,
	HelloMessage = React.createClass({displayName: "HelloMessage",
	getInitialState: function() {
		return {secondsElapsed: 0,
			objectChanged: ""
		};
	},
	tick: function() {
		this.setState({secondsElapsed: this.state.secondsElapsed + 1,
			objectChanged: referencedObject === document.body.firstElementChild ? "true" : "false"});
	},
	componentDidMount: function() {
		this.interval = setInterval(this.tick, 1000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},
	render: function() {
		return React.createElement("div", {className: "built"}, "Hello ", this.props.name, " ", this.state.secondsElapsed, " ", this.state.objectChanged);
	}
});


React.render(React.createElement(HelloMessage, {name: "John JS"}), document.body);