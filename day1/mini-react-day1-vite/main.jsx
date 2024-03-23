import ReactDOM from "./core/ReactDOM.js";
import App from "./app.js";

const app = function () {
  return <div>aaa</div>;
};

console.log(app);

ReactDOM.createRoot(document.querySelector("#root")).render(App);
