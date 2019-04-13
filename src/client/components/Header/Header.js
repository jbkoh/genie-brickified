import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import './Header.css';

class Header extends Component {
  render() {
    const menu = this.props.menu
    const home = this.props.home
    return (
      <div className="header-container">
        <h2 className="top-header">{menu}</h2>
        <div className="sub-header">
          <h5>
            {home}
            {menu}
          </h5>
        </div>
      </div>
    );
  }
}

export default Header;
