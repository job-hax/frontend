import React from "react";

import MentorSingle from "./MentorSingleContainer.jsx";

class MentorGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  generateGroup() {
    return this.props.mentors.map(mentor => (
      <div key={this.props.mentors.indexOf(mentor)}>
        <MentorSingle selectMentor={this.props.selectMentor} mentor={mentor} />
      </div>
    ));
  }

  render() {
    return (
      <div>
        <div className="mentors-group">{this.generateGroup()}</div>
      </div>
    );
  }
}

export default MentorGroup;
