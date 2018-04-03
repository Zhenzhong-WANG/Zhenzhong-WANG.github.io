---
layout:     post
title:      "JavaScript函数"
subtitle:   "学习笔记"
date:       2016-01-17
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 前端开发
---

## 1、函数调用的四种方式

函数调用有四种方式：方法调用、函数调用、构造器调用、apply调用，这些方法初始化this参数方式不同
1、方法调用

```js
var tank = {
   posX: 1,
   move: function() {
       this.posX++;
   }
}
tank.move() //在方法调用中，this被迟绑定到对象上。
```

## 2、函数调用

```js
var move = function() {
   alert(this) //window
}
```

在浏览器环境中，非严格模式下，this被绑定到了全局对象window上，而不是绑定在外部函数this上，在这种调用模式下，使用这个this无法正常工 作，如：

```js
var tank = {
   posX: 1,
   move: function() {
       (function() {
           alert(this); //window
           this.posX = this.posX + 3;
       })()
   }
};
tank.move();
```
move方法又调用了一个匿名函数，这是一个函数调用,这个匿名函数中的this指向window，所以匿名函数无法正常工作，解决this指向有很多方法，

第一个方法：var that=this,显式表现this

```js
var tank = {
   posX: 1,
   move: function() {
       var that = this;
       (function() {
           alert(this); //window
           alert(that); //object
           that.posX = that.posX + 3; //4
       })()
   }
};
tank.move();
```

第二个方法bind()，将函数绑定至某个对象,将匿名函数绑定在我们想要的的this上

```js
var tank = {
   posX: 1,
   move: function() {
       (function() {
           alert(this); //object
           this.posX = this.posX + 3; //4
       }.bind(this))() //将正确的this绑定在匿名函数上
   }
};
tank.move();
```

第三个方法，通过匿名函数直接传递this

```js
var tank = {
    posX: 1,
    move: function() {
          (function(that) {
              alert(that); //object
              that.posX = that.posX + 3; //4
            })(this)
    }
};
```


## 3、构造器调用模式

如果一个函数前面通过new运算符调用，this会被绑定到一个新对象，这个新对象的__proto__将会指向这个函数的prototype，这个新对象就会继承 这个函数的原型对象。

```js
var Tank = function(x) {
   this.x = x;
}
Tank.prototype.move = function() {}
var myTank = new Tank(2);
```
## 4、Apply方式调用
JavaScript支持函数式编程，函数拥有方法，apply和call方法允许我们选择this的值来调用一个函数，它们的第一个参数就是要调用这个函数的对 象，通过上下文来绑定函数体内部的this，apply的第二个参数是一个数组，表示调用这个函数传递的参数，而call传递参数不是通过数组。

严格模式 下，第一个参数都会被转变为this，哪怕传入null或undefined，非严格模式下，传入null或undefined会被转化成全局this，浏览器中就是window对 象，原始值则会被包装成包装对象。 apply和call有很多妙用，比如在上一篇文章中实现继承，子类对象调用父类的构造方法。

此外还有许多妙用，利用定义在Array.prototype中的push方法来合并两个数组，Math.max找到数组中最大元素，如：

```js
Array.prototype.push.apply(arr1, arr2);
Math.max.apply(null,[1,654,2,42,333])
```
