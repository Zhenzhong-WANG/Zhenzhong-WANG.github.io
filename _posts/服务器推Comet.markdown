---
layout:     post
title:      "服务器推Comet"
subtitle:   "学习笔记"
date:       2016-02-21
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 前端开发
    - JavaScript
    - HTTP
---


很多实时服务都需要即使的将服务器端的新数据传递给客户端，实现服务器推送Comet有多种方法，可以基于Ajax长轮询，基于Flash，基于Iframe,或者基于HTTP长连接，本文主要讨论基于HTTP长连接的Comet推送服务。



## 一.基于HTTP长连接Comet的原理


##二.实现Comet的单播聊天室

犀牛书上已经介绍了关于Comet服务器推送的广播方法，单播方法原理相同

只需要在新客户端连接时生成一个ID标识该用户，并将该ID发送到后端记录下来。

前端核心代码

```js
var wComet=(function () {
        var longPolling;
        var requestXhr;
        var count=0;
        var alreadyReceivedLength=0;
        var that=this;
        var init=function (url,data) {
            longPolling=new XMLHttpRequest();
            open(url,data);
        }
        var on=function (type,callback) {
            longPolling.onreadystatechange=function () {
                switch(longPolling.readyState){
                    case 3:connected(callback);break;
                    case 4:reconnect();break;
                }
            };
        }
        var open=function (url,data) {
            longPolling.open("POST",url);
            longPolling.setRequestHeader("Cache-Control", "no-cache");
            console.log(data)
            longPolling.send(data);
        }

        var connected=function (callback) {
            if (longPolling.getResponseHeader('Content-Type')=="text/event-stream") {
                var data =longPolling.responseText.substring(alreadyReceivedLength);
                alreadyReceivedLength=longPolling.responseText.length;
                var json=data//eval("(" + data + ")");
                json=JSON.parse(json);
                callback(json);
            }
        }
        var sendRequest=function (data) {
            requestXhr = new XMLHttpRequest();
                 requestXhr.open("POST", "/comet");                
             requestXhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                    requestXhr.send(data);          
        }
        var reconnect=function () {

        }
        return {
            on:on,
            init:init,
            send:sendRequest
        }
    })();
```

服务器端代码

```js
var http = require('http');
var index = require('fs').readFileSync("mycomet.html");
var ico=require('fs').readFileSync('favicon.ico');
var js=require('fs').readFileSync('comet.js');
var clients = [];
var eventID=0;
setInterval(function() {
    clients.forEach(function (client) {
        var json={
            'type':'event'
        }
        json=JSON.stringify(json)
        client.write(json);
    })
}, 10000);
new http.Server().on("request", function(request, response) {
    if (request.url == '/' && request.method == "GET") {
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write(index);
        response.end();
    }
    if (request.url == '/comet.js' && request.method == "GET") {
        response.writeHead(200, {
            "Content-Type": "text/javascript"
        });
        response.write(js);
        response.end();
    }
    if (request.url == '/ct' && request.method == "POST") {
         var body="";
        request.on("data", function(chunk) {
            body += chunk;
        });
        request.on("end", function() {
            response.writeHead(200, {
                'Content-Type': "text/event-stream"
            });
            var json={
                'type':'connect'
            }
            json=JSON.stringify(json)
            response.write(json);
            console.log(body)
            response.id=body;
            clients.push(response);
        });

        request.connection.on("end",function () {
            clients.splice(clients.indexOf(response),1);
            response.end();
        })
    }
    if (request.url == '/favicon.ico' && request.method == "GET") {
        response.writeHead(200);
        response.write(ico);
        response.end();
    }
    if (request.url=='/comet'&&request.method=="POST") {
        request.setEncoding("utf8");
        var body = "";
        request.on("data", function(chunk) {
            body += chunk;
        });
        request.on("end", function() {
            body=JSON.parse(body)
            console.log(body.data)
            var json={
                'type':'data',
                'data':body.data,
                'fromName':body.fromName,
                'toName':body.toName
            }
            console.log(json.fromName)
            json=JSON.stringify(json)
            response.writeHead(200); // Respond to the request
            response.end();
            clients.forEach(function (client) {
                if (client.id==body.fromName) {
                    client.write(json);
                }
                if (client.id==body.toName) {
                    client.write(json);
                }
            })
        })
    }
}).listen(8000);
```
完整代码在[github](https://github.com/wonggigi/my-practice)上
