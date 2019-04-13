import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Icon } from 'semantic-ui-react';
import MyMenu from './MyMenu';
import './TopMenu.css';

class TopMenu extends Component {
  state = { activeItem: 'inbox' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    let iconStyle = {
      margin: '0 10px 0 0'
    };

    const trigger = (
      <span>
        <Icon name="user" size="large" style={iconStyle} /> User
      </span>
    );

    return (
      <Menu pointing secondary className="top-menu">
        <Menu.Menu postion="left" className="menu-logo">
          <Menu.Item>
            <Link to="dashboard">Genie</Link>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu className="right menu">
          <Menu.Item name="setting" onClick={this.handleItemClick}>
            <MyMenu trigger={trigger} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default TopMenu;
