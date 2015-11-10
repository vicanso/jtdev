# compile styls, lesss, jsx, es and so on for dev.

## Installation

```bash
$ npm install jtdev
```


# API

## parse static file for dev

```js
const serve = require('koa-static');
const koa = require('koa');
const app = koa();
const jtDev = require('jtdev');
const path = require('path');
app.use(jtDev.parser(staticFilePath))

app.use(serve(staticFilePath));

app.listen(3000);

console.log('listening on port 3000');

```


## add define function for requirejs 


```js
const serve = require('koa-static');
const koa = require('koa');
const app = koa();
const jtDev = require('jtdev');
const path = require('path');

app.use(jtDev.defineWrapper(staticFilePath, {
	basePath: path.join(staticFilePath, 'components'),
	except: ['components/widget.js']
}));

app.use(serve(staticFilePath));

app.listen(3000);

console.log('listening on port 3000');

```