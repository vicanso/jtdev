'use strict';
const fs = require('./fs');
const path = require('path');
const util = require('util');
module.exports = defineWrapper;


/**
 * [*defineWrapper description]
 * @param {[type]} file          [description]
 * @param {[type]} basePath      [description]
 * @yield {[type]} [description]
 */
function* defineWrapper(file, basePath, data) {
	if (!data) {
		data = yield fs.readFile(file);
	}
	let arr = ['require', 'exports', 'module'].concat(getDeps(data));
	let moduleName;
	if (basePath) {
		moduleName = file.substring(basePath.length).replace('.js', '');
	} else {
		moduleName = path.basename(file, '.js');
	}
	/* istanbul ignore if */
	if (moduleName.charAt(0) === '/') {
		moduleName = moduleName.substring(1);
	}

	let requireModules = '';
	arr.forEach(function(name, i) {
		if (!i) {
			requireModules += util.format("'%s'", name);
		} else {
			requireModules += util.format(",'%s'", name);
		}
	});
	let str = util.format("define('%s', [%s], function(require, exports, module){\n", moduleName, requireModules);
	let jsCode = str + data + '\n});';
	return jsCode;
}

/**
 * [getDeps description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function getDeps(data) {
	let arr = [];
	let cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
	let result = cjsRequireRegExp.exec(data);
	while (result) {
		let name = result[1];
		if (name && arr.indexOf(name) === -1) {
			arr.push(name);
		}
		result = cjsRequireRegExp.exec(data);
	}
	return arr;
}