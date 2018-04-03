---
layout:     post
title:      "HTTPS和HTTP长连接"
subtitle:   "学习笔记"
date:       2017-03-05
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 前端开发
---

#### 两种加密方法：

共享密钥加密（对称加密）：加密解密用同一密钥，当客户端发送数据时，用密钥加密，同时也要把密钥发给服务器端。这样造成的问题是密钥容易被中间攻击者获取，也能解密内容；

公开密钥加密（非对称加密）：加密用公开密钥加密，解密用私有密钥解密。其中公开密钥任何人都能获取，私有密钥不公开。当客户端发送数据时，用公钥加密，服务器端再用自己的私钥解密；

HTTPS是在HTTP和TCP之间，再填一层SSL，SSL的基本思想是用非对称加密来建立链接(握手阶段),用对称加密来传输数据(传输阶段)。这样做是因为非对称加密比对称加密复杂，计算量大，所以只在建立连接阶段来传送对称加密的密钥；

具体建立连接步骤如下：

* 1.客户端发送ClientHello报文，告诉服务器端自己支持的SSL版本等信息；

* 2.服务器端返回ServerHello，告诉浏览器自己支持的SSL版本等信息；

* 3.服务器发送证书给浏览器，包含了公钥；

* 4.服务器发送SeverHelloDone,完成握手协商；

* 5.客户端产生随机的密码，作为对称加密的密钥，并用第三步的公钥加密；

* 6.以后的信息传输都使用第五步的密钥加密；


#### HTTP长连接

在HTTP1.1中默认开启长连接 `connection: keep-alive`，这样是为了复用TCP，频繁的HTTP请求会造成频繁的TCP建立。

使用 `connection: keep-alive`后，当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会立即关闭，之后的Ajax请求、静态文件请求，会继续使用这一条已经建立的连接，但是Keep-Alive不会永久保持连接，它有一个保持时间，超过保持时间仍会断开。


#### Comet推送

虽然HTTP1.1的TCP连接有一个保持时间，超过保持时间会断开，但是我们可以不时地向这条连接发送数据，这样这个连接就一直不会断开。所以可以用HTTP长连接来做一个不使用客户端轮询的Comet推送。

采用Node编写的服务器端代码：

```js

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
		clients.push(response);       //clients数组保存Response
	});

	request.connection.on("end",function () {  //断开时删除对应的Response
		clients.splice(clients.indexOf(response),1);
		response.end();
	})
}



setInterval(function() {
	clients.forEach(function (client) {    //每10000ms发送一次数据来保持HTTP长连接不断开
		var json={
			'type':'event'
		}
		json=JSON.stringify(json)
		client.write(json);
	})
}, 10000);
```

简单地实现了一个支持单播和广播的网页聊天室：https://github.com/wonggigi/my-practice
