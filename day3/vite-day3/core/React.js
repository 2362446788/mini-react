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
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
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
  root = nextWorkFiber;
}

let nextWorkFiber = null;
let root = null;

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

function transformFiber(fiber, children) {
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
    prevChild = newFiber;
  });
}

function returnNextFiber(fiber) {
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
  // return nextFiber?.sibling;
}

function performWorkOfUnit(fiber) {
  // 判断是否是 functionComponent
  const isFunctionComponent = typeof fiber.type === "function";
  console.log("==== isFunctionComponent", fiber);
  if (!isFunctionComponent) {
    if (!fiber.dom) {
      // 1. 创建 dom；
      fiber.dom = createDOM(fiber.type);

      // 2. 添加 props；
      addProps(fiber.dom, fiber.props);
    }
  }

  // 3. vdom 转换为 fiber 链表；
  const children = isFunctionComponent
    ? [fiber.type(fiber.props)]
    : fiber.props.children;
  transformFiber(fiber, children);

  // 4. 返回下一个链表节点
  return returnNextFiber(fiber);
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function workLoop(deadline) {
  let shouldYeild = false;
  while (!shouldYeild && nextWorkFiber) {
    nextWorkFiber = performWorkOfUnit(nextWorkFiber);
    shouldYeild = deadline.timeRemaining() < 1;
  }
  if (!nextWorkFiber && root) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
};

export default React;
