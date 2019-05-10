import axios from "axios";

import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";

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

export async function axiosCaptcha(url, config) {
  let response = null;
  if (config.method === "GET") {
    response = await axios.get(url, config).catch(error => {
      console.log(error);
    });
  } else if (config.method === "POST") {
    response = await axios({
      method: "POST",
      url: url,
      data: config.body,
      headers: config.headers
    }).catch(error => {
      console.log(error);
    });
  }
  log(url, config, response);
  return response;
}
