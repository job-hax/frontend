import React, {Component} from "react";
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import Content from '../Page1/Content.jsx';

import './style.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    };
  }

  render() {
    const {activePage: page} = this.state;
    return (
      <React.Fragment>
        <Header/>
        <Content content={page}/>
        <div
          onClick={() => this.setState({activePage: this.state.activePage - 1})}
          className="button"
        >
          Previous Page
        </div>
        <div
          onClick={() => this.setState({activePage: this.state.activePage + 1})}
          className="button"
        >
          Next Page
        </div>
        <Footer/>
      </React.Fragment>

    );
  }
}

export default App;