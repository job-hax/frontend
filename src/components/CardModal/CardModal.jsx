import React, {PureComponent} from "react";
import ReactDOM from "react-dom";
import defaultLogo from '../../assets/icons/JobHax-logo-black.svg';
import classNames from 'classnames';

import { fetchApi, postData } from "../../utils/api/fetch_api";
import {
  updateNoteRequest,
  addNoteRequest,
  deleteNoteRequest,
  getNotesRequest,
  deleteJobRequest,
  updateJobStatusRequest
} from "../../utils/api/requests.js";
import {APPLICATION_STATUSES_IN_ORDER} from '../../utils/constants/constants.js';

import './style.scss';


class CardModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showNotePad: false,
      showOptions: false,
      isEditing: false,
      addNoteForm: '',
      updateNoteForm: '',
      notes: [],
      textareaHeight: 16,
    };
    this.notes = [];
    this.currentNote= null;
    this.toggleNotes = this.toggleNotes.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.setToDefault = this.setToDefault.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addNote = this.addNote.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
  }

  toggleNotes() {
    this.currentNote = null;
    console.log('current note\n',this.currentNote)
    this.setState(state => ({
      showNotePad: !state.showNotePad
    }));
  }

  toggleOptions() {
    this.setState(state => ({
      showOptions: !state.showOptions
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
    this.setState(({
      addNoteForm: '',
    }));
  }

  saveNotes(noteData, request, createdDate) {
    if (this.state.showNotePad) {
      const noteUpdated = {
        id: request.jobapp_note_id, 
        description: request.description, 
        created_date: createdDate.created_date, 
        update_date: new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString()
    }
      console.log(noteUpdated);
      const notesUpdated = this.state.notes
        .filter(note => {
          return note.id !== request.jobapp_note_id;
        });
      notesUpdated.unshift(noteUpdated);
      this.setState(() => ({
        notes: notesUpdated
      }));
      this.toggleNotes()
      this.setState(({
        updateNoteForm: '',
      }));
    } else {
      let notesAdded = this.state.notes;
      notesAdded.unshift(noteData);
      this.setState(() => ({
        notes: notesAdded
      }));
      this.setToDefault();
    }
      console.log('after save \n--addNoteForm',this.state.addNoteForm,'\n--updateNoteForm',this.state.updateNoteForm);
  }

  setCurrentNote(item) {
    this.currentNote = item;
    console.log('set current note\n',this.currentNote);
    this.setState(state => ({
      showNotePad: !state.showNotePad,
    }));
  }

  makeTimeBeautiful(time, type = 'date') {
    var beautiful_time = '';
    var dateFull = (time).toString().split('T');
    var datePart = dateFull[0].split('-');
    var beautifulDatePart = datePart[1]+'.'+datePart[2]+'.'+datePart[0]
    if (type == 'date') {
      beautiful_time = beautifulDatePart
    } if (type == 'dateandtime') {
      var time_part = dateFull[1].split(':')
      beautiful_time = beautifulDatePart+' at '+time_part[0]+':'+time_part[1]
    } else {
      beautiful_time = beautiful_time
    }
    return beautiful_time
  }

  componentDidMount(){
    this.getNotes()
  }
  
  getNotes(){
    const { card, token } = this.props;
    let { url, config } = getNotesRequest;
    url = url + '?jopapp_id=' + card.id;
    console.log('URL with params\n',url)
    console.log('token\n',token)
    config.headers.Authorization = token;
    fetchApi(url, config).then(response => {
      if (response.ok) {
        this.notes = (response.json.data).reverse();
        console.log('getNotes.response.json.data\n',this.notes);
        this.setState({
          notes: this.notes,
        });
      }
    });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
    console.log('value',e.target.value);
  } 

  addNote(e) {
    console.log('add note requested!', e.target.value);
    e.preventDefault();
    const { card, token } = this.props;
    const { addNoteForm, updateNoteForm } = this.state;
    console.log('addNote \n--add note form',addNoteForm, '\n--update note form', updateNoteForm, '\n--value', e.target.value);
    console.log('addnoteform currentNote',this.currentNote);
    if (addNoteForm.trim().length == 0 & updateNoteForm.trim().length == 0) return
    const reqBody = this.currentNote == null ?
      {
        jobapp_id: card.id,
        description: addNoteForm,
      }
      :
      {
        jobapp_note_id: this.currentNote.id,
        description: updateNoteForm,
      };
    let {url, config } = this.currentNote == null ? addNoteRequest : updateNoteRequest;
    console.log('request body\n',reqBody)
    config.headers.Authorization = token;
    postData(url, config, reqBody).catch(error => console.error(error))
    .then(response => {
      console.log('response json\n',response.json)
      if (response.ok) {
        this.saveNotes(response.json.data, reqBody, this.currentNote);
      }
    });
  }

  handleKeyUp(evt) {
    if (this.state.textareaHeight != 48) {
      this.setState({
        textareaHeight: 48,
      });
    } else {
      this.setState({
        textareaHeight: 16,
      });
    }
  }

  noteContainerGenerate() {
    let textareaStyle = { 
      height: this.state.textareaHeight, 
      maxWidth:"352px", 
      minWidth:"352px", 
      width:"352px",
    };
    console.log('notecontainergenerator currentNote?',this.currentNote);
    if (this.state.notes.length == 0) {
      return (
        <p style={{color:"rgba(32,32,32,0.6)", marginTop:"16px"}}>You don't have any notes at the moment.</p>
      ) 
    } else {
      return(
        this.state.notes.map((item) =>(
          <div key = {item.id} >
            <div>
            {this.currentNote != item ?
              <div className="note-container">
                <div
                className="text-container"
                value={item} 
                onClick={() => this.setCurrentNote(item)}
                >
                  <p className="note"> {item.description}</p>
                  {item.update_date == null ?
                    <p className="date"> {this.makeTimeBeautiful(item.created_date, 'dateandtime')}</p>
                  :
                    <p className="date">updated on {this.makeTimeBeautiful(item.update_date, 'dateandtime')}</p>
                  }
                </div>
                <div className="button-container-parent">
                  <div className="button-container-child">
                    <button 
                    value={item.id} 
                    onClick={() => this.deleteNote(item.id)} 
                    >
                      <img src="../../src/assets/icons/DeleteIconInBtn@1x.png"/>
                    </button>
                    <button 
                    value={item} 
                    onClick={() => this.setCurrentNote(item)} 
                    >
                      <img src="../../src/assets/icons/edit.png"/>
                    </button>
                  </div>
                </div>
              </div>
            :
              <form 
                className="add-note-area" 
                onSubmit={this.addNote}
                style={{borderBottom: "1px solid rgba(32, 32, 32, 0.1)"}}
                >
                <div>
                  <textarea 
                  name="updateNoteForm"
                  onChange={this.onChange}
                  defaultValue={item.description}
                  onDoubleClick={this.handleKeyUp.bind(this)} 
                  style={textareaStyle}
                  ></textarea>
                </div>
                <div className="notepad-buttons">
                  <button 
                    className="notepad-buttons cancel" 
                    type="reset" 
                    onClick={this.toggleNotes}
                  >
                    cancel
                  </button>
                  <button
                    className="notepad-buttons save" 
                    type="submit"
                  >
                    save
                  </button>
                </div>
              </form>
            }
            </div>
          </div>
        ))
      )
    }
  }

  deleteNote (id) {
    const { token } = this.props;
    const body = {
      jobapp_note_id: id,
    };
    let { url, config } = deleteNoteRequest
    config.headers.Authorization = token;
    console.log('delete request body\n',body)
    postData(url, config, body)
    .then(response => {
      console.log('delete request response\n',response)
      if (response.ok) {
        this.getNotes()
      } 
    })
  }

  deleteJobFunction(){
    const { card, token, deleteJobFromList, columnName } = this.props;
    const body = {
      jobapp_id: card.id,
    };
    let { url, config } = deleteJobRequest;
    config.headers.Authorization = token;
    console.log('delete job request body\n',body)
    postData(url, config, body)
    .then(response => {
      console.log('delete job request response\n',response,card)
      if (response.ok) {
          console.log('function ', columnName, card.id);
          deleteJobFromList(columnName, card.id, card.isRejected);
      } 
    })
  }  
  
  updateAsRejected(){
    const { card, token, moveToRejected, columnName } = this.props;
    var isRejected = !card.isRejected
    const body = {
      jobapp_id: card.id,
      status_id: card.applicationStatus.id,
      rejected: isRejected,
    };
    let { url, config } = updateJobStatusRequest;
    config.headers.Authorization = token;
    console.log('update to rejected request body\n',body)
    postData(url, config, body)
    .then(response => {
      console.log('update to rejected request response\n',response,card)
      if (response.ok) {
          console.log('function ', columnName, card.id);
          moveToRejected(columnName, card, isRejected);
      } 
    })
  }

  updateCardStatusToOtherStatuses (insertedColumnName) {
    const { card, columnName, updateApplications} = this.props;
    updateApplications(card, columnName, insertedColumnName);
  }

  generateNotes() {
    const notesShowingClass = classNames({
      'notes-showing': true,
      '--short': this.state.isEditing,
    });

    return (
      <div >
        <div>
          {this.state.isEditing ? 
            <form className="add-note-area" onSubmit={this.addNote}>
              <div>
                <textarea
                  name="addNoteForm"
                  placeholder="+ Add note"
                  onChange={this.onChange}
                  ref="addNoteFormDefault"
                ></textarea>
              </div>
              <div className="notepad-buttons">
                <button 
                  className="notepad-buttons cancel" 
                  type="reset" 
                  onClick={this.setToDefault}
                >
                  cancel
                </button>
                <button
                  className="notepad-buttons save" 
                  type="submit"
                >
                  save
                </button>
              </div>
            </form>
           :
            <form className="add-note-area">
              <div>
                <textarea
                  className="add-note-area --height-min"
                  placeholder="+ Add note"
                  onClick={this.toggleEdit}
                  ref="addNoteFormDefault"
                ></textarea>
              </div>
            </form>
          }
          <div >
            <div className={notesShowingClass}>
              {this.noteContainerGenerate()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  otherApplicationStatusesGenerator() {
    const {columnName} = this.props;
    var statuses = APPLICATION_STATUSES_IN_ORDER.filter(item => item.id !== columnName);
    return(
      statuses.map((item) =>(
        <div 
        key={item.id}
        className="options"
        value={item.id}
        onClick={() => this.updateCardStatusToOtherStatuses(item.id)}
        >
          <img src={item.icon.toString().split('@')[0]+'InBtn@1x.png'}></img>
          <p>{item.name}</p>
        </div>
      ))
    )
  }

  moveToOptionsGenerator() {
    const {
      card,
      icon,
    } = this.props;
    if (this.state.showOptions) {
      return (
        <div className="options-container" >
          <div className="explanation">
            MOVE TO:
          </div>
          {
            card.applicationStatus.id != 2 ?
              <div 
                className="options"
                onClick={() => this.updateAsRejected()}
              >
                {
                  card.isRejected ? 
                  <div className="ongoing-option">
                    <img src={icon.toString().split('@')[0]+'InBtn@1x.png'}></img>
                    <p >Ongoing</p>
                  </div>
                  : 
                  <div className="rejected-option">
                    <img src={"../../src/assets/icons/RejectedIconInBtn@1x.png"}>
                    </img>
                    <p>Rejected</p>
                  </div>
                }
              </div>
            :
              <div className="unable">
                <img src={"../../src/assets/icons/RejectedIconInBtn@1x.png"}>
                </img>
                Rejected
              </div>
          }
          {this.otherApplicationStatusesGenerator()}
          <div 
            className="delete-option" 
            onClick={() => this.deleteJobFunction()}
          >
            <img src="../../src/assets/icons/DeleteIconInBtn@1x.png"/>
            <p>Delete</p>
          </div>
        </div>
      )
    } else {
      return 
    }
  }

  render() {
    const {
      toggleModal,
      card,
      icon,
      id
    } = this.props;

    return ReactDOM.createPortal(
      <React.Fragment>
        <div className='modal' onClick={toggleModal}>
          <section className='modal-main' onClick={e => {
            e.stopPropagation()
          }}>
            <div className='modal-header'>
              <div>
                <div >
                  <img className="modal-company-icon" src={card.companyLogo || defaultLogo}/>
                </div>
                <div className="modal-header company-name" style={{marginLeft:'140px', marginTop:'40px'}}>
                  Job Details
                </div>
                <div className="modal-header job-title">
                  {card.jobTitle}
                </div>
              </div>
              <div 
                className="modal-header options"
                onMouseEnter={this.toggleOptions}
                onMouseLeave={this.toggleOptions}
                >
                <div 
                className="current-status"
                >
                  <img src={icon.toString().split('@')[0]+'White@1x.png'}/>
                  <p>{APPLICATION_STATUSES_IN_ORDER[(parseInt(id)-1)]['name']}</p>
                </div>
                {this.moveToOptionsGenerator()}
              </div>
            </div>
            <div className="modal-body">
              <div className="modal-body navigation">
                <div className="modal-body navigation subheaders">
                  Company
                </div>
                <div className="modal-body navigation subheaders">
                  Position
                </div>
                <div className="modal-body navigation subheaders">
                  Date
                </div>
                <div className="modal-body navigation subheaders">
                  Source
                </div>
                <div className="modal-body navigation subheaders">
                  Notes
                </div>
              </div>
              <div className="modal-body main">
                <div className="modal-body main data">
                  {card.company}
                </div>
                <div className="modal-body main data">
                  {card.jobTitle}
                </div>
                <div className="modal-body main data">
                  {this.makeTimeBeautiful(card.applyDate, 'date')}
                </div>
                <div className="modal-body main data">
                  {card.source}
                </div>
                <div className="modal-body main data">
                  {this.generateNotes()}
                </div>
              </div>
            </div>
          </section>
        </div>
      </React.Fragment>,
      document.querySelector('#modal')
    )
  }
};

export default CardModal;

