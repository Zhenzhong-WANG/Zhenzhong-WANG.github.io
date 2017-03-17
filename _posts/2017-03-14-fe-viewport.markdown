---
layout:     post
title:      "对移动端适配的理解"
subtitle:   "学习笔记"
date:       2017-03-14
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 前端开发
---

#### 1.viewport meta标签

layout viewport尺寸不同浏览器下不同，Safair为980px.用document.documentElement.clientWidth可度量其尺寸

visual viewport用window.innerWidth/Height度量，是用户可视的区域。

html元素用document.documentElement.offsetWidth/Height度量，默认大小为layout viewport大小

当创建一个页面时，浏览器会进行缩放在屏幕上展示整个layout viewport，html元素默认铺满layout viewport。这个缩放导致元素看起来很小，用户要放大看。通过`<meta name="viewport" content="width=320">`更改layout viewport尺寸，默认的980变成320后,浏览器会进行缩放在屏幕上展示整个layout viewport，但是这个缩放尺度相比原来小了很多,所以看上去就没那么小了，用户看上去就更友好。

#### 2.使用rem适配

根据html根元素的font-sze来设置font-size,width,height等。rem为根元素的倍数

如默认font-size为16px,2em为32px；

要设置html的font-size的值，也就是rem的基准值，可以用css的媒体查询或js动态设置如

`document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';`

如一个iphone6的设计稿基准值为750/10=75；那么对于设计稿上的一个单位可以如下计算他的rem：rem=px/基准值。

最后动态设置viewport的缩放，如下计算：scale=1/dpr：

`meta.setAttribute('content', 'initial-scale=' + 1/dpr + ', maximum-scale=' + 1/dpr + ', minimum-scale=' + 1/dpr + ', user-scalable=no');`
