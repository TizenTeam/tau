tau.setConfig("addPageIfNotExist", false);
tau.setConfig("autoBuildOnPageChange", true);

var TodoList = React.createClass({
	getInitialState: function () {
		return {items:this.props.items};
	},
	onChange: function(e) {
		console.log("changed");
		var id = e.target.dataset.key;
		this.state.items[id].checked = !this.state.items[id].checked;
		this.setState(this.state);
	},
	render: function () {
		var createItem = function (player, key) {
			return <li className={player.checked ? 'li-has-multiline player-checked' : 'li-has-multiline'}><span>{ player.NAME }</span><span
				className="li-text-sub"><span>{ player.FROM }</span><span>{ player.ACTIVE }</span></span>
				<input type="checkbox" onChange={this.onChange} data-key={key} />
			</li>;
		};
		return <ul className="ui-listview"
				   id="listviewtest">{this.state.items.map(createItem)}</ul>;
	}, componentDidUpdate: function () {
		var list = tau.widget.getInstance(document.getElementById("listviewtest"), "Listview");
		if (list) {
			setTimeout(function () {
				console.timeEnd("templ-a");
				//list.refresh();
				//tau.engine.createWidgets(list.element);
				console.timeEnd("templ-tau");
			}, 0);
		}
	}
});
var TodoApp = React.createClass({
	componentDidMount: function () {
		//var el = $(this.getDOMNode());
		tau.engine.run();
	},
	getInitialState: function () {
		return {items:[]};
	},
	loadPlayers: function () {
		console.time("templ-a");
		console.time("templ-tau");
		this.setState({items: JSON_DATA});
	},
	addPlayers: function () {
		this.state.items.push(JSON_DATA.shift());
		this.setState({items: this.state.items});
		console.log("add");
	},
	deletePlayers: function () {
		JSON_DATA.push(this.state.items.shift());
		console.log("delete");
		this.setState({items: this.state.items});
	},
	render: function () {
		return (
			<div className="ui-page" id="main">
				<header className="ui-header">
					<h1 className="ui-title">React + TAU</h1>
				</header>
				<div className="ui-content">
					<TodoList items={this.state.items}/>
				</div>
				<footer className="ui-footer">
					<a className="ui-button" data-inline="true"
					   onClick={this.loadPlayers}>load</a>
					<a className="ui-button" data-inline="true" onClick={this.addPlayers}>add</a>
					<a className="ui-button" data-inline="true" onClick={this.deletePlayers}>delete</a>
				</footer>
			</div>);
	}
});

React.render(<TodoApp />, document.body);
