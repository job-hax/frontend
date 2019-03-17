import React, {Component} from 'react';
import Footer from '../Footer/Footer.jsx';
import {Link} from 'react-router-dom';

import './style.scss'

class Home extends Component {

  generateTopButtons(){
    return (
      <div className="top_buttons">
        <Link to="/aboutus">
          <button>About us</button>
        </Link>
        <Link to="/signup">
          <button>Sign up</button>
        </Link>
        <Link to="/signin">
          <button>Sign in</button>
        </Link>
      </div>
    )
  }

  generateHeaderArea(){
    return(
      <section className="header_area" id="home">
        {this.generateTopButtons()}
        <div className="intro">
          <h2>Simplify your job hunt!</h2>
          <p>Improve your job search experience in a seamless & intuitive way</p>
          <a className="how_it_works_btn" href="#howitworks">How It Works</a>
        </div>
      </section>
    )
  }

  generateFeatureInfo(imageLink,header,body) {
    return (
      <div className="col-lg-3 col-md-6">
        <div className="feature_item">
          <img src={imageLink} styleName="width:90%; height: 90%" alt=""></img>
          <h4 styleName="padding-top: 30px">{header}</h4>
          <p>{body}</p>
        </div>
      </div>
    )
  }

  generateFeatureArea() {
    return (
      <section className="feature_area" id="feature">
          <div className="container">
            <div className="main_title">
              <h2>Unique Features</h2>
              <p>No more messy spreadsheets or digging through emails to see the status of your job applications!</p>
            </div>
            <div className="feature_inner row">
              {this.generateFeatureInfo(
                "/static/images/emailtracking1.jpg",
                "Email Tracking",
                "Too many job app emails to dig through? We can identify & automatically track those jobs on our dashboard!"
              )}
              {this.generateFeatureInfo(
                "/static/images/metrics2.png",
                "Metrics",
                "'We can only improve what we measure', that's why we analyze your data & give you insightful metrics to analyze."
              )}
              {this.generateFeatureInfo(
                "/static/images/share.png",
                "Upcoming: Sharing",
                "This upcoming feature will allow you to share your job search progress & seek advice with someone like your career advisor."
              )}
              {this.generateFeatureInfo(
                "/static/images/predictions.png",
                "Upcoming: Predictions & Notifications",
                "We can do things like remind you of upcoming interviews & suggest jobs!"
              )}
            </div>
          </div>
        </section>
    )
  }

  generateInteriorItem(imageLink,header,body) {
    return (
      <section className="interior_area">
        <div className="container">
          <div className="interior_inner row">
            <div className="col-lg-6">
              <img className="img-fluid" src={imageLink} alt=""></img>
            </div>
            <div className="col-lg-5 offset-lg-1">
              <div className="interior_text">
                <h4>{header}</h4>
                <p>{body}</p>
                {/* <a className="main_btn" href="#">See Details</a> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  generateHowItWorksArea() {
    return (
      <div class="how_it_works_area" id="howitworks">
        {this.generateInteriorItem(
          "../../static/images/apply_to_jobs.jpg",
          "Apply to jobs & have them all automatically tracked",
          "Anytime you apply for a job, we track it automatically! When we see job application emails in your inbox, we add it to your jobs dashboard. Of course, you can also manually add jobs you are interested in to have it tracked."
        )}
        {this.generateInteriorItem(
          "../../static/images/organize_jobs.jpg",
          "See your progression & organize your job search",
          "Once you have applied to jobs you are interested in, we want you to easily visualize and organize your job search. You can quickly see the status of all your job applications, add new information, keep all your contacts & relevant details like dates, tasks, salaries, etc. linked to your job card."
        )}
        {this.generateInteriorItem(
          "../../static/images/metrics.jpg",
          "Get metrics & analytics on your job search",
          "As you progress through your job search, we make it easy to identify problem areas so that you can constantly make improvements. For example, we can provide you with metrics on common attributes (skills, position, experience, etc.) among jobs which you are being rejected for so you can make changes to your resume."
        )}
      </div>
      
    )
  }

  render() {
    return (
      <div className="home-container">
        {this.generateHeaderArea()}
        {this.generateFeatureArea()}
        {this.generateHowItWorksArea()}
        <Footer/>
      </div>
    );
  }
}

export default Home;