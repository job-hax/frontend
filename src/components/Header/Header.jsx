import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './style.scss'

class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <div className="left-container">
          <div className="jobhax-logo-container">
            <Link to="/dashboard">
              <div className="jobhax-logo"></div>
            </Link>
          </div>
          <div className="search-box">
            <div className="header-icon search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path className="svg_ics" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </div>
            <div>
              <input
                className="search-input"
                id="query"
                onChange={e => {
                  e.preventDefault()
                }}>
              </input>
            </div>
          </div>
        </div>
        <div className="right-container">
        <div className="header-icon general tooltips">
            <Link to={window.location.pathname}>
              <svg width="24" height="24" viewBox="0 0 24 24"><path className="svg_ics"  d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79 2.73 2.71 7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58 3.51-3.47 9.14-3.47 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"/></svg>
            </Link>
            <span>Refresh</span>
          </div>
          <div className="header-icon general tooltips">
            <Link to="/metrics">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path className="svg_ics" d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"/></svg>
            <span>Metrics</span>
            </Link>
          </div>
          <div className="header-icon general tooltips">
            <Link to="/test1">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path className="svg_ics" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            <span>Notifications</span>
            </Link>
          </div>
          <div className="header-icon user-icon">
            <Link to="/test1/">
              <img src="../../src/assets/icons/SeyfoIcon@3x.png"></img>
            </Link>
          </div>
          <div className="header-icon sign_out tooltips">
            <Link to="/">
              <svg onClick={() => this.props.googleAuth.signOut()} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path className="svg_ics" d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
            </Link>
            <span>Sign out</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;