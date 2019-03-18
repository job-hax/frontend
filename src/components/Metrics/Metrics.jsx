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
          response: [],
        };
    
        this.response = [];
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
                const {url, config} = getJobAppsRequest;
                config.headers.Authorization = `${response.data.token_type} ${response.data.access_token}`;
                fetchApi(url, config)
                .then(response => {
                    console.log('request');
                    console.log(getJobAppsRequest);
                    console.log("getJobAppsRequest");
                    console.log(response);
                    if (response.ok) {
                    this.dataSaver(response.json.data);
                    }
                });
        });
    }

    dataSaver(data) {
        this.response = JSON.stringify(data);
        this.refreshData();
    }

    refreshData(){
        this.setState({
          response: this.response,
        });
    }

    render() {
        console.log(JSON.parse(this.state.response));
        return(
            <div className="metrics-container">
                <h2>aa</h2>
                {this.state.response[0]}
            </div>
        )
    }
}

    export default Metrics;