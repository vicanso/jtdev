'use strict';
const assert = require('assert');
const path = require('path');
const es2015 = require('../lib/es2015');
const jsx = require('../lib/jsx');
const less = require('../lib/less');
const stylus = require('../lib/stylus');
const fs = require('../lib/fs');
const requirejs = require('../lib/requirejs');
const util = require('util');


function execGenerator(g, arr, v, cb) {
	if (util.isFunction(arr)) {
		cb = arr;
		arr = [];
		v = null;
	}
	let result = g.next(v);
	if (!result.done) {
		result.value.then(function(v) {
			arr.push(v);
			execGenerator(g, arr, v, cb);
		}, cb);
	} else {
		arr.push(result.value);
		cb(null, arr);
	}
}

describe('es2015 parse', function() {
	it('should parse es file success', function(done) {
		this.timeout(10000);
		let file = path.join(__dirname, '../files/es2015.js');
		let g = es2015(file);
		let originalCode = '\'use strict\';\n\nconst _ = require(\'lodash\');\n\nclass Person {\n\tconstructor(name) {\n\t\tthis.name = name;\n\t}\n}';
		let compileCode = '\'use strict\';\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nvar _ = require(\'lodash\');\n\nvar Person = function Person(name) {\n\t_classCallCheck(this, Person);\n\n\tthis.name = name;\n};';
		execGenerator(g, function(err, result) {
			if (err) {
				done(err);
			} else {
				assert.equal(result[0], originalCode);
				assert.equal(result[1], compileCode);
				done();
			}
		});
	});
});


describe('jsx parse', function() {
	it('should parse jsx file success', function(done) {
		let file = path.join(__dirname, '../files/react.js');
		let g = jsx(file);
		let originalCode = 'var HelloMessage = React.createClass({\n\trender: function() {\n\t\treturn <div>Hello {this.props.name}</div>;\n\t}\n});\n\nReactDOM.render(<HelloMessage name="John" />, mountNode);';
		let compileCode = 'var HelloMessage = React.createClass({\n\trender: function () {\n\t\treturn React.createElement(\n\t\t\t"div",\n\t\t\tnull,\n\t\t\t"Hello ",\n\t\t\tthis.props.name\n\t\t);\n\t}\n});\n\nReactDOM.render(React.createElement(HelloMessage, { name: "John" }), mountNode);';
		execGenerator(g, function(err, result) {
			if (err) {
				done(err);
			} else {
				assert.equal(result[0], originalCode);
				assert.equal(result[1], compileCode);
				done();
			}
		});
	});
});


describe('less parse', function() {
	it('should parse less file success', function(done) {
		let file = path.join(__dirname, '../files/dlg.css');
		let g = less(file);
		let originalCode = '@base: #f938ab;\n\n.box-shadow(@style, @c) when (iscolor(@c)) {\n  -webkit-box-shadow: @style @c;\n  box-shadow:         @style @c;\n}\n.box-shadow(@style, @alpha: 50%) when (isnumber(@alpha)) {\n  .box-shadow(@style, rgba(0, 0, 0, @alpha));\n}\n.box {\n  color: saturate(@base, 5%);\n  border-color: lighten(@base, 30%);\n  div { .box-shadow(0 0 5px, 30%) }\n}';
		let compileCode = '.box {\n  color: #fe33ac;\n  border-color: #fdcdea;\n}\n.box div {\n  -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);\n}\n';
		execGenerator(g, function(err, result) {
			if (err) {
				done(err);
			} else {
				assert.equal(result[0], originalCode);
				assert.equal(result[1], compileCode);
				done();
			}
		});
	});
});



describe('stylus parse', function() {
	it('should parse stylus file success', function(done) {
		let file = path.join(__dirname, '../files/alert.css');
		let g = stylus(file);
		let originalCode = 'border-radius()\n  -webkit-border-radius arguments\n  -moz-border-radius arguments\n  border-radius arguments\n\nbody\n  font 12px Helvetica, Arial, sans-serif\n\na.button\n  border-radius 5px';
		let compileCode = 'body {\n  font: 12px Helvetica, Arial, sans-serif;\n}\na.button {\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  border-radius: 5px;\n}\n';
		execGenerator(g, function(err, result) {
			if (err) {
				done(err);
			} else {
				assert.equal(result[0], originalCode);
				assert.equal(result[1], compileCode);
				done();
			}
		});
	});
});

describe('fs', function() {
	it('should get file readable status success', function(done) {
		let checkTimes = 0;
		let finish = function() {
			checkTimes++;
			if (checkTimes === 2) {
				done();
			}
		};
		fs.canRead(path.join(__dirname, '../files/alert.styl')).then(function(readable) {
			assert.equal(readable, true);
			finish();
		}, done);
		fs.canRead(path.join(__dirname, '../files/alert.css')).then(function(readable) {
			assert.equal(readable, false);
			finish();
		}, done);
	});
});


describe('requirejs', function() {
	it('should wrap js file with define success', function(done) {
		let file = path.join(__dirname, '../files/util.js');
		let g = requirejs(file);
		let originalCode = '\'use strict\';\n\nvar _ = require(\'lodash\');\nvar fs = require(\'fs\');\n\nfunction sum(i, j) {\n\treturn i + j;\n}\n\nexports.sum = sum;';
		let compileCode = 'define(\'util\', [\'require\',\'exports\',\'module\',\'lodash\',\'fs\'], function(require, exports, module){\n\'use strict\';\n\nvar _ = require(\'lodash\');\nvar fs = require(\'fs\');\n\nfunction sum(i, j) {\n\treturn i + j;\n}\n\nexports.sum = sum;\n});';
		execGenerator(g, function(err, result) {
			if (err) {
				done(err);
			} else {
				assert.equal(result[0], originalCode);
				assert.equal(result[1], compileCode);
				done();
			}
		});
	});


	it('should wrap js file with define success', function(done) {
		let file = path.join(__dirname, '../files/request.js');
		let g = requirejs(file, path.join(__dirname, '../files/'));
		let originalCode = '\'use strict\';\n\nvar request = require(\'request\');\n\nfunction get(url) {\n\treturn url;\n}\n\nexports.get = get;';
		let compileCode = 'define(\'request\', [\'require\',\'exports\',\'module\',\'request\'], function(require, exports, module){\n\'use strict\';\n\nvar request = require(\'request\');\n\nfunction get(url) {\n\treturn url;\n}\n\nexports.get = get;\n});';
		execGenerator(g, function(err, result) {
			if (err) {
				done(err);
			} else {
				assert.equal(result[0], originalCode);
				assert.equal(result[1], compileCode);
				done();
			}
		});
	});
});