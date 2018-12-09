import React, { Component } from "react";
import Title from "react-document-title";
import { Button, Container, Image, Segment, Divider } from "semantic-ui-react";
import NodeLogo from "./../assets/node.png";
import ReactLogo from "./../assets/react.png";
import PythonLogo from "./../assets/python.png";
import NumpyLogo from "./../assets/numpy.png";
import FlaskLogo from "./../assets/flask.png";

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
    marginTop: "100px",
    textAlign: "center"
  },
  HideOverflow: {
    overflow: "hidden"
  },
  Button: {
    width: "10vw"
  },
  Logo: {
    margin: "40px"
  }
};

class Home extends Component {
  constructor(props) {
    super(props);

    // set states
    this.state = {};
  }

  render() {
    return (
      <Title title="Solver and Minimizer App">
        <div style={style.HideOverflow}>
          <Container style={style.Container}>
            <Segment>
              <Divider hidden />
              <p style={style.Head}>
                <strong>CMSC 150</strong>
              </p>
              <p style={style.SubHead}>Numerical and Symbolic Computation</p>
              <Divider hidden />
              <Button.Group>
                <Button
                  size="big"
                  style={style.Button}
                  data-value={this.props.constants.GENSOLVER}
                  onClick={this.props.clickButton}
                >
                  Solver
                </Button>
                <Button.Or />
                <Button
                  size="big"
                  style={style.Button}
                  data-value={this.props.constants.SIMPLEX}
                  onClick={this.props.clickButton}
                >
                  Minimizer
                </Button>
              </Button.Group>
              <Container style={{ marginTop: "50px" }}>
                <Image.Group size="tiny">
                  <a href="https://nodejs.org/" target="_blank">
                    <Image src={NodeLogo} style={style.Logo} />
                  </a>
                  <a href="https://reactjs.org/" target="_blank">
                    <Image src={ReactLogo} style={style.Logo} />
                  </a>
                  <a href="https://www.python.org/" target="_blank">
                    <Image src={PythonLogo} style={style.Logo} />
                  </a>
                  <a href="http://www.numpy.org/" target="_blank">
                    <Image src={NumpyLogo} style={style.Logo} />
                  </a>
                  <a href="flask.pocoo.org/" target="_blank">
                    <Image src={FlaskLogo} style={style.Logo} />
                  </a>
                </Image.Group>
              </Container>
            </Segment>
          </Container>
        </div>
      </Title>
    );
  }
}

export default Home;
