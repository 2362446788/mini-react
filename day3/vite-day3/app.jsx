import React from "./core/React.js";
// const app = React.createElement("div", { id: "app" }, "app");

function CC() {
    return <Count num={10}></Count>
}

function Count({num}) {
    return <div>count: {num}</div>
}

function App(){
    return <div id="app">
        app
        <CC></CC>
        <Count num={10}></Count>
        <Count num={20}></Count>
        aaa
    </div>
}

// const App = <div id="app">
//     app
//     {/* <Count num={10}></Count> */}
//     <CC></CC>
// </div>;

export default App;
