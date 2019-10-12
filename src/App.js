import React, { Component } from 'react';
import './App.css';
import Home from './client/Homepage';
import Main from './client/Mainpage';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import {
    LOGIN_URL
} from './config'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/main" component={Main} />
          <Route path='/login' component={() => {
              window.location.href = LOGIN_URL;
              return null;
          }}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
