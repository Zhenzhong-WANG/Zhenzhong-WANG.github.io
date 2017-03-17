---
layout:     post
title:      "Jquery基本原型技术"
subtitle:   "学习笔记"
date:       2016-04-29
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - jQuery
    - JavaScript
    - 前端开发
---


### (一)Jquery基本原型技术

```js
var $ = jQuery = function() {};
jQuery.fn = jQuery.prototype = {
    jquery: "1.1.3",
    size: function() {
        return this.length;
    }
};
var my$ = new $();
my$.jquery     //1.1.3
my$.size()       //undefined
```

但是jqery调用方式是这样的$().jquery

而且使用new创建类实例时，this指向my$，实例获得了Jq.prototype的原型属性和方法，this总是指向类的实例
所以继续改写：

将Jq看作一个类，普通函数，函数返回值为Jq类的实例.

改写结构模型如下：

```js
var $ = jQuery = function() {
    return new jQuery(); //返回类的实例
};
jQuery.fn = jQuery.prototype = {
    jquery: "1.1.3",
    size: function() {
        return this.length;
    }
};

$().jquery;
$().size();
```

但是会发生内存泄漏，jquery函数不断调用本身

考虑在Jq中使用工厂方法创建实例，这个方法放在jq.prototype原型对象中，然后在Jq（）函数中返回原型方法的调用

改写如下：

```js
var $ = jQuery = function() {
    return jQuery.fn.init(); //调用原型方法init
};

jQuery.fn = jQuery.prototype = {
    init: function() { //在初始化原型方法中返回实例的引用
        return this;
    }
    jquery: "1.1.3",
    size: function() {
        return this.length;
    }
};

$().jquery;
$().size();
```

但是这样带来了作用域问题，init方法返回的this引用jq类的实例，如果在init里继续使用init，init则视为一个构造器，this关键字不仅引用init函数作用域所在的对象，也引用了上一级jq.fn的作用域。破坏了作用域的独立性。

```js
var $ = jQuery = function() {
    return jQuery.fn.init();
};

jQuery.fn = jQuery.prototype = {
    init: function() {
        this.length = 0;
        this.test = function() {
            return this.length
        }
        return this;
    }
    jquery: "1.1.3",
    length: 1;
    size: function() {
        return this.length;
    }
};

$().jquery;//1.1.3
$().test(); //0
$().size(); //0
```

把init构造器中的this和jq.fn中的this隔离，但是这样就返回init中的this,就无法访问jq.fn中的属性和方法了

```js
var $ = jQuery = function() {
    return new jQuery.fn.init(); //实例化init初始化类型，隔离作用域
};

jQuery.fn = jQuery.prototype = {
    init: function() {
        this.length = 0;
        this.test = function() {
            return this.length
        }
        return this;
    }
    jquery: "1.1.3",
    length: 1,
    size: function() {
        return this.length;
    }
};

$().jquery; //undefined
$().test(); //0
$().size() //error
```

如何既能做到隔离作用域，又能在返回实例中访问jq的原型对象？利用原型传递实现跨域访问，把jq的原型对象赋给init的原型对象

new jQuery.fn.init()创建的对象拥有init的prototype，修改其prototype的指向，指向jq的prototype，创建的对象就继承了jq.fn原型对象的方法

```js
var $ = jQuery = function() {
    return new jQuery.fn.init(); //实例化init初始化类型，隔离作用域
};
jQuery.fn = jQuery.prototype = {
    init: function() {
        this.length = 0;
        this.test = function() {
            return this.length
        }
        return this;
    }
    jquery: "1.1.3",
    length: 1,
    size: function() {
        return this.length;
    }
};

jQuery.fn.init.prototype = jQuery.fn;
$().jquery; //1.1.3
$().test(); //0
$().size() //0
```


### （二）jQuery选择器基本原理
```js
var $=jQuery = function(selector, context) {
    return new jQuery.fn.init(selector, context);
};

jQuery.fn = jQuery.prototype = {
    init: function(selector, context) {
        selector = selector || document;
        context = context || document;  //选择范围
        if (selector.nodeType) {               //选择节点对象
            this[0] = selector;
            this.length = 1;
            this.context = selector;
            return this;
        };

        if (this selector === "string") {       //选择是字符串
            var e = context.getElementsByTagName(selector);
            for (var i = 0; i, e.length; i++) {
                this[i] = e[i];
            }
            this.length = e.length;
            this.context = context;
            return this;
        } else {
            this.length = 0;
            this.context = context;
            return this;
        }
    }
    jquery: "1.1.3",
    length: 1,
    size: function() {
        return this.length;
    }
};

jQuery.fn.init.prototype = jQuery.fn;
$("div").size();
```

参考资料：《jquery内核详解与实践》
