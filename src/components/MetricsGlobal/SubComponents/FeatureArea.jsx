import React from "react";

class FeatureArea extends React.Component {
  constructor(props) {
    super(props);
  }

  generateFeatureInfo(imageLink, header, body, href) {
    return (
      <div className="feature">
        <a href={href}>
          <img src={imageLink} alt="" />
          <h4>{header}</h4>
          <p className="small-text">{body}</p>
        </a>
      </div>
    );
  }

  generateFeatureArea() {
    return (
      <section className="metrics_global_feature_area" id="feature">
        <div className="title">
          <h2>Explore Aggregated ITU Students Metrics</h2>
          <p className="small-text">
            Discovering your schools collective job application analytics gives
            you uncomparable insights about market's reaction towards
            classmates!
          </p>
          <p className="small-text">
            There are {this.props.statistics.total_user} ITU students using
            JobHax platform and they have total{" "}
            {this.props.statistics.total_application} job applications so far!
            It means average of{" "}
            {Math.round(this.props.statistics.total_average * 100) / 100} job
            applications per ITU student!
          </p>
          <p className="small-text">
            You can find the most anticipated companies and job positions amount
            your classmates below!
          </p>
        </div>
        <div className="features">
          {this.generateFeatureInfo(
            "src/assets/icons/featureMetrics.png",
            "Top Companies",
            "You can easily track how many applications you have made each month!",
            "#monthlyapplication"
          )}
          {this.generateFeatureInfo(
            "src/assets/icons/featurePredictions.png",
            "Peak Seasons",
            "You can easily track the trend of your applications",
            "#applicationtrend"
          )}
          {this.generateFeatureInfo(
            "src/assets/icons/featureMetrics.png",
            "Top Positions",
            "You can easily track how many applications you have made each month!",
            "#monthlyapplication"
          )}
        </div>
      </section>
    );
  }

  render() {
    return this.generateFeatureArea();
  }
}

export default FeatureArea;
