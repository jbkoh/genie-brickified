import React, { Component } from 'react';
import LeftMenu from './components/LeftMenu/LeftMenu';
import TopMenu from './components/TopMenu/TopMenu';
import Dashboard from './Dashboard';
import './css/Mainpage.css';
import {Responsive} from 'semantic-ui-react';
import PropTypes from "prop-types";
import Account from './components/Account/Account'

class DesktopContainer extends Component {
  render() {
    const {onAddItem, onRemoveItem, changeBuilding, changeCampus, changeCollege,
      changeRoom, account, switchAccount} = this.props
    const main = account ? (
      <div className="main-container">
        <Account mobile={false} options={this.props.options} updateOptions={this.props.updateOptions} 
      onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
      changeBuilding={changeBuilding} changeCampus={changeCampus}
      changeCollege={changeCollege} changeRoom={changeRoom} />
      </div>
    ) : (
      <div className="main-container">
        <Dashboard mobile={false} options={this.props.options} updateOptions={this.props.updateOptions} 
      onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
      changeBuilding={changeBuilding} changeCampus={changeCampus}
      changeCollege={changeCollege} changeRoom={changeRoom} />
      </div>
    );
    return (
      <Responsive minWidth={1136} >
        <TopMenu switchAccount={switchAccount} />
        <LeftMenu switchAccount={switchAccount} />
        {main}
      </Responsive>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node
};

class MobileContainer extends Component {
  render() {
    const {onAddItem, onRemoveItem, changeBuilding, changeCampus, changeCollege,
      changeRoom, account, switchAccount} = this.props
      const main = account ? (
        <div className="mobile-container">
          <Account mobile={true} options={this.props.options} updateOptions={this.props.updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom} />
        </div>
      ) : (
        <div className="mobile-container">
          <Dashboard mobile={true} options={this.props.options} updateOptions={this.props.updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom} />
        </div>
      );
    return (
      <Responsive maxWidth={1135}>
        <TopMenu switchAccount={switchAccount} />
        {main}
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node
};

const ResponsiveContainer = ({ children, options, updateOptions, onAddItem, onRemoveItem, changeBuilding,
changeCampus, changeCollege, changeRoom, account, switchAccount }) => (
  <div>
    <DesktopContainer options={options} updateOptions={updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom}
        account={account} switchAccount={switchAccount} >{children}</DesktopContainer>
    <MobileContainer options={options} updateOptions={updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom}
        account={account} switchAccount={switchAccount} >{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node
};

class Main extends Component {  
  state = {
    options: [],
    temp: {},
    account: false
  }

  switchAccount = (option) => {
    this.setState({account: option})
  }

  updateOptions = (options) => {
    this.setState({options: options})
  }

  changeRoom = (e, {value}) => {
      this.setState(prevState => ({
          temp: {
              ...prevState.temp,
              room: {value}
          }
      }))
  }

  changeCampus = (e, {value}) => {
      this.setState(prevState => ({
          temp: {
              ...prevState.temp,
              campus: {value}
          }
      }))
  }

  changeBuilding = (e, {value}) => {
      this.setState(prevState => ({
          temp: {
              ...prevState.temp,
              building: {value}
          }
      }))
  }

  changeCollege = (e, {value}) => {
      this.setState(prevState => ({
          temp: {
              ...prevState.temp,
              college: {value}
          }
      }))
  }

  onAddItem = () => {
      this.setState(
          state => {
              if(!state.options.some(o => (o.college.value === state.temp.college.value
                                      && o.campus.value === state.temp.campus.value
                                      && o.building.value === state.temp.building.value
                                      && o.room.value === state.temp.room.value)))
                  state.options.push(state.temp)
              const options = state.options
              return {
                  options,
                  temp: state.temp
              }
          }
      )
  }

  onRemoveItem = i => {
      this.setState(state => {
          const options = state.options.filter((item, j) => i !== j)
          return {
              options,
          }
      })
  }

  componentWillMount() {
      localStorage.getItem('options') && this.setState({
        options: JSON.parse(localStorage.getItem('options'))
      })
      localStorage.getItem('temp') && this.setState({
        temp: JSON.parse(localStorage.getItem('temp'))
      })
  }

  componentDidMount() {
    if(!localStorage.getItem('options')) {
      //todo: fetch data
    }
    if(!localStorage.getItem('temp')) {
      //todo: fetch data
    }
  }

  componentWillUpdate(nextProps, nextState) {
      localStorage.setItem('options', JSON.stringify(nextState.options))
      localStorage.setItem('temp', JSON.stringify(nextState.temp))
  }

  render() {
    const {options, account} = this.state;
    return (
      <ResponsiveContainer options={options} updateOptions={this.updateOptions} 
        onAddItem={this.onAddItem} onRemoveItem={this.onRemoveItem} 
        changeBuilding={this.changeBuilding} changeCampus={this.changeCampus}
        changeCollege={this.changeCollege} changeRoom={this.changeRoom}
        account={account} switchAccount={this.switchAccount} />
    );
  }
}

export default Main;
