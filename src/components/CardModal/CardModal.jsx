import React from "react";
import ReactDOM from "react-dom";

import './style.scss';

const CardModal = props => {
  const {
    toggleModal,
    card
  } = props;

  return ReactDOM.createPortal(
    <React.Fragment>
      <div className='modal' onClick={toggleModal}>
        <section className='modal-main' onClick={e => {
          e.stopPropagation()
        }}>
          <div className='modal-header'>
            <div className="modal-company-icon">
              <img className="modal-company-icon" src={card.companyLogo}/>
            </div>
            <div>
              <div className="modal-header company-name">
                {card.company}
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
    </React.Fragment>,
    document.querySelector('#modal')
  );
};

export default CardModal;

