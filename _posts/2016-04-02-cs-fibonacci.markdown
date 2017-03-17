---
layout:     post
title:      "Fibonacci数列"
subtitle:   "学习笔记"
date:       2016-04-02
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 算法
---

Fibonacci数列递归公式：

![img](/img/20160402/0.jpg)

### 求Fibonacci数列第n项

低效算法

直接利用递归公式

低效算法未保存中间结果，速度很慢。

```js
long long Fibonacci(unsigned int n){
  if (n<=0)
  {
    return 0;
  }
  if (1==n)
  {
    return 1;
  }
  return Fibonacci(n-1)+Fibonacci(n-1);
}
```

高效算法

高效算法保存中间结果

```js
long long Fibonacci(unsigned int n){
  int result[2]={0,1};
  if (n<2)
  {
    return result[n];
  }
  long long a=1;
  long long b=2;
  long long c=0;
  for (unsigned int i = 2; i <=n; ++i)
  {
    c=a+b;
    b=a;
    a=c;
  }
  return c;
}
 ```

算法变形题：

### 一、一只蛤跳台阶，一次跳一级或者二级，上n级台阶有几种跳法

分析：

当只有一级台阶时 有一种跳法

当只有二级台阶时 有两种跳法

当有n级台阶时 有`f(n)`种跳法

如果第一跳跳一级， 之后还有f`(n-1)`种跳法

如果第一跳跳两级，之后有`f(n-2)`种跳法

所以这个问题实际为斐波那契数列问题

### 二、用2*1矩形覆盖2*8矩形，可横铺可竖铺，有多少种方法覆盖

分析：

设覆盖2*8矩形有f(8)种方法

当第一块竖着放最左边，那么还剩2*7矩形，有`f(7)`种方法

当第一块横着放，它下方必须也横着放，还剩2*6矩形，有`f(6)`种方法

即`f(8)=f(7)+f(6)`,也为fibonacci问题
