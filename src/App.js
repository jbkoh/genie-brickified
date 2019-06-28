import React, { Component } from 'react';
import './App.css';
import Home from './client/Homepage';
import Main from './client/Mainpage';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/main" component={Main} />
          <Route path='/login' component={() => {
              window.location.href = 'https://bd-testbed.ucsd.edu:5000/api/log';
              return null;
          }}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
