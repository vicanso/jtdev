'use strict';

exports.readFile = readFile;
exports.canRead = canRead;

/**
 * [readFile description]
 * @param  {[type]} file     [description]
 * @param  {[type]} encoding [description]
 * @return {[type]}          [description]
 */
function readFile(file, encoding) {
	encoding = encoding || 'utf8';
	return new Promise(function(resolve, reject) {
		fs.readFile(file, encoding, function(err, str) {
			if (err) {
				reject(err);
			} else {
				resolve(str);
			}
		});
	});
}

/**
 * [canRead description]
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
function canRead(file) {
	return new Promise(function(resolve, reject) {
		fs.access(file, fs.R_OK, function(err) {
			if (err) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
}