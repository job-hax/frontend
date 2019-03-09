import React, {Component} from "react";

import './style.scss';

class DetailsModal extends Component {
  constructor() {
    super();
    this.state = {
      isModalShowing: false,
    }
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState(state => ({
      isModalShowing: !state.isModalShowing
    }));
  }

  Modal() {
    return (
      <div className={this.state.isModalShowing ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className='modal-header'>
            <div className="modal-company-icon">
              <img className="modal-company-icon" src="../../src/assets/icons/JobHax-logo-black.svg"></img>
            </div>
            <div>
              <div className="modal-header company-name">
                Company Name
              </div>
              <div className="modal-header job-title">
                Job Title
              </div>
            </div>
            <div className="modal-header close" onClick={this.toggleModal}>
              x
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
                Contacts
              </div>
              <div className="modal-body navigation subheaders">
                Notes
              </div>
            </div>
            <div className="modal-body main">

            </div>
          </div>
        </section>
      </div>
    );
  }

  render() {
    return (
      <main>
        {this.Modal()}
        <div className="show-modal-button" onClick={this.toggleModal}>x</div>
      </main>
    )
  }
}

export default DetailsModal;

