# 模块描述

用于在开发中编译coffee、stylus

# API

- [coffee parser](#coffeeParser)
- [ext converter](#extConverter)
- [stylus parser](#stylusParser)

<a name="coffeeParser" />
## coffee parser
### coffeescript的编译器

### 无参数

```js
var jtDev = require('jtdev');
var app = expresss();
app.use(jtDev.coffee.parser());
```



<a name="extConverter" />
## ext convert
### 后缀转换（如请求x.css文件，首先判断x.css是否存在，不存在则将请求文件修改为x.styl，还有.js ---> .coffee）

### staticPath 静态文件的存放目录

```js
var jtDev = require('jtdev');
var app = express();
app.use(jtDev.ext.converter('/test/statics'));
```


<a name="stylusParser" />
## stylus parser
### stylus的编译器

### staticPath 静态文件的存放目录

```js
var jtDev = require('jtdev');
var app = express();
app.use(jtDev.stylus.parser('/test/statics'));
```