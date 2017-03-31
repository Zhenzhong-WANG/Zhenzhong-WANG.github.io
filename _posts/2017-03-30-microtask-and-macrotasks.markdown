---
layout:     post
title:      "Microtask 和 Macrotask"
subtitle:   "学习笔记"
date:       2017-03-31
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 前端开发
---

### Microtask 和 Macrotask

#### EventLoop

> Each 'thread' gets its own event loop, so each web worker gets its own, so it can execute independently, whereas all windows on the same origin share an event loop as they can synchronously communicate. The event loop runs continually, executing any tasks queued. An event loop has multiple task sources which guarantees execution order within that source (specs such as IndexedDB define their own), but the browser gets to pick which source to take a task from on each turn of the loop. This allows the browser to give preference to performance sensitive tasks such as user-input.

一个事件循环包含了很多的任务队列，事件循环不断运行，执行任何排队的任务。 事件循环具有多个任务队列，它们保这些任务队列中的执行顺序，浏览器可以从每个循环中选择哪个源来执行任务。 允许浏览器优先考虑如用户输入之类的敏感的任务。


#### Macrotask(Task)

> Tasks are scheduled so the browser can get from its internals into JavaScript/DOM land and ensures these actions happen sequentially. Between tasks, the browser may render updates. Getting from a mouse click to an event callback requires scheduling a task, as does parsing HTML, and in the above example, setTimeout

Tasks任务包括事件回调，解析HTML，setTimeout，浏览器会在task之间去渲染更新视图；

#### Microtask

> The microtask queue is processed after callbacks as long as no other JavaScript is mid-execution, and at the end of each task. Any additional microtasks queued during microtasks are added to the end of the queue and also processed. Microtasks include mutation observer callbacks, and as in the above example, promise callbacks.

Microtask任务包括Mutation Observer（变动观察器）回调，promise的回调，Microtask将会在JavaScript调用栈为空时执行，并且后加入的microtask也会在microtask队列执行的时候一并执行，直到队列为空；

#### 一个题目：

```js
(function() {
    setTimeout(function() {
        console.log(1);
    }, 0);

    new Promise(function(resolve) {
        console.log(2);
        resolve();
    }).then(function() {
        return new Promise(function(resolve) {
            console.log(3);
            resolve();
        });
    }).then(function(){
        console.log(4);
    });
    console.log(5);
})();
```

Chrome的运行结果

输出顺序2,5,3,4,1

分析各队列和JS调用栈情况：

----------------------

Tasks：   
Microtasks ：   
JSstack ：匿名函数                      
Log	 ：                          

----------------------

将setTimeout进入task队列，开始执行promise,输出2

Tasks：   setTimeoutCallback（1）
Microtasks ：   
JSstack ：匿名函数   Promise（2）                   
Log	 ：   2                       

----------------------

将promise的then进入microtask队列，输出5，之后匿名函数调用结束，返回

Tasks：   setTimeoutCallback（1）
Microtasks ：   promiseThen
JSstack ：                      
Log	 ：   2   5                    

----------------------

JS执行栈为空，开始执行microtask，执行其中的promise（3）

Tasks：   setTimeoutCallback（1）
Microtasks ：   
JSstack ：   promise（3）                  
Log	 ：   2   5    3                

----------------------

将promise（3）的回调函数放入microtask，promise（3）执行完毕

Tasks：   setTimeoutCallback（1）
Microtasks ：   promiseThen(4)
JSstack ：                   
Log	 ：   2   5   3                

----------------------

JS栈为空，开始执行microtask

Tasks：  setTimeoutCallback（1）
Microtasks ：   
JSstack ：  promise(4)                 

Log	 ：   2   5   3   4            

----------------------

microtask为空了，继续执行tasks，输出1，执行完毕

Tasks：   
Microtasks ：   
JSstack ：   setTimeoutCallback（1）             

Log	 ：   2   5   3   4   1       

----------------------

参考自:https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly&utm_medium=email
