import React, { PureComponent } from "react";

import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { postUsersRequest } from "../../utils/api/requests.js";
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
              company: "Evercoin",
              position: "Android Developer",
              university: "ITU",
              graduationYear: 2019,
              degree: "MS Software Engineering",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              company: "Google",
              position: "Product Manager",
              university: "Virginia Tech",
              graduationYear: 2015,
              degree: "BS Computer Science",
              fullName: "Suhas Avadhuta",
              photoUrl:
                "https://media.licdn.com/dms/image/C4E03AQGdaM6-jDB7oA/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=UCjVGmJBbDd4VwcPu4CfQhi3uVuuRVJTALOmSlYNZNY"
            },
            {
              company: "Opengov",
              position: "DevOps",
              university: "ITU",
              graduationYear: 2019,
              degree: "MS Software Engineering",
              fullName: "Sako M",
              photoUrl:
                "https://media.licdn.com/dms/image/C5603AQElIIuc89DUQg/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=100zl9rFw6QhQEmafTriUJkD60n8bvcNbVwj-5x2JBM"
            },
            {
              company: "JobHax",
              position: "Front-End Developer",
              university: "ITU",
              graduationYear: 2019,
              degree: "MS Computer Science",
              fullName: "Egemen Uslu",
              photoUrl:
                "https://backend.jobhax.com/media/65823394-c838-45ce-a08e-002e983bef7e.jpg"
            },
            {
              company: "Evercoin",
              position: "Android Developer",
              university: "ITU",
              graduationYear: 2019,
              degree: "MS Software Engineering",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              company: "Evercoin",
              position: "Android Developer",
              university: "ITU",
              graduationYear: 2019,
              degree: "MS Software Engineering",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            }
          ]
        },
        {
          cagetoryName: "Based on Your Applications",
          mentors: [
            {
              company: "Google",
              position: "Product Manager",
              university: "Virginia Tech",
              graduationYear: 2015,
              degree: "BS Computer Science",
              fullName: "Suhas Avadhuta",
              photoUrl:
                "https://media.licdn.com/dms/image/C4E03AQGdaM6-jDB7oA/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=UCjVGmJBbDd4VwcPu4CfQhi3uVuuRVJTALOmSlYNZNY"
            },
            {
              company: "JobHax",
              position: "Front-End Developer",
              university: "ITU",
              graduationYear: 2019,
              degree: "MS Computer Science",
              fullName: "Egemen Uslu",
              photoUrl:
                "https://backend.jobhax.com/media/65823394-c838-45ce-a08e-002e983bef7e.jpg"
            },
            {
              company: "Evercoin",
              position: "Android Developer",
              university: "ITU",
              graduationYear: 2019,
              degree: "MS Software Engineering",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            },
            {
              company: "Opengov",
              position: "DevOps",
              university: "ITU",
              graduationYear: 2019,
              degree: "MS Software Engineering",
              fullName: "Sako M",
              photoUrl:
                "https://media.licdn.com/dms/image/C5603AQElIIuc89DUQg/profile-displayphoto-shrink_800_800/0?e=1568851200&v=beta&t=100zl9rFw6QhQEmafTriUJkD60n8bvcNbVwj-5x2JBM"
            },
            {
              company: "Evercoin",
              position: "Android Developer",
              university: "ITU",
              graduationYear: 2019,
              degree: "MS Software Engineering",
              fullName: "Seyfullah Demirci",
              photoUrl:
                "https://backend.jobhax.com/media/b9686ee3-ccde-46b6-bc4f-7e4188e01012.png"
            }
          ]
        }
      ]
    };
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      await this.props.handleTokenExpiration("metrics getData");
      axiosCaptcha(
        postUsersRequest.url("verify_recaptcha"),
        postUsersRequest.config,
        "metrics"
      ).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success != true) {
            this.setState({ isUpdating: false });
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
          <div style={{ height: 100 }} />
        )}
        <div className="mentor-categories-container">
          {this.generateMentorCategories()}
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
