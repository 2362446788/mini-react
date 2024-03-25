import ReactDOM from "./core/ReactDOM.js";
import App from "./app.jsx";

const app = function () {
  return <div>aaa: 10</div>;
};

console.log(app);

ReactDOM.createRoot(document.querySelector("#root")).render(App);
