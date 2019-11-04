import axios from "axios";
import {
  linkedInClientId,
  linkedInClientSecret,
  googleApiKey,
  googleClientId
} from "../../config/config.js";
import { IS_CONSOLE_LOG_OPEN } from "../constants/constants.js";

export function googleOAuth() {
  const scope = "email https://www.googleapis.com/auth/gmail.readonly";
  return new Promise(resolve => {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          apiKey: googleApiKey,
          clientId: googleClientId,
          scope: scope,
          prompt: "select_account"
        })
        .then(() => {
          let googleAuth = window.gapi.auth2.getAuthInstance();
          googleAuth.signIn().then(() => {
            const user = googleAuth.currentUser.get();
            const userInfo = {
              first_name: user.getBasicProfile().getGivenName(),
              last_name: user.getBasicProfile().getFamilyName(),
              email: user.getBasicProfile().getEmail(),
              photo_url: user.getBasicProfile().getImageUrl(),
              access_token: user.getAuthResponse().access_token,
              expires_at: user.getAuthResponse().expires_at
            };
            const isAuthorized = user.hasGrantedScopes(scope);
            if (isAuthorized) {
              console.log("email granted");
            } else {
              console.log("email not granted");
            }
            resolve(userInfo);
          });
        });
    });
  });
}

export function linkedInOAuth() {
  let url =
    "https://www.linkedin.com/oauth/v2/authorization" +
    "?response_type=code" +
    "&client_id=" +
    linkedInClientId +
    "&redirect_uri=https://jobhax.com/action-linkedin-oauth2" +
    "&scope=" +
    "r_emailaddress%20" +
    "r_liteprofile%20";
  window.open(url);
}

export async function linkedInAccessTokenRequester(authCode) {
  IS_CONSOLE_LOG_OPEN &&
    console.log("access code will be requested with", authCode);
  response = await axios({
    method: "POST",
    url: "https://www.linkedin.com/oauth/v2/accessToken",
    data: {
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: "https://jobhax.com/action-linkedin-oauth2",
      client_id: linkedInClientId,
      client_secret: linkedInClientSecret
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).catch(error => {
    IS_CONSOLE_LOG_OPEN && console.log(error);
  });
  IS_CONSOLE_LOG_OPEN && console.log("linkedInOAuth response", response);
}
