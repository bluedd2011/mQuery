## 介绍

这是一个简单的类jquery工具。

## 使用

```html
<script src='mQuery.js'></script>
```

```js
var $ = mQuery
$().ready(function() {
  $('.app').addClass('ready')
})
```

也可改造源码为使用es6模块化方案引入。

## API

#### 作为选择器

* $('.app')

#### 原型方法

* $.prototype.ready
* $.prototype.on
* $.prototype.find
* $.prototype.get
* $.prototype.eq
* $.prototype.hasClass
* $.prototype.addClass
* $.prototype.removeClass
* $.prototype.css
* $.prototype.show
* $.prototype.hide
* $.prototype.attr
* $.prototype.removeAttr
* $.prototype.html
* $.prototype.append
* $.prototype.val
* $.prototype.width
* $.prototype.height

#### 静态属性

* $.location

#### 静态方法

* $.serialize
* $.ajax
* $.IEVersion
* $.each