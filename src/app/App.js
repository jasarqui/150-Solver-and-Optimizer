import React, { Component } from "react";
import Home from "../ui/Home";
import GenSolvers from "../ui/GenSolvers";
import Simplex from "../ui/Simplex";
import Error404 from "../ui/Error404";

// declare constants
const constants = {
  HOME: "home",
  GENSOLVER: "solver",
  SIMPLEX: "simplex"
};

class App extends Component {
  constructor(props) {
    super(props);

    // set states
    this.state = { page: constants.HOME };
  }

  // will change current webpage
  changePage = page_num => {
    this.setState({ page: page_num });
  };

  clickButton = e => {
    e.preventDefault();
    this.changePage(e.currentTarget.dataset.value);
  };

  render() {
    return (
      <div>
        {this.state.page === constants.HOME ? (
          <Home {...{ clickButton: this.clickButton, constants: constants }} />
        ) : this.state.page === constants.GENSOLVER ? (
          <GenSolvers
            {...{ clickButton: this.clickButton, constants: constants }}
          />
        ) : this.state.page === constants.SIMPLEX ? (
          <Simplex {...{ clickButton: this.clickButton, constants: constants }} />
        ) : (
          <Error404
            {...{ clickButton: this.clickButtonu, constants: constants }}
          />
        )}
      </div>
    );
  }
}

export default App;
