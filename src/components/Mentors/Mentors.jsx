import React, { PureComponent } from "react";
import { Button } from "antd";

import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { USERS } from "../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import MentorCategory from "./SubComponents/MentorCategory/MentorCategory.jsx";

import "./style.scss";

class Mentors extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      mentorOnDisplay: "",
      mentorsData: [
        {
          cagetoryName: "Top Mentors",
          mentors: [
            {
              id: 1,
              company: "Evercoin",
              companyLogo: "https://logo.clearbit.com/evercoin.com",
              position: "Android Developer",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              id: 2,
              company: "Google",
              companyLogo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
              position: "Product Manager",
              fullName: "Suhas Avadhuta",
              photoUrl:
                "https://media.licdn.com/dms/image/C4E03AQGdaM6-jDB7oA/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=UCjVGmJBbDd4VwcPu4CfQhi3uVuuRVJTALOmSlYNZNY"
            },
            {
              id: 3,
              company: "Opengov",
              companyLogo: "https://logo.clearbit.com/opengov.com",
              position: "DevOps",
              fullName: "Sako M",
              photoUrl:
                "https://media.licdn.com/dms/image/C5603AQElIIuc89DUQg/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=100zl9rFw6QhQEmafTriUJkD60n8bvcNbVwj-5x2JBM"
            },
            {
              id: 4,
              company: "JobHax",
              companyLogo: "../../../src/assets/icons/JobHax-logo-black.png",
              position: "Front-End Developer",
              fullName: "Egemen Uslu",
              photoUrl:
                "https://backend.jobhax.com/media/65823394-c838-45ce-a08e-002e983bef7e.jpg"
            },
            {
              id: 1,
              company: "Evercoin",
              companyLogo: "https://logo.clearbit.com/evercoin.com",
              position: "Android Developer",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              id: 1,
              company: "Evercoin",
              companyLogo: "https://logo.clearbit.com/evercoin.com",
              position: "Android Developer",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              id: 2,
              company: "Google",
              companyLogo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
              position: "Product Manager",
              fullName: "Suhas Avadhuta",
              photoUrl:
                "https://media.licdn.com/dms/image/C4E03AQGdaM6-jDB7oA/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=UCjVGmJBbDd4VwcPu4CfQhi3uVuuRVJTALOmSlYNZNY"
            },
            {
              id: 3,
              company: "Opengov",
              companyLogo: "https://logo.clearbit.com/opengov.com",
              position: "DevOps",
              fullName: "Sako M",
              photoUrl:
                "https://media.licdn.com/dms/image/C5603AQElIIuc89DUQg/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=100zl9rFw6QhQEmafTriUJkD60n8bvcNbVwj-5x2JBM"
            },
            {
              id: 4,
              company: "JobHax",
              companyLogo: "../../../src/assets/icons/JobHax-logo-black.png",
              position: "Front-End Developer",
              fullName: "Egemen Uslu",
              photoUrl:
                "https://backend.jobhax.com/media/65823394-c838-45ce-a08e-002e983bef7e.jpg"
            }
          ]
        },
        {
          cagetoryName: "Based on Your Applications",
          mentors: [
            {
              id: 2,
              company: "Google",
              companyLogo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
              position: "Product Manager",
              fullName: "Suhas Avadhuta",
              photoUrl:
                "https://media.licdn.com/dms/image/C4E03AQGdaM6-jDB7oA/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=UCjVGmJBbDd4VwcPu4CfQhi3uVuuRVJTALOmSlYNZNY"
            },
            {
              id: 3,
              company: "Opengov",
              companyLogo: "https://logo.clearbit.com/opengov.com",
              position: "DevOps",
              fullName: "Sako M",
              photoUrl:
                "https://media.licdn.com/dms/image/C5603AQElIIuc89DUQg/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=100zl9rFw6QhQEmafTriUJkD60n8bvcNbVwj-5x2JBM"
            },
            {
              id: 1,
              company: "Evercoin",
              companyLogo: "https://logo.clearbit.com/evercoin.com",
              position: "Android Developer",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              id: 4,
              company: "JobHax",
              companyLogo: "../../../src/assets/icons/JobHax-logo-black.png",
              position: "Front-End Developer",
              fullName: "Egemen Uslu",
              photoUrl:
                "https://backend.jobhax.com/media/65823394-c838-45ce-a08e-002e983bef7e.jpg"
            },
            {
              id: 1,
              company: "Evercoin",
              companyLogo: "https://logo.clearbit.com/evercoin.com",
              position: "Android Developer",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              id: 1,
              company: "Evercoin",
              companyLogo: "https://logo.clearbit.com/evercoin.com",
              position: "Android Developer",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              id: 2,
              company: "Google",
              companyLogo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
              position: "Product Manager",
              fullName: "Suhas Avadhuta",
              photoUrl:
                "https://media.licdn.com/dms/image/C4E03AQGdaM6-jDB7oA/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=UCjVGmJBbDd4VwcPu4CfQhi3uVuuRVJTALOmSlYNZNY"
            },
            {
              id: 3,
              company: "Opengov",
              companyLogo: "https://logo.clearbit.com/opengov.com",
              position: "DevOps",
              fullName: "Sako M",
              photoUrl:
                "https://media.licdn.com/dms/image/C5603AQElIIuc89DUQg/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=100zl9rFw6QhQEmafTriUJkD60n8bvcNbVwj-5x2JBM"
            },
            {
              id: 4,
              company: "JobHax",
              companyLogo: "../../../src/assets/icons/JobHax-logo-black.png",
              position: "Front-End Developer",
              fullName: "Egemen Uslu",
              photoUrl:
                "https://backend.jobhax.com/media/65823394-c838-45ce-a08e-002e983bef7e.jpg"
            }
          ]
        },

        {
          cagetoryName: "Since you applied Google",
          mentors: [
            {
              id: 1,
              company: "Evercoin",
              companyLogo: "https://logo.clearbit.com/evercoin.com",
              position: "Android Developer",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              id: 2,
              company: "Google",
              companyLogo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
              position: "Product Manager",
              fullName: "Suhas Avadhuta",
              photoUrl:
                "https://media.licdn.com/dms/image/C4E03AQGdaM6-jDB7oA/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=UCjVGmJBbDd4VwcPu4CfQhi3uVuuRVJTALOmSlYNZNY"
            },
            {
              id: 3,
              company: "Opengov",
              companyLogo: "https://logo.clearbit.com/opengov.com",
              position: "DevOps",
              fullName: "Sako M",
              photoUrl:
                "https://media.licdn.com/dms/image/C5603AQElIIuc89DUQg/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=100zl9rFw6QhQEmafTriUJkD60n8bvcNbVwj-5x2JBM"
            },
            {
              id: 4,
              company: "JobHax",
              companyLogo: "../../../src/assets/icons/JobHax-logo-black.png",
              position: "Front-End Developer",
              fullName: "Egemen Uslu",
              photoUrl:
                "https://backend.jobhax.com/media/65823394-c838-45ce-a08e-002e983bef7e.jpg"
            },
            {
              id: 1,
              company: "Evercoin",
              companyLogo: "https://logo.clearbit.com/evercoin.com",
              position: "Android Developer",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              id: 1,
              company: "Evercoin",
              companyLogo: "https://logo.clearbit.com/evercoin.com",
              position: "Android Developer",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              id: 2,
              company: "Google",
              companyLogo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
              position: "Product Manager",
              fullName: "Suhas Avadhuta",
              photoUrl:
                "https://media.licdn.com/dms/image/C4E03AQGdaM6-jDB7oA/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=UCjVGmJBbDd4VwcPu4CfQhi3uVuuRVJTALOmSlYNZNY"
            },
            {
              id: 3,
              company: "Opengov",
              companyLogo: "https://logo.clearbit.com/opengov.com",
              position: "DevOps",
              fullName: "Sako M",
              photoUrl:
                "https://media.licdn.com/dms/image/C5603AQElIIuc89DUQg/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=100zl9rFw6QhQEmafTriUJkD60n8bvcNbVwj-5x2JBM"
            },
            {
              id: 4,
              company: "JobHax",
              companyLogo: "../../../src/assets/icons/JobHax-logo-black.png",
              position: "Front-End Developer",
              fullName: "Egemen Uslu",
              photoUrl:
                "https://backend.jobhax.com/media/65823394-c838-45ce-a08e-002e983bef7e.jpg"
            }
          ]
        }
      ]
    };

    this.changeMentorOnDisplay = this.changeMentorOnDisplay.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ mentorOnDisplay: "" });
    }
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      await this.props.handleTokenExpiration("mentors getData");
      let config = { method: "POST" };
      axiosCaptcha(USERS("verifyRecaptcha"), config, false).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success != true) {
            this.setState({ isUpdating: false });
            IS_CONSOLE_LOG_OPEN &&
              console.log(response, response.data.error_message);
            this.props.alert(
              5000,
              "error",
              "Error: " + response.data.error_message
            );
          }
        }
      });
    }
  }

  changeMentorOnDisplay(mentor) {
    this.setState({ mentorOnDisplay: mentor });
  }

  generateMentorCategories() {
    return this.state.mentorsData.map(category => (
      <div
        className="mentor-category-main-container"
        key={this.state.mentorsData.indexOf(category)}
      >
        <div className="mentor-category-name">{category.cagetoryName}</div>
        <div className="mentor-category-scroll-hide-container">
          <div className="mentors-category-container">
            <div>
              <div className="mentors-category">
                <MentorCategory
                  selectMentor={this.changeMentorOnDisplay}
                  mentors={category.mentors}
                  cookie={this.props.cookie}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  generateMentorDetails(mentor) {
    return (
      <div>
        <div>
          <div className="mentor-on-display-container">
            <div className="mentor-on-display-left">
              <div className="avatar">
                <img
                  src={
                    mentor.photoUrl
                      ? mentor.photoUrl
                      : "../../../../src/assets/icons/SeyfoIcon@3x.png"
                  }
                />
              </div>
            </div>
            <div className="mentor-on-display-middle">
              <div className="mentor-info">
                <div className="mentor-name">{mentor.fullName}</div>
                <div className="mentor-employment">
                  {mentor.position + " at " + mentor.company}
                </div>
                <div className="mentor-company">
                  <img src={mentor.companyLogo} />
                  <div className="company-name">{mentor.company}</div>
                </div>
              </div>
              <div className="button-container">
                <Button style={{ width: "180px" }}>Connect</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.mentorOnDisplay === "" ? (
          <div>
            <div style={{ height: 60 }} />
            <div className="mentor-feature-area">
              <div className="header">Mentorship Hub</div>
              <div className="body">
                Directly connect with industries top professionals and ask your
                individual questions, get feedback about your job hunting
                process, request online meeting for your questions to boost your
                success.
              </div>
              <div className="body">
                You may set up a one hour mock interview with your target
                companies' employees and even request a referral from them!{" "}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="mentor-on-display-big-container"
            ref={this.setWrapperRef}
          >
            {this.generateMentorDetails(this.state.mentorOnDisplay)}
          </div>
        )}
        <div className="mentor-categories-container">
          {this.generateMentorCategories()}
        </div>
        <div style={{ height: 100 }} />
        <div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Mentors;
