import React, {PureComponent} from "react";
import classNames from 'classnames';

import './style.scss'

class JobInput extends PureComponent {
  render() {
    const {
      showInput
    } = this.props;

    return (
      showInput ?
        <div>
          <div>
            <form className="column-addJob-form" id="addJob">
              <h1 contentEditable="true" className="addJob-company" id="company">Company Name</h1>
              <h1 contentEditable="true" className="addJob-position" id="jobTitle">Job Title</h1>
            </form>
          </div>
          <div>
            <button className="column-addJob-form-button" onClick={this.toggleAddJob}>Cancel</button>
            <button className="column-addJob-form-button addJob" onClick={this.toggleAddJob}>Add Job</button>
          </div>
        </div> :
        <div className="column-addJob" onClick={this.toggleAddJob}>
          +
        </div>
    )
  }
}

export default JobInput;
