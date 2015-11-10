'use strict';

const serve = require('koa-static');
const koa = require('koa');
const app = koa();
const jtDev = require('..');
const path = require('path');
const staticFilePath = path.join(__dirname, '../files');


app.use(jtDev.defineWrapper(staticFilePath, {
	basePath: path.join(staticFilePath, 'components'),
	except: ['components/widget.js']
}));

app.use(jtDev.parser(staticFilePath))


// $ GET /package.json
app.use(serve(staticFilePath));

app.listen(3000);

console.log('listening on port 3000');