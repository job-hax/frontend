import React, {PureComponent} from "react";
import classNames from 'classnames';

import './style.scss'

class JobInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyNameValidated: false,
      jobTitleValidated: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddNewApplication = this.handleAddNewApplication.bind(this);
  }

  handleInputChange(e) {
    let {
      companyNameValidated,
      jobTitleValidated
    } = this.state;
    if (e.target.value.trim().length > 0) {
      if (e.target.name === 'company') {
        companyNameValidated = true;
      } else {
        jobTitleValidated = true;
      }
    } else {
      if (e.target.name === 'company') {
        companyNameValidated = false;
      } else {
        jobTitleValidated = false;
      }
    }
    this.setState({
      companyNameValidated,
      jobTitleValidated
    })
  }

  handleAddNewApplication(e) {
    const {
      columnId
    } = this.props;
    e.preventDefault();
    this.props.addNewApplication({
      columnId,
      name: e.target[0].value,
      title: e.target[1].value,
    })
  }

  render() {
    const {
      showInput,
      toggleJobInput
    } = this.props;

    const {
      companyNameValidated,
      jobTitleValidated
    } = this.state;

    const addJobButtonClass = classNames({
      'column-addJob-form-button': true,
      '--addJob': true,
      '--button-disabled': !companyNameValidated || !jobTitleValidated
    });
    return (
      showInput ?
        <div>
          <form className="column-addJob-form" onSubmit={this.handleAddNewApplication}>
            <input
              name="company"
              className="input-add-job --company"
              placeholder="Company Name"
              onChange={this.handleInputChange}
            />
            <input
              name="title"
              className="input-add-job --position"
              placeholder="Job Title"
              onChange={this.handleInputChange}
            />
            <div>
              <button
                className="column-addJob-form-button"
                onClick={toggleJobInput}
              >
                Cancel
              </button>
              <button
                className={addJobButtonClass}
              >
                Add Job
              </button>
            </div>
          </form>
        </div> :
        <div className="column-addJob" onClick={toggleJobInput}>
          +
        </div>
    )
  }
}

export default JobInput;
