import React from "react";
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';
import defaultLogo from '../../assets/icons/JobHax-logo-black.svg';
// import { DetailsModal , toggleModal} from '../DetailsModal/DetailsModal.jsx';

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

function renderCard(props) {
  const {
    card: {
      companyLogo,
      company,
      jobTitle,
      isRejected
    },
    isDragging
  } = props;

  const cardClass = classNames({
    'card-container': true,
    'rejected-cards': isRejected,
    '--is_dragging': isDragging
  });

  return (
    <div className={cardClass}>
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
        {/* <DetailsModal></DetailsModal>   */}
      </div>
    </div>
  );
}

const Card = (props) => {
  const {
    card: {
      isRejected
    },
    connectDragSource,
  } = props;

  if (isRejected) {
    return renderCard(props);
  }
  return connectDragSource(
    renderCard(props)
  );
};

Card.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default DragSource('item', cardSpec, collect)(Card);
