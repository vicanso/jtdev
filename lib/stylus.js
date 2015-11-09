'use strict';
const fs = require('./fs');
const nib = require('nib');
const stylus = require('stylus');
module.exports = parse;

/**
 * [*parse description]
 * @param {[type]} file          [description]
 * @yield {[type]} [description]
 */
function* parse(file) {
	file = file.replace('.css', '.styl');
	let data = yield fs.readFile(file);
	return yield render(data);
}


/**
 * [*render description]
 * @param {[type]} data          [description]
 * @param {[type]} file          [description]
 * @yield {[type]} [description]
 */
function render(data, file) {
	return new Promise(function(resolve, reject) {
		stylus(data).set('filename', file)
			.use(nib())
			.render(function(err, css) {
				if (err) {
					reject(err);
				} else {
					resolve(css);
				}
			});
	});
}