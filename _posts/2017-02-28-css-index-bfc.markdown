---
layout:     post
title:      "CSS的层叠和BFC"
subtitle:   "学习笔记"
date:       2017-02-28
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - CSS
    - 前端开发
---

### 层叠

### 层叠覆盖关系有2个准则

* 1.在同一个层叠上下文当中，z-index值大的覆盖z-index值小的

* 2.当层叠水平z-index一致时，后面的DOM元素覆盖之前的DOM元素

如:

```js
<div style="position:relative; z-index:auto;">
    <img src="a.jpg" style="position:absolute; z-index:2;">
</div>
<div style="position:relative; z-index:auto;">
    <img src="b.jpg" style="position:relative; z-index:1;">
</div>
```

`z-index:auto`不具有层叠上下文，两个子元素都在同一个根层叠上下文中,所以子元素不受父级影响，z-index的在前，a在b上面；

```js
<div style="position:relative; z-index:0;">
    <img src="a.jpg" style="position:absolute; z-index:2;">  
</div>
<div style="position:relative; z-index:0;">
    <img src="b.jpg" style="position:relative; z-index:1;">
</div>
```

`z-index:0`时，创建了层叠上下文，子元素的z-index不起作用，层叠水平一致，后面的覆盖之前的，b在a上面；


#### 哪些属性可以创建层叠上下文？

有`position:relative/position:absolute`的定位元素，且z-index不为auto

`display：flex`或`inline-flex`的子元素

opacity、 transform和filter


层叠上下文上面的层叠顺序：

层叠上下文 < 负z-index < block < float < inline/inline-block < z-index=0/auto < 正z-index

这个顺序可以解释如下的效果：

```js
.box {  }
.box > div { background-color: blue; z-index: 1; }   
.box > div > img {
  position: relative; z-index: -1; right: -150px;     
}

<div class="box">
    <div>
    	<img src="a.jpg">
    </div>
</div>
```

box不具有层叠上下文，div是个block，block>负z-index，box内的div覆盖a图片

```js
.box { display：flex }

.box > div { background-color: blue; z-index: 1; }   
.box > div > img {
  position: relative; z-index: -1; right: -150px;     
}

<div class="box">
    <div>
    	<img src="a.jpg">
    </div>
</div>
```

box的子元素具有了层叠上下文，层叠上下文<负z-index，a在div之上

### BFC

#### 1.BFC布局规则：

内部的Box会在垂直方向，一个接一个地放置；

Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠；

每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此；

BFC的区域不会与float box重叠；

BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此；

计算BFC的高度时，浮动元素也参与计算；

#### 2.怎么触发BFC？

根元素

float属性不为none

position为absolute或fixed

display为inline-block, table-cell, table-caption, flex, inline-flex

overflow不为visible



#### 3.能解决的问题？

* (1)浮动父元素高度塌陷
```js
  <style>
      .par {
          border: 5px solid #fcc;
          width: 300px;
          overflow: hidden;    生成BFC，计算BFC的高度时，浮动元素也参与计算
      }
      .child {
          border: 5px solid #f66;
          width:100px;
          height: 100px;
          float: left;
      }
  </style>
  <body>
      <div class="par">
          <div class="child"></div>
          <div class="child"></div>
      </div>
  </body>
```

* (2)多列布局

```js

  <style>
      body {
          width: 300px;
          position: relative;
      }
      .aside {
          width: 100px;
          height: 150px;
          float: left;
          background: #f66;
      }
      .main {
          height: 200px;
          background: #fcc;
          overflow: hidden;      生成BFC，BFC的区域不会与float box重叠
      }
  </style>
  <body>
      <div class="aside"></div>
      <div class="main"></div>
  </body>
```

* (3)防止垂直 margin 重叠
