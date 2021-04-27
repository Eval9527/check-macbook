# node.js 监听 Apple Mac M1 翻新库存

Apple 苹果中国官网上架翻新版 M1，库存不是很多，于是使用 node.js 写了一个粗糙的轮训监听，如果有库存将发送到 Server 酱

# 下载
```shell
$ git clone git@github.com:Pooc-J/check-macbook.git
$ cd check-macbook
$ npm i
```

# 使用方法

## 修改 Server 酱的 Token

去 `send-msg.js` 添加 `SERVER` 的 Token

## 选择轮训方式

### 监听全部
启动之前需要设定筛选条件

需要对 `check-all.js` 中的 `allResult` 进行修改

默认监听 2020 + M1 + MacBook Air + 16G + 价格<￥10000 + 不是金色

监听所有的

```shell
$ node check-all.js
```


### 监听特定型号
启动之前需要设定筛选条件

需要对 `check-one.js` 中的 `name` 进行修改

默认 G1274CH/A Air 星空灰 16+256

```shell
$ node check-one.js
```
