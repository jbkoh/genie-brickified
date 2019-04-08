import React, { Component } from 'react';
import { Link } from 'react-router';
import { Icon } from 'semantic-ui-react';
import Header from '../Header/Header';
import './LeftMenu.css';

class SubMenu extends Component {
  render() {
    let subMenu = this.props.submenu;

    if (subMenu !== null) {
      return (
        <div>
          {subMenu.map(submenu => {
            return (
              <div key={submenu.name} className="sub-menu">
                <Link to={submenu.name}>
                  <Icon name="plus" size="small"/>
                  <span>{submenu.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
      );
    } else {
      return <div></div>
    }
  }
}

class LeftMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenu: 'Dashboard'
    };
  }

  render() {
    const menus = [
      {
        name: 'Dashboard',
        icon: 'inbox',
      },
      {
        name: 'Account',
        icon: 'user',
      }
    ];

    return (
      <div>
        <Header menu={this.state.activeMenu} home={"Genie"} />
        <div className="left-menus">
          {menus.map(item => {
            if (item.submenus) {
              return (
                <div key={item.name}
                  className={this.state.activeMenu === item.name ? 'menu active' : 'menu' }
                  onClick={() => this.setState({ activeMenu: item.name })}>
                    <Icon name={item.icon} size="large"/>
                    <span>{item.name}</span>
                    <Icon name={this.state.activeMenu === item.name ? "angle up" : "angle down" }/>
                  <div className="">
                    <div className={ 'sub-menu-container ' +
                        (this.state.activeMenu === item.name ? 'active' : '') } >
                      <SubMenu submenu={item.submenus} menu={item} />
                    </div>
                  </div>
                </div>
              )
            } else {
              return (
                <Link to={item.name} name={item.name} key={item.name}
                  className={this.state.activeMenu === item.name ? 'menu active' : 'menu' }
                  onClick={() => this.setState({ activeMenu: item.name })}
                  >
                  <Icon name={item.icon} size="large"/>
                  <span>{item.name}</span>
                </Link>
              )
            }
          })}
        </div>
      </div>
    );
  }
}

export default LeftMenu;
