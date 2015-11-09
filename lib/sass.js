'use strict';
const fs = require('./fs');
const sass = require('sass');

/**
 * [*parse description]
 * @param {[type]} file          [description]
 * @yield {[type]} [description]
 */
function* parse(file) {
	file = file.replace('.css', '.sass');
	let data = yield fs.readFile(file);
	return sass.render(data, {
		filename: file
	});
}