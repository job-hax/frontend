import React, {PureComponent} from "react";
import ReactDOM from "react-dom";
import defaultLogo from '../../assets/icons/JobHax-logo-black.svg';
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
      addNoteForm: '',
      notes: [],
    };
    this.notes = [];
    this.currentNote= null;
    this.toggleNotes = this.toggleNotes.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
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

  saveNotes() {
    this.getNotes()
    this.toggleNotes()
  }

  setCurrentNote(item) {
    this.currentNote = item;
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
        this.notes = (response.json.data);
        console.log('getNotes.response.json.data\n',this.notes);
        this.setState({
          notes: this.notes,
        });
      }
    });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  } 

  addNote(e) {
    e.preventDefault();
    const { card, token } = this.props;
    const { addNoteForm } = this.state;
    if (addNoteForm.trim().length == 0) return
    const reqBody = this.currentNote == null ?
      {
        jobapp_id: card.id,
        description: addNoteForm,
      }
      :
      {
        jobapp_note_id: this.currentNote.id,
        description: addNoteForm,
      };
    let {url, config } = this.currentNote == null ? addNoteRequest : updateNoteRequest;
    console.log('request body\n',reqBody)
    config.headers.Authorization = token;
    postData(url, config, reqBody).catch(error => console.error(error))
    .then(response => {
      if (response.ok) {
        this.setState(state => ({
          showNotePad: !state.showNotePad
        }));
        this.getNotes()
      }
    });
  }

  noteContainerGenerate() {
    if (this.state.notes.length == 0) {
      return (
        <p style={{color:"rgba(32,32,32,0.6)"}}>You don't have any notes at the moment.</p>
      ) 
    } else {
      return(
        this.state.notes.map((item) =>(
          <div key = {item.id} className="note-container">
            <div className="text-container">
              <p className="note"> {item.description}</p>
              <p className="date"> {this.makeTimeBeautiful(item.created_date, 'dateandtime')}</p>
            </div>
            <div className="button-container">
              <button 
              value={item.id} 
              onClick={() => this.deleteNote(item.id)} 
              >
                <img src="../../src/assets/icons/DeleteIconInBtn@3x.png"/>
              </button>
              <button 
              value={item} 
              onClick={() => this.setCurrentNote(item)} 
              >
                <img src="../../src/assets/icons/edit@3x.png"/>
              </button>
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
    const currentValue = this.currentNote == null ? '' : this.currentNote.description;
    return (
      <div >
        {!this.state.showNotePad ?
          <div >
            <div className="notesShowing">
              {this.noteContainerGenerate()}
            </div>
            <div className="notepad-buttons">
              <button onClick={this.toggleNotes}>add a note</button>
            </div>
          </div>
        :
          <div>
            <form onSubmit={this.addNote}>
              <textarea
                name="addNoteForm"
                placeholder="enter your note here..."
                onChange={this.onChange}
                defaultValue = {currentValue}
              ></textarea>
              <div className="notepad-buttons textarea">
                <button onClick={this.toggleNotes}>Cancel</button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        }
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
          <img src={item.icon}></img>
          {item.name}
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
        <div 
        className="options-container" 
        onMouseLeave={this.toggleOptions}
        >
          <div className="explanation">
            Move to:
          </div>
          <div 
            className="options"
            onClick={() => this.updateAsRejected()}
          >
          {
            card.isRejected ? 
            <div>
              <img src={icon}></img>
              ongoing
            </div>
            : 
            <div>
              <img src={"../../src/assets/icons/RejectedIconInBtn@3x.png"}></img>
              rejected
            </div>
          }
          </div>
          {this.otherApplicationStatusesGenerator()}
          <div 
            className="delete-option" 
            onClick={() => this.deleteJobFunction()}
          >
            <img src="../../src/assets/icons/DeleteIconInBtn@3x.png"/>
            Delete
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
      title
    } = this.props;

    return ReactDOM.createPortal(
      <React.Fragment>
        <div className='modal' onClick={toggleModal}>
          <section className='modal-main' onClick={e => {
            e.stopPropagation()
          }}>
            <div className='modal-header'>
              <div>
                <div className="modal-header company-name" style={{marginLeft:'80px'}}>
                  Job Details
                </div>
                <div className="modal-header job-title">
                  {card.jobTitle}
                </div>
              </div>
              <div className="modal-header options">
                <div 
                className="current-status"
                onMouseEnter={this.toggleOptions}
                >
                  <img src={icon}/>
                  {title}
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
              <div >
                <img className="modal-company-icon" src={card.companyLogo || defaultLogo}/>
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

