import React from "react";

class DropDownSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOptionsShowing: false
    };
  }

  generateOptionList() {
    return this.props.itemList.map(item => (
      <div
        key={item.id}
        className="dropdown-item"
        onClick={() => this.props.selector(item.param, item.name)}
      >
        {item.name}
      </div>
    ));
  }

  render() {
    const optionsStyle = this.state.isOptionsShowing ? "" : "none";
    return (
      <div onMouseLeave={() => this.setState({ isOptionsShowing: false })}>
        <div
          className="dropdown-menu"
          onClick={() => this.setState({ isOptionsShowing: true })}
        >
          {this.props.menuName}
          {!this.state.isOptionsShowing && (
            <img src="../../../src/assets/icons/ExpandArrow@3x.png" />
          )}
        </div>
        <div
          className="dropdown-items-container"
          style={{ display: optionsStyle }}
        >
          <div className="up-arrow-container">
            <img src="../../../src/assets/icons/ExpandArrow@3x.png" />
          </div>
          {this.generateOptionList()}
        </div>
      </div>
    );
  }
}

export default DropDownSelector;
