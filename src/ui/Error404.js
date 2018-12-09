import React, { Component } from "react";
import Title from "react-document-title";
import { Button, Container } from "semantic-ui-react";

// create styles here
const style = {
  Head: {
    fontSize: "50px"
  },
  SubHead: {
    marginTop: "-60px",
    fontSize: "30px"
  },
  Container: {
    marginTop: "150px",
    textAlign: "center"
  },
  HideOverflow: {
    overflow: "hidden"
  },
  Button: {
    width: "10vw"
  }
};

class Error404 extends Component {
  constructor(props) {
    super(props);

    // set states
    this.state = {};
  }

  render() {
    return (
      <Title title="Error 404">
        <div style={style.HideOverflow}>
          <Container style={style.Container}>
            <p style={style.Head}>
              <strong>ERROR 404</strong>
            </p>
            <p style={style.SubHead}>
              The page you are looking for is not found.
            </p>
            <Button.Group>
              <Button
                size="large"
                style={style.Button}
                data-value={this.props.constants.HOME}
                onClick={this.props.clickButton}
              >
                Home
              </Button>
              <Button.Or />
              <Button
                size="large"
                style={style.Button}
                data-value={this.props.constants.GENSOLVER}
                onClick={this.props.clickButton}
              >
                Solver
              </Button>
              <Button.Or />
              <Button
                size="large"
                style={style.Button}
                data-value={this.props.constants.SIMPLEX}
                onClick={this.props.clickButton}
              >
                Minimizer
              </Button>
            </Button.Group>
          </Container>
        </div>
      </Title>
    );
  }
}

export default Error404;
