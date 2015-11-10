'use strict';
const fs = require('./fs');
const babel = require('babel-core');
module.exports = parse;

/**
 * [*parse description]
 * @param {[type]} file          [description]
 * @yield {[type]} [description]
 */
function* parse(file) {
	file = file.replace('.js', '.jsx');
	let data = yield fs.readFile(file);
	return babel.transform(data, {
		presets: ['react'],
		filename: file
	}).code;
}