---
layout:     post
title:      "对HTTP一些字段的理解"
subtitle:   "学习笔记"
date:       2017-03-03
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 前端开发
---


今天继续看《图解HTTP协议》,很多字段看的云里雾里，于是自己打开了一个网站做了观察，有以下分析：

#### 关于HTTP缓存

第一次进入一个网站时，本地无缓存，response成功返回200

服务器在Response Header里，设置了Etag和Last-Modify，如下图；

![img](/img/20170303/0.png)

`Etag`字段将资源唯一性的标识，如果资源有更新，Etag值也将变化；

`Last-Modify`表明了在服务器端最后发生改变的时间；

浏览器保存这个Etag值和Last-Modify,以便于下次请求的时候使用；

![img](/img/20170303/1.png)

刷新后，发送的Request Header如下：

![img](/img/20170303/2.png)

其中If-None-Match字段就是向服务器端询问第一次的Etag值是否更新，两次Etag相同,说明资源未发生根本改变

If-Modified-Since向服务器询问在这个时间发生改变了吗；

![img](/img/20170303/3.png)

![img](/img/20170303/4.png)

最终发回响应，Etag和Last-Modify无变化，所以最终返回304,比第一次的ResponseHeader相比，还多了两个字段`Cache-Control: max-ag`e和`Expires`

这两个属性就是为了告诉浏览器，不必再来询问服务器资源过没过期，允许浏览器在一个时间段内继续使用本地缓存；

max-age属于HTTP1.1 ，Expires属于HTTP1.0,如果max-age和Expires同时存在，Expires则被Cache-Control的max-age覆盖。

另外返回的ResponseHeader还有Via字段，说明经过了很多代理服务器，这说明我们要的资源可能是放在了CDN上的；

还有个字段Vary，它可对缓存进行控制，它告诉代理服务器，返回和Accept-Encoding字段相同的缓存资源，而不是从源服务器端；

#### 禁用HTTP缓存

no-store不缓存任何内容

no-cache先向服务器验证缓存
