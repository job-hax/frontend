import axios from "axios";

export function linkedInOAuth() {
  let url =
    "https://www.linkedin.com/oauth/v2/authorization" +
    "?response_type=code" +
    "&client_id=86n2yu4anxdswg" +
    "&redirect_uri=http://localhost:8080/action-linkedin-oauth2" +
    "&scope=" +
    "r_liteprofile%20" +
    "w_member_social";
  window.open(url);
}

export async function linkedInAccessTokenRequester(authCode) {
  console.log("access code will be requested with", authCode);
  response = await axios({
    method: "POST",
    url: "https://www.linkedin.com/oauth/v2/accessToken",
    data: {
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: "http://localhost:8080/action-linkedin-oauth2",
      client_id: "86n2yu4anxdswg",
      client_secret: "MY3zNKZctbFNG058"
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).catch(error => {
    console.log(error);
  });
  console.log("linkedInOAuth response", response);
}
