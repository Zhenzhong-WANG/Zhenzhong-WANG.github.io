---
layout:     post
title:      "Cookie、Session、LocalStorage"
subtitle:   "学习笔记"
date:       2016-02-11
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 前端开发
---

Cookie 和 Web Storage都存储在客户端,而Session存储在服务器端。

Storage中分为session Storage 和local Storage，但是两者不用于服务器通讯，只用于本地数据存储，因为Cookie只能存储少量数据

local storage 常用于本地持久化存储，不刻意删除便一直保存。受同源策略限制。

Session Storage 一般有效期只在浏览期间，当用户关闭窗口，数据就会被删除。不仅受同源策略限制，而且同源文档，不同页面互相也无法访问对方文档数据。

由于Http是无状态的协议，当一次传输完成，连接就会断开，所以利用Session来跟踪用户的状态，用户每次向服务器请求新的页面，都会把Cookie发送给服务器端，用于更新Session数据。
