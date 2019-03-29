import React, {PureComponent} from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import Header from '../Header/Header.jsx';
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
          appsMonthSourcesWithTotal: [],
          countByJobtitleAndStatusesRequest: [],
          countByStatusesRequest: [],
          wordCountRequest: [],
          currentmonthsoflastyear: [],
        };
    
        this.totalAppsCountRequest = [];
        this.appsCountByMonthRequest = [];
        this.appsMonthSources= [];
        this.appsCountByMonthWithTotalRequest = [];
        this.appsMonthSourcesWithTotal = [];
        this.countByJobtitleAndStatusesRequest = [];
        this.countByStatusesRequest = [];
        this.wordCountRequest = [];
        this.currentmonthsoflastyear = [];
    }

    componentDidMount() {
        new Promise(resolve => setTimeout(resolve,500)) 
        .then(() =>{
            console.log('metrics token:',this.props.token);
            console.log('active?',this.props.active);
            getTotalAppsCountRequest.config.headers.Authorization = this.props.token;
            console.log(getTotalAppsCountRequest.config);
            fetchApi(getTotalAppsCountRequest.url, getTotalAppsCountRequest.config)
            .then(response => {
                if (response.ok) {
                this.totalAppsCountRequest = (response.json.data);
                this.setState({
                    totalAppsCountRequest: this.totalAppsCountRequest,
                });
                }
            });
            console.log('yoyo',getAppsCountByMonthRequest.config);
            getAppsCountByMonthRequest.config.headers.Authorization = this.props.token;
            fetchApi(getAppsCountByMonthRequest.url, getAppsCountByMonthRequest.config)
            .then(response => {
                if (response.ok) {
                this.appsCountByMonthRequest = (response.json.data[0]);
                this.appsCountByMonthRequest.forEach(element => {
                    element["name"] = element["source"];
                    delete element["source"];
                    element["type"] = "bar";
                    element["stack"] = "Company";
                });
                this.currentmonthsoflastyear = (response.json.data[1]);
                this.setState({
                    appsCountByMonthRequest: this.appsCountByMonthRequest,
                    currentmonthsoflastyear: this.currentmonthsoflastyear,
                    });
                this.state.appsCountByMonthRequest.map((item) =>(
                    this.appsMonthSources.push(item.name)
                ))
                this.setState({
                    appsMonthSources: this.appsMonthSources,
                });
                }
            });
            getAppsCountByMonthWithTotalRequest.config.headers.Authorization = this.props.token;
            fetchApi(getAppsCountByMonthWithTotalRequest.url, getAppsCountByMonthWithTotalRequest.config)
            .then(response => {
                if (response.ok) {
                this.appsCountByMonthWithTotalRequest = (response.json.data[0]);
                this.appsCountByMonthWithTotalRequest.forEach(element => {
                    element["name"] = element["source"];
                    delete element["source"];
                    element["type"] = "line";
                });
                this.setState({
                    appsCountByMonthWithTotalRequest: this.appsCountByMonthWithTotalRequest,
                });
                this.state.appsCountByMonthWithTotalRequest.map((item) =>(
                    this.appsMonthSourcesWithTotal.push(item.name)
                ))
                this.setState({
                    appsMonthSourcesWithTotal: this.appsMonthSourcesWithTotal,
                });
                }
            });
            getCountByJobtitleAndStatusesRequest.config.headers.Authorization = this.props.token;
            fetchApi(getCountByJobtitleAndStatusesRequest.url, getCountByJobtitleAndStatusesRequest.config)
            .then(response => {
                if (response.ok) {
                this.countByJobtitleAndStatusesRequest = (response.json.data);
                this.countByJobtitleAndStatusesRequest.data.forEach(element => {
                    element["type"] = "bar";
                    element["stack"] = "Company";
                });
                this.setState({
                    countByJobtitleAndStatusesRequest: this.countByJobtitleAndStatusesRequest,
                });
                }
            });
            getCountByStatusesRequest.config.headers.Authorization = this.props.token;
            fetchApi(getCountByStatusesRequest.url, getCountByStatusesRequest.config)
            .then(response => {
                if (response.ok) {
                this.countByStatusesRequest = (response.json.data);
                this.setState({
                    countByStatusesRequest: this.countByStatusesRequest,
                });
                }
            });
            getWordCountRequest.config.headers.Authorization = this.props.token;
            fetchApi(getWordCountRequest.url, getWordCountRequest.config)
            .then(response => {
                if (response.ok) {
                this.wordCountRequest = (response.json.data);
                this.setState({
                    wordCountRequest: this.wordCountRequest,
                });
                }
            });    
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
                top: '28px',
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
                    data : this.currentmonthsoflastyear
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
                data: this.state.appsMonthSourcesWithTotal,
                x: 'right',
                top: '28px',
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
                data: this.currentmonthsoflastyear
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
        console.log('metrics token',this.props.token);
        return(
            <div >
                <Header googleAuth={this.props.googleAuth}/>
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