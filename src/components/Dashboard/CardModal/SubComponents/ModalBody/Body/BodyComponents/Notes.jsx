import React from "react";
import classNames from "classnames";

import { axiosCaptcha } from "../../../../../../../utils/api/fetch_api";
import {
  updateNoteRequest,
  addNoteRequest,
  deleteNoteRequest,
  getNotesRequest
} from "../../../../../../../utils/api/requests.js";
import {
  IS_CONSOLE_LOG_OPEN,
  makeTimeBeautiful
} from "../../../../../../../utils/constants/constants.js";

class Notes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNotePad: false,
      isEditing: false,
      imageLoadError: true,
      whatIsDisplaying: "company",
      addNoteForm: "",
      updateNoteForm: "",
      notes: [],
      editNoteTextAreaHeight: 16,
      addNoteTextAreaHeight: 40
    };
    this.notes = [];
    this.currentNote = null;
    this.toggleNotes = this.toggleNotes.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.setToDefault = this.setToDefault.bind(this);
    this.onAddNoteChange = this.onAddNoteChange.bind(this);
    this.addNote = this.addNote.bind(this);
    this.handleAddNote = this.handleAddNote.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
    this.onEditNoteChange = this.onEditNoteChange.bind(this);
  }

  componentDidMount() {
    this.getNotes();
  }

  async getNotes() {
    await this.props.handleTokenExpiration("notes getNotes");
    const { card } = this.props;
    let { url, config } = getNotesRequest;
    url = url + "?jopapp_id=" + card.id;
    axiosCaptcha(url, config).then(response => {
      if (response.statusText === "OK") {
        this.notes = response.data.data.reverse();
        this.setState({
          notes: this.notes
        });
      }
    });
  }

  toggleNotes() {
    this.currentNote = null;
    IS_CONSOLE_LOG_OPEN && console.log("current note\n", this.currentNote);
    this.setState(state => ({
      showNotePad: !state.showNotePad
    }));
  }

  toggleEdit() {
    this.setState(state => ({
      isEditing: !state.isEditing
    }));
  }

  setToDefault() {
    this.toggleEdit();
    var resetValue = this.refs.addNoteFormDefault;
    resetValue.value = "";
    this.setState({
      addNoteForm: "",
      addNoteTextAreaHeight: 40
    });
  }

  setCurrentNote(item) {
    this.currentNote = item;
    let height = item.description.split("").length * 0.5;
    IS_CONSOLE_LOG_OPEN && console.log("set current note\n", this.currentNote);
    this.setState(state => ({
      showNotePad: !state.showNotePad,
      editNoteTextAreaHeight: height
    }));
  }

  onAddNoteChange(event) {
    let height = event.target.value.split("").length * 0.5;
    this.setState({});
    this.setState({
      [event.target.name]: event.target.value,
      addNoteTextAreaHeight: height
    });
    IS_CONSOLE_LOG_OPEN && console.log("value", event.target);
  }

  onEditNoteChange(event) {
    let height = event.target.value.split("").length * 0.5;
    this.setState({});
    this.setState({
      [event.target.name]: event.target.value,
      editNoteTextAreaHeight: height
    });
    IS_CONSOLE_LOG_OPEN && console.log("value", event);
  }

  handleAddNote(e) {
    e.preventDefault();
    this.addNote(e.target.value);
  }

  async addNote(note) {
    IS_CONSOLE_LOG_OPEN && console.log("add note requested!", note);
    await this.props.handleTokenExpiration("notes addNote");
    const { card } = this.props;
    const { addNoteForm, updateNoteForm } = this.state;
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "addNote \n--add note form",
        addNoteForm,
        "\n--update note form",
        updateNoteForm,
        "\n--value",
        note
      );
    IS_CONSOLE_LOG_OPEN &&
      console.log("addnoteform currentNote", this.currentNote);
    if ((addNoteForm.trim().length == 0) & (updateNoteForm.trim().length == 0))
      return;
    const reqBody =
      this.currentNote == null
        ? {
            jobapp_id: card.id,
            description: addNoteForm
          }
        : {
            jobapp_note_id: this.currentNote.id,
            description: updateNoteForm
          };
    let { url, config } =
      this.currentNote == null ? addNoteRequest : updateNoteRequest;
    config.body = reqBody;
    axiosCaptcha(url, config, "jobapp_note")
      .catch(error => console.error(error))
      .then(response => {
        if (response.statusText === "OK") {
          this.saveNotes(response.data.data, reqBody, this.currentNote);
        }
      });
  }

  async deleteNote(id) {
    await this.props.handleTokenExpiration("notes deleteNote");
    const body = {
      jobapp_note_id: id
    };
    let { url, config } = deleteNoteRequest;
    config.body = body;
    axiosCaptcha(url, config).then(response => {
      if (response.statusText === "OK") {
        this.getNotes();
      }
    });
  }

  saveNotes(noteData, request, createdDate) {
    if (this.state.showNotePad) {
      const noteUpdated = {
        id: request.jobapp_note_id,
        description: request.description,
        created_date: createdDate.created_date,
        update_date: new Date(
          new Date().toString().split("GMT")[0] + " UTC"
        ).toISOString()
      };
      const notesUpdated = this.state.notes.filter(note => {
        return note.id !== request.jobapp_note_id;
      });
      notesUpdated.unshift(noteUpdated);
      this.setState(() => ({
        notes: notesUpdated
      }));
      this.toggleNotes();
      this.setState({
        updateNoteForm: ""
      });
    } else {
      let notesAdded = this.state.notes;
      notesAdded.unshift(noteData);
      this.setState(() => ({
        notes: notesAdded
      }));
      this.setToDefault();
    }
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "after save \n--addNoteForm",
        this.state.addNoteForm,
        "\n--updateNoteForm",
        this.state.updateNoteForm
      );
  }

  noteContainerGenerate() {
    let textareaStyle = {
      height: this.state.editNoteTextAreaHeight,
      maxHeight: "400px",
      maxWidth: "482px",
      minWidth: "482px",
      width: "482px"
    };
    IS_CONSOLE_LOG_OPEN &&
      console.log("notecontainergenerator currentNote?", this.currentNote);
    if (this.state.notes.length == 0) {
      return (
        <p style={{ color: "rgba(32,32,32,0.6)", marginTop: "16px" }}>
          You don't have any notes at the moment.
        </p>
      );
    } else {
      return this.state.notes.map(item => (
        <div key={item.id}>
          <div>
            {this.currentNote != item ? (
              <div className="note-container">
                <div
                  className="text-container"
                  value={item}
                  onClick={() => this.setCurrentNote(item)}
                >
                  <p className="note"> {item.description}</p>
                  {item.update_date == null ? (
                    <p className="date">
                      {" "}
                      {makeTimeBeautiful(item.created_date, "dateandtime")}
                    </p>
                  ) : (
                    <p className="date">
                      last updated{" "}
                      {makeTimeBeautiful(item.update_date, "dateandtime")}
                    </p>
                  )}
                </div>
                <div className="button-container-parent">
                  <div className="button-container-child">
                    <button
                      value={item.id}
                      onClick={() => this.deleteNote(item.id)}
                    >
                      <img src="../../src/assets/icons/DeleteIconInBtn@1x.png" />
                    </button>
                    <button
                      value={item}
                      onClick={() => this.setCurrentNote(item)}
                    >
                      <img src="../../src/assets/icons/edit.png" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                className="add-note-area"
                onSubmit={this.handleAddNote}
                style={{ borderBottom: "1px solid rgba(32, 32, 32, 0.1)" }}
              >
                <div>
                  <textarea
                    name="updateNoteForm"
                    onChange={this.onEditNoteChange}
                    defaultValue={item.description}
                    style={textareaStyle}
                  />
                </div>
                <div className="notepad-buttons">
                  <button
                    className="notepad-buttons cancel"
                    type="reset"
                    onClick={this.toggleNotes}
                  >
                    cancel
                  </button>
                  <button className="notepad-buttons save" type="submit">
                    save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ));
    }
  }

  generateNotes() {
    const notesShowingClass = classNames({
      "notes-showing": true,
      "--short": this.state.isEditing
    });
    return (
      <div>
        <div>
          {this.state.isEditing ? (
            <form className="add-note-area" onSubmit={this.handleAddNote}>
              <div>
                <textarea
                  name="addNoteForm"
                  placeholder="+ Add note"
                  onChange={this.onAddNoteChange}
                  ref="addNoteFormDefault"
                  style={{ height: this.state.addNoteTextAreaHeight }}
                />
              </div>
              <div className="notepad-buttons">
                <button
                  className="notepad-buttons cancel"
                  type="reset"
                  onClick={this.setToDefault}
                >
                  cancel
                </button>
                <button className="notepad-buttons save" type="submit">
                  save
                </button>
              </div>
            </form>
          ) : (
            <form className="add-note-area">
              <div>
                <textarea
                  className="add-note-area --height-min"
                  placeholder="+ Add note"
                  onClick={this.toggleEdit}
                  ref="addNoteFormDefault"
                />
              </div>
            </form>
          )}
          <div>
            <div className={notesShowingClass}>
              {this.noteContainerGenerate()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.generateNotes()}</div>;
  }
}

export default Notes;
