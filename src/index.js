import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import * as serviceWorker from "./serviceWorker";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <App />
);

// Register the service worker
//if ("serviceWorker" in navigator) {
 // window.addEventListener("load", () => {
 //   serviceWorker.register();
 // });
//}

serviceWorker.register();
