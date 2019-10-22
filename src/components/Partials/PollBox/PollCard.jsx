import React from "react";
import moment from "moment";

import {
  IS_CONSOLE_LOG_OPEN,
  DATE_AND_TIME_FORMAT
} from "../../../utils/constants/constants.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { VOTE_POLL } from "../../../utils/constants/endpoints.js";

import "./style.scss";

class PollCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedAnswer: null, isPollSubmitted: false };

    this.handleAnswerClick = this.handleAnswerClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAnswerClick(event) {
    this.setState({ selectedAnswer: Number(event.target.value) });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.submit(event.target.id);
  }

  async submit(id) {
    await this.props.handleTokenExpiration("pollCard submit");
    let config = { method: "POST" };
    config.body = {
      item_id: this.state.selectedAnswer
    };
    axiosCaptcha(VOTE_POLL(id), config).then(response => {
      if (response.statusText === "OK") {
        IS_CONSOLE_LOG_OPEN && console.log(response);
        if (response.data.success == false) {
          this.props.alert(
            5000,
            "error",
            "Error: " + response.data.error_message
          );
        } else {
          this.setState({ isPollSubmitted: true });
          IS_CONSOLE_LOG_OPEN && console.log(this.state.isPollSubmitted);
        }
      }
    });
  }

  generatePollAnswers(answers) {
    return answers.map(answer => (
      <div key={answer.id} className="answer">
        <label>
          <input
            onClick={this.handleAnswerClick}
            type="radio"
            name="react-tips"
            value={answer.id}
          />
          {answer.value}
        </label>
      </div>
    ));
  }

  render() {
    const poll = this.props.poll;
    return (
      <div className="poll-card" key={poll.id}>
        <div>
          <div className="date">
            {moment(poll.date).format(DATE_AND_TIME_FORMAT)}
          </div>
          <div className="question">{poll.title}</div>
        </div>
        {!this.state.isPollSubmitted ? (
          <form onSubmit={this.handleSubmit} id={poll.id}>
            <div className="answer">{this.generatePollAnswers(poll.items)}</div>
            <div className="button-container">
              <button className="submit" type="submit">
                submit
              </button>
            </div>
          </form>
        ) : (
          <div className="message">
            Your answer has been submitted successfully!
          </div>
        )}
      </div>
    );
  }
}

export default PollCard;
