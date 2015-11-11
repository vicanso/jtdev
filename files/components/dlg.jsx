var Dialog = React.createClass({
	render: function() {
		return <div>{this.props.title}</div>;
	}
});

ReactDOM.render(<Dialog title="Hello" />, mountNode);

exports.Dialog = Dialog;