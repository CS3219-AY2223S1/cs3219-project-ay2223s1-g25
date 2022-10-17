import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './collab.css'
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";
import reportWebVitals from './reportWebVitals';
import { getConfig } from "./configs";

const root = ReactDOM.createRoot(document.getElementById('root'));


const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  audience: config.audience,
  scope: config.scope,
  redirectUri: window.location.origin,
  useRefreshTokens: true,
  // screen_hint: "signup"
};

root.render(
    <Auth0Provider {...providerConfig}>
    <App/>
    </Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
