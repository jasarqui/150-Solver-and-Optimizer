import React, { Component } from "react";
import { Menu, Segment } from "semantic-ui-react";
import axios from "axios";

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = { res: 0 };
  }

  handleItemClick = e =>
    axios.get(`/solve/2`).then(result => {
      console.log(result);
      this.setState({ res: result.data.returnthis });
    });

  render() {
    const { activeItem } = this.state;

    return (
      <Segment inverted>
        <Menu inverted secondary>
          <Menu.Item
            name={this.state.res}
            active={activeItem === "home"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="messages"
            active={activeItem === "messages"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="friends"
            active={activeItem === "friends"}
            onClick={this.handleItemClick}
          />
        </Menu>
      </Segment>
    );
  }
}
