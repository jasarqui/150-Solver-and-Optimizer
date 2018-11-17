import React, { Component } from 'react';
import Navbar from '../ui/Navbar';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {res: 0};
  }
  
  render() {
    return (
      <div>
        <Navbar onClick={this.test}/>
      </div>
    );
  }
}

export default App;
