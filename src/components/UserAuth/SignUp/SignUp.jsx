import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Form,
  Input,
  Icon,
  Select,
  Checkbox,
  Button,
  Switch,
  AutoComplete
} from "antd";

import { linkedInOAuth } from "../../../utils/helpers/oAuthHelperFunctions.js";
import { googleClientId } from "../../../config/config.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import {
  getPositionsRequest,
  registerUserRequest,
  authenticateRequest,
  updateProfilePhotoRequest
} from "../../../utils/api/requests.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";
import Footer from "../../Partials/Footer/Footer.jsx";

import "./style.scss";

class SignUpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      autoCompleteCompanyData: [],
      autoCompletePositionsData: [],
      token: "",
      isUserLoggedIn: false,
      isUserAuthenticated: false,
      isAuthenticationChecking: false,
      confirmDirty: false,
      isEmailSignUpRequested: false,
      level:
        window.location.search.split("=")[1] == "synced" ? "submit" : "none",
      accountType: "",
      universityAccountType: "",
      collegeName: "",
      major: "",
      graduationYear: null,
      alumniEmployment: false,
      alumniEmploymentCompany: "",
      alumniEmploymentPosition: "",
      googleAccessToken: "",
      photoUrl: ""
    };

    this.nextButtonStyle = {
      borderRadius: 0,
      width: "272px"
    };

    this.narrowInputStyle = {
      width: "240px",
      marginBottom: 16
    };

    this.handlePositionsSearch = this.handlePositionsSearch.bind(this);
    this.handleCompanySearch = this.handleCompanySearch.bind(this);
    this.handleSignUpFormNext = this.handleSignUpFormNext.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.generateSignUpForm = this.generateSignUpForm.bind(this);
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
    this.validateToNextPassword = this.validateToNextPassword.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this);
    this.linkedInOAuthRequest = this.linkedInOAuthRequest.bind(this);
    this.onAlumniEmploymentSwitch = this.onAlumniEmploymentSwitch.bind(this);
  }

  compareToFirstPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords do not match!");
    } else {
      callback();
    }
  }

  validateToNextPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  }

  handleConfirmBlur(event) {
    const value = event.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  handleGoogleSignIn() {
    registerUserRequest.config.body = [];
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          apiKey: "AIzaSyBnF8loY6Vqhs4QWTM_fWCP93Xidbh1kYo",
          clientId: googleClientId,
          scope: "email https://www.googleapis.com/auth/gmail.readonly",
          prompt: "select_account"
        })
        .then(() => {
          this.googleAuth = window.gapi.auth2.getAuthInstance();
          let authenticated = this.googleAuth.isSignedIn.get();
          this.setState(() => ({ isUserAuthenticated: authenticated }));
          this.googleAuth.signIn().then(response => {
            IS_CONSOLE_LOG_OPEN && console.log("signIn response", response);
            if (response.Zi.token_type === "Bearer") {
              let photoUrl = response.w3.Paa;
              let googleAccessTokenExpiresOn = new Date();
              googleAccessTokenExpiresOn.setSeconds(
                googleAccessTokenExpiresOn.getSeconds() + response.Zi.expires_in
              );
              const googleAccessToken = this.googleAuth.currentUser
                .get()
                .getAuthResponse().access_token;
              this.setState(() => ({
                googleAccessToken: googleAccessToken,
                level: "intro",
                photoUrl: photoUrl
              }));
              this.props.cookie(
                "set",
                "google_login_first_instance",
                true,
                "/"
              );
            }
          });
        });
    });
  }

  handleFinish() {
    if (this.state.accountType != "") {
      registerUserRequest.config.body.accountType = this.state.accountType;
    }
    if (this.state.universityAccountType != "") {
      registerUserRequest.config.body.universityAccountType = this.state.universityAccountType;
    }
    if (this.state.collegeName != "") {
      registerUserRequest.config.body.collegeName = this.state.collegeName;
    }
    if (this.state.major != "") {
      registerUserRequest.config.body.major = this.state.major;
    }
    if (this.state.graduationYear != null) {
      registerUserRequest.config.body.graduationYear = this.state.graduationYear;
    }
    registerUserRequest.config.body.alumniEmployment = this.state.alumniEmployment;
    if (this.state.alumniEmployment === true) {
      registerUserRequest.config.body.alumniEmploymentCompany = this.state.alumniEmploymentCompany;
      registerUserRequest.config.body.alumniEmploymentPosition = this.state.alumniEmploymentPosition;
    }
    if (this.state.googleAccessToken != "") {
      registerUserRequest.config.body.googleAccessToken = this.state.googleAccessToken;
      registerUserRequest.config.body.photoUrl = this.state.photoUrl;
    }
    axiosCaptcha(
      registerUserRequest.url,
      registerUserRequest.config,
      "signup"
    ).then(response => {
      if (response.statusText === "OK") {
        console.log(response.data);
        if (response.data.success === true) {
          this.setState({ level: "final" });
          this.props.cookie(
            "set",
            "google_access_token_expiration",
            googleAccessTokenExpiresOn.getTime(),
            "/",
            googleAccessTokenExpiresOn
          );
          this.props.alert(
            5000,
            "success",
            "Registration mail has sent to your email successfully! \nPlease click the link on your email to activate your account!"
          );
        } else {
          console.log(response, response.data.error_message);
          this.props.alert(
            5000,
            "error",
            "Error: " + response.data.error_message
          );
        }
      } else {
        if (response.data == "500") {
          this.props.alert(3000, "error", "You have to fill out all from!");
        } else {
          this.props.alert(5000, "error", "Something went wrong!");
        }
      }
    });
  }

  handleSignUpFormNext(event) {
    event.preventDefault();
    registerUserRequest.config.body = [];
    if (
      event.target[1].value.trim() === (null || "") ||
      event.target[2].value.trim() === (null || "") ||
      event.target[3].value.trim() === (null || "") ||
      event.target[4].value.trim() === (null || "")
    ) {
      this.props.alert(3000, "error", "You have to fill out all sign up form!");
    } else {
      if (this.state.isAgreementRead === true) {
        registerUserRequest.config.body.first_name = null;
        registerUserRequest.config.body.last_name = null;
        registerUserRequest.config.body.username = event.target[1].value;
        registerUserRequest.config.body.email = event.target[2].value;
        registerUserRequest.config.body.password = event.target[3].value;
        registerUserRequest.config.body.password2 = event.target[4].value;
        this.setState({ level: "intro" });
      } else {
        this.props.alert(
          3000,
          "error",
          "You have to agree with the user agreement!"
        );
      }
    }
  }

  generateTopButtons() {
    return (
      <div className="sign_up-top">
        <Link to="/">
          <img
            className="logo"
            src="src/assets/icons/JobHax-logo-white.svg"
            alt="JobHax-logo"
          />
        </Link>
        <Link to="/home">
          <button>Home</button>
        </Link>
      </div>
    );
  }

  generateSignUpForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={() => this.handleSignUpFormNext(event)}>
        <div style={{ margin: "0px 0 16px 0" }}>
          <div className="social-buttons-container">
            {/*<div>
              <div className="social-buttons-google">
                <img
                  style={{ marginLeft: 48 }}
                  onClick={this.handleGoogleSignIn}
                  src="../../../src/assets/icons/btn_google_signin_light_normal_web@2x.png"
                />
              </div>
            </div>*/}
            <div>
              <Button
                type="primary"
                icon="google"
                onClick={this.handleGoogleSignIn}
                style={{ width: "240px" }}
              >
                {" "}
                Sign Up with Google
              </Button>
            </div>
          </div>
        </div>
        <div
          className="separator"
          style={{ margin: "12px 24px 12px 24px", width: 224 }}
        />
        <Form.Item style={{ width: "272px" }}>
          {getFieldDecorator("Username", {
            rules: [
              {
                required: true,
                message: "Please enter your Username!",
                whitespace: true
              }
            ]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
              style={{ width: "272px" }}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "The enter is not valid E-mail!"
              },
              {
                required: true,
                message: "Please enter your E-mail!"
              }
            ]
          })(
            <Input
              prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="E-mail"
              style={{ width: "272px" }}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please enter your password!"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
              style={{ width: "272px" }}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "Please confirm your password!"
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Confirm Password"
              style={{ width: "272px" }}
              onBlur={this.handleConfirmBlur}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("agreement", {
            valuePropName: "checked"
          })(
            <div style={{ display: "flex", justifyContent: "left" }}>
              <div>
                <Checkbox
                  style={{
                    width: "24px",
                    height: "48px"
                  }}
                  onClick={() =>
                    this.setState({
                      isAgreementRead: !this.state.isAgreementRead
                    })
                  }
                />
              </div>
              <div style={{ marginTop: "-8px" }}>
                <span
                  style={{
                    width: "252px",
                    fontSize: "90%",
                    height: "48px",
                    padding: 0
                  }}
                >
                  I agree with the{" "}
                  <a onClick={() => window.open("/useragreement")}>
                    user agreement
                  </a>{" "}
                  and{" "}
                </span>
                <div
                  style={{
                    marginTop: "-24px",
                    fontSize: "90%"
                  }}
                >
                  <a onClick={() => window.open("/privacypolicy")}>
                    privacy policy
                  </a>
                </div>
              </div>
            </div>
          )}
        </Form.Item>
        <Form.Item>
          <div style={{ marginTop: "-28px" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={this.nextButtonStyle}
            >
              Next
            </Button>
          </div>
        </Form.Item>
        <div style={{ fontSize: "90%" }}>
          Do you have an account? Go <Link to="/signin">sign in!</Link>
        </div>
      </Form>
    );
  }

  generateSignupOptions() {
    return (
      <div>
        <div>
          <div className="social-buttons-container">
            {/*<div>
              <button className="social-buttons-google">
                <img
                  onClick={this.handleGoogleSignIn}
                  src="../../../src/assets/icons/btn_google_signin_light_normal_web@2x.png"
                />
              </button>
            </div>*/}
            <div>
              <Button
                type="primary"
                icon="google"
                onClick={this.handleGoogleSignIn}
                style={{ width: "240px" }}
              >
                {" "}
                Sign Up with Google
              </Button>
            </div>
          </div>

          {/*<div className="email-button-container">
            <div
              onClick={() => this.setState({ isEmailSignUpRequested: true })}
              className="email-button"
            >
              <Icon type="mail" />
              Sign Up with E-mail
            </div>
          </div>*/}
          <div
            className="separator"
            style={{ width: "224px", margin: "12px 24px 0px 24px" }}
          />
          <div
            className="social-buttons-container"
            style={{ marginBottom: 20 }}
          >
            <div>
              <Button
                icon="mail"
                onClick={() =>
                  this.setState({
                    isEmailSignUpRequested: true,
                    accountType: "",
                    universityAccountType: "",
                    collegeName: "",
                    major: "",
                    graduationYear: null,
                    alumniEmployment: false,
                    alumniEmploymentCompany: "",
                    alumniEmploymentPosition: "",
                    googleAccessToken: "",
                    photoUrl: ""
                  })
                }
                style={{ width: "240px" }}
              >
                {" "}
                Sign Up with Email
              </Button>
            </div>
          </div>
        </div>
        <div style={{ fontSize: "90%" }}>
          Do you have an account? Go <Link to="/signin">sign in!</Link>
        </div>
      </div>
    );
  }

  generateSignUp() {
    return (
      <div className="sign_up-form-container">
        <div className="content-container">
          <h1>Sign up</h1>
          {this.state.isEmailSignUpRequested
            ? this.generateSignUpForm()
            : this.generateSignupOptions()}
        </div>
      </div>
    );
  }

  generateBackButton(level) {
    return (
      <div>
        <div style={{ margin: "12px 0 0 0" }} />
        <Button
          onClick={() =>
            this.setState({
              level: level
            })
          }
          style={this.nextButtonStyle}
        >
          Back
        </Button>
      </div>
    );
  }

  generateLevelIntro() {
    return (
      <div>
        <div className="level-title">Welcome to Jobhax!</div>
        <div className="level-body">
          Please confirm a few, quick details to activate your account.
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => this.setState({ level: "accountType" })}
            style={this.nextButtonStyle}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  generateLevelAccountType() {
    return (
      <div>
        <div className="level-title">
          Are you affiliated with a College/University?
        </div>
        <div>
          <div className="level-body">
            Improve your Job search experience in a seamless & intuitive way.
          </div>
          <div>
            <Button
              type="primary"
              onClick={() =>
                this.setState({ level: "linkedin", accountType: "public" })
              }
              style={this.nextButtonStyle}
            >
              Public Sign Up
            </Button>
          </div>
        </div>
        <div className="separator" />
        <div>
          <div className="level-body">
            Connect & engage with your University to launch your career!
          </div>
          <div>
            <Button
              type="primary"
              onClick={() =>
                this.setState({
                  level: "university",
                  accountType: "university"
                })
              }
              style={this.nextButtonStyle}
            >
              University Portal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  universityChoices(snippet, link, title) {
    return (
      <div>
        <div className="level-body">{snippet}</div>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={() =>
              this.setState({ level: link, universityAccountType: link })
            }
            style={this.nextButtonStyle}
          >
            {title}
          </Button>
        </div>
      </div>
    );
  }

  generateLevelUniversity() {
    return (
      <div>
        <div className="level-title">
          What kind of account do you want to create?
        </div>
        <div>
          {this.universityChoices(
            "Organize, track, & get assistance throughout your job search process.",
            "student",
            "Student"
          )}
        </div>
        <div>
          {this.universityChoices(
            "Use your experience to guide students towards their career goals.",
            "alumni",
            "Alumni"
          )}
        </div>
        <div>
          {this.universityChoices(
            "Connect with your cohort to providetargeted assistance & track progress.",
            "careerServices",
            "Career Services"
          )}
        </div>
        <div>{this.generateBackButton("accountType")}</div>
      </div>
    );
  }

  generateLevelStudent() {
    return (
      <div>
        <div className="level-title">Connect with your College</div>
        <div className="level-body">Please enter your College:</div>
        <div>
          <Input
            placeholder="ex. Stanford University"
            style={this.narrowInputStyle}
            onChange={event =>
              this.setState({ collegeName: event.target.value })
            }
          />
        </div>
        <div className="level-body">Please enter your Major:</div>
        <div>
          <Input
            placeholder="ex. Computer Science"
            style={this.narrowInputStyle}
            onChange={event => this.setState({ major: event.target.value })}
          />
        </div>
        <div className="level-body">Expected Graduation Year:</div>
        <div>
          <Input
            placeholder="ex. 2019"
            style={this.narrowInputStyle}
            onChange={event =>
              this.setState({ graduationYear: event.target.value })
            }
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <Button
            type="primary"
            onClick={() => this.setState({ level: "linkedin" })}
            style={this.nextButtonStyle}
          >
            Next
          </Button>
        </div>
        <div>{this.generateBackButton("university")}</div>
      </div>
    );
  }

  onAlumniEmploymentSwitch(checked) {
    console.log(`switch to ${checked}`);
    this.setState({ alumniEmployment: checked });
  }

  handleCompanySearch(value) {
    this.setState({ alumniEmploymentCompany: value });
    let url =
      "https://autocomplete.clearbit.com/v1/companies/suggest?query=" + value;
    let config = {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      }
    };
    axiosCaptcha(url, config).then(response => {
      if (response.statusText === "OK") {
        console.log(response);
        let bufferList = [];
        response.data.forEach(company => bufferList.push(company.name));
        this.setState({
          autoCompleteCompanyData: bufferList
        });
      }
    });
  }

  handlePositionsSearch(value) {
    this.setState({ alumniEmploymentPosition: value });
    const { url, config } = getPositionsRequest;
    let newUrl = url + "?q=" + value + "&count=5";
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        console.log(response.data);
        let bufferPositionsList = [];
        response.data.data.forEach(position =>
          bufferPositionsList.push(position.job_title)
        );
        this.setState({
          autoCompletePositionsData: bufferPositionsList
        });
      }
    });
  }

  generateAlumniEmploymentForm() {
    return (
      <div>
        <div>
          <AutoComplete
            dataSource={this.state.autoCompleteCompanyData}
            style={this.narrowInputStyle}
            onSearch={this.handleCompanySearch}
            placeholder="Company Name"
            value={
              this.state.alumniEmploymentCompany &&
              this.state.alumniEmploymentCompany
            }
          />
        </div>
        <div>
          <AutoComplete
            style={this.narrowInputStyle}
            dataSource={this.state.autoCompletePositionsData}
            onSearch={this.handlePositionsSearch}
            placeholder="Job Title"
            value={
              this.state.alumniEmploymentPosition &&
              this.state.alumniEmploymentPosition
            }
          />
        </div>
      </div>
    );
  }

  generateLevelAlumni() {
    return (
      <div>
        <div className="level-title">Connect with your College</div>
        <div className="level-body">Please enter your College:</div>
        <div>
          <Input
            placeholder="ex. Stanford University"
            defaultValue={this.state.collegeName && this.state.collegeName}
            style={this.narrowInputStyle}
            onChange={event =>
              this.setState({ collegeName: event.target.value })
            }
          />
        </div>
        <div className="level-body">Please enter your Major:</div>
        <div>
          <Input
            placeholder="ex. Computer Science"
            defaultValue={this.state.major && this.state.major}
            style={this.narrowInputStyle}
            onChange={event => this.setState({ major: event.target.value })}
          />
        </div>
        <div className="level-body">Graduation Year:</div>
        <div>
          <Input
            placeholder="ex. 2019"
            defaultValue={
              this.state.graduationYear && this.state.graduationYear
            }
            style={this.narrowInputStyle}
            onChange={event =>
              this.setState({ graduationYear: event.target.value })
            }
          />
        </div>
        <div
          className="level-body"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "210px"
          }}
        >
          Current Employment
          <Switch
            defaultChecked={this.state.alumniEmployment}
            onChange={this.onAlumniEmploymentSwitch}
          />
        </div>
        {this.state.alumniEmployment && this.generateAlumniEmploymentForm()}
        <div style={{ marginTop: 8 }}>
          <Button
            type="primary"
            onClick={() => this.setState({ level: "linkedin" })}
            style={this.nextButtonStyle}
          >
            Next
          </Button>
        </div>
        <div>{this.generateBackButton("university")}</div>
      </div>
    );
  }

  linkedInOAuthRequest() {
    linkedInOAuth();
    this.setState({ level: "submit" });
  }

  generateLevelLinkedIn() {
    const level =
      this.state.accountType == "public"
        ? "accountType"
        : this.state.universityAccountType;
    return (
      <div>
        <div className="level-title">Welcome to Jobhax!</div>
        <div className="level-body">
          If you have a LinkedIn account, we can keep your information in sync,
          aggregate your work experience & build custom resumes.
        </div>
        <div>
          <Button
            type="primary"
            icon="linkedin"
            onClick={() => this.linkedInOAuthRequest()}
            style={this.nextButtonStyle}
          >
            {" "}
            Connect With LinkedIn
          </Button>
        </div>
        <div style={{ marginTop: 20 }}>
          <Button
            onClick={() => this.setState({ level: "submit" })}
            style={this.nextButtonStyle}
          >
            Skip
          </Button>
        </div>
        <div>{this.generateBackButton(level)}</div>
      </div>
    );
  }

  generateLevelSubmit() {
    return (
      <div>
        <div className="level-title" style={{ fontWeight: 500 }}>
          You're all set!
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => this.handleFinish()}
            style={this.nextButtonStyle}
          >
            Finish
          </Button>
        </div>
        <div>{this.generateBackButton("linkedin")}</div>
      </div>
    );
  }

  generateLevelFinal() {
    return (
      <div>
        <div className="level-title" style={{ fontWeight: 500 }}>
          Congratulations!
        </div>
        <div className="level-body">
          Registration mail has sent to your email successfully!
        </div>
        <div className="level-body">
          Please click the link on your email to activate your account!
        </div>
      </div>
    );
  }

  generateAdditionalInfoForms() {
    switch (this.state.level) {
      case "intro":
        return this.generateLevelIntro();
      case "accountType":
        return this.generateLevelAccountType();
      case "university":
        return this.generateLevelUniversity();
      case "student":
        return this.generateLevelStudent();
      case "alumni":
        return this.generateLevelAlumni();
      case "careerServices":
        return <Redirect to="signin" />;
      case "linkedin":
        return this.generateLevelLinkedIn();
      case "submit":
        return this.generateLevelSubmit();
      case "final":
        return this.generateLevelFinal();
    }
  }

  render() {
    return (
      <div>
        <div className="sign_up-background">{this.generateTopButtons()}</div>
        <div className="sign_up-vertical-container">
          <div className="sign_up-container">
            {this.state.level === "none" ? (
              this.generateSignUp()
            ) : (
              <div className="sign_up-form-container">
                <div className="content-container">
                  <div className="levels">
                    {this.generateAdditionalInfoForms()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bottom-fixed-footer-sign_up">
          <Footer />
        </div>
      </div>
    );
  }
}

const SignUp = Form.create({ name: "signup" })(SignUpPage);

export default SignUp;
