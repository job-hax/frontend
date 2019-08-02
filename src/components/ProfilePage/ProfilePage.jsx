import React from "react";
import { Upload, message, Button, Icon, DatePicker } from "antd";
import ReactTelInput from "react-telephone-input";
import moment from "moment";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import NotificationsBox from "../Partials/NotificationsBox/NotificationsBox.jsx";
import {
  makeTimeBeautiful,
  IS_CONSOLE_LOG_OPEN
} from "../../utils/constants/constants.js";
import { linkedInOAuth } from "../../utils/helpers/oAuthHelperFunctions.js";
import { apiRoot } from "../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import {
  notificationsRequest,
  getEmploymentStatusesRequest,
  updateProfileRequest,
  getProfileRequest,
  updateProfilePhotoRequest
} from "../../utils/api/requests.js";

import "./react-datepicker.scss";
import "./style.scss";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      isUpdating: false,
      isDataArrived: false,
      isUpdated: false,
      isProfileSettingsOpen: false,
      isNotificationsChecking: true,
      notificationsList: [],
      employmentStatusList: [],
      selectedDateShowing: new Date(),
      data: [],
      body: {},
      isInitialRequest: "beforeRequest"
    };

    this.body = {};
    this.settingsBody = {};
    this.checkNotifications = this.checkNotifications.bind(this);
    this.getEmploymentStatuses = this.getEmploymentStatuses.bind(this);
    this.getProfileData = this.getProfileData.bind(this);
    this.handleGenderClick = this.handleGenderClick.bind(this);
    this.handleStatusClick = this.handleStatusClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
    this.handleSettingsSubmit = this.handleSettingsSubmit.bind(this);
    this.handleStudentMailChange = this.handleStudentMailChange.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.handleProfilePhotoUpdate = this.handleProfilePhotoUpdate.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != "") {
      await this.props.handleTokenExpiration("profilePage componentDidMount");
      this.checkNotifications();
      this.getEmploymentStatuses();
      this.getProfileData(false);
    }
  }

  async getProfileData(isTokenExpirationChecking) {
    if (this.state.data.length == 0) {
      isTokenExpirationChecking &&
        (await this.props.handleTokenExpiration("profilePage getProfileData"));
      axiosCaptcha(getProfileRequest.url, getProfileRequest.config).then(
        response => {
          if (response.statusText === "OK") {
            this.data = response.data.data;
            this.setState({
              data: this.data,
              isUpdated: true,
              isInitialRequest: false
            });
            if (this.data.dob) {
              this.setState({
                selectedDateShowing: new Date(this.data.dob + "T06:00:00")
              });
            }
            IS_CONSOLE_LOG_OPEN &&
              console.log("profile page received data", this.state.data);
          }
        }
      );
    }
  }

  checkNotifications() {
    axiosCaptcha(notificationsRequest.url, notificationsRequest.config).then(
      response => {
        if (response.statusText === "OK") {
          this.notificationsList = response.data.data;
          this.setState({
            notificationsList: this.notificationsList,
            isNotificationsChecking: false
          });
        }
      }
    );
  }

  getEmploymentStatuses() {
    axiosCaptcha(
      getEmploymentStatusesRequest.url,
      getEmploymentStatusesRequest.config
    ).then(response => {
      if (response.statusText === "OK") {
        this.employmentStatusList = response.data.data;
        this.setState({
          employmentStatusList: this.employmentStatusList,
          isNotificationsChecking: false
        });
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.submitProfileUpdate(event.target);
  }

  async submitProfileUpdate(target) {
    console.log(target);
    await this.props.handleTokenExpiration("profilePage submitProfileUpdate");
    this.setState({
      isUpdating: true
    });
    if (target[6].value.trim() != (null || "")) {
      this.body["first_name"] = target[6].value.trim();
    }
    if (target[7].value.trim() != (null || "")) {
      this.state.body[" last_name"] = target[7].value.trim();
    }
    updateProfileRequest.config.body = this.body;
    axiosCaptcha(
      updateProfileRequest.url,
      updateProfileRequest.config,
      "update_profile"
    ).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success === true) {
          this.data = response.data.data;
          this.setState({
            data: this.data,
            isUpdating: false,
            isEditing: false,
            isUpdated: true
          });
          this.props.alert(
            5000,
            "success",
            "Your profile have been updated successfully!"
          );
          this.props.setIsFirstLogin(true);
        } else {
          this.setState({ isUpdating: false });
          this.props.alert(
            5000,
            "error",
            "Error: " + response.data.error_message
          );
        }
      } else {
        this.setState({ isUpdating: false });
        this.props.alert(5000, "error", "Something went wrong!");
      }
    });
    this.body = {};
  }

  handleSettingsSubmit(event) {
    event.preventDefault();
    this.submitSettingsUpdate(event.target);
  }

  async submitSettingsUpdate(target) {
    await this.props.handleTokenExpiration("profilePage submitSettingsUpdate");
    if (target[1].value === target[2].value) {
      this.setState({ isUpdating: true });
      if (target[1].value != (null || "")) {
        this.settingsBody["password"] = target[1].value;
      }
      if (target[0].value != (null || "")) {
        this.settingsBody["username"] = target[0].value;
      }
      updateProfileRequest.config.body = this.settingsBody;
      axiosCaptcha(
        updateProfileRequest.url,
        updateProfileRequest.config,
        "update_profile"
      ).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success === true) {
            this.data = response.data.data;
            this.setState({
              data: this.data,
              isUpdating: false,
              isProfileSettingsOpen: false,
              isUpdated: true
            });
            this.props.alert(
              5000,
              "success",
              "Your settings have been updated successfully!"
            );
          } else {
            this.setState({ isUpdating: false });
            this.props.alert(
              5000,
              "error",
              "Error:" + response.data.error_message
            );
          }
        } else {
          this.setState({ isUpdating: false });
          this.props.alert(5000, "error", "Something went wrong!");
        }
      });
      this.settingsBody = {};
    } else
      this.props.alert(
        5000,
        "error",
        "Passwords are not matching!\n Please enter the same password."
      );
  }

  handlePhoneNumberChange(telNumber) {
    this.body["phone_number"] = telNumber;
  }

  handleStudentMailChange(event) {
    this.body["student_email"] =
      event.target.value.trim() + "@students.itu.edu";
  }

  handleGenderClick(event) {
    this.body["gender"] = event.target.value;
  }

  handleStatusClick(event) {
    this.body["emp_status_id"] = Number(event.target.value);
  }

  handleDatePickerChange(event) {
    this.setState({ selectedDateShowing: event });
    this.body["dob"] = event.toISOString().split("T")[0];
  }

  async handleProfilePhotoUpdate(file) {
    if (
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg"
    ) {
      if (file.size < 1024 * 1024 * 2) {
        this.props.alert(5000, "info", "Photo is being uploaded!");
        await this.props.handleTokenExpiration(
          "profilePage handleProfilePhotoUpdate"
        );
        let bodyFormData = new FormData();
        bodyFormData.append("photo", file);
        updateProfilePhotoRequest.config.body = bodyFormData;
        axiosCaptcha(
          updateProfilePhotoRequest.url,
          updateProfilePhotoRequest.config
        ).then(response => {
          if (response.statusText === "OK") {
            if (response.data.success === true) {
              this.data = response.data.data;
              this.setState({ data: this.data });
              this.props.setProfilePhotoUrlInHeader();
              this.props.alert(
                5000,
                "success",
                "Your profile have been updated successfully!"
              );
              this.props.setIsFirstLogin(true);
            } else {
              this.setState({ isUpdating: false });
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
      } else {
        this.props.alert(
          3000,
          "error",
          "Profile photo must be smaller than 2MB!"
        );
      }
    } else {
      this.props.alert(
        3000,
        "error",
        "Profile photo must be PNG, JPG or JPEG!"
      );
    }
  }

  generateNonEditableProfileMainArea() {
    const props = {
      name: "file",
      showUploadList: false,
      action: file => {
        this.handleProfilePhotoUpdate(file);
      }
    };

    return (
      <div className="profile-page-left">
        <div className="profile-page-left-first">
          <div className="profile-page-left-first-inside">
            <div className="profile-image">
              {this.state.data.length != 0 && (
                <img
                  src={
                    this.state.data.profile_photo_custom == null
                      ? this.state.data.profile_photo_social
                        ? this.state.data.profile_photo_social
                        : "../../src/assets/icons/SeyfoIcon@3x.png"
                      : apiRoot + this.state.data.profile_photo_custom
                  }
                />
              )}
            </div>
            <div className="profile-image-update-container">
              <div>
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> Update Profile Photo
                  </Button>
                </Upload>
              </div>
            </div>
            <div className="register-date">
              {this.state.data.length != 0 &&
                this.state.data.user.date_joined && (
                  <span>
                    Registered on{" "}
                    {makeTimeBeautiful(
                      this.state.data.user.date_joined,
                      "date"
                    )}
                  </span>
                )}
            </div>
            <div className="professional-info-container">
              <div className="professional-info-header">
                <img id="workIcon" />
                Work
              </div>
              <div className="professional-info-title">
                <div className="professional-bio-content">professional bio</div>
              </div>
              <div className="core-skills-title">
                <div className="core-skills-content">professional bio</div>
              </div>
            </div>
            <div className="employment-status-container">
              <div className="employment-status-label">Employment Status: </div>
              <div className="employment-status-content">
                {this.state.data.length != 0 && this.state.data.emp_status ? (
                  this.state.data.emp_status.value
                ) : (
                  <span className="not-specified-notice">Not specified!</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="profile-page-main">
          <div className="profile-header">
            <div className="name">
              <div className="first-name">
                {this.state.data.length != 0 &&
                this.state.data.user.first_name ? (
                  this.state.data.user.first_name
                ) : (
                  <span>First Name</span>
                )}
              </div>
              <div className="last-name">
                {this.state.data.length != 0 &&
                this.state.data.user.last_name ? (
                  this.state.data.user.last_name
                ) : (
                  <span>Last Name</span>
                )}
              </div>
            </div>
            <div className="job-position" onClick={() => linkedInOAuth()}>
              <Button type="primary">Sync With LinkedIn</Button>
            </div>
            <div className="city-state" />
          </div>
          <div className="profile-info">
            <div className="info-header">
              <div className="info-type-icon">
                <img id="infoTypeIcon" />
              </div>
              <div className="info-type-name">About</div>
            </div>
            <div className="info-content-container">
              <div className="info-content-title">Basic Information</div>
              <div className="info-content-body">
                <div className="info-content-body-item">
                  <div className="info-content-body-item-label">Birthday:</div>
                  <div className="info-content-body-item-text">
                    {this.state.data.length != 0 && this.state.data.dob ? (
                      makeTimeBeautiful(this.state.data.dob + "T", "date")
                    ) : (
                      <span className="not-specified-notice">
                        Not specified!
                      </span>
                    )}
                  </div>
                </div>
                <div className="info-content-body-item">
                  <div className="info-content-body-item-label">Gender:</div>
                  <div className="info-content-body-item-text">
                    {this.state.data.length != 0 && this.state.data.gender ? (
                      this.state.data.gender == "F" ? (
                        "Female"
                      ) : (
                        "Male"
                      )
                    ) : (
                      <span className="not-specified-notice">
                        Not specified!
                      </span>
                    )}
                  </div>
                </div>
                <div className="info-content-body-item">
                  <div className="info-content-body-item-label">Email:</div>
                  <div className="info-content-body-item-text">
                    {this.state.data.length != 0 &&
                    this.state.data.user.email ? (
                      this.state.data.user.email
                    ) : (
                      <span className="not-specified-notice">
                        Not specified!
                      </span>
                    )}
                  </div>
                </div>
                <div className="info-content-body-item">
                  <div className="info-content-body-item-label">
                    Student email:
                  </div>
                  <div className="info-content-body-item-text">
                    {this.state.data.length != 0 &&
                    this.state.data.student_email ? (
                      this.state.data.student_email
                    ) : (
                      <span className="not-specified-notice">
                        Not specified!
                      </span>
                    )}
                  </div>
                </div>
                <div className="info-content-body-item">
                  <div className="info-content-body-item-label">Phone:</div>
                  <div className="info-content-body-item-text">
                    {this.state.data.length != 0 &&
                    this.state.data.phone_number ? (
                      this.state.data.phone_number
                    ) : (
                      <span className="not-specified-notice">
                        Not specified!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="city-state" />
          </div>
          <div className="badges-container">
            <div className="badges-header">
              <img id="badgesTitleIcon" />
              Badges
            </div>
            <div className="badge-icons-container">
              <img className="badge" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  mapEmploymentStatuses() {
    return this.state.employmentStatusList.map(status => (
      <div key={status.id}>
        <label>
          <input
            type="radio"
            name="status"
            value={status.id}
            onClick={this.handleStatusClick}
          />{" "}
          {status.value}{" "}
        </label>
      </div>
    ));
  }

  generateEditableProfileMainArea() {
    const props = {
      name: "file",
      showUploadList: false,
      action: file => {
        this.handleProfilePhotoUpdate(file);
      }
    };
    const dateFormat = "MM.DD.YYYY";
    const { selectedDateShowing } = this.state;

    return (
      <div className="profile-page-left">
        <form className="profile-page-left" onSubmit={this.handleSubmit}>
          <div className="profile-page-left-first">
            <div className="profile-page-left-first-inside">
              <div className="profile-image">
                {this.state.data.length != 0 && (
                  <img
                    src={
                      this.state.data.profile_photo_custom == null
                        ? this.state.data.profile_photo_social
                          ? this.state.data.profile_photo_social
                          : "../../src/assets/icons/SeyfoIcon@3x.png"
                        : apiRoot + this.state.data.profile_photo_custom
                    }
                  />
                )}
              </div>
              <div className="profile-image-update-container">
                <div>
                  <Upload {...props}>
                    <Button>
                      <Icon type="upload" /> Update Profile Photo
                    </Button>
                  </Upload>
                </div>
              </div>
              <div className="register-date">
                <span>Registered on </span>
                {this.state.data.length != 0 &&
                  this.state.data.user.date_joined &&
                  makeTimeBeautiful(this.state.data.user.date_joined, "date")}
              </div>
              <div className="professional-info-container">
                <div className="professional-info-header">
                  <img id="workIcon" />
                  Work
                </div>
                <div className="professional-info-title">
                  <div className="professional-bio-content">
                    professional bio
                  </div>
                </div>
                <div className="core-skills-title">
                  <div className="core-skills-content">professional bio</div>
                </div>
              </div>
              <div className="employment-status-container">
                <div className="employment-status-label">
                  Employment Status:{" "}
                </div>
                <div className="employment-status-content">
                  {this.mapEmploymentStatuses()}
                </div>
              </div>
            </div>
          </div>
          <div className="profile-page-main">
            <div className="profile-header">
              <div className="name">
                <div className="first-name">
                  <label>
                    First Name:
                    <input
                      className="first-name"
                      placeholder={
                        this.state.data.length != 0 &&
                        this.state.data.user.first_name
                          ? this.state.data.user.first_name
                          : "First Name"
                      }
                    />
                  </label>
                </div>
                <div className="last-name">
                  <label>
                    Last Name:
                    <input
                      className="last-name"
                      placeholder={
                        this.state.data.length != 0 &&
                        this.state.data.user.last_name
                          ? this.state.data.user.last_name
                          : "Last Name"
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="job-position" />
              <div className="city-state" />
            </div>
            <div className="profile-info">
              <div className="info-header">
                <div className="info-type-icon">
                  <img id="infoTypeIcon" />
                </div>
                <div className="info-type-name">About</div>
              </div>
              <div className="info-content-container">
                <div className="info-content-title">Basic Information</div>
                <div className="info-content-body">
                  <div className="info-content-body-item">
                    <div className="info-content-body-item-label">
                      Birthday:
                    </div>
                    <div style={{ zIndex: 99 }}>
                      <DatePicker
                        onChange={this.handleDatePickerChange}
                        defaultValue={moment(selectedDateShowing, dateFormat)}
                        format={dateFormat}
                        style={{ width: "168px", margin: "-6px 0 6px 0" }}
                      />
                    </div>
                  </div>
                  <div className="info-content-body-item">
                    <div className="info-content-body-item-label">Gender:</div>
                    <div className="info-content-body-item-text">
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="F"
                          onClick={this.handleGenderClick}
                        />{" "}
                        Female{" "}
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="M"
                          onClick={this.handleGenderClick}
                        />{" "}
                        Male{" "}
                      </label>
                    </div>
                  </div>
                  <div className="info-content-body-item">
                    <div className="info-content-body-item-label">Email:</div>
                    <div className="info-content-body-item-text">
                      {this.state.data.length != 0 &&
                      this.state.data.user.email ? (
                        this.state.data.user.email
                      ) : (
                        <span className="not-specified-notice">
                          Not specified!
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="info-content-body-item">
                    <div className="info-content-body-item-label">
                      Student email:
                    </div>
                    <div className="info-content-body-item-text">
                      <label>
                        <input
                          className="input"
                          onChange={this.handleStudentMailChange}
                          placeholder={
                            this.state.data.length != 0 &&
                            this.state.data.student_email
                              ? this.state.data.student_email.split("@")[0]
                              : "your student email"
                          }
                        />{" "}
                        @students.itu.edu
                      </label>
                    </div>
                  </div>
                  <div className="info-content-body-item">
                    <div className="info-content-body-item-label">Phone:</div>
                    <div
                      className="info-content-body-item-text"
                      style={{ width: 168, height: 28 }}
                    >
                      <ReactTelInput
                        defaultCountry="us"
                        preferredCountries={["us"]}
                        value={this.state.data.phone_number}
                        flagsImagePath={require("../../assets/icons/flags.png")}
                        onChange={this.handlePhoneNumberChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="save-button-container">
                <button className="save-button" type="submit">
                  Save
                </button>
              </div>
            </div>
            <div className="badges-container">
              <div className="badges-header">
                <img id="badgesTitleIcon" />
                Badges
              </div>
              <div className="badge-icons-container">
                <img className="badge" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  render() {
    const notificationsBoxHeight = this.state.isProfileSettingsOpen
      ? { height: "200px" }
      : { height: "fit-content" };

    const heightForSettings = this.state.isProfileSettingsOpen
      ? { height: "320px" }
      : { height: "480px" };

    const customNotificationsBoxStyle = {
      boxShadow: "none",
      borderRadius: "16px",
      border: "1px solid rgba(126, 126, 126, 0.4)",
      marginLeft: "36px",
      zIndex: 0,
      notificationsBoxHeight,
      position: "relative"
    };
    IS_CONSOLE_LOG_OPEN &&
      console.log("profile pagerender run! \n data:", this.state.data);
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    if (this.state.data.length == 0) {
      return <Spinner message="Reaching profile data..." />;
    }
    if (this.state.isUpdating) {
      return <Spinner message="Updating your profile data..." />;
    }
    return (
      <div className="profile-page-big-container">
        <div className="profile-page-medium-container">
          <div className="profile-page-container">
            {!this.state.isEditing
              ? this.generateNonEditableProfileMainArea()
              : this.generateEditableProfileMainArea()}
            <div className="profile-page-right">
              <div
                className="edit-button"
                onClick={() =>
                  this.setState({ isEditing: !this.state.isEditing })
                }
              >
                {!this.state.isEditing ? "Edit" : "Cancel"}
              </div>
              <div className="profile-notifications" style={heightForSettings}>
                <NotificationsBox
                  notificationsList={this.state.notificationsList}
                  customBoxStyle={customNotificationsBoxStyle}
                  itemListHeight={notificationsBoxHeight}
                />
              </div>
              <div className="to-do-list" />
              {this.state.isProfileSettingsOpen && (
                <div className="settings-container">
                  <div className="settings-header">
                    <div className="settings-icon">
                      <img />
                    </div>
                    <div className="settings-title">Profile Settings </div>
                  </div>
                  <form onSubmit={this.handleSettingsSubmit}>
                    <div className="settings">
                      <div className="setting">
                        <label>
                          User Name:
                          {this.state.data.length != 0 &&
                          this.state.data.user.username
                            ? " " + this.state.data.user.username
                            : " Get one!"}
                          <input
                            defaultValue=""
                            placeholder="Enter a new username"
                          />
                        </label>
                      </div>
                      <div className="setting">
                        <label>
                          Password:
                          <input
                            type="password"
                            defaultValue=""
                            placeholder="Enter a new password"
                          />
                        </label>
                      </div>
                      <div className="setting">
                        <label>
                          Password:
                          <input
                            type="password"
                            defaultValue=""
                            placeholder="Retype the new password"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="settings-buttons-container">
                      <div
                        onClick={() =>
                          this.setState({ isProfileSettingsOpen: false })
                        }
                      >
                        <button className="settings-editing-button">
                          Cancel
                        </button>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="settings-editing-button"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              {!this.state.isProfileSettingsOpen && (
                <div
                  className="settings-button"
                  onClick={() =>
                    this.setState({
                      isProfileSettingsOpen: !this.state.isProfileSettingsOpen
                    })
                  }
                >
                  Profile Settings
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfilePage;
