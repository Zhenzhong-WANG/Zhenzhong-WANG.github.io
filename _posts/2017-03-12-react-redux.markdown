---
layout:     post
title:      "React生命周期和Redux原理"
subtitle:   "学习笔记"
date:       2017-03-12
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 前端开发
---


#### React组件的生命周期

当一个组件首次被mount时先constructor，在其构造函数内部getDefaultProps,getInitialState完成初始化props和state，之后`componentWillMount()`，`render()`,`componentDidMount()`

需要注意的地方有：constructor内的this.props为undefined，所以不能用props去初始化state。

当一个组件被update时先`componentWillReceiveProps()`,再依次`shouldComponentUpdate(nextProps, nextState)`,`componentWillUpdate(nextProps, nextState)`,`render( )`,`componentDidUpdate(prevProps, prevState )`

需要主要的地方有：不要在componentWillUpdate内setState.

其中shouldComponentUpdate可以用来对React组件做优化，可以用来判断props或者state真的发生变化时，才返回true继续更新组件。在state数据的改变要采用深拷贝的方式

使用Object.assign将深拷贝原来的对象，分配新的内存空间，这样在shouldComponentUpdate中通过return new!==old快速比较判断是否继续更新。

#### Redux

通过看react-redux源码和网上资料,connect对component做了如下封装：

connect时react-redux的核心模块，他通过context获取Provider上的store

![img](/img/20170312/0.png)

connect模块返回一个名叫wrapWithConnect的闭包函数

![img](/img/20170312/1.png)

这个闭包函数返回一个React组件Connect，这个组件render传入的原组件，并把mapStateToProps, mapDispatchToProps后的props与原有props合并。这样原组件既保持了原有的功能，又引入了store。

![img](/img/20170312/2.png)
