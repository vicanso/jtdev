'use strict';
const fs = require('./fs');
const less = require('less');

module.exports = parse;

/**
 * [*parse description]
 * @param {[type]} file          [description]
 * @yield {[type]} [description]
 */
function* parse(file) {
	file = file.replace('.css', '.less');
	let data = yield fs.readFile(file);
	return new Promise(function(resolve, reject) {
		less.render(data, {
			filename: file
		}, function(err, output) {
			if (err) {
				reject(err);
			} else {
				resolve(output.css);
			}
		});
	});
}