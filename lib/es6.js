'use strict';
const fs = require('./fs');
const babel = require('babel-core');
module.exports = parser;

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
	return babel.transform(data);
}