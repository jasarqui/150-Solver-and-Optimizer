import React, { Component } from "react";
import { Grid, Table, Button, Segment, Input, Label } from "semantic-ui-react";
import Title from "react-document-title";
import Dropzone from "react-dropzone";
import Alert from "react-s-alert";
import Papa from "papaparse";
import axios from "axios";

// setup function plot
window.d3 = require("d3");
const functionPlot = require("function-plot");

// create styles
const styles = {
  Button: {
    width: "10vw"
  },
  Title: {
    fontSize: "25px",
    marginBottom: "0px"
  },
  Heading: {
    fontSize: "20px",
    width: "100%"
  },
  SubHead: {
    fontSize: "15px",
    marginTop: "-20px",
    width: "100%"
  },
  DropDiv: {
    width: "25%"
  },
  SolveDiv: {
    width: "35%"
  },
  PlotDiv: {
    width: "40%"
  },
  Dropzone: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    verticalAlign: "center",
    border: "2px dashed silver",
    borderRadius: "30px",
    backgroundColor: "#f8f8f8",
    margin: "20px",
    cursor: "pointer"
  },
  DropButton: {
    height: "0px",
    marginBottom: "10px",
    float: "right"
  },
  DropText: {
    width: "70%",
    textAlign: "center",
    color: "gray"
  },
  CSV: {
    padding: "0px",
    overflow: "auto",
    overflowX: "hidden",
    maxHeight: "80vh"
  },
  FunctionSegment: {
    marginTop: "0px",
    width: "100%"
  }
};

class GenSolvers extends Component {
  constructor(props) {
    super(props);

    // set states
    this.state = {
      file: null,
      contents: [],
      pr_function: null,
      qsi_functions: [],
      qsi_data: [],
      pr_degree: 0,
      pr_x: "",
      qsi_x: "",
      pr_y: "",
      qsi_y: ""
    };
  }

  handlePRDeg = e => {
    this.setState({ pr_degree: e.target.value });
  };

  handlePRX = e => {
    this.setState({ pr_x: e.target.value });
  };

  handleQSIX = e => {
    this.setState({ qsi_x: e.target.value });
  };

  uploadFiles = uploadFile => {
    this.setState({ file: uploadFile }, () => {
      this.readCSV(uploadFile);
    });
  };

  solvePR = e => {
    e.preventDefault();
    axios
      .get(`/solve/pr/${this.state.contents}&${this.state.pr_degree}`)
      .then(result => {
        this.setState({ pr_function: result.data.result });
        // parse function to string
        let function_string, i;
        for (i = 0; i < this.state.contents.length; i++) {
          if (i === 0) function_string = String(this.state.pr_function[i]);
          else
            function_string +=
              "(" +
              String(this.state.pr_function[i]) +
              " * x ^ " +
              String(i) +
              ")";
          if (i !== this.state.contents.length - 1) function_string += " + ";
        }

        // plot
        functionPlot({
          target: "#polyplot",
          disableZoom: false,
          height: "400",
          xAxis: {
            domain: [
              this.state.contents[0][0],
              this.state.contents[this.state.contents.length - 1][0]
            ]
          },
          data: [
            {
              fn: function_string,
              nSamples: 1000,
              graphType: "polyline"
            }
          ]
        });
      });
  };

  evaluatePR = e => {
    e.preventDefault();
    axios
      .get(`/eval/pr/${this.state.pr_function}&${this.state.pr_x}`)
      .then(result => {
        this.setState({ pr_y: result.data.result });
      });
  };

  solveQSI = e => {
    e.preventDefault();
    axios.get(`/solve/qsi/${this.state.contents}`).then(result => {
      result.data.result
        ? this.setState(
            {
              qsi_functions: result.data.result,
              qsi_data: this.state.contents
            },
            () => {
              let function_strings = [];
              let i;

              // parse functions
              for (i = 0; i < this.state.qsi_functions.length; i++) {
                let function_string =
                  "(" +
                  String(this.state.qsi_functions[i][0]) +
                  "* x ^ 2) + (" +
                  String(this.state.qsi_functions[i][1]) +
                  "* x) + " +
                  this.state.qsi_functions[i][2];
                function_strings.push({
                  fn: function_string,
                  nSamples: 1000,
                  graphType: "polyline",
                  range: [
                    this.state.qsi_data[i][0],
                    this.state.qsi_data[i + 1][0]
                  ]
                });
              }

              // plot
              functionPlot({
                target: "#qsiplot",
                disableZoom: false,
                height: "400",
                xAxis: {
                  domain: [
                    this.state.contents[0][0],
                    this.state.contents[this.state.contents.length - 1][0]
                  ]
                },
                data: function_strings
              });
            }
          )
        : Alert.error("Invalid Data.", {
            beep: false,
            position: "top-right",
            effect: "stackslide",
            timeout: 2000
          });
    });
  };

  evaluateQSI = e => {
    e.preventDefault();
    axios
      .get(
        `/eval/qsi/${this.state.qsi_functions}&${this.state.qsi_data}&${
          this.state.qsi_x
        }`
      )
      .then(result => {
        this.setState({ qsi_y: result.data.result });
      });
  };

  readCSV = file => {
    var reader = new FileReader();
    // callback fxn for parsing csv
    reader.onload = e => {
      var reader_content = Papa.parse(reader.result, { delimeter: "," }).data;

      // sort content
      reader_content.sort(sortFunction);
      function sortFunction(a, b) {
        if (a[0] === b[0]) {
          // if same do nothing
          return 0;
        } else {
          // else swap
          return a[0] < b[0] ? -1 : 1;
        }
      }

      this.setState({
        contents: reader_content
      });
    }; // read the file
    reader.readAsText(file[0]);
  };

  render() {
    return (
      <Title title="Generic Solvers">
        <div style={{ height: "100vh" }}>
          <Grid celled="internally" style={{ height: "100%" }}>
            <Grid.Row>
              <Grid.Column width={3}>
                {this.state.contents.length === 0 ? (
                  <Dropzone
                    accept="application/vnd.ms-excel, text/x-csv, text/plain, text/csv"
                    multiple={true}
                    style={styles.Dropzone}
                    onDropAccepted={this.uploadFiles}
                  >
                    <p style={styles.DropText}>
                      Upload or drop a CSV file here.
                    </p>
                  </Dropzone>
                ) : (
                  <div>
                    <Segment style={styles.CSV}>
                      <Table inverted>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>X</Table.HeaderCell>
                            <Table.HeaderCell>Y</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {this.state.contents.map((row, id) => {
                            return (
                              <Table.Row key={id}>
                                <Table.Cell>{row[0]}</Table.Cell>
                                <Table.Cell>{row[1]}</Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      </Table>
                    </Segment>
                    <Dropzone
                      accept="application/vnd.ms-excel, text/x-csv, text/plain, text/csv"
                      multiple={true}
                      style={styles.DropButton}
                      onDropAccepted={this.uploadFiles}
                    >
                      <Button>Upload new CSV</Button>
                    </Dropzone>
                  </div>
                )}
              </Grid.Column>
              <Grid.Column width={13}>
                <Grid divided="vertically">
                  <Grid.Row style={{ padding: "10px", width: "90%" }}>
                    <p style={styles.Title}>
                      <strong>Generic Solvers</strong>
                    </p>
                    <div style={{ paddingLeft: "56%" }}>
                      <Button.Group>
                        <Button
                          size="medium"
                          style={styles.Button}
                          data-value={this.props.constants.HOME}
                          onClick={this.props.clickButton}
                        >
                          Home
                        </Button>
                        <Button.Or />
                        <Button
                          size="medium"
                          style={styles.Button}
                          data-value={this.props.constants.SIMPLEX}
                          onClick={this.props.clickButton}
                        >
                          Minimizer
                        </Button>
                      </Button.Group>
                    </div>
                  </Grid.Row>
                  <Grid.Row style={{ padding: "10px" }}>
                    <Grid.Column width={8}>
                      <p style={styles.Heading}>
                        <strong>Polynomial Regression</strong>
                      </p>
                      <p style={styles.SubHead}>
                        Model the data points as a polynomial.
                      </p>
                      <div style={{ width: "100%", paddingBottom: "10px" }}>
                        <Input
                          labelPosition="right"
                          type="text"
                          placeholder="of the polynomial"
                          size="mini"
                        >
                          <Label>
                            <p style={{ fontSize: "12px" }}>Degree</p>
                          </Label>
                          <input
                            value={this.state.pr_degree}
                            onChange={this.handlePRDeg}
                          />
                          <Button
                            disabled={
                              this.state.contents.length > 0 &&
                              this.state.pr_degree <
                                this.state.contents.length &&
                              this.state.contents.length > 2 &&
                              this.state.pr_degree > 1
                                ? false
                                : true
                            }
                            onClick={this.solvePR}
                          >
                            Solve
                          </Button>
                        </Input>
                      </div>
                      <Segment style={styles.FunctionSegment}>
                        {this.state.pr_function ? (
                          <div>
                            {this.state.pr_function.map((coeff, id) => {
                              return (
                                <text>
                                  {Math.round((coeff + 0.00001) * 10000) /
                                    10000}
                                  {id === 0 ? (
                                    " + "
                                  ) : (
                                    <text>
                                      {" * x"}
                                      <sup>{id}</sup>
                                      {id !== this.state.pr_function.length - 1
                                        ? " + "
                                        : ""}
                                    </text>
                                  )}
                                </text>
                              );
                            })}
                            <Input
                              labelPosition="right"
                              type="text"
                              placeholder="x"
                              size="mini"
                              style={{ marginTop: "10px" }}
                            >
                              <Label basic>f(</Label>
                              <input
                                value={this.state.pr_x}
                                onChange={this.handlePRX}
                              />
                              <Label basic>)</Label>
                              <Button
                                disabled={
                                  this.state.pr_function && this.state.pr_x
                                    ? false
                                    : true
                                }
                                onClick={this.evaluatePR}
                              >
                                Evaluate
                              </Button>
                              {this.state.pr_y ? (
                                <Label pointing="left">
                                  {Math.round(
                                    (this.state.pr_y + 0.00001) * 10000
                                  ) / 10000}
                                </Label>
                              ) : (
                                <div />
                              )}
                            </Input>
                          </div>
                        ) : (
                          "No functions solved for yet."
                        )}
                      </Segment>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <div id="polyplot" />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row style={{ padding: "10px" }}>
                    <Grid.Column width={8}>
                      <p style={styles.Heading}>
                        <strong>Quadratic Spline Interpolation</strong>
                      </p>
                      <p style={styles.SubHead}>
                        Create piecewise Quadratic interpolants using the data
                        points.
                      </p>
                      <div style={{ width: "100%", paddingBottom: "10px" }}>
                        <Button
                          disabled={
                            this.state.contents.length > 2 ? false : true
                          }
                          onClick={this.solveQSI}
                        >
                          Interpolate
                        </Button>
                      </div>
                      <Segment style={styles.FunctionSegment}>
                        {this.state.qsi_functions.length > 0 ? (
                          <div>
                            <Table basic="very" celled collapsing>
                              <Table.Body>
                                {this.state.qsi_functions.map((func, id) => {
                                  return (
                                    <Table.Row key={id}>
                                      <Table.Cell>
                                        {"["}
                                        {this.state.contents[id][0]}
                                        {", "}
                                        {this.state.contents[id + 1][0]}
                                        {")"}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {Math.round(
                                          (func[0] + 0.00001) * 10000
                                        ) / 10000}
                                        {" * x"}
                                        <sup>2</sup>
                                        {" + "}
                                        {Math.round(
                                          (func[1] + 0.00001) * 10000
                                        ) / 10000}
                                        {" * x + "}
                                        {Math.round(
                                          (func[2] + 0.00001) * 10000
                                        ) / 10000}
                                      </Table.Cell>
                                    </Table.Row>
                                  );
                                })}
                              </Table.Body>
                            </Table>
                            <Input
                              labelPosition="right"
                              type="text"
                              placeholder="x"
                              size="mini"
                            >
                              <Label basic>f(</Label>
                              <input
                                value={this.state.qsi_x}
                                onChange={this.handleQSIX}
                              />
                              <Label basic>)</Label>
                              <Button
                                disabled={
                                  this.state.qsi_functions.length > 0 &&
                                  this.state.qsi_x >=
                                    this.state.qsi_data[0][0] &&
                                  this.state.qsi_data <=
                                    this.state.qsi_data[
                                      this.state.qsi_data.length - 1
                                    ][0]
                                    ? false
                                    : true
                                }
                                onClick={this.evaluateQSI}
                              >
                                Evaluate
                              </Button>
                              {this.state.qsi_y ? (
                                <Label pointing="left">
                                  {Math.round(
                                    (this.state.qsi_y + 0.00001) * 10000
                                  ) / 10000}
                                </Label>
                              ) : (
                                <div />
                              )}
                            </Input>
                          </div>
                        ) : (
                          "No splines solved for yet."
                        )}
                      </Segment>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <div id={"qsiplot"} />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Title>
    );
  }
}

export default GenSolvers;
