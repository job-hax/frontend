import React from "react";

class MentorSingle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="mentors-container">
        <div className="mentor">
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              maxWidth: 290,
              padding: 12
            }}
          >
            <div style={{ margin: "40px 12px 0 0px" }}>
              <img
                style={{
                  height: 120,
                  width: "auto"
                }}
                src={
                  this.props.mentor.photoUrl
                    ? this.props.mentor.photoUrl
                    : "../../../../src/assets/icons/SeyfoIcon@3x.png"
                }
              />
            </div>
            <div
              style={{
                margin: "48px 0 0 0px",
                height: 100,
                whiteSpace: "nowrap"
              }}
            >
              <div
                style={{
                  fontSize: "120%",
                  fontWeight: "600",
                  margin: "0px 0 0 0px"
                }}
              >
                {this.props.mentor.company}
              </div>
              <div
                style={{
                  fontSize: "95%",
                  fontWeight: "420",
                  margin: "0px 0 0 0px"
                }}
              >
                {this.props.mentor.position}
              </div>
              <div
                style={{
                  fontSize: "95%",
                  fontWeight: "450",
                  margin: "4px 0 0 0px"
                }}
              >
                {this.props.mentor.university}{" "}
                {this.props.mentor.graduationYear}
              </div>
              <div
                style={{
                  fontSize: "80%",
                  fontWeight: "450",
                  margin: "2px 0 0 0px"
                }}
              >
                {this.props.mentor.degree}
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: "140%",
              fontWeight: "450",
              marginTop: -16,
              padding: 12
            }}
          >
            {this.props.mentor.fullName}
          </div>
        </div>
      </div>
    );
  }
}

export default MentorSingle;
