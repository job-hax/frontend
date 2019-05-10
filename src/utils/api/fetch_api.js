import axios from "axios";

import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";

const script = document.createElement("script");
script.src = `https://www.google.com/recaptcha/api.js?render=6LfOH6IUAAAAAL4Ezv-g8eUzkkERCWlnnPq_SdkY`;
document.body.appendChild(script);

function reCaptchaToken(action) {
  return new Promise(resolve => {
    grecaptcha.ready(async () => {
      const token = await grecaptcha.execute(
        "6LfOH6IUAAAAAL4Ezv-g8eUzkkERCWlnnPq_SdkY",
        {
          action: action
        }
      );
      resolve(token);
    });
  });
}

function log(url, config, response) {
  return (
    IS_CONSOLE_LOG_OPEN &&
    console.log(
      "Request : ",
      url,
      " Params : ",
      config,
      " Response : ",
      response
    )
  );
}

export async function axiosCaptcha(url, config, action) {
  let response = null;
  if (config.method === "GET") {
    response = await axios.get(url, config).catch(error => {
      console.log(error);
    });
  } else if (config.method === "POST") {
    if (action != false) {
      const recaptchaToken = await reCaptchaToken(action);
      if (config.body) {
        config.body["recaptcha_token"] = recaptchaToken;
        config.body["action"] = action;
      } else {
        config["body"] = { recaptcha_token: recaptchaToken };
        config.body["action"] = action;
      }
    }
    response = await axios({
      method: "POST",
      url: url,
      data: JSON.stringify(config.body),
      headers: config.headers
    }).catch(error => {
      console.log(error);
    });
  }
  log(url, config, response);
  return response;
}
