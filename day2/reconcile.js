let taskID = 1;
function workLoop(deadline) {
  console.log("==== deadline", deadline.timeRemaining());
  taskID++;

  let shouldYeild = false;
  while (!shouldYeild) {
    // 执行任务
    console.log("==== taskid", taskID);
    // 当没有空闲之间了就切换到下一个task的空闲时间
    shouldYeild = deadline.timeRemaining() < 1;
  }

  // 一直执行
  //   requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);
