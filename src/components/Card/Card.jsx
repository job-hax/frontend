import React, {Component} from "react";
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';



import './style.scss'

const cardSpec = {
  beginDrag(props) {
    return {
      jobTitle: props.jobTitle
    };
  },

  endDrag(props, monitor) {
    const dragItem = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      console.log(`You dropped ${dragItem.jobTitle} into ${dropResult.name}`);
    }
  }
};

let collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

const Card = (props) => {
  const {
    card: {
      companyLogo,
      company,
      jobTitle,
      isRejected
    },
    connectDragSource,
    isDragging
  } = props;

  const cardClass = classNames({
    'card-rejected-container': isRejected,
    'card-container': !isRejected,
    'dragging': isDragging
  });

  return connectDragSource(
    <div className={cardClass}>
      <div className="card-company-icon">
        <img className="card-company-icon" src={companyLogo}/>
      </div>
      <div className="card-company-info">
        <div className="card-company-name">
          {company}
        </div>
        <div className="card-job-position">
          {jobTitle}
        </div>
      </div>
      <div className="card-job-details">
        ...
      </div>
    </div>
  );
};

Card.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default DragSource('snack', cardSpec, collectDrag)(Card);