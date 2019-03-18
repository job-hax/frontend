import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {fetchApi} from '../../utils/api/fetch_api'
import {
  authenticateRequest,
  getJobAppsRequest,
  getTotalAppsCountRequest,
  getAppsCountByMonthRequest,
  getAppsCountByMonthWithTotalRequest,
  getCountByJobtitleAndStatusesRequest,
  getCountByStatusesRequest,
  getWordCountRequest
} from '../../utils/api/requests.js'
import {IS_MOCKING} from '../../config/config.js';
import {mockJobApps} from '../../utils/api/mockResponses.js'

import './style.scss'

class Metrics extends Component {
    
    constructor(props) {
        super(props);
    
        this.state = {
          totalAppsCountRequest: [],
          appsCountByMonthRequest: [],
          appsCountByMonthWithTotalRequest: [],
          countByJobtitleAndStatusesRequest: [],
          countByStatusesRequest: [],
          wordCountRequest: [],
        };
    
        this.totalAppsCountRequest = [];
        this.appsCountByMonthRequest = [];
        this.appsCountByMonthWithTotalRequest = [];
        this.countByJobtitleAndStatusesRequest = [];
        this.countByStatusesRequest = [];
        this.wordCountRequest = [];
    }

    componentDidMount() {
        if (IS_MOCKING) {
          this.dataSaver(mockJobApps.data);
          return;
        }
        const {url, config} = authenticateRequest;
        config.body.token = this.props.googleAuth.currentUser.get().getAuthResponse().access_token;
        config.body = JSON.stringify(config.body)
        fetchApi(url, config)
            .then(response => {
                console.log("authenticateRequest");
                console.log(response);
                if (response.ok) {
                return response.json;
                }
            })
            .then(response => {
                const {url, config} = getTotalAppsCountRequest;
                config.headers.Authorization = `${response.data.token_type} ${response.data.access_token}`;
                fetchApi(url, config)
                .then(response => {
                    console.log('getTotalAppsCountRequest');
                    console.log(getTotalAppsCountRequest);
                    if (response.ok) {
                    this.totalAppsCountRequest = (response.json.data);
                    console.log('getTotalAppsCountRequest.response.json.data');
                    console.log(this.totalAppsCountRequest);
                    this.setState({
                        totalAppsCountRequest: this.totalAppsCountRequest,
                      });
                    }
                });
                return response;
            })
            .then(response => {
                const {url, config} = getAppsCountByMonthRequest;
                config.headers.Authorization = `${response.data.token_type} ${response.data.access_token}`;
                fetchApi(url, config)
                .then(response => {
                    console.log('getAppsCountByMonthRequest');
                    console.log(getAppsCountByMonthRequest);
                    if (response.ok) {
                    this.appsCountByMonthRequest = (response.json.data);
                    console.log('getAppsCountByMonthRequest.response.json.data');
                    console.log(this.appsCountByMonthRequest);
                    this.setState({
                        appsCountByMonthRequest: this.appsCountByMonthRequest,
                      });
                    }
                });
                return response;
            })
            .then(response => {
                const {url, config} = getAppsCountByMonthWithTotalRequest;
                config.headers.Authorization = `${response.data.token_type} ${response.data.access_token}`;
                fetchApi(url, config)
                .then(response => {
                    console.log('getAppsCountByMonthWithTotalRequest');
                    console.log(getAppsCountByMonthWithTotalRequest);
                    if (response.ok) {
                    this.appsCountByMonthWithTotalRequest = (response.json.data);
                    console.log('getAppsCountByMonthWithTotalRequest.response.json.data');
                    console.log(this.appsCountByMonthWithTotalRequest);
                    this.setState({
                        appsCountByMonthWithTotalRequest: this.appsCountByMonthWithTotalRequest,
                      });
                    }
                });
                return response;
            })
            .then(response => {
                const {url, config} = getCountByJobtitleAndStatusesRequest;
                config.headers.Authorization = `${response.data.token_type} ${response.data.access_token}`;
                fetchApi(url, config)
                .then(response => {
                    console.log('getCountByJobtitleAndStatusesRequest');
                    console.log(getCountByJobtitleAndStatusesRequest);
                    if (response.ok) {
                    this.countByJobtitleAndStatusesRequest = (response.json.data);
                    console.log('getCountByJobtitleAndStatusesRequest.response.json.data');
                    console.log(this.countByJobtitleAndStatusesRequest);
                    this.setState({
                        countByJobtitleAndStatusesRequest: this.countByJobtitleAndStatusesRequest,
                      });
                    }
                });
                return response;
            })
            .then(response => {
                const {url, config} = getCountByStatusesRequest;
                config.headers.Authorization = `${response.data.token_type} ${response.data.access_token}`;
                fetchApi(url, config)
                .then(response => {
                    console.log('getCountByStatusesRequest');
                    console.log(getCountByStatusesRequest);
                    if (response.ok) {
                    this.countByStatusesRequest = (response.json.data);
                    console.log('getCountByStatusesRequest.response.json.data');
                    console.log(this.countByStatusesRequest);
                    this.setState({
                        countByStatusesRequest: this.countByStatusesRequest,
                      });
                    }
                });
                return response;
            })
            .then(response => {
                const {url, config} = getWordCountRequest;
                config.headers.Authorization = `${response.data.token_type} ${response.data.access_token}`;
                fetchApi(url, config)
                .then(response => {
                    console.log('getWordCountRequest');
                    console.log(getWordCountRequest);
                    if (response.ok) {
                    this.wordCountRequest = (response.json.data);
                    console.log('getWordCountRequest.response.json.data');
                    console.log(this.wordCountRequest);
                    this.setState({
                        wordCountRequest: this.wordCountRequest,
                      });
                    }
                });
                return response;
            })
    }

    mapData (data) {
        switch (data) {
            case 'appsCountByMonthRequest': 
                return(
                    <div>
                        {this.state.appsCountByMonthRequest.map((item) =>(
                            <p> {item.source} - {item.data[10]}</p>
                        ))}
                    </div>
                )
            case 'appsCountByMonthWithTotalRequest': 
                return(
                    <div>
                        {this.state.appsCountByMonthWithTotalRequest.map((item) =>(
                            <p> {item.source}</p>
                        ))}
                    </div>
                )
            case 'countByJobtitleAndStatusesRequest': 
                return(
                    <div>
                        {this.state.countByJobtitleAndStatusesRequest.map((item) =>(
                            <p> {item.source} </p>
                        ))}
                    </div>
                )
            case 'countByStatusesRequest': 
                return(
                    <div>
                        {this.state.countByStatusesRequest.map((item) =>(
                            <p> {item.source}</p>
                        ))}
                    </div>
                )
            case 'wordCountRequest': 
                return(
                    <div>
                        {this.state.wordCountRequest.map((item) =>(
                            <p> {item.source}</p>
                        ))}
                    </div>
                )
            default:
        } 
    }

    generateFeatureInfo(imageLink,header,body) {
        return (
          <div className="feature">
            <img src={imageLink} alt=""></img>
            <h4>{header}</h4>
            <p className="small-text">{body}</p>
          </div>
        )
      }
    
      generateFeatureArea() {
        return (
          <section className="metrics_feature_area" id="feature">
            <div className="title">
              <h2>Evaluate Your Process in a Unique Way</h2>
              <p className="small-text">Analysing your job application history provides you a priceless perspective to understand and iprove your strategy!</p>
              <p className="small-text">You have total {this.state.totalAppsCountRequest.count} job applications so far! That means you have already taken {this.state.totalAppsCountRequest.count} steps towards your perfect job!</p>
            </div>
            <div className="features">
              {this.generateFeatureInfo(
                "src/assets/icons/featureEmail.png",
                "Monthly Application",
                "You can easily track how many applications you have made each month!"
              )}
              {this.generateFeatureInfo(
                "src/assets/icons/featureMetrics.png",
                "Application Trend",
                "You can easily track the trend of your applications"
              )}
              {this.generateFeatureInfo(
                "src/assets/icons/featureSharing.png",
                "Application Stages",
                "You can easily track how many of your applications at which stage"
              )}
              {this.generateFeatureInfo(
                "src/assets/icons/featurePredictions.png",
                "Stages in Positions",
                "You can easily track how many of your applications for each position at which stage"
              )}
            </div>
          </section>
        )
      }

    render() {
        return(
            <div >
                {this.generateFeatureArea()}
                {this.mapData('appsCountByMonthRequest')}
            </div>
        );
    }
}

    export default Metrics;