---
title: Promise 面试题
---

# Promise 面试题

这篇内容整理自个人 Notion 笔记，并按面试复习的思路重新归纳，重点覆盖 Promise 的核心概念、链式调用规则、静态方法、`async / await` 关系以及常见易错点。

## 一、Promise 是什么

`Promise` 用来表示一个异步操作最终的结果。

你可以把它理解成一个“未来才会拿到结果的容器”，它通常用来解决传统回调写法层层嵌套的问题，让异步逻辑更容易串联和统一处理错误。

面试里常见的两个表述：

- Promise 是一个表示异步操作结果的对象
- Promise / thenable 的识别重点是“是否具有 `then` 方法”

## 二、Promise 的三种状态

Promise 只有三种状态：

- `pending`：进行中，未决议
- `fulfilled`：已完成，也常被口语化叫做 `resolved`
- `rejected`：已拒绝

### 状态特点

- Promise 从 `pending` 只能变成 `fulfilled` 或 `rejected`
- 一旦状态发生改变，就不会再变
- 第一次调用 `resolve` 或 `reject` 生效，后续调用都会失效

也就是说，Promise 的状态转换是不可逆的。

## 三、Promise 链式调用规则

在链式调用中，后一个 Promise 的状态不是简单复制前一个 Promise，而是取决于前一个 `then` / `catch` 回调的执行结果。

### 规则总结

#### 1. 没有传入有效回调

如果 `then` / `catch` 没有传入函数，那么状态和值会“穿透”到下一个 Promise。

```javascript
Promise.resolve(10)
  .then()
  .then((value) => {
    console.log(value) // 10
  })
```

#### 2. 回调正常执行并返回普通值

新 Promise 会变成 `fulfilled`，并且值就是这个返回值。

```javascript
Promise.resolve(10)
  .then((value) => value + 1)
  .then((value) => {
    console.log(value) // 11
  })
```

#### 3. 回调抛出异常

新 Promise 会变成 `rejected`，拒因就是抛出的错误。

```javascript
Promise.resolve(10)
  .then(() => {
    throw new Error("boom")
  })
  .catch((err) => {
    console.log(err.message) // boom
  })
```

#### 4. 回调返回另一个 Promise

新 Promise 的状态和值，都会跟随返回的那个 Promise。

```javascript
Promise.resolve(10)
  .then(() => Promise.resolve(20))
  .then((value) => {
    console.log(value) // 20
  })
```

## 四、then 和 catch 的本质

`then` 和 `catch` 都会返回一个新的 Promise。

- `then(onFulfilled, onRejected)` 主要处理成功分支
- `catch(onRejected)` 本质上可以理解为 `then(undefined, onRejected)`

### 状态如何变化

- 回调执行成功，返回普通值：新的 Promise 为 `fulfilled`
- 回调抛错：新的 Promise 为 `rejected`
- 回调返回 Promise：新的 Promise 跟随该 Promise

### 面试常考点

- `then` / `catch` 的回调会进入微任务队列
- `then` 中必须传函数；如果不是函数，会发生值穿透

例如：

```javascript
Promise.resolve(10)
  .then(1)
  .then(Promise.resolve(2))
  .then(console.log)
```

上面的非函数参数不会真正处理前一个 Promise，最终仍然会输出：

```javascript
10
```

## 五、Promise 的优点和缺点

### 优点

- 统一异步操作的写法，API 风格更一致
- 比事件回调更适合表示“一次性结果”
- 支持链式调用，能明显缓解回调地狱
- 错误处理更集中，可以通过 `catch` 统一捕获

### 缺点

- 一旦创建就会立即执行，无法从中途直接取消
- 如果没有显式处理错误，错误不会像同步代码那样直接暴露在外层流程里
- 处于 `pending` 时，无法直接知道当前进度
- 真正执行回调时，创建 Promise 的同步上下文通常已经结束，排查调用链有时不如同步代码直观

## 六、Promise 的静态方法

### `Promise.resolve(value)`

返回一个立即成功的 Promise。

```javascript
Promise.resolve(100).then(console.log) // 100
```

### `Promise.reject(reason)`

返回一个立即失败的 Promise。

```javascript
Promise.reject("error").catch(console.log) // error
```

### `Promise.all(iterable)`

特点：

- 全部成功才成功
- 只要有一个失败就立即失败
- 成功结果按照传入顺序组成数组

```javascript
Promise.all([Promise.resolve(1), Promise.resolve(2)]).then(console.log)
// [1, 2]
```

### `Promise.any(iterable)`

特点：

- 任意一个成功就成功
- 所有都失败才失败

适合“多个备选源，只要有一个可用即可”的场景。

### `Promise.allSettled(iterable)`

特点：

- 等待所有 Promise 都变成已决状态
- 不会因为某一个失败而整体失败
- 返回每个任务各自的结果描述

适合“我需要知道每个请求最终都怎么样了”的场景。

### `Promise.race(iterable)`

特点：

- 哪个 Promise 最先决议，就采用哪个结果
- 既可能最先成功，也可能最先失败

常用于超时控制、抢占式请求等场景。

## 七、Promise 与事件、回调的对比

### 和事件相比

Promise 更适合处理“一次性结果”。

- 结果产生前注册回调，可以拿到结果
- 结果产生后再注册回调，仍然可以拿到结果

但 Promise 不适合表达“持续触发、多次触发”的场景，例如长期监听型事件，这类场景仍然更适合事件机制。

### 和回调相比

Promise 解决的核心问题是：

- 避免回调层层嵌套
- 让异步逻辑更像顺序流程
- 让错误处理更集中

## 八、async / await 和 Promise 的关系

`async / await` 本质上是 Promise 的语法糖。

### 需要记住的结论

- `async` 函数一定返回一个 Promise
- `await` 后面会等待一个值
- 如果后面不是 Promise，会等价于 `Promise.resolve(该值)`
- `await` 后续的代码会进入微任务队列

## 九、async / await 常见输出题

```javascript
(async function () {
  console.log(1)
  const a = await 100
  console.log("a", a)
  const b = await Promise.resolve(200)
  console.log("b", b)
  const c = await Promise.reject(300)
  console.log("c", c)
  console.log("end")
})()
```

输出：

```javascript
1
a 100
b 200
```

原因：

- `await 100` 等价于等待一个成功的 Promise
- `await Promise.resolve(200)` 正常继续执行
- `await Promise.reject(300)` 会抛出一个拒绝结果
- 因为这里没有 `try...catch` 处理，所以后面的 `console.log("c", c)` 和 `console.log("end")` 不会执行

## 十、async / await、Promise、setTimeout 执行顺序

```javascript
async function async1() {
  console.log("async1start")
  await async2()
  console.log("async1 end")
}

async function async2() {
  console.log("async2")
}

console.log("script start")

setTimeout(() => {
  console.log("setTimeout")
}, 0)

async1()

new Promise((resolve) => {
  console.log("promise1")
  resolve()
}).then(() => {
  console.log("promise2")
})

console.log("script end")
```

输出顺序：

```javascript
script start
async1start
async2
promise1
script end
async1 end
promise2
setTimeout
```

记忆重点：

- 同步代码先执行
- `await` 后续逻辑进入微任务
- `then` 回调也进入微任务
- `setTimeout` 回调进入宏任务
- 本题里 `async1 end` 比 `promise2` 更早进入微任务队列，因此更早执行

## 十一、手写 Promise 封装图片加载

这是一个很常见的手写题，核心是把成功和失败两种结果封装进 Promise。

```javascript
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img")

    img.onload = () => {
      resolve(img)
    }

    img.onerror = () => {
      reject(new Error("图片加载失败"))
    }

    img.src = src
  })
}
```

可以这样使用：

```javascript
loadImage("test.png")
  .then((img) => {
    document.body.appendChild(img)
  })
  .catch((err) => {
    console.error(err)
  })
```

## 十二、面试速记版

如果面试时间很紧，可以直接记这几个关键点：

1. Promise 有三种状态：`pending`、`fulfilled`、`rejected`
2. 状态一旦改变就不可逆，第一次 `resolve` / `reject` 生效
3. `then` / `catch` 都返回新的 Promise
4. 新 Promise 的状态取决于回调的返回值或异常
5. `then` / `catch` / `await` 后续逻辑都会进入微任务队列
6. `async / await` 是 Promise 的语法糖，`async` 函数始终返回 Promise

## 十三、容易答错的点

- 不要把 `resolved` 和 `fulfilled` 完全混用到所有语境里；面试里更严谨的最终状态是 `fulfilled`
- `then` 里传非函数，不会报错，而是发生值穿透
- `await` 并不会阻塞整个线程，它只是让当前 `async` 函数后续逻辑延后到微任务中
- `Promise.race` 不代表“谁先成功就取谁”，而是“谁先决议就取谁”
- Promise 适合一次性结果，不适合持续事件流
