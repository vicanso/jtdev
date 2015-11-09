'use strict';
const fs = require('./fs');
const babel = require('babel-core');
module.exports = parse;

babel.transform('var HelloMessage = React.createClass({\n  render: function() {\n    return <div>Hello {this.props.name}</div>;\n  }\n});\n\nReactDOM.render(<HelloMessage name="John" />, mountNode);', {});

/**
 * [*parse description]
 * @param {[type]} file          [description]
 * @yield {[type]} [description]
 */
function* parse(file) {
	file = file.replace('.js', '.es');
	let readable = yield fs.canRead(file);
	if (!readable) {
		file = file.replace('.es', '.jsx');
	}
	let data = yield fs.readFile(file);
	console.dir(data);
	return babel.transform(data, {
		filename: file
	}).code;;
}