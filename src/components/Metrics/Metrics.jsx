import React, {PureComponent} from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {fetchApi} from '../../utils/api/fetch_api'
import {
  authenticateRequest,
  getTotalAppsCountRequest,
  getAppsCountByMonthRequest,
  getAppsCountByMonthWithTotalRequest,
  getCountByJobtitleAndStatusesRequest,
  getCountByStatusesRequest,
  getWordCountRequest
} from '../../utils/api/requests.js'

import './style.scss'

class Metrics extends PureComponent {
    
    constructor(props) {
        super(props);
    
        this.state = {
          totalAppsCountRequest: [],
          appsCountByMonthRequest: [],
          appsMonthSources: [],
          appsCountByMonthWithTotalRequest: [],
          countByJobtitleAndStatusesRequest: [],
          countByStatusesRequest: [],
          wordCountRequest: [],
        };
    
        this.totalAppsCountRequest = [];
        this.appsCountByMonthRequest = [];
        this.appsMonthSources= [];
        this.appsCountByMonthWithTotalRequest = [];
        this.countByJobtitleAndStatusesRequest = [];
        this.countByStatusesRequest = [];
        this.wordCountRequest = [];
    }

    componentDidMount() {
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
                    this.appsCountByMonthRequest.forEach(element => {
                        element["name"] = element["source"];
                        delete element["source"];
                        element["type"] = "bar";
                        element["stack"] = "Company";
                    });
                    console.log('getAppsCountByMonthRequest.response.json.data');
                    console.log(this.appsCountByMonthRequest);
                    this.setState({
                        appsCountByMonthRequest: this.appsCountByMonthRequest,
                      });
                    this.state.appsCountByMonthRequest.map((item) =>(
                        this.appsMonthSources.push(item.source)
                    ))
                    this.setState({
                        appsMonthSources: this.appsMonthSources,
                    });
                    console.log('statuses for monthly graph',this.state.appsMonthSources)
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
                    this.appsCountByMonthWithTotalRequest.forEach(element => {
                        element["name"] = element["source"];
                        delete element["source"];
                        element["type"] = "line";
                    });
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
                    this.countByJobtitleAndStatusesRequest.data.forEach(element => {
                        element["type"] = "bar";
                        element["stack"] = "Company";
                    });
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
                this.state.appsCountByMonthRequest.map((item) =>(
                    this.appsMonthSources.push(item.source)
                ))
                this.setState({
                    appsMonthSources: this.appsMonthSources,
                });
                console.log('statuses for monthly graph',this.appsMonthSources)
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

    generateFeatureInfo(imageLink,header,body,href) {
        return (
          <div className="feature">
            <a href={href}>
                <img src={imageLink} alt=""></img>
                <h4>{header}</h4>
                <p className="small-text">{body}</p>
            </a>
          </div>
        )
      }
    
    generateFeatureArea() {
        return (
            <section className="metrics_feature_area" id="feature">
            <div className="title">
                <h2>Evaluate Your Process in a Unique Way</h2>
                <p className="small-text">Analysing your job application history provides you a priceless perspective to understand and improve your strategy!</p>
                <p className="small-text">You have total {this.state.totalAppsCountRequest.count} job applications so far! That means you have already taken {this.state.totalAppsCountRequest.count} steps towards your perfect job!</p>
            </div>
            <div className="features">
                {this.generateFeatureInfo(
                "src/assets/icons/featureMetrics.png",
                "Monthly Application",
                "You can easily track how many applications you have made each month!",
                "#monthlyapplication"
                )}
                {this.generateFeatureInfo(
                "src/assets/icons/featurePredictions.png",
                "Application Trend",
                "You can easily track the trend of your applications",
                "#applicationtrend"
                )}
                {this.generateFeatureInfo(
                "src/assets/icons/piechartmetric.png",
                "Application Stages",
                "You can easily track how many of your applications at which stage",
                "#applicationstages"
                )}
                {this.generateFeatureInfo(
                "src/assets/icons/positionsbystagesmetric.png",
                "Stages in Positions",
                "You can easily track how many of your applications for each position at which stage",
                "#stagesinpositions"
                )}
            </div>
            </section>
        )
    }

    chartThemeCreator() {
        echarts.registerTheme('positionsbystages', {
            color: ['#F4EBC1','#A0C1B8','#709FB0','#726A95','#351F39'],
            backgroundColor: 'rgb(92, 39, 195)',
            legend: {
                textStyle: {
                    color: 'white'
                }
            },
            textStyle: {
                fontType: 'Exo',
                color: 'white'
            },
            title: {
                textStyle: {
                    color: 'white'
                }
            },
        }),
        echarts.registerTheme('monthlyapplications', {
            color: ['#E82F3A','#0077B5','#2164f4','rgb(64,151,219)','#261268'],
            backgroundColor: 'white',
            legend: {
                textStyle: {
                    color: '#261268'
                }
            },
            textStyle: {
                fontType: 'Exo',
                color: '#261268'
            },
            title: {
                textStyle: {
                    color: '#261268'
                }
            },
        }),
        echarts.registerTheme('monthlyapplicationsline', {
            color: ['#E82F3A','#0077B5','#2164f4','rgb(64,151,219)','#261268','rgb(255,255,255)'],
            backgroundColor: 'rgb(92, 39, 195)', 
            textStyle: {
                fontType: 'Exo',
                color: 'white'
            },
            title: {
                textStyle: {
                    color: 'white'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#black'
                }
            },
        }),
        echarts.registerTheme('stagesofapplications', {
            color: ['#F5AB99','#FEB47B','#FF7E5F','#765285','#351C4D'],
            backgroundColor: 'white', 
            textStyle: {
                fontType: 'Exo',
                color: '#261268'
            },
            title: {
                textStyle: {
                    color: '#261268'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '##261268'
                }
            },
        })
    }

    buildPositionsByStagesGraph () {
        this.chartThemeCreator();
        return {
            title : {
                text: 'Position by Stages Graph',
                subtext: '',
                x:'center',
                top: '0px'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {           
                    type : 'shadow'        
                }
            },
            legend: {
                data:this.state.countByJobtitleAndStatusesRequest.statuses,
                x:'center',
                bottom: '-5px'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '5%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : this.state.countByJobtitleAndStatusesRequest.jobs
                }
            ],
            yAxis : [
                {
                    type : 'value',
                }
            ],
            series : this.state.countByJobtitleAndStatusesRequest.data
        };
    };

    buildMonthlyApplicationGraph () {
        this.chartThemeCreator();
        return {
            title : {
                text: 'Monthly Application Graph',
                subtext: '',
                x:'center',
                top: '0px'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {           
                    type : 'shadow'        
                }
            },
            legend: {
                data: this.state.appsMonthSources,
                x:'right',
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['January','February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : this.state.appsCountByMonthRequest
        };
    };

    buildMonthlyApplicationLineGraph () {
        this.chartThemeCreator();
        return {
            title : {
                text: 'Monthly Applications Line Graph',
                subtext: '',
                x:'center',
                top: '0px'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: this.state.appsMonthSources,
                x: 'right'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['January','February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            },
            yAxis: {
                type: 'value'
            },
            series: this.state.appsCountByMonthWithTotalRequest
        };
    };

    buildStagesOfApplicationsPieChart () {
        this.chartThemeCreator();
        return {
            title : {
                text: 'Stages of Applications',
                subtext: '',
                x:'center',
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: this.state.appsMonthSources,
            },
            series : [
                {
                    name: 'Stages',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: this.state.countByStatusesRequest,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    };

    render() {
        return(
            <div >
                {this.generateFeatureArea()}
                <div className="graph-container-dark-background" id="monthlyapplication">
                    <div className="graph">
                        <ReactEcharts
                        option={this.buildMonthlyApplicationGraph()}
                        style={{height: '440px', width: '740px', margin:'30px'}}
                        theme= 'monthlyapplications'
                        />
                    </div>
                </div>
                <div className="graph-container-light-background" id="applicationtrend">
                    <div className="graph-dark">
                        <ReactEcharts
                        option={this.buildMonthlyApplicationLineGraph()}
                        style={{height: '440px', width: '740px', margin:'30px'}}
                        theme= 'monthlyapplicationsline'
                        />
                    </div>
                </div>
                <div className="graph-container-dark-background" id="applicationstages">
                    <div className="graph">
                        <ReactEcharts
                        option={this.buildStagesOfApplicationsPieChart()}
                        style={{height: '440px', width: '740px', margin:'30px'}}
                        theme= 'stagesofapplications'
                        />
                    </div>
                </div>
                <div className="graph-container-light-background" id="stagesinpositions">
                    <div className="graph-dark">
                        <ReactEcharts
                        option={this.buildPositionsByStagesGraph()}
                        style={{height: '440px', width: '740px', margin:'30px'}}
                        theme= 'positionsbystages'
                        />
                    </div>
                </div>
                
            </div>
        );
    }
}

    export default Metrics;