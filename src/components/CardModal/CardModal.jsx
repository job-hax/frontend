import React, {PureComponent} from "react";
import ReactDOM from "react-dom";
import defaultLogo from '../../assets/icons/JobHax-logo-black.svg';

import './style.scss';


class CardModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showNotePad: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState(state => ({
      showNotePad: !state.showNotePad
    }));
  }

  makeTimeBeautiful(applyDate) {
    var title = (applyDate).toString()
    title = title.substring(0,10).replace(/-/g, ' ')
    console.log(title)
    return title
  }

  notes() {
    return ('my note')
  }

  handleSaveNote () {

  }

  generateNotes () {
    var isNote = false;
    return (
      <div>
        {!this.state.showNotePad ?
          <div>
            <p>{!isNote ? "You don't have any notes at the moment.": notes() }</p>
            <div className="notepad-buttons">
              <button onClick={this.toggleModal}>Take Note</button>
            </div>
          </div>
        :
          <div>
            <textarea></textarea>
            <div className="notepad-buttons">
              <button onClick={this.toggleModal}>Show Notes</button>
              <button >Save Note</button>
            </div>
          </div>
        }
      </div>
    )
  }

  render() {
    const {
      toggleModal,
      toggleNotes,
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
                  Time
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
                  {this.makeTimeBeautiful(card.applyDate)}
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

