import React, { Component } from "react";
import { Grid, Button, Table, Input } from "semantic-ui-react";
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
  }
};

// company county
const Company = ["Denver", "Pheonix", "Dallas"];

class Simplex extends Component {
  constructor(props) {
    super(props);

    // set states
    this.state = {
      costs: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
      demands: [180, 80, 200, 160, 220],
      supplies: [310, 260, 280],
      shipping_1: [0, 0, 0, 0, 0],
      shipping_2: [0, 0, 0, 0, 0],
      shipping_3: [0, 0, 0, 0, 0],
      optimized: false,
      show_iter: false
    };
  }

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
                            <Table.Cell>{cost[0]}</Table.Cell>
                            <Table.Cell>{cost[1]}</Table.Cell>
                            <Table.Cell>{cost[2]}</Table.Cell>
                            <Table.Cell>{cost[3]}</Table.Cell>
                            <Table.Cell>{cost[4]}</Table.Cell>
                            <Table.Cell>{cost[5]}</Table.Cell>
                          </Table.Row>
                        );
                      })}
                      <Table.Row>
                        <Table.Cell>Totals:</Table.Cell>
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
                        <Table.Cell>
                          {this.state.costs[0][5] +
                            this.state.costs[1][5] +
                            this.state.costs[2][5]}
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
                        <Table.Cell textAlign='center'>
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
                          {this.state.costs[0][0] * this.state.shipping_1[0] +
                            this.state.costs[1][0] * this.state.shipping_2[0] +
                            this.state.costs[2][0] * this.state.shipping_3[0]}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {this.state.costs[0][1] * this.state.shipping_1[1] +
                            this.state.costs[1][1] * this.state.shipping_2[1] +
                            this.state.costs[2][1] * this.state.shipping_3[1]}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {this.state.costs[0][2] * this.state.shipping_1[2] +
                            this.state.costs[1][2] * this.state.shipping_2[2] +
                            this.state.costs[2][2] * this.state.shipping_3[2]}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {this.state.costs[0][3] * this.state.shipping_1[3] +
                            this.state.costs[1][3] * this.state.shipping_2[3] +
                            this.state.costs[2][3] * this.state.shipping_3[3]}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
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
        </div>
      </Title>
    );
  }
}

export default Simplex;
