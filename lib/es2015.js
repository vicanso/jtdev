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
	file = file.replace('.js', '.es');
	let data = yield fs.readFile(file);
	return babel.transform(data, {
		presets: ['es2015'],
		filename: file
	}).code;
}