import React, { Component } from 'react';
import './App.css';
import Homepage from './client/Homepage';
import LeftMenu from './client/components/LeftMenu/LeftMenu';
import TopMenu from './client/components/TopMenu/TopMenu';
import Dashboard from './client/Dashboard';

class App extends Component {
  render() {
    return (
      // <Homepage />
      <div className="App">
        <TopMenu />
        <LeftMenu />
        <div className="main-container">
          <Dashboard />
        </div>
      </div>
    );
  }
}

export default App;
