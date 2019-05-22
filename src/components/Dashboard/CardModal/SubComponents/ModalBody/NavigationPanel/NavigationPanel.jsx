import React from "react";

class NavigationPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  generateNavigationPanel() {
    const styleNormal = {};
    const styleSelected = {
      fontWeight: "450",
      color: "white",
      backgroundColor: "rgba(132, 100, 239, 1)" //"rgba(38, 18, 104, 0.4)"
    };
    return this.props.sections.map(section => (
      <div
        style={this.props.displaying == section ? styleSelected : styleNormal}
        key={this.props.sections.indexOf(section)}
        className="modal-body navigation subheaders"
        onClick={() => this.props.setDisplaying(section)}
      >
        {section}
      </div>
    ));
  }

  render() {
    return (
      <div className="modal-body navigation">
        {this.generateNavigationPanel()}
      </div>
    );
  }
}

export default NavigationPanel;
