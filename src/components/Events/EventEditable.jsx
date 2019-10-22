import React from "react";
import { Redirect } from "react-router-dom";
import {
  Icon,
  Button,
  Affix,
  Input,
  Upload,
  message,
  Checkbox,
  DatePicker,
  Tag,
  Dropdown,
  Menu
} from "antd";
import parse from "html-react-parser";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Geosuggest from "react-geosuggest";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import moment from "moment";

import {
  IS_CONSOLE_LOG_OPEN,
  USER_TYPES,
  errorMessage,
  DATE_AND_TIME_FORMAT,
  LONG_DATE_FORMAT
} from "../../utils/constants/constants";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { apiRoot, EVENTS } from "../../utils/constants/endpoints";
import Map from "../Metrics/SubComponents/Map/Map.jsx";
import Spinner from "../Partials/Spinner/Spinner.jsx";

import "./style.scss";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

class EventEditable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInitialRequest: true,
      redirect: null,
      user_type: this.props.cookie("get", "user_type"),
      event_types: null,
      shareStudents:
        this.props.event.user_types &&
        this.props.event.user_types
          .map(userType => userType.id)
          .includes(USER_TYPES["student"]),
      shareAlumni:
        this.props.event.user_types &&
        this.props.event.user_types
          .map(userType => userType.id)
          .includes(USER_TYPES["alumni"]),
      isLinkDisplaying: false,
      created_at: this.props.event.created_at,
      details: this.props.event.details,
      event_date_start: this.props.event.event_date_start,
      event_date_end: this.props.event.event_date_end,
      id: this.props.event.id,
      event_type: this.props.event.event_type,
      header_image: this.props.event.header_image,
      is_publish: false,
      title: this.props.event.title,
      location_address: this.props.event.location_address,
      location_title: this.props.event.location_title,
      location_lat: this.props.event.location_lat,
      location_lon: this.props.event.location_lon,
      spot_count: this.props.event.spot_count,
      short_description: this.props.event.short_description,
      host_user: this.props.event.host_user,
      updated_at: this.props.event.updated_at,

      loading: false,
      formData: new FormData(),
      isEditingContent: true,
      isEditingDate: false,
      isEditingLocation: false,
      editorState: EditorState.createEmpty()
    };

    this.toggleEditable = this.toggleEditable.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handlePhotoUpdate = this.handlePhotoUpdate.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.onDateOk = this.onDateOk.bind(this);
    this.saveEventData = this.saveEventData.bind(this);
    this.postEventData = this.postEventData.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
    this.handleEventTypeClick = this.handleEventTypeClick.bind(this);

    this.isCareerService =
      this.state.user_type.id === USER_TYPES["career_services"];
  }

  componentDidMount() {
    const contentBlock = htmlToDraft(this.state.details);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState: editorState
      });
    }
    let config = { method: "GET" };
    axiosCaptcha(EVENTS + "types/", config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.setState({
            event_types: response.data.data,
            isInitialRequest: false
          });
        }
      }
    });
  }

  async postEventData() {
    await this.setState({ is_publish: true });
    this.saveEventData();
  }

  async saveEventData() {
    const {
      id,
      formData,
      is_publish,
      shareAlumni,
      shareStudents,
      event_type
    } = this.state;
    let user_types = [];
    if (shareAlumni) {
      user_types.push(USER_TYPES["alumni"]);
    }
    if (shareStudents) {
      user_types.push(USER_TYPES["student"]);
    }
    console.log(user_types);
    let toAdd = [
      "title",
      "short_description",
      "details",
      "is_publish",
      "event_date_start",
      "event_date_end",
      "location_address",
      "location_title",
      "location_lat",
      "location_lon",
      "spot_count"
    ];
    let config = id == null ? { method: "POST" } : { method: "PUT" };
    toAdd.forEach(entry => formData.append(entry, this.state[entry]));
    this.isCareerService && formData.append("user_types", user_types);
    event_type && formData.append("event_type_id", event_type.id);
    if (config.method == "PUT") {
      formData.append("event_id", id);
    }
    config.body = formData;
    config.headers = {};
    config.headers["Content-Type"] = "multipart/form-data";
    let response = await axiosCaptcha(EVENTS, config);
    if (response.statusText === "OK") {
      if (response.data.success === true) {
        let update_date = new Date().toISOString();
        this.setState({
          id: response.data.data.id,
          updated_at: update_date,
          is_publish: false
        });
        !is_publish
          ? this.props.alert(3000, "success", "Saved!")
          : this.isCareerService
          ? this.props.alert(3000, "success", "Published")
          : this.props.alert(
              3000,
              "success",
              "Your event has been sent for approval! Approval procedure may take several days!"
            );
        if (config.method == "POST") {
          let create_date = new Date().toISOString();
          this.setState({
            created_at: create_date
          });
        }
        if (this.isCareerService && this.props.userType) {
          this.props.handleModalCancel(this.props.userType);
        }
      } else {
        errorMessage(
          response.data.error_code + " " + response.data.error_message
        );
      }
    }
  }

  toggleEditable(type) {
    this.setState({
      [type]: !this.state[type]
    });
  }

  onChange(event) {
    event.persist();
    let type = event.target.id;
    let value = event.target.value;
    this.setState({ [type]: value, is_publish: false });
  }

  onEditorStateChange(editorState) {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.setState({
      editorState: editorState,
      details: html,
      is_publish: false
    });
  }

  handlePhotoUpdate(file) {
    let bodyFormData = new FormData();
    bodyFormData.append("header_image", file);
    this.setState({ formData: bodyFormData });
    getBase64(file, imageUrl =>
      this.setState({
        header_image: imageUrl,
        loading: false,
        is_publish: false
      })
    );
  }

  onDateOk(event) {
    IS_CONSOLE_LOG_OPEN && console.log(event);
    this.setState({
      event_date_start: event[0].toISOString(),
      event_date_end: event[1].toISOString(),
      isEditingDate: false
    });
  }

  onLocationSelect(suggest) {
    IS_CONSOLE_LOG_OPEN && console.log(suggest);
    let lat = suggest.location.lat;
    let lon = suggest.location.lng;
    let title = suggest.gmaps.name;
    let address = suggest.description;
    this.setState({
      location_address: address,
      location_lat: parseFloat(lat),
      location_lon: parseFloat(lon),
      location_title: title,
      isEditingLocation: false
    });
  }

  handleEventTypeClick(event) {
    let name = event.item.props.value;
    let id = parseFloat(event.key);
    let type = { id: id, name: name };
    this.setState({ event_type: type });
  }

  generateEventTypeDropdown() {
    const menu = () => (
      <Menu onClick={event => this.handleEventTypeClick(event)}>
        {this.state.event_types.map(type => (
          <Menu.Item key={type.id} value={type.name}>
            {type.name}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown overlay={menu()} placement="bottomCenter">
        <Button
          className="ant-dropdown-link"
          style={{
            margin: "-8px 0px 0px 0px",
            color: "rgba(0, 0, 0, 0.4)",
            borderColor: "rgb(217, 217, 217)"
          }}
        >
          {this.state.event_type ? this.state.event_type.name : "Please Select"}
          <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }

  generateEventHeader() {
    const {
      title,
      short_description,
      event_date_start,
      host_user,
      event_type
    } = this.state;
    const { event } = this.props;
    let photoUrl =
      host_user.profile_photo === ("" || null)
        ? "../../../src/assets/icons/User@3x.png"
        : apiRoot + host_user.profile_photo;
    let start_date_locale = moment(event_date_start).format(LONG_DATE_FORMAT);
    let day_locale = moment(event_date_start).format("DD");
    let month_locale = moment(event_date_start)
      .format("MMM")
      .toUpperCase();
    return (
      <div className="event-header">
        <div className="event-datebox">
          <div className="day">{day_locale}</div>
          <div className="month">{month_locale}</div>
        </div>
        <div className="event-info">
          <div className="event-date">{start_date_locale}</div>
          <div>
            <div
              style={{
                width: 668,
                overflow: "hidden",
                borderBottomRightRadius: 36
              }}
            >
              <TextArea
                placeholder="Add title..."
                autosize={{ minRows: 1, maxRows: 2 }}
                style={{
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                  minWidth: 668
                }}
                className="title"
                id="title"
                value={title}
                onChange={e => this.onChange(e)}
              />
            </div>
            <div
              style={{
                width: 668,
                overflow: "hidden",
                borderBottomRightRadius: 106
              }}
            >
              <TextArea
                placeholder="Add short description..."
                autosize={{ minRows: 2, maxRows: 4 }}
                style={{
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                  minWidth: 668
                }}
                className="short-description"
                id="short_description"
                value={short_description}
                onChange={e => this.onChange(e)}
              />
            </div>
          </div>
          <div className="host-info">
            <div className="host-photo">
              <img src={photoUrl} />
            </div>
            <div className="name">
              <div>Hosted by</div>
              <div className="host-name">
                {host_user.first_name + " " + host_user.last_name}
              </div>
            </div>
          </div>
          {event_type ? (
            <div>
              <Tag color="geekblue" style={{ margin: "4px 0px 0px 60px" }}>
                {event_type.name.toUpperCase()}
              </Tag>
              <Icon
                type="edit"
                style={{ fontSize: "120%", marginLeft: 12 }}
                onClick={() => this.setState({ event_type: null })}
              />
            </div>
          ) : (
            <div style={{ marginLeft: 60 }}>
              {this.generateEventTypeDropdown()}
            </div>
          )}
        </div>
        <div
          style={{
            minWidth: "410px"
          }}
        ></div>
      </div>
    );
  }

  generateAttendeeCard(attendee) {
    let photoUrl =
      attendee.user.profile_photo === ("" || null)
        ? "../../../src/assets/icons/User@3x.png"
        : apiRoot + attendee.user.profile_photo;
    return (
      <div className="attendee-card-container" key={attendee.id}>
        <div>
          <div className="image-container">
            <div className="image">
              <img src={photoUrl} />
            </div>
          </div>
          <div className="name">
            <div>{attendee.user.first_name}</div>
            <div>{attendee.user.last_name}</div>
          </div>
        </div>
      </div>
    );
  }

  generateLocationArea() {
    const { event } = this.props;
    const {
      isEditingDate,
      event_date_start,
      event_date_end,
      isEditingLocation,
      location_address,
      location_lat,
      location_lon,
      location_title
    } = this.state;

    let start_date_locale = moment(event_date_start).format(LONG_DATE_FORMAT);
    let start_hour_locale = moment(event_date_start).format("LT");
    let end_hour_locale = moment(event_date_end).format("LT");

    const addressPickMargin = location_title ? 4 : 36;
    const mapPosition = [
      {
        id: 1,
        company: location_title,
        location_lat: location_lat,
        location_lon: location_lon
      }
    ];

    return (
      <div>
        <div>
          {!isEditingDate ? (
            <div className="info">
              <div className="icon">
                <Icon type="schedule" style={{ fontSize: "150%" }} />
              </div>
              <div
                style={{
                  width: "240px",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div>{start_date_locale}</div>
                  <div>{start_hour_locale + " to " + end_hour_locale}</div>
                </div>
                <div
                  onClick={() => this.setState({ isEditingDate: true })}
                  style={{ marginTop: 16 }}
                >
                  <Icon type="edit" style={{ fontSize: "120%" }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="info">
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                defaultValue={[
                  moment(event_date_start),
                  moment(event_date_end)
                ]}
                placeholder={["Start Time", "End Time"]}
                onOk={this.onDateOk}
              />
            </div>
          )}
        </div>
        <div className="info">
          <div className="icon">
            <Icon type="environment" style={{ fontSize: "150%" }} />
          </div>
          <div style={{ height: "100%", zIndex: 9 }}>
            {location_title && location_title !== "" && (
              <div style={{ maxWidth: 260 }}>{location_title}</div>
            )}
            <div>
              {isEditingLocation ? (
                <Geosuggest
                  ref={el => (this._geoSuggest = el)}
                  placeholder="Add Location..."
                  onSuggestSelect={this.onLocationSelect}
                  location={new google.maps.LatLng(location_lat, location_lon)}
                  queryDelay={1000}
                  minLength={3}
                  placeDetailFields={["name"]}
                  radius="20"
                />
              ) : (
                <div
                  onClick={() => this.setState({ isEditingLocation: true })}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "240px",
                    marginTop: addressPickMargin,
                    cursor: "pointer"
                  }}
                >
                  {location_address === null || location_address === ""
                    ? "Pick a location "
                    : location_address}
                  <Icon type="edit" style={{ fontSize: "120%" }} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="map">
          <Map
            defaultCenter={{ lat: location_lat, lng: location_lon }}
            positions={mapPosition}
          />
        </div>
      </div>
    );
  }

  generateEventBody() {
    const { event } = this.props;
    const { details, header_image, isEditingContent, editorState } = this.state;
    const uploadButton = (
      <div
        style={{
          width: 648,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div>
          <Icon type={this.state.loading ? "loading" : "plus"} />
          <div className="ant-upload-text">Upload</div>
        </div>
      </div>
    );

    const headerImage =
      header_image !== null && header_image.substring(0, 4) === "data" ? (
        <img src={header_image} />
      ) : (
        <img src={apiRoot + header_image} />
      );

    const attendees =
      event.attendee_list &&
      event.attendee_list.map(attendee => {
        return this.generateAttendeeCard(attendee);
      });
    return (
      <div className="event-body">
        <div className="event-data">
          <div className="event-photo">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              style={{ width: 668, height: 336 }}
              showUploadList={false}
              beforeUpload={beforeUpload}
              action={file => this.handlePhotoUpdate(file)}
            >
              {header_image !== "" && header_image !== null
                ? headerImage
                : uploadButton}
            </Upload>
          </div>
          <div className="details-container">
            {isEditingContent ? (
              <div>
                <div
                  style={{
                    width: 668,
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 12
                  }}
                >
                  <Button
                    onClick={() => this.setState({ isEditingContent: false })}
                  >
                    {" "}
                    Close Editor{" "}
                  </Button>
                </div>
                <Editor
                  editorState={editorState}
                  toolbarClassName="toolbar"
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor editor"
                  onEditorStateChange={this.onEditorStateChange}
                />
              </div>
            ) : (
              <div
                className="details"
                onClick={() => this.setState({ isEditingContent: true })}
              >
                {details == "" ? (
                  <div style={{ minHeight: 440 }}>Add content...</div>
                ) : details.length == 8 ? (
                  <div style={{ minHeight: 440 }}>Add content...</div>
                ) : (
                  parse(`${details}`)
                )}
              </div>
            )}
          </div>
          <div className="attendees">
            <div className="title">Attendees ({event.attendee_count})</div>
            {event.attendee_count == 0 ? (
              <div className="no-data">No attendees yet!</div>
            ) : (
              <div className="attendee-list">{attendees}</div>
            )}
          </div>
        </div>
        <Affix offsetTop={220} className="location-affix">
          <div className="location-container">
            <div className="location"> {this.generateLocationArea()} </div>
          </div>
        </Affix>
      </div>
    );
  }

  generateFixedButtons() {
    const {
      details,
      title,
      short_description,
      header_image,
      updated_at,
      event_date_start,
      event_date_end,
      shareAlumni,
      shareStudents,
      location_lat,
      location_lon,
      event_type
    } = this.state;
    const { event } = this.props;
    const isAnytingEdited =
      details != event.details ||
      title != event.title ||
      short_description != event.short_description ||
      header_image != event.header_image ||
      event_date_start != event.event_date_start ||
      event_date_end != event.event_date_end ||
      location_lat != event.location_lat ||
      location_lon != event.location_lon ||
      event_type != event.event_type ||
      (event.user_types &&
        shareStudents !=
          event.user_types
            .map(userType => userType.id)
            .includes(USER_TYPES["student"])) ||
      (event.user_types &&
        shareAlumni !=
          event.user_types
            .map(userType => userType.id)
            .includes(USER_TYPES["alumni"]));
    const isRequiredFieldsFilled =
      details &&
      title &&
      short_description &&
      header_image &&
      event_date_start &&
      event_date_end;
    const publishButtonText = this.isCareerService
      ? "Publish"
      : "Send for Approval";
    const publishButtonDisable = this.state.is_publish
      ? !isAnytingEdited || !isRequiredFieldsFilled
      : !isRequiredFieldsFilled;
    return (
      <div className="fixed-buttons-container">
        {this.isCareerService && (
          <div className="share-with-checkbox-area">
            <div>Share with</div>
            <div className="checkbox-container">
              <Checkbox
                checked={shareStudents}
                onChange={event =>
                  this.setState({ shareStudents: event.target.checked })
                }
              >
                Students
              </Checkbox>
              <Checkbox
                checked={shareAlumni}
                onChange={event =>
                  this.setState({ shareAlumni: event.target.checked })
                }
              >
                Alumni
              </Checkbox>
            </div>
          </div>
        )}
        <div className="save-buttons-container">
          <Button
            type="primary"
            shape="circle"
            size="large"
            disabled={!isAnytingEdited}
            onClick={() => this.saveEventData()}
          >
            <Icon type="save" />
          </Button>
          <Button
            type="primary"
            disabled={publishButtonDisable}
            style={{ margin: "0 0 0 8px" }}
            onClick={() => this.postEventData()}
          >
            {publishButtonText}
          </Button>
        </div>
        {updated_at && (
          <div className="no-data">
            {"last update " + moment(updated_at).format(DATE_AND_TIME_FORMAT)}
          </div>
        )}
      </div>
    );
  }

  render() {
    const { redirect } = this.state;
    if (redirect !== null) {
      return <Redirect to={redirect} />;
    }
    window.onpopstate = () => {
      this.setState({ redirect: "/action?type=redirect&" + location.pathname });
    };
    if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing event edit..." />;
    return (
      <div className="event-details">
        {this.generateFixedButtons()}
        {this.generateEventHeader()}
        {this.generateEventBody()}
      </div>
    );
  }
}

export default EventEditable;
