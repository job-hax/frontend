import React, {PureComponent} from "react";
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';
import defaultLogo from '../../assets/icons/JobHax-logo-black.svg';
import CardModal from '../CardModal/CardModal.jsx';

import './style.scss'

const cardSpec = {
  beginDrag(props) {
    return props.card;
  },

  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      return props.updateApplications(props.card, props.columnName, monitor.getDropResult().name);
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

class Card extends PureComponent {
  constructor() {
    super();
    this.state = {
      showModal: false
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState(({showModal}) => ({
      showModal: !showModal
    }));
  }

  renderCard() {
    const {
      card: {
        companyLogo,
        company,
        jobTitle,
        isRejected,
        applyDate,
        source,
      },
      isDragging
    } = this.props;

    const {showModal} = this.state;

    const cardClass = classNames({
      'card-container': true,
      'rejected-cards': isRejected,
      '--is_dragging': isDragging
    });

    return (
      <div>
        {
          showModal &&
          <CardModal
            toggleModal={this.toggleModal}
            {...this.props}
          />
        }
        <div className={cardClass} onClick={this.toggleModal}>
          <div className="card-company-icon">
            <img src={companyLogo || defaultLogo}/>
          </div>
          <div className="card-company-info">
            <div id="company" className="card-company-name">
              {company}
            </div>
            <div id="jobTitle" className="card-job-position">
              {jobTitle}
            </div>
          </div>
          <div className="card-job-details">
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      card: {
        isRejected
      },
      connectDragSource,
    } = this.props;

    if (isRejected) {
      return this.renderCard();
    }
    return connectDragSource(
      this.renderCard()
    );
  }
};

Card.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default DragSource('item', cardSpec, collect)(Card);
