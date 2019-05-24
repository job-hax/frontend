import React from "react";

import { makeTimeBeautiful } from "../../../../../../../utils/constants/constants.js";
import CompanyStats from "../../../../../../Partials/CompanyStats/CompanyStats.jsx";

class JobDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  generateModalBodyInfo(itemsList) {
    return itemsList.map(item => (
      <div key={itemsList.indexOf(item)} className="modal-body main data info">
        <label>{item.id}</label>
        <div>{" : " + item.value}</div>
      </div>
    ));
  }

  render() {
    const { card } = this.props;
    const time = makeTimeBeautiful(card.applyDate, "date");
    return (
      <div className="modal-body main data">
        <div>
          {this.generateModalBodyInfo([
            { id: "Company", value: card.companyObject.company },
            { id: "Position", value: card.position.job_title },
            { id: "Applied on", value: time },
            {
              id: "Source",
              value: card.app_source === null ? "N/A" : card.app_source.value
            }
          ])}
        </div>
        {/*<div className="company-stats-container">
          <CompanyStats company={card.companyObject} />
        </div>*/}
      </div>
    );
  }
}

export default JobDetails;
