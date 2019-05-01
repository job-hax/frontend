import React, { Component } from "react";
import Footer from "../../Partials/Footer/Footer.jsx";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

import { fetchApi } from "../../../utils/api/fetch_api.js";
import { getAgreementsRequest } from "../../../utils/api/requests.js";

import "./style.scss";

const privacy_policy_html = `
<p> If you require any more information or have any questions about our privacy policy, please feel free to contact us by email at <a href="mailto:privacy@jobhax.com">Privacy</a>.</p>
<p>At https://jobhax.com/ we consider the privacy of our visitors to be extremely important. This privacy policy document describes in detail the types of personal information is collected and recorded by https://jobhax.com/ and how we use it. </p><p> <b>Log Files</b><br> Like many other Web sites, https://jobhax.com/ makes use of log files. These files merely logs visitors to the site - usually a standard procedure for hosting companies and a part of hosting services's analytics. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and possibly the number of clicks. This information is used to analyze trends, administer the site, track user's movement around the site, and gather demographic information. IP addresses, and other such information are not linked to any information that is personally identifiable. </p>
<p> <b>Cookies and Web Beacons</b><br>https://jobhax.com/ uses cookies to store information about visitors' preferences, to record user-specific information on which pages the site visitor accesses or visits, and to personalize or customize our web page content based upon visitors' browser type or other information that the visitor sends via their browser. </p>
<p><b>DoubleClick DART Cookie</b><br>




<p><b>Our Advertising Partners</b><br>
Some of our advertising partners may use cookies and web beacons on our site. Our advertising partners include ....... <br>
<ul></ul>
<p><em>While each of these advertising partners has their own Privacy Policy for their site, an updated and hyperlinked resource is maintained here: <a href="http://www.privacypolicyonline.com/privacy-policies">Privacy Policies</a>.<br />
You may consult this listing to find the privacy policy for each of the advertising partners of https://jobhax.com/.</em></p>
<p> These third-party ad servers or ad networks use technology in their respective advertisements and links that appear on https://jobhax.com/ and which are sent directly to your browser. They automatically receive your IP address when this occurs. Other technologies (such as cookies, JavaScript, or Web Beacons) may also be used by our site's third-party ad networks to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on the site. </p>
<p> https://jobhax.com/ has no access to or control over these cookies that are used by third-party advertisers. </p>
<p> </p><p><b>Third Party Privacy Policies</b><br>
You should consult the respective privacy policies of these third-party ad servers for more detailed information on their practices as well as for instructions about how to opt-out of certain practices. https://jobhax.com/'s privacy policy does not apply to, and we cannot control the activities of, such other advertisers or web sites. You may find a comprehensive listing of these privacy policies and their links here: <a href="http://www.privacypolicyonline.com/privacy-policy-links" title="Privacy Policy Links">Privacy Policy Links</a>.</p>
<p> If you wish to disable cookies, you may do so through your individual browser options. More detailed information about cookie management with specific web browsers can be found at the browsers' respective websites. <a href="http://www.privacypolicyonline.com/what-are-cookies">What Are Cookies?</a></p>

<p><strong>Children's Information</strong><br />We believe it is important to provide added protection for children online. We encourage parents and guardians to spend time online with their children to observe, participate in and/or monitor and guide their online activity.
https://jobhax.com/ does not knowingly collect any personally identifiable information from children under the age of 13.  If a parent or guardian believes that https://jobhax.com/ has in its database the personally-identifiable information of a child under the age of 13, please contact us immediately (using the contact in the first paragraph) and we will use our best efforts to promptly remove such information from our records.

<p>
<b>Online Privacy Policy Only</b><br />
This privacy policy applies only to our online activities and is valid for visitors to our website and regarding information shared and/or collected there.
This policy does not apply to any information collected offline or via channels other than this website.</p>
<p><b>Consent</b><br />
By using our website, you hereby consent to our privacy policy and agree to its terms.
</p>`;

class PrivacyPolicy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      privacy_policy: ""
    };
  }

  componentDidMount() {
    const { url, config } = getAgreementsRequest;
    fetchApi(url, config).then(response => {
      if (response.ok) {
        this.setState({ privacy_policy: response.json.data.privacy });
      }
    });
  }

  generateTopButtons() {
    return (
      <div className="top-buttons">
        <Link to="/home">
          <img
            className="logo"
            src="src/assets/icons/JobHax-logo-white.svg"
            alt="JobHax-logo"
          />
        </Link>
        <Link to="/home">
          <button>Home</button>
        </Link>
      </div>
    );
  }

  generateHeaderArea() {
    return (
      <section className="header_area">
        {this.generateTopButtons()}
        <div>
          <h2>JobHax Privacy Policy</h2>
        </div>
      </section>
    );
  }

  generateInfo() {
    return (
      <div className="info-container">
        <div className="info-area">
          {this.state.privacy_policy.is_html === true
            ? parse(`${this.state.privacy_policy.value}`)
            : this.state.privacy_policy.value}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="under_constrution-container">
        <div>
          {this.generateHeaderArea()}
          {this.generateInfo()}
        </div>
        <div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default PrivacyPolicy;
