---
layout:     post
title:      "script的defer和async"
subtitle:   "学习笔记"
date:       2017-03-24
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 前端开发
---

浏览器进程中存在JS执行线程和UI渲染线程，由于JS可以访问和修改DOM，CSS，所以JavaScript执行线程和UI渲染线程是互斥的。在浏览器解析文档的过程中，如果遇到正常的外联的script和link，会暂停解析。下载link和下载script，之后执行JavaScript，继续解析文档，之后完成DOM树构建，触发DOMContentLoaded，之后加载img等外部资源，触发onload事件


### defer：

> This Boolean attribute is set to indicate to a browser that the script is meant to be executed after the document has been parsed, but before firing DOMContentLoaded. The defer attribute should only be used on external scripts.

defer应该用在外部引用的script标签中，defer在DOMContentLoaded之前完成执行


### async

> Set this Boolean attribute to indicate that the browser should, if possible, execute the script asynchronously. It has no effect on inline scripts (i.e., scripts that don't have the src attribute).

async应该用在外部引用的script标签中，async异步执行，执行时机不一定，可能在DOMContentLoaded之前也可能在DOMContentLoaded之后，但会在onload事件之前完成。

### 执行顺序与页面渲染

```js
<!DOCTYPE html>
<html>
    <head>
      <script>
        console.log("inline script");
        window.onload=function () {
          console.log("window onload");
        }
        document.addEventListener('DOMContentLoaded',function(){
          console.log("DOMContentLoaded");
        },false);
      </script>
      <script type="text/javascript" async src="./head_async.js" ></script>
      <script type="text/javascript" defer src="./head_defer.js" ></script>
    </head>
    <body>
      <script type="text/javascript" async src="./body_async.js" ></script>
      <script type="text/javascript" defer src="./body_defer.js" ></script>
    </body>
</html>
```

#### 执行顺序

运行多次代码，得到以下async和defer的执行顺序：

![img](/img/20170324/async_after_domcontentloader_log.png)

![img](/img/20170324/async_before_domcontentloaded_log.png)

![img](/img/20170324/async_log.png)

其中defer一定在DOMContentLoaded之前执行，async则不一定.

#### 页面渲染

* 不含async和defer：

![img](/img/20170324/normal_script_tl.png)

script的下载会阻塞HTML的解析

* 含有async和defer的两次运行结果：

![img](/img/20170324/async_after_domcontentloader_tl.png)

async执行发生在DOMContentLoaded之后。defer在DOMContentLoaded之前完成，不阻塞HTML解析；

![img](/img/20170324/async_before_domcontentloaded_tl.png)

async执行发生在DOMContentLoaded之前，阻塞了HTML解析。defer在DOMContentLoaded之前完成，不阻塞HTML解析；

### 总结：

* 含有defer和async的script的下载不会影响HTML的解析；
* async的执行时机不一定，但一定会在load之前完成；
* async会在下载完毕后异步执行，若此时HTML解析未完成，将会阻塞HTML解析，HTML解析完毕后触发DOMContentLoaded；
* defer会在DOMContentLoaded之前执行完成，但是它并不阻塞HTML解析；
* async会发生在DOMContentLoaded之后，将一些js设为async将减少白屏时间；
