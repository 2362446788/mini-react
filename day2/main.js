// v1 使用原生dom api将 app 展示在页面中
// const dom = document.createElement("div");
// dom.id = "app";
// document.querySelector("#root").append(dom);
// const textElement = document.createTextNode("app");
// dom.append(textElement);

// v2 将需要展示的这些个dom节点转换成react的vdom结构
// const textElementVdom = {
//   type: "TEXT_ELEMENT",
//   props: {
//     nodeValue: "app",
//     children: [],
//   },
// };
// const domVdom = {
//   type: "div",
//   props: {
//     id: "app",
//     children: [textElementVdom],
//   },
// };

// const dom = document.createElement(domVdom.type);
// dom.id = domVdom.props.id;
// document.querySelector("#root").append(dom);
// const textElement = document.createTextNode(textElementVdom.props.nodeValue);
// dom.append(textElement);

// v3 实现react内置api
// function createTextNode(nodeValue) {
//   return {
//     type: "TEXT_ELEMENT",
//     props: {
//       nodeValue: nodeValue,
//       children: [],
//     },
//   };
// }

// function createElement(type, props, ...children) {
//   return {
//     type,
//     props: {
//       ...props,
//       children: children.map((child) => {
//         return typeof child === "string" ? createTextNode(child) : child;
//       }),
//     },
//   };
// }

// function render(el, container) {
//   // 创建一个dom
//   const dom =
//     el.type === "TEXT_ELEMENT"
//       ? document.createTextNode(el.props.nodeValue)
//       : document.createElement(el.type);

//   // 将节点上的属性挂载上去
//   Object.keys(el.props).forEach((key) => {
//     if (key !== "children") {
//       dom[key] = el.props[key];
//     }
//   });

//   // 将children进行递归生成节点
//   el.props.children.forEach((child) => {
//     render(child, dom);
//   });

//   // 挂载节点
//   container.append(dom);
// }

// const textElement = createTextNode("app");
// // const app = createElement("div", { id: "app" }, textElement);
// const app = createElement("div", { id: "app" }, "aaa", "bbb");

// render(app, document.querySelector("#root"));

// v4 实现react的调用方式
import ReactDOM from "./core/ReactDOM.js";
import App from "./app.js";

ReactDOM.createRoot(document.querySelector("#root")).render(App);
