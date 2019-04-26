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
      <section className="metrics_feature_area" id="feature">
        <div className="title">
          <h2>Evaluate Your Process in a Unique Way</h2>
          <p className="small-text">
            Analysing your job application history provides you a priceless
            perspective to understand and improve your strategy!
          </p>
          <p className="small-text">
            You have total {this.props.count} job applications so far! That
            means you have already taken {this.props.count} steps towards your
            perfect job!
          </p>
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
    );
  }

  render() {
    return this.generateFeatureArea();
  }
}

export default FeatureArea;
