import ui from "./ui.js";
import Pool from "./threads/pool.js";
import Task from "./threads/task.js";
import { HtmlString } from "./html-string.js";

const html = new HtmlString();
const pool = new Pool();

const renderData = (col) => (res) => {
  console.log("BACK TO MAIN THREAD");
  ui.cols[col].innerHTML = html.li(res.data);
};

const data = [new Array(1000)];
const jobA = (data) => {
  const result = data.fill("<span>HEY HOW FROM THE THREAD A</span>").join("");
  console.log("EXECUTING TASK IN THREAD");
  return result;
};
const jobB = (data) => {
  const result = data.fill("<span>HEY HOW FROM THE THREAD B</span>").join("");
  console.log("EXECUTING TASK IN THREAD");
  return result;
};

const taskA = new Task(jobA, data);
const taskB = new Task(jobB, data);

ui.buttons.start.addEventListener("click", () => {
  pool.run(taskA).then(renderData("left"));
  pool.run(taskB).then(renderData("right"));
});
