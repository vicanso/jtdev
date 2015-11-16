'use strict';
const path = require('path');
const url = require('url');
const fs = require('./lib/fs');
const es2015 = require('./lib/es2015');
const jsx = require('./lib/jsx');
const less = require('./lib/less');
const stylus = require('./lib/stylus');
const requirejs = require('./lib/requirejs');
const util = require('util');
const through = require('through2');

exports.parser = parser;
exports.defineWrapper = defineWrapper;
exports.requirejs = requirejsDefine;

function parser(staticPath) {
	return function* staticParser(next) {
		/*jshint validthis:true */
		const ctx = this;
		let urlInfo = url.parse(ctx.url);
		let file = path.join(staticPath, urlInfo.pathname);
		file = file.replace(/\\/g, '/');
		if (path.sep !== '/') {
			file = file.replace(/\//g, '\\');
		}
		let ext = path.extname(file);
		let newExt;
		let contentType;
		switch (ext) {
			case '.css':
				newExt = yield convertFileExt(file, ext, ['.styl', '.less']);
				contentType = 'text/css; charset=utf-8';
				break;
			case '.js':
				newExt = yield convertFileExt(file, ext, ['.jsx', '.es']);
				contentType = 'application/javascript; charset=utf-8';
				break;
			default:
				newExt = ext;
				break;
		}
		if (newExt !== ext) {
			let fns = {
				'.styl': stylus,
				'.less': less,
				'.es': es2015,
				'.jsx': jsx
			};
			let data = yield fns[newExt](file);
			ctx.set({
				'Content-Type': contentType
			});
			ctx.body = data;
		} else {
			yield * next;
		}

	}
}

/**
 * [ *convertFileExt description]
 * @param {[type]} file          [description]
 * @param {[type]} currentExt    [description]
 * @param {[type]} exts          [description]
 * @yield {[type]} [description]
 */
function* convertFileExt(file, currentExt, exts) {
	let fns = exts.map(function(ext) {
		return fs.canRead(file.replace(currentExt, ext));
	});
	let result = yield fns;
	let newExt = currentExt;
	result.forEach(function(readable, i) {
		if (readable) {
			newExt = exts[i];
		};
	});
	return newExt;
}


function defineWrapper(staticPath, options) {
	let basePath = staticPath;
	if (options && options.basePath) {
		basePath = options.basePath;
	}
	let reject;
	if (options.except) {
		let files = [];
		let regExpList = [];
		options.except.forEach(function(file) {
			if (util.isRegExp(file)) {
				regExpList.push(file);
			} else {
				files.push(path.join(staticPath, file));
			}
		});
		reject = function(file) {
			let isRejct = files.indexOf(file) !== -1;
			if (isRejct) {
				return isRejct;
			} else {
				regExpList.forEach(function(reg) {
					if (!isRejct) {
						isRejct = reg.test(file);
					}
				});
				return isRejct;
			}
		};
	}
	return function* requirejsDefineWrapper(next) {
		/*jshint validthis:true */
		const ctx = this;
		let urlInfo = url.parse(ctx.url);
		let file = path.join(staticPath, urlInfo.pathname);
		file = file.replace(/\\/g, '/');
		if (path.sep !== '/') {
			file = file.replace(/\//g, '\\');
		}
		let ext = path.extname(file);
		if (ext !== '.js' || file.indexOf(basePath) !== 0 || reject(file)) {
			return yield * next;
		}
		ctx.set({
			'Content-Type': 'application/javascript; charset=utf-8'
		});
		let readable = yield fs.canRead(file);
		if (readable) {
			ctx.body = yield requirejs(file, basePath);
		} else {
			yield * next;
			ctx.body = yield requirejs(file, basePath, ctx.body);
		}
	};
}


function requirejsDefine(opts) {
	function wrapper(file, encoding, cb) {
		let fileName = file.path;
		let code = requirejs.define(fileName, opts.basePath, file.contents.toString(encoding));
		file.contents = new Buffer(code);
		this.push(file);
		setImmediate(cb);
	}

	return through.obj(wrapper);
}