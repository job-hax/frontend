import React, {Component} from "react";
import Name from './Name.jsx';

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