import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { Menu, Icon } from 'semantic-ui-react';
import MyMenu from './MyMenu';
import './TopMenu.css';

class TopMenu extends Component {
  state = { activeItem: 'home', user: 'User' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  componentDidMount() {
	  const {user_email} = this.props
	  if(user_email !== null) { 
    axios.get('/user', {
    	params: {
		user_email: user_email
	}
    })
        .then(res => {
            if(res != null 
                && res.data != null 
                && res.data['value'] != null) {
                const resp = res.data;
                this.setState({ user: resp['value'].name });
            }
            else {
                this.setState({ user: 'User' });
            }
        })
	  } 
  }

  render() {
    const { activeItem, user } = this.state;

    let iconStyle = {
      margin: '0 10px 0 0'
    };

    const trigger = (
      <span>
        <Icon name="user" size="large" style={iconStyle} /> {user}
      </span>
    );

    return (
      <Menu pointing secondary className="top-menu">
        <Menu.Menu postion="left" className="menu-logo">
          <Menu.Item position="left">
            <Link to="dashboard">Genie</Link>
          </Menu.Item>
        </Menu.Menu>

        <Menu.Menu className="center menu">
          <Menu.Item
            name="home"
            onClick={() => {
              this.setState({ activeItem: 'home' })
              this.props.switchAccount(false)
            }}
            active={activeItem === 'home'}
          >
            <Icon name="inbox" size="large" style={iconStyle} />
            <span>Dashboard</span>
          </Menu.Item>
        </Menu.Menu>

        <Menu.Menu className="right menu">
          <Menu.Item 
            name="setting" 
            onClick={this.handleItemClick} 
            active={activeItem === "setting"}
          >
            <MyMenu trigger={trigger} switchAccount={this.props.switchAccount} user={user} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default TopMenu;
