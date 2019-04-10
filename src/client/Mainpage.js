import React, { Component } from 'react';
import LeftMenu from './components/LeftMenu/LeftMenu';
import TopMenu from './components/TopMenu/TopMenu';
import Dashboard from './Dashboard';
import './css/Mainpage.css';

class Main extends Component {
  render() {
    return (
      <div>
        <TopMenu />
        <LeftMenu />
        <div className="main-container">
          <Dashboard />
        </div>
      </div>
    );
  }
}

export default Main;
