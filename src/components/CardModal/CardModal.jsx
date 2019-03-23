import React, {PureComponent} from "react";
import ReactDOM from "react-dom";
import defaultLogo from '../../assets/icons/JobHax-logo-black.svg';
import { fetchApi, postData } from "../../utils/api/fetch_api";
import {
  authenticateRequest,
  updateNote,
  addNote,
  deleteNote,
  getNotes
} from "../../utils/api/requests.js";

import './style.scss';


class CardModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showNotePad: false,
      addNoteForm: '',
      notes: [],
    };
    this.notes = [];
    this.currentNote= null;
    this.toggleNotes = this.toggleNotes.bind(this);
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
    var time_part = dateFull[1].split(':')
    var beautifulDatePart = datePart[1]+'.'+datePart[2]+'.'+datePart[0]
    if (type == 'date') {
      beautiful_time = beautifulDatePart
    } if (type == 'dateandtime') {
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
    const { card } = this.props;
    const { url, config } = authenticateRequest;
    fetchApi(url, config)
      .then(response => {
        if (response.ok) {
          return response.json;
        }
      })
      .then(response => {
        let { url, config } = getNotes;
        url = url + '?jopapp_id=' + card.id;
        console.log('URL with params\n',url)
        config.headers.Authorization = `${response.data.token_type} ${response.data.access_token.trim()}`;
        fetchApi(url, config).then(response => {
          if (response.ok) {
            this.notes = (response.json.data);
            console.log('getNotes.response.json.data\n',this.notes);
            this.setState({
              notes: this.notes,
            });
          }
        });
      });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  } 

  addNote(e) {
    e.preventDefault();
    const { card } = this.props;
    const { addNoteForm } = this.state;
    if (addNoteForm.trim().length == 0) return
    const { url, config } = authenticateRequest;
    fetchApi(url, config)
      .then(response => {
        if (response.ok) {
          return response.json;
        }
      })
      .then(response => {
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
        let {url, config } = this.currentNote == null ? addNote : updateNote;
        console.log('request body\n',reqBody)
        config.headers.Authorization = `${response.data.token_type} ${response.data.access_token.trim()}`;
        postData(url, config, reqBody).catch(error => console.error(error))
        .then(response => {
          if (response.ok) {
            this.setState(state => ({
              showNotePad: !state.showNotePad
            }));
            this.getNotes()
          }
        });
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
          <div className="note-container">
            <div className="text-container">
              <p className="note"> {item.description}</p>
              <p className="date"> {this.makeTimeBeautiful(item.created_date, 'dateandtime')}</p>
            </div>
            <div className="button-container">
              <button value={item.id} onClick={() => this.deleteNote(item.id)}>x</button>
              <button value={item} onClick={() => this.setCurrentNote(item)} >!</button>
            </div>
          </div>
        ))
      )
    }
  }

  deleteNote (id) {
    const body = {
      jobapp_note_id: id,
    };
    const { url, config } = authenticateRequest;
    fetchApi(url, config)
      .then(response => {
        if (response.ok) {
          return response.json;
        }
      })
      .then(response => {
        let { url, config } = deleteNote;
        config.headers.Authorization = `${response.data.token_type} ${response.data.access_token.trim()}`;
        console.log('delete request body\n',body)
        postData(url, config, body)
        .then(response => {
          console.log('delete request responseasil\n',response)
          if (response.ok) {
            this.getNotes()
          } 
        })
      });
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

  render() {
    const {
      toggleModal,
      card
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

