import React from "react";
import {
  Icon,
  Button,
  Affix,
  Input,
  Upload,
  message,
  Checkbox,
  DatePicker
} from "antd";
import parse from "html-react-parser";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Geosuggest from "react-geosuggest";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import {
  makeTimeBeautiful,
  IS_CONSOLE_LOG_OPEN
} from "../../utils/constants/constants";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { apiRoot, EVENTS } from "../../utils/constants/endpoints";
import Map from "../Metrics/SubComponents/Map/Map.jsx";

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
      isLinkDisplaying: false,
      created_at: this.props.event.created_at,
      details: this.props.event.details,
      event_date_start: this.props.event.event_date_start,
      event_date_end: this.props.event.event_date_end,
      id: this.props.event.id,
      event_type: this.props.event.event_type,
      header_image: this.props.event.header_image,
      is_publish: false,
      is_public: this.props.event.is_public,
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
      fromData: new FormData(),
      isEditingContent: false,
      isEditingDate: false,
      isEditingLocation: false,
      editorState: EditorState.createEmpty()
    };

    this.toggleEditable = this.toggleEditable.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handlePublicCheckbox = this.handlePublicCheckbox.bind(this);
    this.handlePhotoUpdate = this.handlePhotoUpdate.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.onDateOk = this.onDateOk.bind(this);
    this.saveEventData = this.saveEventData.bind(this);
    this.postEventData = this.postEventData.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
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
  }

  async postEventData() {
    await this.setState({ is_publish: true });
    this.saveBlogData();
  }

  async saveEventData() {
    const { id, fromData, is_publish } = this.state;
    let toAdd = [
      "title",
      "short_description",
      "details",
      "is_publish",
      "is_public",
      "event_date_start",
      "event_date_end",
      "location_address",
      "location_title",
      "location_lat",
      "location_lon",
      "spot_count",
      "event_type"
    ];
    let config = id == null ? { method: "POST" } : { method: "PUT" };
    toAdd.forEach(enrty => fromData.append(enrty, this.state[enrty]));
    if (config.method == "PUT") {
      fromData.append("event_id", id);
    }
    config.body = fromData;
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

  handlePublicCheckbox(e) {
    this.setState({ is_public: !e.target.checked, is_publish: false });
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
    this.setState({ fromData: bodyFormData });
    getBase64(file, imageUrl =>
      this.setState({
        header_image: imageUrl,
        loading: false,
        is_publish: false
      })
    );
  }

  onDateOk(event) {
    this.setState({
      event_date_start: event[0].toISOString(),
      event_date_end: event[1].toISOString(),
      isEditingDate: false
    });
  }

  onLocationSelect(suggest) {
    IS_CONSOLE_LOG_OPEN && console.log(suggest);
  }

  generateEventHeader() {
    const { title, short_description, event_date_start } = this.state;
    const { event } = this.props;
    let photoUrl =
      event.host_user.profile_photo.substring(0, 4) == "http"
        ? event.host_user.profile_photo
        : apiRoot + event.host_user.profile_photo;
    let time = makeTimeBeautiful(event_date_start, "dateandtime");
    let longDate = makeTimeBeautiful(event_date_start, "longDate");
    return (
      <div className="event-header">
        <div className="event-datebox">
          <div className="day">{time.split("-")[0]}</div>
          <div className="month">{time.split("-")[1].toUpperCase()}</div>
        </div>
        <div className="event-info">
          <div className="event-date">{longDate}</div>
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
                {event.host_user.first_name + " " + event.host_user.last_name}
              </div>
            </div>
          </div>
        </div>
        <div className="attendance"></div>
      </div>
    );
  }

  generateAttendeeCard(attendee) {
    let photoUrl =
      attendee.user.profile_photo.substring(0, 4) == "http"
        ? attendee.user.profile_photo
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
      isEditingLocation
    } = this.state;
    let longDate = makeTimeBeautiful(event_date_start, "longDate");
    return (
      <div>
        <div>
          {!isEditingDate ? (
            <div
              className="info"
              onClick={() => this.setState({ isEditingDate: true })}
            >
              <div className="icon">
                <Icon type="schedule" style={{ fontSize: "150%" }} />
              </div>
              <div>
                <div>{longDate}</div>
                <div>
                  {makeTimeBeautiful(event_date_start, "dateandtime").split(
                    "at"
                  )[1] +
                    " to " +
                    makeTimeBeautiful(event_date_end, "dateandtime").split(
                      "at"
                    )[1]}
                </div>
              </div>
            </div>
          ) : (
            <div className="info">
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                placeholder={["Start Time", "End Time"]}
                onOk={this.onDateOk}
              />
            </div>
          )}
        </div>
        <div
          className="info"
          onClick={() => this.setState({ isEditingLocation: true })}
        >
          <div className="icon">
            <Icon type="environment" style={{ fontSize: "150%" }} />
          </div>
          <div>
            <div>{event.location_title}</div>
            <div>
              {isEditingLocation ? (
                <Geosuggest
                  ref={el => (this._geoSuggest = el)}
                  placeholder="Add Location..."
                  onSuggestSelect={this.onLocationSelect}
                  radius="20"
                />
              ) : (
                event.location_address
              )}
            </div>
          </div>
        </div>
        <div className="map">
          <Map
            defaultCenter={{ lat: event.location_lat, lng: event.location_lon }}
            positions={[{ lat: event.location_lat, lng: event.location_lon }]}
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
    const image =
      header_image.substring(0, 4) == "data"
        ? header_image
        : apiRoot + header_image;
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
              {header_image != "" ? (
                <img src={image} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
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
        <Affix offsetTop={220}>
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
      is_public
    } = this.state;
    const { event } = this.props;
    const isAnytingEdited =
      details != event.details ||
      title != event.title ||
      short_description != event.short_description ||
      header_image != event.header_image ||
      event_date_start != event.event_date_start ||
      event_date_end != event.event_date_end ||
      is_public != event.is_public;
    const isRequiredFieldsFilled =
      details &&
      title &&
      short_description &&
      header_image &&
      event_date_start &&
      event_date_end;
    return (
      <div className="fixed-button" style={{ boxShadow: "none" }}>
        <div className="fixed-button" style={{ boxShadow: "none" }}>
          {isAnytingEdited && (
            <Button
              type="primary"
              shape="circle"
              size="large"
              onClick={() => this.saveEventData()}
            >
              <Icon type="save" />
            </Button>
          )}

          {isAnytingEdited && isRequiredFieldsFilled && (
            <Button
              type="primary"
              style={{ margin: "0 0 0 8px" }}
              onClick={() => this.postEventData()}
            >
              Send for Approval
            </Button>
          )}
        </div>
        {isRequiredFieldsFilled && (
          <div
            className="fixed-button"
            style={{ boxShadow: "none", margin: "48px 0 0 0" }}
          >
            <Checkbox
              checked={!this.state.is_public}
              onChange={e => this.handlePublicCheckbox(e)}
            >
              Share only with school
            </Checkbox>
          </div>
        )}
        {updated_at && (
          <div
            className="no-data"
            style={{ boxShadow: "none", margin: "80px 8px 0 0" }}
          >
            {"last update " +
              makeTimeBeautiful(this.state.updated_at, "dateandtime")}
          </div>
        )}
      </div>
    );
  }

  render() {
    history.pushState(null, null, location.href);
    window.onpopstate = function() {
      window.location.assign("events");
    };
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
