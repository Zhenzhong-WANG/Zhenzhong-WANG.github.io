---
layout:     post
title:      "TrAdaBoost"
subtitle:   "迁移学习"
date:       2018-05-16
author:     "wzz"
header-img: "img/home-bg.jpg"
catalog: true
tags:
    - 迁移学习
---

# TrAdaBoost

### TrAdaBoost主要思想

传统的机器学习中常常假设训练数据测试数据遵从同分布。但是当有新域到来，其中只有少量的数据来自于老域，重新去标注新的数据是十分耗时的。如果丢弃训练数据又是十分可惜的，考虑到以前过期的训练数据还有部分可用，所以可采用迁移学习，找出可用数据。
现有有少量labeled的数据集$T_S\subseteq New Domain$，大量labeled的数据集$T_D \subseteq Old Domain$，待测试数据集$S\subseteq New Domain$。
输入$T＝T_S \cup T_D$训练并输出一个Classifier。
对T进行TrAdaboost，其中对于$T_S$，由于和S同分布，可直接用Adaboost训练，分类错误的数据则提高其权重，减少后续迭代时分类错误的概率。对于$T_D$，若分类错误，说明由于数据分布的改变，它们已经无法在新的数据分布上很好预测了，降低其权重，减少后续迭代时分类错误的概率。

### 问题模型

$X_s$和$X_d$分别为同分布样例空间和非同分布样例空间，$Y=\{0,1\}$为类别空间。
测试数据为$S=\{(x^t_i)\}$，其中$x^t_i \in X_s$。
待训练数据为$T_S \cup T_D＝T＝\{(x_i,c(x_i))\} \subseteq \{X \times Y\}$，其中$X=X_s \cup X_d$,$c(x_i)$返回$x_i$类别。
目标：训练出Classifier $\hat{c}:X \mapsto Y$。
### TrAdaBoost算法

![img](/img/tradaboost.png)

##### 论文名：Boosting for Transfer Learning