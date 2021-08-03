import React from "react";
import { Provider } from "react-redux";
import store from './store/store';
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>    
    <BrowserRouter basename="/social-media">
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);