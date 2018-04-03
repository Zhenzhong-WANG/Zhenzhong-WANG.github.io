---
layout:     post
title:      "JavaScript闭包"
subtitle:   "学习笔记"
date:       2016-01-07
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 前端开发
---

## 1.作用域

要理解闭包，首要要理解JavaScript中的作用域，在类C语言中，花括号内的代码都有各自的作用域，并且在声明他们的代码段之外不可 见，称为块级作用域。而JavaScript中使用的是函数作用域，变量在声明他们的函数体和这个函数体中嵌套的函数内都有定义。

犀牛书例子：

```js
function test(o) { //变量i j k在test函数体内都有定义，而不仅仅是在花括号内有定义
    var i = 0;
    if (typeof o == "object") {
        var j = 0;
        for (var k = 0; k < 10; k++) {
            console.log(k);
        }
        console.log(k);
    }
    onsole.log(j);
}
```

## 2.声明提前
JavaScript函数中声明的作用域在函数体内始终可见，也就是说不论这个变量定义或声明在函数体中什么位置，在这个函数内部，可在 任何位置访问这个变量，因为JavaScript把声明的所有变量都提至函数体顶部。

犀牛书例子：

因为JavaScript函数中声明的作用域在函数体内始终可见，所以这俩个输出的都是f内的局部scope，覆盖了全局scope，所以不可能输出 global，但是由于声明提前，上述代码等价于如下代码

```js
var scope = “global”;
function f() {
    console.log(scope); //undefined
    var scope = "local"; //定义局部scope
    console.log(scope); //local
}
```

## 2.闭包
JavaScript在运行时函数都会创建属于函数的上下文环境（context）及作用域，在浏览器环境中JavaScript 中最外围的环境为 window 对象。

当执 行到下一级环境时，下一级环境会主动包含上一级的作用域，最终形成一级一级关联的作用域链。函数的执行用到了作用域链。

作用域链是函数定义时 候创建的，我理解的闭包就是在闭包函数创建的时候，保留其创建时候的上下文环境，使上级作用域链可继续访问，借助作用链域访问外部的变量。

* 闭包的实例1：

```js
var div = document.getElementsByTagName('div');
for (var i = 0; i < div.length; i++) {
    div[i].onclick = function() {
        alert(i + 1);
    };
}
```

这些代码不会正确得到我们想要的结果，点击第i个div则显示第i个编号，这些代码的执行结果是不论点击哪个div，只显示div.length 原因如下，首先onclick是个异步事件，在for循环的过程中不会执行，只是把事件添加到事件队列中，等到事件触发的时候，只会显示i最终的结果， 在这里我们需要用闭包函数，首先添加一个自执行的匿名函数，每次循环立即执行，将i传递给里面的函数，返回创建的闭包函数，闭包函数 保存着创建其时候的上下文执行环境，所以每个闭包函数的i不同。

```js
var div=document.getElementsByTagName('div');
for (var i = 0; i < div.length; i++) {
    div[i].onclick = function(i) {
        return (function() { //返回闭包函数
            alert(i);
        })
    }(i); //自执行匿名函数
}
```

* 闭包的实例2
闭包实现渐变,setTimeout是一个异步函数，fade函数调用后1，他将display函数放入事件队列后,fade函数立即返回,约500毫秒后调用display，这 时创建了一个display函数，虽然fade已经返回，但是display可以继续访问在它外部的level变量，display就是一个闭包函数，保存了创建其时候的上下文环境。

```js
var fade = function() {
    var level = 0;
    var display = function() {
        if (level < 100) {
            for (var i = 0; i < div.length; i++) {
                div[i].style.opacity = level / 100;
            }
            setTimeout(display, 0);
        }
    }
    setTimeout(display, 500);
}
fade(document.body)
```

总结：可以看到闭包函数可以访问其外部的变量环境，函数调用完成之后，其执行上下文环境不会接着被销毁。闭包借助作用域链，可使内部函数 可访问外部函数的变量，外部变量不会当做垃圾回收。所以大量使用闭包会造成内存开销过大，无法进行垃圾回收，甚至内存泄露。
