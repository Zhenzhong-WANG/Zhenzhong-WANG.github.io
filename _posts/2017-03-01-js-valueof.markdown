---
layout:     post
title:      "JavaScript类型转换和应用"
subtitle:   "学习笔记"
date:       2017-03-01
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - JavaScript
---

### Object.toString()；

#### 什么时候会自动触发toString()？

当调用alert(Object)、Object和一个字符串相加的时候、Object和字符串比较的时候会自动调用Object.toString()；

####转换规则

* 如果 toString 方法存在并且返回原始类型，返回 toString 的结果。

* 如果 toString 方法不存在或者返回的不是“原始类型”，调用valueOf 方法，如果 valueOf 方法存在，并且返回“原始类型”数据，返回 valueOf 的结果。

* 其他情况，抛出异常

### Object.prototype.valueOf()

#### 什么时候会自动触发valueOf()?

触发toString返回的不是原始类型、Object和数字运算或比较

#### 转换规则

* 如果 valueOf 存在，且返回原始类型数据，返回 valueOf 的结果。

* 如果 toString 存在，且返回原始类型数据，返回 toString 的结果。

* 其他情况，抛出错误。

### 有何应用？今天在网上看到了这样一道题：

编写一个add函数满足如下输出：
```js
add(1)(2) // 3
add(1, 2, 3)(10) // 16
add(1)(2)(3)(4)(5) // 15
```

解法如下：

```js
function add () {
    console.log('进入add');
    var args = Array.prototype.slice.call(arguments);
    var fn = function () {
        var arg_fn = Array.prototype.slice.call(arguments);
        console.log('调用fn');
        return add.apply(null, args.concat(arg_fn));
    }
    fn.valueOf = function () {
        console.log('调用valueOf');
        return args.reduce(function(a, b) {
            return a + b;
        })
    }

    console.log('离开add');

    return fn;
}
```

当add(1)时，返回fn，fn调用自己的valueOf方法，最终返回的相当于如下：

```js
[1].reduce(function(a, b) {
    return a + b;
})
```

结果输出如下：

![img](/img/20170301/0.png)

当多次调用时，add(1)(2)(3)，输出如下：

![img](/img/20170301/1.png)

在最后一次调用之前都是调用fn合并参数，最后一次调用执行valueOf，将参数相加；

#### 为什么会只在最后一次调用valueOf尼：

当add(1)(2)(3)时

add(1)返回fn，fn是个闭包函数，虽然add已经return了，但仍能访问到add内部的args，参数的值1仍保存在变量args中；

接下来相当于fn(2)(3)，fn(2)中add.apply(null, args.concat(arg_fn));将参数合并到args中，并执行add，返回了一个新的fn
；
接下来fn(3), ，fn(3)中add.apply(null, args.concat(arg_fn));将参数合并到args中，并执行add，返回了一个新的fn;

接下来fn，这相当于在控制台中直接打印fn这个函数，如下图

![img](/img/20170301/2.png)

这样fn自动调用自己的valueOf或者toString方法。于是执行了

```js
args.reduce(function(a, b) {
   return a + b;
})
```
