# mini-react

遵循 react 的模式实现最小版本的可执行代码库 mini-react，本次记录是参加崔哥的七天训练营，输出总结自己的学习历程：
按照如下的模式去记录自己打怪升级的记录

- 今天学习到了什么
- 遇到什么问题以及怎么解决的

## 第一天

今天通过 dom 原生 api 实现 vdom 转换为真实 dom，在页面中展示出`app`，拆分为以及几个小步（小步慢跑才不会摔倒）

1. 原生 api 将`app`展示在 html 中；
2. 使用 vdom 结构定义需要展示的`app`字符串；
3. 编写出符合 react 导出的 api 结构实现功能；
4. 使用 jsx 写法验证

### 第一步

这个最容易实现，通过调用 dom 原生 api 即可

```js
const dom = document.createElement("div");
dom.id = "app";
document.querySelector("#root").append(dom);
const textElement = document.createTextNode("app");
dom.append(textElement);
```

### 第二步

这一步需要知道 react 中 vdom 的结构是怎么样的，其实也很简单，就包含几个字段：type、props、key、ref 等等，其中我们需要使用的就是 type 和 props；
type 标识当前的节点类型，props 保存节点上的属性以及在 children 上保存子节点的信息；
基于这两点，可以将上面的 dom 进行 vdom 结构化，然后进行 dom 节点的处理

```js
const textElementVdom = {
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: "app",
    children: [],
  },
};
const domVdom = {
  type: "div",
  props: {
    id: "app",
    children: [textElementVdom],
  },
};

const dom = document.createElement(domVdom.type);
dom.id = domVdom.props.id;
document.querySelector("#root").append(dom);
const textElement = document.createTextNode(textElementVdom.props.nodeValue);
dom.append(textElement);
```

### 第三步

这一步也需要知道 react 最后提供出来的调用方法是什么，其实在[babel](https://babeljs.io/rep)上很清晰的能看出，最终调用的结果是`React.createElement `这个方法，并且对与文本节点而言，可以单独抽离一个方法`createTextNode`进行使用；
最终实现一个`render`方法去执行渲染逻辑

```js
function createTextNode(nodeValue) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: nodeValue,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}

function render(el, container) {
  // 创建一个dom
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode(el.props.nodeValue)
      : document.createElement(el.type);

  // 将节点上的属性挂载上去
  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });

  // 将children进行递归生成节点
  el.props.children.forEach((child) => {
    render(child, dom);
  });

  // 挂载节点
  container.append(dom);
}

const textElement = createTextNode("app");
// const app = createElement ("div", { id: "app" }, textElement);
const app = createElement("div", { id: "app" }, "aaa", "bbb");

render(app, document.querySelector("#root"));
```

### 第四步

这一步通过 vite 的转换功能，将 jsx 转换为 React.createElement 的结构验证我们的代码逻辑
