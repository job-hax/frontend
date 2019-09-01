import React from "react";

import MentorGroup from "../Containers/MentorGroupContainer.jsx";
import { axiosCaptcha } from "../../../../utils/api/fetch_api.js";
import Spinner from "../../../Partials/Spinner/Spinner.jsx";

class MentorCategory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isInitialRequest: "beforeRequest"
    };
  }

  /*
    componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      //this.getData();
      return
    }
  }

  getData() {
    if (
      this.props.cookie("get", "jobhax_access_token") != ("" || null) &&
      this.state.isInitialRequest === "beforeRequest"
    ) {
      this.setState({ isInitialRequest: true });
      axiosCaptcha(getMetrics.url("personal/generic"), getMetrics.config).then(
        response => {
          if (response.statusText === "OK") {
            this.data = response.data.data;
            this.setState({
              genericData: this.data
            });
          }
        }
      );
      axiosCaptcha(getMetrics.url("personal/detailed"), getMetrics.config).then(
        response => {
          if (response.statusText === "OK") {
            this.data = response.data.data;
            this.setState({
              detailedData: this.data,
              isInitialRequest: false
            });
          }
        }
      );
    }
  }
*/

  generateMentorsCategory() {
    return (
      <div>
        <div>
          <MentorGroup
            selectMentor={this.props.selectMentor}
            cookie={this.props.cookie}
            mentors={this.props.mentors}
          />
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.generateMentorsCategory()}</div>;
  }
}

export default MentorCategory;
