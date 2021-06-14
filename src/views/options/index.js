import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "store";
import Options from "./options.jsx";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Options />
        </Provider>
    </React.StrictMode>,
    document.getElementById("options")
);