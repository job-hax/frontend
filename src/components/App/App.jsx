import React, {Component} from "react";
import Name from './Name/Name.jsx';

class App extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
  }

  render() {
    return (
      <div>
        <Name name={'Sako'}/>
        <Name name={'Leo'}/>
      </div>
    );
  }
}

export default App;