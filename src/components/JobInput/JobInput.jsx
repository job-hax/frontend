import React, {PureComponent} from "react";
import classNames from 'classnames';

import './style.scss'

class JobInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyName: '',
      jobTitle: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddNewApplication = this.handleAddNewApplication.bind(this);
  }

  handleInputChange(stateKey) {
    return e => this.setState({
      [stateKey]: e.target.value.trim()
    })
  }

  handleAddNewApplication(e) {
    e.preventDefault();
    const {
      columnName
    } = this.props;
    this.props.addNewApplication({
      columnName,
      name: e.target[0].value,
      title: e.target[1].value,
    })
      .then(({ok}) => {
        if (ok) {
          this.setState({
            companyName: '',
            jobTitle: '',
          })
        }
      })
  }

  render() {
    const {
      showInput,
      toggleJobInput
    } = this.props;

    const {
      companyName,
      jobTitle
    } = this.state;

    const addJobButtonClass = classNames({
      'column-addJob-form-button': true,
      '--addJob': true,
      '--button-disabled': companyName.length < 1 || jobTitle.length < 1
    });
    return (
      showInput ?
        <div>
          <form className="column-addJob-form" onSubmit={this.handleAddNewApplication}>
            <input
              name="company"
              className="input-add-job --company"
              placeholder="Company Name"
              onChange={this.handleInputChange('companyName')}
              value={companyName}
            />
            <input
              name="title"
              className="input-add-job --position"
              placeholder="Job Title"
              onChange={this.handleInputChange('jobTitle')}
              value={jobTitle}
            />
            <div className="column-addJob-form-buttons-container">
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
