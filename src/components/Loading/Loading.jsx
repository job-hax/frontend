import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import './style.scss'

class Loading extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toDashboard: false,
    };
    new Promise(resolve => setTimeout(resolve, 1000)) 
    .then(() =>{
      this.toDashboard=true;
      this.setState({
        toDashboard: this.toDashboard,
    });
    })
  }


  render() {
    if (this.state.toDashboard) {
      return <Redirect to='/dashboard' />
    }
    return (
      <div className="loading-container">
        <img src="../../src/assets/icons/JobHax-logo-white.svg"></img>
        <p>loading...</p>
      </div>
    );
  }
}

export default Loading;