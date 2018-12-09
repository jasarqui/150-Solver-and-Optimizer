import React, { Component } from "react";
import {
  Grid,
  Button,
  Table,
  Input,
  Segment,
  List,
  Divider
} from "semantic-ui-react";
import Title from "react-document-title";
import axios from "axios";

// create styles
const styles = {
  Button: {
    width: "10vw"
  },
  Title: {
    fontSize: "25px",
    marginBottom: "0px"
  },
  SubHead: {
    fontSize: "20px"
  },
  Content: {
    color: "gray",
    textAlign: "justify"
  },
  Statement: {
    fontSize: "15px"
  }
};

// company county
const Company = ["Denver", "Pheonix", "Dallas"];

class Simplex extends Component {
  constructor(props) {
    super(props);

    // set states
    this.state = {
      costs: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
      demands: [180, 80, 200, 160, 220],
      supplies: [310, 260, 280],
      shipping_1: [10, 8, 6, 5, 4],
      shipping_2: [6, 5, 4, 3, 6],
      shipping_3: [3, 4, 5, 5, 9],
      optimized: false,
      show_iter: false,
      iterations: [],
      basic_solution: []
    };
  }

  optimize = e => {
    e.preventDefault();
    // some arrays
    let five_zeros = [0, 0, 0, 0, 0];
    let five_ones = [1, 1, 1, 1, 1];
    let one_four_zero = [1, 0, 0, 0, 0];
    // supply constraints
    let constraint1 = [
      ...five_ones,
      ...five_zeros,
      ...five_zeros,
      this.state.supplies[0]
    ];
    let constraint2 = [
      ...five_zeros,
      ...five_ones,
      ...five_zeros,
      this.state.supplies[1]
    ];
    let constraint3 = [
      ...five_zeros,
      ...five_zeros,
      ...five_ones,
      this.state.supplies[2]
    ];
    // demand constraints
    let constraint4 = [
      ...one_four_zero,
      ...one_four_zero,
      ...one_four_zero,
      this.state.demands[0]
    ];
    let constraint5 = [
      0,
      ...one_four_zero,
      ...one_four_zero,
      1,
      0,
      0,
      0,
      this.state.demands[1]
    ];
    let constraint6 = [
      0,
      0,
      ...one_four_zero,
      ...one_four_zero,
      1,
      0,
      0,
      this.state.demands[2]
    ];
    let constraint7 = [
      0,
      0,
      0,
      ...one_four_zero,
      ...one_four_zero,
      1,
      0,
      this.state.demands[3]
    ];
    let constraint8 = [
      0,
      0,
      0,
      0,
      ...one_four_zero,
      ...one_four_zero,
      1,
      this.state.demands[4]
    ];
    let obj_fxn = [
      ...this.state.shipping_1,
      ...this.state.shipping_2,
      ...this.state.shipping_3,
      0
    ];
    // generate tableau
    let tableau = [
      constraint1,
      constraint2,
      constraint3,
      constraint4,
      constraint5,
      constraint6,
      constraint7,
      constraint8,
      obj_fxn
    ];

    axios.get(`/solve/simplex/${tableau}`).then(result => {
      this.setState({ iterations: result.data.result, optimized: true }, () => {
        // get the basic solutions
        var basic_solutions = [];
        for (
          var iteration = 0;
          iteration < result.data.result.length;
          iteration++
        ) {
          // get the basic solution of each iteration
          var basic_solution = [];
          for (
            var i = 0;
            i < result.data.result[iteration][0].length - 2;
            i++
          ) {
            var active = false;
            var value_row = 0;

            for (var j = 0; j < result.data.result[iteration].length; j++) {
              if (result.data.result[iteration][j][i] == 1) {
                active = !active;
                if (!active) break; // if previously active and 1 is encountered, no longer active
                value_row = j;
              } else if (result.data.result[iteration][j][i] == 0) {
                // do nothing
              } else {
                // if there is a value other than 1 or 0, always inactive
                active = false;
                break;
              }
            }

            if (active) {
              basic_solution.push(
                result.data.result[iteration][value_row][
                  result.data.result[iteration][0].length - 2
                ]
              );
            } else {
              basic_solution.push(0);
            }
          }
          basic_solutions.push(basic_solution);
        }
        let final_solution = basic_solutions.length - 1;
        let new_costs = [
          [
            basic_solutions[final_solution][0],
            basic_solutions[final_solution][1],
            basic_solutions[final_solution][2],
            basic_solutions[final_solution][3],
            basic_solutions[final_solution][4]
          ],
          [
            basic_solutions[final_solution][5],
            basic_solutions[final_solution][6],
            basic_solutions[final_solution][7],
            basic_solutions[final_solution][8],
            basic_solutions[final_solution][9]
          ],
          [
            basic_solutions[final_solution][10],
            basic_solutions[final_solution][11],
            basic_solutions[final_solution][12],
            basic_solutions[final_solution][13],
            basic_solutions[final_solution][14]
          ]
        ];
        this.setState({ basic_solution: basic_solutions, costs: new_costs });
      });
    });
  };

  showIterations = e => {
    e.preventDefault();
    this.setState({ show_iter: !this.state.show_iter });
  };

  demandChange = e => {
    var newDemand = [...this.state.demands];
    newDemand[e.currentTarget.parentNode.dataset.value] = e.target.value;
    this.setState({ demands: newDemand });
  };

  supplyChange = e => {
    var newSupply = [...this.state.supplies];
    newSupply[e.currentTarget.parentNode.dataset.value] = e.target.value;
    this.setState({ supplies: newSupply });
  };

  ship1Change = e => {
    var newShip = [...this.state.shipping_1];
    newShip[e.currentTarget.parentNode.dataset.value] = e.target.value;
    this.setState({ shipping_1: newShip });
  };

  ship2Change = e => {
    var newShip = [...this.state.shipping_2];
    newShip[e.currentTarget.parentNode.dataset.value] = e.target.value;
    this.setState({ shipping_2: newShip });
  };

  ship3Change = e => {
    var newShip = [...this.state.shipping_3];
    newShip[e.currentTarget.parentNode.dataset.value] = e.target.value;
    this.setState({ shipping_3: newShip });
  };

  render() {
    return (
      <Title title="Minimizer">
        <div style={{ padding: "10px" }}>
          <Grid divided="vertically">
            <Grid.Row style={{ padding: "10px", width: "100%" }}>
              <Grid.Column
                width={16}
                style={{ marginBottom: "0", padding: "10px" }}
              >
                <p>
                  <strong style={styles.Title}>
                    ASSESSING THE VALUE OF SUPPLY CHAIN MANAGEMENT OPTIMIZING
                    SHIPMENTS
                  </strong>
                  <Button.Group style={{ marginLeft: "4%" }}>
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
                      data-value={this.props.constants.GENSOLVER}
                      onClick={this.props.clickButton}
                    >
                      Solver
                    </Button>
                  </Button.Group>
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <p>
                  <strong style={styles.SubHead}>
                    Background of the study
                  </strong>
                </p>
                <p style={styles.Content}>
                  One of the main products of the Fairway Woods Company is
                  custom-made golf clubs. The clubs are manufactured at three
                  plants (Denver, Colorado; Phoenix, Arizona; and Dallas, Texas)
                  and are then shipped by truck to five distribution warehouses
                  in Sacramento, California; Salt Lake City, Utah; Albuquerque,
                  New Mexico; Chicago, Illinois; and New York City, New York.
                  Because shipping costs are a major expense, management is
                  investigating a way to reduce them. For the upcoming golf
                  season, an estimate has been created as to the total output
                  needed from each manufacturing plant and how each warehouse
                  will require satisfying its customers. The CIO from Fairway
                  Woods Company has created a spreadsheet of the shipping costs
                  from each manufacturing plant to each warehouse as a baseline
                  analysis.
                </p>
                <center>
                  <Button
                    content="Optimize"
                    icon="lightning"
                    labelPosition="left"
                    size="huge"
                    style={{ marginTop: "25px" }}
                    onClick={this.optimize}
                  />
                  <Table celled structured columns={7}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell colSpan="7" textAlign="center">
                          <p style={{ fontSize: "16px" }}>
                            Fairways Woods Company Shipping Analysis
                          </p>
                        </Table.HeaderCell>
                      </Table.Row>
                      <Table.Row>
                        <Table.HeaderCell textAlign="center">
                          Plants
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">
                          Total
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="center" colSpan="5">
                          Number to ship from plant to warehouse
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {this.state.costs.map((cost, id) => {
                        return (
                          <Table.Row key={id}>
                            <Table.Cell>{Company[id]}</Table.Cell>
                            <Table.Cell>
                              {cost[0] + cost[1] + cost[2] + cost[3] + cost[4]}
                            </Table.Cell>
                            <Table.Cell>{cost[0]}</Table.Cell>
                            <Table.Cell>{cost[1]}</Table.Cell>
                            <Table.Cell>{cost[2]}</Table.Cell>
                            <Table.Cell>{cost[3]}</Table.Cell>
                            <Table.Cell>{cost[4]}</Table.Cell>
                          </Table.Row>
                        );
                      })}
                      <Table.Row>
                        <Table.Cell>Totals:</Table.Cell>
                        <Table.Cell>
                          {this.state.costs[0][0] +
                            this.state.costs[1][0] +
                            this.state.costs[2][0] +
                            this.state.costs[0][1] +
                            this.state.costs[1][1] +
                            this.state.costs[2][1] +
                            this.state.costs[0][2] +
                            this.state.costs[1][2] +
                            this.state.costs[2][2] +
                            this.state.costs[0][3] +
                            this.state.costs[1][3] +
                            this.state.costs[2][3] +
                            this.state.costs[0][4] +
                            this.state.costs[1][4] +
                            this.state.costs[2][4]}
                        </Table.Cell>
                        <Table.Cell>
                          {this.state.costs[0][0] +
                            this.state.costs[1][0] +
                            this.state.costs[2][0]}
                        </Table.Cell>
                        <Table.Cell>
                          {this.state.costs[0][1] +
                            this.state.costs[1][1] +
                            this.state.costs[2][1]}
                        </Table.Cell>
                        <Table.Cell>
                          {this.state.costs[0][2] +
                            this.state.costs[1][2] +
                            this.state.costs[2][2]}
                        </Table.Cell>
                        <Table.Cell>
                          {this.state.costs[0][3] +
                            this.state.costs[1][3] +
                            this.state.costs[2][3]}
                        </Table.Cell>
                        <Table.Cell>
                          {this.state.costs[0][4] +
                            this.state.costs[1][4] +
                            this.state.costs[2][4]}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell colSpan="7" />
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell colSpan="2" textAlign="center">
                          Demands by
                        </Table.Cell>
                        {this.state.demands.map((demand, id) => {
                          return (
                            <Table.Cell key={id}>
                              <Input
                                placeholder="Company Demand"
                                data-value={id}
                                value={demand}
                                onChange={this.demandChange}
                              />
                            </Table.Cell>
                          );
                        })}
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  <Table celled structured columns={7}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell textAlign="center">
                          Plants
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">
                          Supply
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="center" colSpan="5">
                          Shipping costs from plant to warehouse
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {this.state.supplies.map((supply, supp_id) => {
                        return (
                          <Table.Row key={supp_id}>
                            <Table.Cell>{Company[supp_id]}</Table.Cell>
                            <Table.Cell>
                              <Input
                                style={{ width: "10vh" }}
                                placeholder="Supply"
                                data-value={supp_id}
                                value={supply}
                                onChange={this.supplyChange}
                              />
                            </Table.Cell>
                            {supp_id === 0
                              ? this.state.shipping_1.map((cost, cost_id) => {
                                  return (
                                    <Table.Cell key={cost_id}>
                                      <Input
                                        placeholder="Shipping Cost"
                                        data-value={cost_id}
                                        value={cost}
                                        onChange={this.ship1Change}
                                      />
                                    </Table.Cell>
                                  );
                                })
                              : supp_id === 1
                              ? this.state.shipping_2.map((cost, cost_id) => {
                                  return (
                                    <Table.Cell key={cost_id}>
                                      <Input
                                        placeholder="Shipping Cost"
                                        data-value={cost_id}
                                        value={cost}
                                        onChange={this.ship2Change}
                                      />
                                    </Table.Cell>
                                  );
                                })
                              : this.state.shipping_3.map((cost, cost_id) => {
                                  return (
                                    <Table.Cell key={cost_id}>
                                      <Input
                                        placeholder="Shipping Cost"
                                        data-value={cost_id}
                                        value={cost}
                                        onChange={this.ship3Change}
                                      />
                                    </Table.Cell>
                                  );
                                })}
                          </Table.Row>
                        );
                      })}
                      <Table.Row colSpan={7} />
                      <Table.Row>
                        <Table.Cell textAlign="center">Shipping</Table.Cell>
                        <Table.Cell textAlign="center">
                          {"$"}
                          {this.state.costs[0][0] * this.state.shipping_1[0] +
                            this.state.costs[1][0] * this.state.shipping_2[0] +
                            this.state.costs[2][0] * this.state.shipping_3[0] +
                            (this.state.costs[0][1] * this.state.shipping_1[1] +
                              this.state.costs[1][1] *
                                this.state.shipping_2[1] +
                              this.state.costs[2][1] *
                                this.state.shipping_3[1]) +
                            (this.state.costs[0][2] * this.state.shipping_1[2] +
                              this.state.costs[1][2] *
                                this.state.shipping_2[2] +
                              this.state.costs[2][2] *
                                this.state.shipping_3[2]) +
                            (this.state.costs[0][3] * this.state.shipping_1[3] +
                              this.state.costs[1][3] *
                                this.state.shipping_2[3] +
                              this.state.costs[2][3] *
                                this.state.shipping_3[3]) +
                            (this.state.costs[0][4] * this.state.shipping_1[4] +
                              this.state.costs[1][4] *
                                this.state.shipping_2[4] +
                              this.state.costs[2][4] *
                                this.state.shipping_3[4])}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {"$"}
                          {this.state.costs[0][0] * this.state.shipping_1[0] +
                            this.state.costs[1][0] * this.state.shipping_2[0] +
                            this.state.costs[2][0] * this.state.shipping_3[0]}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {"$"}
                          {this.state.costs[0][1] * this.state.shipping_1[1] +
                            this.state.costs[1][1] * this.state.shipping_2[1] +
                            this.state.costs[2][1] * this.state.shipping_3[1]}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {"$"}
                          {this.state.costs[0][2] * this.state.shipping_1[2] +
                            this.state.costs[1][2] * this.state.shipping_2[2] +
                            this.state.costs[2][2] * this.state.shipping_3[2]}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {"$"}
                          {this.state.costs[0][3] * this.state.shipping_1[3] +
                            this.state.costs[1][3] * this.state.shipping_2[3] +
                            this.state.costs[2][3] * this.state.shipping_3[3]}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {"$"}
                          {this.state.costs[0][4] * this.state.shipping_1[4] +
                            this.state.costs[1][4] * this.state.shipping_2[4] +
                            this.state.costs[2][4] * this.state.shipping_3[4]}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </center>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Segment>
            <p style={styles.Statement}>
              The following constraints were derived from the table (excluding
              the nonnegativity constraints):
            </p>
            <List as="ol" style={{ marginTop: "10px" }}>
              <List.Item as="li" value="*">
                Supply Constraints
                <List.Item as="ol">
                  <List.Item as="li" value="-" style={styles.Content}>
                    X<sub>1</sub> + X<sub>2</sub> + X<sub>3</sub> + X
                    <sub>4</sub> + X<sub>5</sub>
                    {" <= "}
                    {this.state.supplies[0]}
                  </List.Item>
                  <List.Item as="li" value="-" style={styles.Content}>
                    X<sub>6</sub> + X<sub>7</sub> + X<sub>8</sub> + X
                    <sub>9</sub> + X<sub>10</sub>
                    {" <= "}
                    {this.state.supplies[1]}
                  </List.Item>
                  <List.Item as="li" value="-" style={styles.Content}>
                    X<sub>11</sub> + X<sub>12</sub> + X<sub>13</sub> + X
                    <sub>14</sub> + X<sub>15</sub>
                    {" <= "}
                    {this.state.supplies[2]}
                  </List.Item>
                </List.Item>
              </List.Item>
              <List.Item as="li" value="*">
                Demand Constraints
                <List.Item as="ol">
                  <List.Item as="li" value="-" style={styles.Content}>
                    X<sub>1</sub> + X<sub>6</sub> + X<sub>11</sub> >={" "}
                    {this.state.demands[0]}
                  </List.Item>
                  <List.Item as="li" value="-" style={styles.Content}>
                    X<sub>2</sub> + X<sub>7</sub> + X<sub>12</sub> >={" "}
                    {this.state.demands[1]}
                  </List.Item>
                  <List.Item as="li" value="-" style={styles.Content}>
                    X<sub>3</sub> + X<sub>8</sub> + X<sub>13</sub> >={" "}
                    {this.state.demands[2]}
                  </List.Item>
                  <List.Item as="li" value="-" style={styles.Content}>
                    X<sub>4</sub> + X<sub>9</sub> + X<sub>14</sub> >={" "}
                    {this.state.demands[3]}
                  </List.Item>
                  <List.Item as="li" value="-" style={styles.Content}>
                    X<sub>5</sub> + X<sub>10</sub> + X<sub>15</sub> >={" "}
                    {this.state.demands[4]}
                  </List.Item>
                </List.Item>
              </List.Item>
            </List>
            <p style={styles.Statement}>
              With that, the objective function is defined then as follows:
            </p>
            <p
              style={{
                marginTop: "-10px",
                marginBottom: "10px",
                ...styles.Content
              }}
            >
              <strong>
                {this.state.shipping_1[0]}X<sub>1</sub> +{" "}
                {this.state.shipping_1[1]}X<sub>2</sub> +{" "}
                {this.state.shipping_1[2]}X<sub>3</sub> +{" "}
                {this.state.shipping_1[3]}X<sub>4</sub> +{" "}
                {this.state.shipping_1[4]}X<sub>5</sub> +{" "}
                {this.state.shipping_2[0]}X<sub>6</sub> +{" "}
                {this.state.shipping_2[1]}X<sub>7</sub> +{" "}
                {this.state.shipping_2[2]}X<sub>8</sub> +{" "}
                {this.state.shipping_2[3]}X<sub>9</sub> +{" "}
                {this.state.shipping_2[4]}X<sub>10</sub> +{" "}
                {this.state.shipping_3[0]}X<sub>11</sub> +{" "}
                {this.state.shipping_3[1]}X<sub>12</sub> +{" "}
                {this.state.shipping_3[2]}X<sub>13</sub> +{" "}
                {this.state.shipping_3[3]}X<sub>14</sub> +{" "}
                {this.state.shipping_3[4]}X<sub>15</sub> = Z
              </strong>
            </p>
            {this.state.optimized ? (
              <div>
                <p style={styles.Statement}>
                  After minimization, here are the resulting values:{" "}
                  <Button onClick={this.showIterations}>
                    {this.state.show_iter ? "Hide" : "Show"}
                  </Button>
                </p>
                {this.state.show_iter ? (
                  <div>
                    {this.state.iterations.map((iter, id) => {
                      return (
                        <div>
                          <Divider horizontal>
                            {id === 0 ? (
                              "Initial Tableau"
                            ) : (
                              <text>Iteration {id}</text>
                            )}
                          </Divider>
                          <Table
                            inverted
                            celled
                            structured
                            columns={26}
                            key={id}
                          >
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>1</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>2</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>3</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>4</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>5</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>6</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>7</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>8</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>9</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>10</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>11</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>12</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>13</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>14</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>15</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>1</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>2</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>3</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>4</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>5</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>6</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>7</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>8</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  Z
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  Solution
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  Test Ratio
                                </Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {iter.map((values, val_id) => {
                                return (
                                  <Table.Row key={val_id}>
                                    {values.map((value, value_id) => {
                                      return (
                                        <Table.Cell
                                          key={value_id}
                                          textAlign="center"
                                        >
                                          {value}
                                        </Table.Cell>
                                      );
                                    })}
                                  </Table.Row>
                                );
                              })}
                            </Table.Body>
                          </Table>
                          <Table inverted celled structured columns={25}>
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell
                                  colSpan={25}
                                  textAlign="center"
                                >
                                  Basic Solution
                                </Table.HeaderCell>
                              </Table.Row>
                              <Table.Row>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>1</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>2</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>3</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>4</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>5</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>6</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>7</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>8</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>9</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>10</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>11</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>12</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>13</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>14</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  X<sub>15</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>1</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>2</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>3</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>4</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>5</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>6</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>7</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  S<sub>8</sub>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  Z
                                </Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              <Table.Row>
                                {this.state.basic_solution[id].map(
                                  (soln, soln_id) => {
                                    return (
                                      <Table.Cell
                                        textAlign="center"
                                        key={soln_id}
                                      >
                                        {soln}
                                      </Table.Cell>
                                    );
                                  }
                                )}
                              </Table.Row>
                            </Table.Body>
                          </Table>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div />
                )}
              </div>
            ) : (
              <div />
            )}
          </Segment>
        </div>
      </Title>
    );
  }
}

export default Simplex;
