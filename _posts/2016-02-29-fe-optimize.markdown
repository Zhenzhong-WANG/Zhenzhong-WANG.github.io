---
layout:     post
title:      "服务器推Comet"
subtitle:   "学习笔记"
date:       2016-02-29
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 前端开发
    - 前端优化
---


* 减少Http请求

 Http请求中除了我们要的请求主体部分，还包含了头部信息，请求方法，Http响应中除了我们需要的响应主体，也包含了响应头信息。

 这些头信息也会占用网络资源，并且建立连接过程中也会产生网络时延，所以我们应当减少Http请求次数，比如合并文件。

* 使用构建工具

 使用构建工具来丑化，压缩代码，剔除代码中的空格，将变量名称变短，使文件变小

* 设定图片的高度和宽度

如果网站中使用的图片没有指定img标签的宽度，高度。浏览器会因为图片下载过程中大小的改变而重新渲染文档结构。影响浏览体验。

指定大小后，浏览器就可以正常渲染页面。

* 减少DOM操作

DOM操作耗费时间，如多次操作DOM，最好采用一次性添加到文档中的方法。如

```js
for (var i = 0; i < 100; i++) {
   parentNode.appendChild(document.creatElement("div"))
} //多次操作DOM改变DOM树
```

改为：

```js
for (var i = 0; i < 100; i++) {
    parentNode += '<div></div>'
} //一次性加入DOM树中
```
