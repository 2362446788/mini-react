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
  nextWorkFiber = {
    dom: container,
    props: {
      children: [el],
    },
  };
}

let nextWorkFiber = null;

function createDOM(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function addProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function transformFiber(fiber) {
  const children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = child;
  });
}

function returnNextFiber(fiber) {
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent?.sibling;
}

function performWorkOfUnit(fiber) {
  console.log("==== fiber", fiber);
  // 1. 创建 dom；
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber.type);
    fiber.parent.dom.append(fiber.dom);
  }

  // 2. 添加 props；
  addProps(fiber.dom, fiber.props);

  // 3. vdom 转换为 fiber 链表；
  transformFiber(fiber);

  // 4. 返回下一个链表节点
  return returnNextFiber(fiber);
}

function workLoop(deadline) {
  let shouldYeild = false;
  while (!shouldYeild && nextWorkFiber) {
    nextWorkFiber = performWorkOfUnit(nextWorkFiber);
    shouldYeild = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
};

export default React;
