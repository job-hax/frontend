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
  Menu,
  Dropdown,
  AutoComplete
} from "antd";

import {
  linkedInOAuth,
  googleOAuth
} from "../../../utils/helpers/oAuthHelperFunctions.js";
import {
  googleApiKey,
  googleClientId,
  jobHaxClientId,
  jobHaxClientSecret
} from "../../../config/config.js";
import { USERS, AUTOCOMPLETE } from "../../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import {
  IS_CONSOLE_LOG_OPEN,
  USER_TYPES
} from "../../../utils/constants/constants.js";
import Footer from "../../Partials/Footer/Footer.jsx";

import "./style.scss";

class SignUpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      companyAutoCompleteData: [],
      positionAutoCompleteData: [],
      collegeAutoCompleteData: [],
      collegeList: [],
      majorAutoCompleteData: [],
      countryList: [],
      stateOrProvinceList: [],
      mustInputEmphasis: false,
      confirmDirty: false,
      isEmailSignUpRequested: false,
      level:
        window.location.search.split("=")[1] == "synced"
          ? "submit"
          : window.location.search.split("=")[1] == "intro"
          ? "intro"
          : "undefined",
      user_type:
        this.props.signupType === "alumni"
          ? USER_TYPES["alumni"]
          : USER_TYPES["public"],
      first_name: "",
      last_name: "",
      college_id: null,
      college: "",
      major: "",
      grad_year: null,
      alumniEmployment: true,
      company: "",
      job_title: "",
      country: "",
      country_id: null,
      stateOrProvince: "",
      state_id: null,
      googleAccessToken: "",
      photoUrl: ""
    };

    this.rightButtonStyle = {
      width: "124px",
      height: "40px",
      borderRadius: "100px",
      marginBottom: "24px"
    };

    this.bigButtonStyle = {
      width: "100%",
      height: 48
    };

    this.nextButtonStyle = {
      borderRadius: 0,
      width: "272px"
    };

    this.narrowInputStyle = {
      width: "240px",
      marginBottom: 16
    };

    this.warningStyle = {
      width: "240px",
      marginBottom: 16,
      border: "1px solid red",
      borderRadius: 4
    };

    this.handleAutoCompleteSearch = this.handleAutoCompleteSearch.bind(this);
    this.handleCompanySearch = this.handleCompanySearch.bind(this);
    this.handleSignUpFormNext = this.handleSignUpFormNext.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.generateSignUpForm = this.generateSignUpForm.bind(this);
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
    this.validateToNextPassword = this.validateToNextPassword.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.handleGoogleSignUp = this.handleGoogleSignUp.bind(this);
    this.linkedInOAuthRequest = this.linkedInOAuthRequest.bind(this);
    this.onAlumniEmploymentSwitch = this.onAlumniEmploymentSwitch.bind(this);
    this.handleGradYearSelection = this.handleGradYearSelection.bind(this);
    this.generateGradYearDropdown = this.generateGradYearDropdown.bind(this);
    this.checkMustInputs = this.checkMustInputs.bind(this);
    this.setCountryOrStateList = this.setCountryOrStateList.bind(this);
    this.generateUrlForGetData = this.generateUrlForGetData.bind(this);
    this.setCookies = this.setCookies.bind(this);
  }

  componentDidMount() {
    this.props.cookie("remove", "signup_complete_required");
  }

  componentDidUpdate() {
    if (
      this.props.signupType === "alumni" &&
      this.state.user_type != USER_TYPES["alumni"]
    ) {
      this.setState({ user_type: USER_TYPES["alumni"] });
    }
  }

  currentStyle(state, condition) {
    if (this.state.mustInputEmphasis === false) {
      return this.narrowInputStyle;
    } else {
      if (state != condition) {
        return this.narrowInputStyle;
      } else {
        return this.warningStyle;
      }
    }
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

  setCookies(response, googleAccessTokenExpiresOn) {
    this.token = `${
      response.data.data.token_type
    } ${response.data.data.access_token.trim()}`;
    IS_CONSOLE_LOG_OPEN && console.log(this.token);
    this.refresh_token = response.data.data.refresh_token;
    let date = new Date();
    date.setSeconds(date.getSeconds() + response.data.data.expires_in);
    this.props.cookie(
      "set",
      "google_access_token_expiration",
      googleAccessTokenExpiresOn,
      "/",
      new Date(googleAccessTokenExpiresOn)
    );
    this.props.cookie("set", "google_login_first_instance", true, "/");
    this.props.cookie("set", "jobhax_access_token", this.token, "/", date);
    this.props.cookie(
      "set",
      "jobhax_access_token_expiration",
      date.getTime(),
      "/"
    );
    this.props.cookie("set", "jobhax_refresh_token", this.refresh_token, "/");
    this.props.cookie("set", "user_type", response.data.data.user_type, "/");
    this.props.cookie(
      "set",
      "signup_flow_completed",
      response.data.data.signup_flow_completed,
      "/"
    );
  }

  setFirstSignUpFeedback() {
    this.props.passStatesToAppForFuture("feedbackType", "afterSignup", 2 * 5);
    this.props.passStatesToAppForFuture("feedbackVisible", true, 2 * 60);
    this.props.passStatesToAppForFuture("feedbackEmphasis", true, 2 * 60);
  }

  async handleGoogleSignUp() {
    let userGoogleInfo = await googleOAuth();
    let config = { method: "POST" };
    config.body = {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret,
      provider: "google-oauth2",
      user_type: this.state.user_type,
      token: userGoogleInfo.access_token,
      first_name: userGoogleInfo.first_name,
      last_name: userGoogleInfo.last_name,
      email: userGoogleInfo.email,
      photo_url: userGoogleInfo.photo_url
    };
    axiosCaptcha(USERS("authSocialUser"), config, "signin")
      .then(response => {
        if (response.statusText === "OK") {
          if (response.data.success === true) {
            this.setCookies(response, userGoogleInfo.expires_at);
          }
        }
        return response;
      })
      .then(response => {
        if (response.statusText === "OK") {
          if (response.data.success === true) {
            if (response.data.data.signup_flow_completed === "required") {
              this.setState({ level: "intro" });
            } else {
              this.props.cookie("set", "remember_me", true, "/");
              this.setFirstSignUpFeedback();
              this.props.alert(5000, "success", "Welcome to Jobhax!");
              this.props.passStatesToApp("isUserLoggedIn", true);
            }
          }
        }
      });
    return;
  }

  handleFinish() {
    let config = { method: "POST" };
    config.body = {};
    if (this.state.first_name != "") {
      config.body.first_name = this.state.first_name.trim();
    }
    if (this.state.last_name != "") {
      config.body.last_name = this.state.last_name.trim();
    }
    if (this.state.country_id != null) {
      config.body.country_id = this.state.country_id;
    }
    if (this.state.state_id != null) {
      config.body.state_id = this.state.state_id;
    }
    if (this.state.user_type != null) {
      config.body.user_type = this.state.user_type;
    }
    if (this.state.college_id != null) {
      config.body.college_id = this.state.college_id;
    }
    if (this.state.major != "") {
      config.body.major = this.state.major.trim();
    }
    if (this.state.grad_year != null) {
      config.body.grad_year = this.state.grad_year;
    }
    if (this.state.company != "") {
      config.body.company = this.state.company.trim();
    }
    if (this.state.job_title != "") {
      config.body.job_title = this.state.job_title.trim();
    }
    axiosCaptcha(USERS("updateProfile"), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success === true) {
          this.props.cookie(
            "set",
            "user_type",
            response.data.data.user_type,
            "/"
          );
          this.props.cookie("set", "signup_flow_completed", true, "/");
          this.setState({ redirect: "/signup?=final" });
          this.setFirstSignUpFeedback();
          this.props.passStatesToApp("isUserLoggedIn", true);
          this.props.alert(
            5000,
            "success",
            "Your account information has been saved successfully!"
          );
        } else {
          this.props.alert(
            5000,
            "error",
            "Error: " + response.data.error_message
          );
        }
      } else {
        this.props.alert(5000, "error", "Something went wrong!");
      }
    });
  }

  handleSignUpFormNext(event) {
    event.preventDefault();
    let config = { method: "POST" };
    config.body = {};
    if (
      event.target[0].value.trim() === (null || "") ||
      event.target[1].value.trim() === (null || "")
    ) {
      this.props.alert(3000, "error", "You have to fill out all sign up form!");
    } else {
      if (this.state.isAgreementRead === true) {
        config.body.email = event.target[0].value;
        config.body.password = event.target[1].value;
        config.body.password2 = event.target[1].value;
        config.body.username =
          event.target[0].value.split("@")[0] +
          new Date().getMilliseconds().toString();
        config.body.client_id = jobHaxClientId;
        config.body.client_secret = jobHaxClientSecret;
        if (this.state.user_type != null) {
          config.body.user_type = this.state.user_type;
        }
        axiosCaptcha(USERS("register"), config, "signup").then(response => {
          if (response.statusText === "OK") {
            if (response.data.success === true) {
              this.token = `${
                response.data.data.token_type
              } ${response.data.data.access_token.trim()}`;
              IS_CONSOLE_LOG_OPEN && console.log(this.token);
              this.refresh_token = response.data.data.refresh_token;
              let date = new Date();
              date.setSeconds(
                date.getSeconds() + response.data.data.expires_in
              );
              this.props.cookie(
                "set",
                "jobhax_access_token",
                this.token,
                "/",
                date
              );
              this.props.cookie(
                "set",
                "user_type",
                response.data.data.user_type,
                "/"
              );
              this.props.cookie(
                "set",
                "signup_flow_completed",
                response.data.data.signup_flow_completed,
                "/"
              );
              this.props.cookie(
                "set",
                "jobhax_access_token_expiration",
                date.getTime(),
                "/"
              );
              this.props.cookie(
                "set",
                "jobhax_refresh_token",
                this.refresh_token,
                "/"
              );
              if (response.data.data.signup_flow_completed === "required") {
                this.setState({ level: "intro" });
              } else {
                this.props.passStatesToApp("isUserLoggedIn", true);
              }
            } else {
              IS_CONSOLE_LOG_OPEN &&
                console.log(response, response.data.error_message);
              this.props.alert(
                5000,
                "error",
                "Error: " + response.data.error_message
              );
            }
          } else {
            if (response.data == "500") {
              this.props.alert(3000, "error", "You have to fill out all form!");
            } else {
              this.props.alert(5000, "error", "Something went wrong!");
            }
          }
        });
      } else {
        this.props.alert(
          3000,
          "error",
          "You have to agree with the user agreement!"
        );
      }
    }
  }

  generateSignUpForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={() => this.handleSignUpFormNext(event)}>
        <h1>Sign up with email</h1>
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
              placeholder="email"
              style={{ width: "100%", height: "36px" }}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please enter your password!"
              }
            ]
          })(
            <Input
              type="password"
              placeholder="password"
              style={{ width: "100%", height: "36px" }}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("agreement", {
            valuePropName: "checked"
          })(
            <div style={{ display: "flex", justifyContent: "left" }}>
              <div style={{ marginRight: 5, lineHeight: "20px" }}>
                <Checkbox
                  onClick={() =>
                    this.setState({
                      isAgreementRead: !this.state.isAgreementRead
                    })
                  }
                />
              </div>
              <div className="explanation">
                I understand, by choosing to sign up with email instead of
                Google, I will not be able to use the auto tracking features and
                get the most out of JobHax. I agree with the{" "}
                <a onClick={() => window.open("/useragreement")}>
                  user agreement
                </a>{" "}
                and{" "}
                <a onClick={() => window.open("/privacypolicy")}>
                  privacy policy
                </a>
              </div>
            </div>
          )}
        </Form.Item>
        <div className="right-align-container">
          <Button
            type="primary"
            htmlType="submit"
            style={this.rightButtonStyle}
          >
            Sign up
          </Button>
        </div>
        <div className="separator">
          <div className="line" />
          <div> OR </div>
          <div className="line" />
        </div>
        <div>
          <Button
            type="primary"
            icon="google"
            onClick={() =>
              this.setState({ isEmailSignUpRequested: "informed" })
            }
            style={this.bigButtonStyle}
          >
            {" "}
            Sign Up with Google
          </Button>
        </div>
        <div className="existing-account-question">
          Already have an account? <Link to="/signin">Log in!</Link>
        </div>
      </Form>
    );
  }

  generateStepOne() {
    return (
      <div>
        <h1>Sign up</h1>
        <div>
          <Button
            type="primary"
            icon="google"
            onClick={() =>
              this.setState({ isEmailSignUpRequested: "informed" })
            }
            style={this.bigButtonStyle}
          >
            {" "}
            Sign Up with Google
          </Button>
        </div>
        <div className="existing-account-question">
          Already have an account? <Link to="/signin">Log in!</Link>
        </div>
      </div>
    );
  }

  generatePermissionInfoStep() {
    return (
      <div>
        <h1>Why grant permission?</h1>
        <h2>
          Want to effortlessly auto track your job hunting progress (with manual
          override)? Grant permission in next step.
        </h2>
        <div className="center-image">
          <img src="../../../src/assets/images/mock_permission.png" />
        </div>
        <div className="right-align-container">
          <Button
            type="primary"
            onClick={this.handleGoogleSignUp}
            style={this.rightButtonStyle}
          >
            {" "}
            Next
          </Button>
        </div>
        <div className="explanation">
          We strictly follow privacy laws and Google’s policy. JobHax does NOT
          read, store, or share your emails in any way.{" "}
        </div>
        <div className="explanation">
          You can also{" "}
          <a
            onClick={() =>
              this.setState({
                isEmailSignUpRequested: true,
                user_type: USER_TYPES["public"],
                college_id: null,
                college: "",
                collegeList: [],
                major: "",
                grad_year: null,
                alumniEmployment: true,
                company: "",
                job_title: "",
                country: "",
                stateOrProvince: "",
                googleAccessToken: "",
                photoUrl: ""
              })
            }
          >
            sign up with email
          </a>{" "}
          and manually enter and update your job applications.{" "}
        </div>
        <div className="existing-account-question">
          Already have an account? <Link to="/signin">Log in!</Link>
        </div>
      </div>
    );
  }

  generateSignUp() {
    return (
      <div className="sign-up-big-form-container">
        <div className="content-container">
          {this.state.isEmailSignUpRequested === true
            ? this.generateSignUpForm()
            : this.state.isEmailSignUpRequested === "informed"
            ? this.generatePermissionInfoStep()
            : this.generateStepOne()}
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
            onClick={() => this.setState({ level: "basicInfo" })}
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
                this.setState({
                  level: "linkedin",
                  user_type: USER_TYPES["public"]
                })
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
                  level: "student",
                  user_type: USER_TYPES["student"]
                })
              }
              style={this.nextButtonStyle}
            >
              University Portal
            </Button>
          </div>
        </div>
        <div>{this.generateBackButton("basicInfo")}</div>
      </div>
    );
  }

  universityChoices(snippet, type, title, level) {
    return (
      <div>
        <div className="level-body">{snippet}</div>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={() =>
              this.setState({ level: level, user_type: USER_TYPES[type] })
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
            "Student",
            "student"
          )}
        </div>
        <div>
          {this.universityChoices(
            "Use your experience to guide students towards their career goals.",
            "alumni",
            "Alumni",
            "alumni"
          )}
        </div>
        <div>
          {this.universityChoices(
            "Connect with your cohort to providetargeted assistance & track progress.",
            "career_services",
            "Career Services",
            "career_services"
          )}
        </div>
        <div>{this.generateBackButton("user_type")}</div>
      </div>
    );
  }

  generateLevelStudent() {
    return (
      <div>
        <div className="level-title">Connect with your College</div>
        <div className="level-body">Please enter your College:</div>
        <div>
          <AutoComplete
            style={this.currentStyle(this.state.college, "")}
            dataSource={this.state.collegeAutoCompleteData}
            onSearch={value => this.handleAutoCompleteSearch(value, "colleges")}
            placeholder="ex. Stanford University"
            value={this.state.college && this.state.college}
            onSelect={value => this.setState({ college: value })}
          />
        </div>
        <div className="level-body">Please enter your Major:</div>
        <div>
          <AutoComplete
            style={this.currentStyle(this.state.major, "")}
            dataSource={this.state.majorAutoCompleteData}
            onSearch={value => this.handleAutoCompleteSearch(value, "majors")}
            placeholder="ex. Computer Science"
            value={this.state.major && this.state.major}
            onSelect={value => this.setState({ major: value })}
          />
        </div>
        <div
          className="level-body"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "240px",
            margin: "0 0 8px 12px"
          }}
        >
          <div>Expected Graduation Year:</div>
          {this.state.mustInputEmphasis === true &&
            this.state.grad_year === null && (
              <div style={{ color: "red" }}>*</div>
            )}
          <Dropdown
            overlay={() => this.generateGradYearDropdown(50, 1)}
            placement="bottomCenter"
          >
            <a
              className="ant-dropdown-link"
              style={{ color: "rgba(100, 100, 100, 0.9)" }}
            >
              {this.state.grad_year != null ? this.state.grad_year : "Select"}{" "}
              <Icon type="down" />
            </a>
          </Dropdown>
        </div>
        <div style={{ marginTop: 8 }}>
          <Button
            type="primary"
            onClick={() =>
              this.checkMustInputs(
                [this.state.college, this.state.major, this.state.grad_year],
                "linkedin"
              )
            }
            style={this.nextButtonStyle}
          >
            Next
          </Button>
        </div>
        <div>{this.generateBackButton("user_type")}</div>
      </div>
    );
  }

  setCountryOrStateList(event, state_type, id_type) {
    if (
      state_type == "country" &&
      this.state.country != "" &&
      this.state.country != event.item.props.children
    ) {
      let emptyList = [];
      this.setState({
        stateOrProvince: "",
        state_id: null,
        stateOrProvinceList: emptyList
      });
    }
    this.setState({
      [state_type]: event.item.props.children,
      [id_type]: parseInt(event.key)
    });
    if (state_type == "country") {
      this.handleAutoCompleteSearch(parseInt(event.key), "stateOrProvince");
    }
  }

  generateLevelBasicInfo() {
    const nextLevel =
      this.props.signupType === "alumni" ? "alumni" : "user_type";
    const mustInputsList =
      this.state.stateOrProvinceList.length > 0
        ? [
            this.state.first_name,
            this.state.last_name,
            this.state.country,
            this.state.stateOrProvince
          ]
        : [this.state.first_name, this.state.last_name, this.state.country];
    const menu = (state_type, id_type, data_list) => (
      <Menu
        onClick={event =>
          this.setCountryOrStateList(event, state_type, id_type)
        }
        style={{
          width: "240px",
          maxHeight: "260px",
          textAlign: "center",
          overflowX: "hidden"
        }}
      >
        {data_list.map(data => (
          <Menu.Item key={data.id}>{data.name}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div>
        <div className="level-title">Tell Us More About Yourself</div>
        <div className="level-body">Please enter your First Name:</div>
        <div>
          <Input
            placeholder="John"
            value={this.state.first_name && this.state.first_name}
            style={this.currentStyle(this.state.first_name, "")}
            onChange={event =>
              this.setState({ first_name: event.target.value })
            }
          />
        </div>
        <div className="level-body">Please enter your Last Name:</div>
        <div>
          <Input
            placeholder="Doe"
            value={this.state.last_name && this.state.last_name}
            style={this.currentStyle(this.state.last_name, "")}
            onChange={event => this.setState({ last_name: event.target.value })}
          />
        </div>
        <div className="level-body">
          <div style={{ padding: "0 4px 8px 0" }}>Where do you live?</div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            {this.state.mustInputEmphasis === true &&
              this.state.country == "" && <div style={{ color: "red" }}>*</div>}
            <Dropdown
              overlay={menu("country", "country_id", this.state.countryList)}
              placement="bottomCenter"
            >
              <a
                className="ant-dropdown-link"
                style={{ color: "rgba(100, 100, 100, 0.9)" }}
                onMouseEnter={() =>
                  this.state.countryList.length == 0 &&
                  this.handleAutoCompleteSearch(null, "countries")
                }
              >
                {this.state.country != "" || null
                  ? this.state.country
                  : "Please Select a Country"}{" "}
                <Icon type="down" />
              </a>
            </Dropdown>
          </div>
          {this.state.country_id != null &&
            this.state.stateOrProvinceList.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "8px 0 8px 0"
                }}
              >
                {this.state.mustInputEmphasis === true &&
                  this.state.stateOrProvince === "" && (
                    <div style={{ color: "red" }}>*</div>
                  )}
                <Dropdown
                  overlay={menu(
                    "stateOrProvince",
                    "state_id",
                    this.state.stateOrProvinceList
                  )}
                  placement="bottomCenter"
                >
                  <a
                    className="ant-dropdown-link"
                    style={{
                      color: "rgba(100, 100, 100, 0.9)",
                      margin: "0 0 8px 0"
                    }}
                  >
                    {this.state.stateOrProvince != "" || null
                      ? this.state.stateOrProvince
                      : "Select a State/Province"}{" "}
                    <Icon type="down" />
                  </a>
                </Dropdown>
              </div>
            )}
        </div>
        <div style={{ marginTop: 8 }}>
          <Button
            type="primary"
            onClick={() => this.checkMustInputs(mustInputsList, nextLevel)}
            style={this.nextButtonStyle}
          >
            Next
          </Button>
        </div>
        <div>{this.generateBackButton("intro")}</div>
      </div>
    );
  }

  checkMustInputs(mustInputs, level) {
    let x = mustInputs.length;
    let y = 0;
    for (let i = 0; i < x; i++) {
      if (mustInputs[i] != null) {
        if (mustInputs[i].toString().trim() != "") {
          y = y + 1;
        }
      }
    }
    if (x == y) {
      this.setState({ level: level, mustInputEmphasis: false });
    } else {
      this.setState({ mustInputEmphasis: true });
      this.props.alert(3000, "error", "You have to fill out all form!");
    }
  }

  onAlumniEmploymentSwitch(checked) {
    this.setState({ alumniEmployment: checked });
  }

  handleCompanySearch(value) {
    this.setState({ company: value });
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
        let bufferList = [];
        response.data.forEach(company => bufferList.push(company.name));
        this.setState({
          companyAutoCompleteData: bufferList
        });
      }
    });
  }

  generateUrlForGetData(value, type) {
    if (type === "majors") {
      this.setState({ major: value });
      let newUrl = AUTOCOMPLETE(type) + "?q=" + value;
      return newUrl;
    } else if (type === "positions") {
      let newUrl = AUTOCOMPLETE(type) + "?q=" + value + "&count=5";
      this.setState({ job_title: value });
      return newUrl;
    } else if (type === "colleges") {
      let newUrl = AUTOCOMPLETE(type) + "?q=" + value;
      this.setState({ college: value });
      return newUrl;
    } else if (type === "countries") {
      let newUrl = AUTOCOMPLETE(type);
      return newUrl;
    } else if (type === "stateOrProvince") {
      let newUrl = AUTOCOMPLETE("countries") + value + "/states/";
      return newUrl;
    }
  }

  async handleAutoCompleteSearch(value, type) {
    let config = { method: "GET" };
    let newUrl = await this.generateUrlForGetData(value, type);
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          let bufferList = [];
          if (type === "majors") {
            response.data.data.forEach(element =>
              bufferList.push(element.name)
            );
            this.setState({ majorAutoCompleteData: bufferList });
          } else if (type === "positions") {
            response.data.data.forEach(element =>
              bufferList.push(element.job_title)
            );
            this.setState({ positionAutoCompleteData: bufferList });
          } else if (type === "colleges") {
            response.data.data.forEach(element =>
              bufferList.push(`${element.alpha_two_code} - ${element.name}`)
            );
            this.setState({
              collegeAutoCompleteData: bufferList
            });
            if (response.data.data.length > 0) {
              let collegeList = response.data.data;
              this.setState({
                collegeList: collegeList,
                college_id: collegeList[0].id
              });
            }
          } else if (type === "countries") {
            let countriesList = response.data.data;
            this.setState({ countryList: countriesList });
          } else if (type === "stateOrProvince") {
            let statesList = response.data.data;
            this.setState({ stateOrProvinceList: statesList });
          }
        }
      }
    });
  }

  generateAlumniEmploymentForm() {
    return (
      <div>
        <div>
          <AutoComplete
            dataSource={this.state.companyAutoCompleteData}
            style={this.narrowInputStyle}
            onSearch={this.handleCompanySearch}
            placeholder="Company Name"
            value={this.state.company && this.state.company}
            onSelect={value => this.setState({ company: value })}
          />
        </div>
        <div>
          <AutoComplete
            style={this.narrowInputStyle}
            dataSource={this.state.positionAutoCompleteData}
            onSearch={value =>
              this.handleAutoCompleteSearch(value, "positions")
            }
            placeholder="Job Title"
            value={this.state.job_title && this.state.job_title}
            onSelect={value => this.setState({ job_title: value })}
          />
        </div>
      </div>
    );
  }

  generateGradYears(amount, direction) {
    let yearList = [];
    for (let i = 0; i <= amount - 1; i++) {
      yearList.push(new Date().getFullYear() + i * direction);
    }
    return yearList.map(year => <Menu.Item key={year}>{year}</Menu.Item>);
  }

  handleGradYearSelection(event) {
    let year = event.item.props.children;
    this.setState({ grad_year: year });
  }

  generateGradYearDropdown(amount, direction) {
    return (
      <Menu
        onClick={this.handleGradYearSelection}
        style={{
          width: "68px",
          maxHeight: "260px",
          textAlign: "center",
          overflowX: "hidden"
        }}
      >
        {this.generateGradYears(amount, direction)}
      </Menu>
    );
  }

  generateLevelAlumni() {
    return (
      <div>
        <div className="level-title">Connect with your College</div>
        <div className="level-body">Please enter your College:</div>
        <div>
          <AutoComplete
            style={this.currentStyle(this.state.college, "")}
            dataSource={this.state.collegeAutoCompleteData}
            onSearch={value => this.handleAutoCompleteSearch(value, "colleges")}
            placeholder="ex. Stanford University"
            value={this.state.college && this.state.college}
            onSelect={value => this.setState({ college: value })}
          />
        </div>
        <div className="level-body">Please enter your Major:</div>
        <div>
          <AutoComplete
            style={this.currentStyle(this.state.major, "")}
            dataSource={this.state.majorAutoCompleteData}
            onSearch={value => this.handleAutoCompleteSearch(value, "majors")}
            placeholder="ex. Computer Science"
            value={this.state.major && this.state.major}
            onSelect={value => this.setState({ major: value })}
          />
        </div>
        <div
          className="level-body"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "240px",
            margin: "0 0 8px 12px"
          }}
        >
          <div>Graduation Year:</div>
          {this.state.mustInputEmphasis === true &&
            this.state.grad_year === null && (
              <div style={{ color: "red" }}>*</div>
            )}
          <Dropdown
            overlay={() => this.generateGradYearDropdown(50, -1)}
            placement="bottomCenter"
          >
            <a
              className="ant-dropdown-link"
              style={{ color: "rgba(100, 100, 100, 0.9)" }}
            >
              {this.state.grad_year != null ? this.state.grad_year : "Select"}{" "}
              <Icon type="down" />
            </a>
          </Dropdown>
        </div>
        <div
          className="level-body"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "240px",
            margin: "0 0 0 12px"
          }}
        >
          Currently Employed?
          <Switch
            defaultChecked={this.state.alumniEmployment}
            onChange={this.onAlumniEmploymentSwitch}
          />
        </div>
        {this.state.alumniEmployment && this.generateAlumniEmploymentForm()}
        <div style={{ marginTop: 8 }}>
          <Button
            type="primary"
            onClick={() =>
              this.checkMustInputs(
                [this.state.college, this.state.major, this.state.grad_year],
                "linkedin"
              )
            }
            style={this.nextButtonStyle}
          >
            Next
          </Button>
        </div>
        <div>{this.generateBackButton("basicInfo")}</div>
      </div>
    );
  }

  linkedInOAuthRequest() {
    linkedInOAuth();
    this.setState({ level: "submit" });
  }

  generateLevelLinkedIn() {
    const level =
      this.state.user_type == USER_TYPES["public"]
        ? "user_type"
        : Object.assign(
            {},
            ...Object.entries(USER_TYPES).map(([a, b]) => ({ [b]: a }))
          )[this.state.user_type];
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

  generateAdditionalInfoForms() {
    switch (this.state.level) {
      case "intro":
        return this.generateLevelIntro();
      case "basicInfo":
        return this.generateLevelBasicInfo();
      case "user_type":
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
    }
  }

  render() {
    const { redirect } = this.state;
    if (redirect !== null) {
      return <Redirect to={redirect} />;
    }
    window.onpopstate = () => {
      this.setState({ redirect: "/action?type=redirect&" + location.pathname });
    };
    return (
      <div>
        <div className="sign_up-vertical-container">
          <div className="sign_up-container">
            {this.state.level === "undefined" ? (
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
