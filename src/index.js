import React from "react";
import ReactDOM from "react-dom";
import { CookiesProvider } from "react-cookie";

import App from "./components/App/App.jsx";
import { nonceCSP, googleClientId } from "./config/config.js";

const rootElement = document.getElementById("root");
const refElement = document.getElementById("nameJobhax");

const meta = document.createElement("meta");
meta.httpEquiv = `Content-Security-Policy`;
meta.content = `script-src 'nonce-${nonceCSP}' 'unsafe-inline' 'unsafe-eval' 'self' https://*.google.com https://*.googleapis.com https://www.google-analytics.com https://www.gstatic.com; frame-src https://*.google.com https://*.youtube.com`;
document.head.insertBefore(meta, refElement);

let script = document.createElement("script");
script.nonce = nonceCSP;
script.src = "https://apis.google.com/js/api.js";
script.async;
script.defer;
script.onload = init;
document.head.insertBefore(script, refElement);

function init() {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: googleClientId,
      scope: "email https://www.googleapis.com/auth/gmail.readonly",
      prompt: "select_account"
    });
  });
}

ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
  rootElement
);
