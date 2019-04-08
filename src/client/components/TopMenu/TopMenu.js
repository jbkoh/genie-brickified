import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
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
        <Menu.Menu className="center menu">
          <Menu.Item
            name="home"
            active={activeItem === 'home'}
            onClick={this.handleItemClick}
          >
            <Icon name="home" size="large" style={iconStyle} />
            <span>Home</span>
          </Menu.Item>

          <Menu.Item name="setting" onClick={this.handleItemClick}>
            <MyMenu trigger={trigger} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default TopMenu;
