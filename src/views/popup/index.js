import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "store";
import Popup from "./popup.jsx";

ReactDOM.render(
	<React.StrictMode>
        <Provider store={store}>
            <Popup />
        </Provider>
	</React.StrictMode>,
	document.getElementById("popup")
);