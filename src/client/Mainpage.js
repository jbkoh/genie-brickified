import React, { Component } from 'react';
import LeftMenu from './components/LeftMenu/LeftMenu';
import TopMenu from './components/TopMenu/TopMenu';
import Dashboard from './Dashboard';
import './css/Mainpage.css';
import {Responsive} from 'semantic-ui-react';
import PropTypes from "prop-types";

class DesktopContainer extends Component {
  render() {
    const {onAddItem, onRemoveItem, changeBuilding, changeCampus, changeCollege,
      changeRoom} = this.props
    return (
      <Responsive minWidth={1136} >
        <TopMenu />
        <LeftMenu />
        <div className="main-container">
          <Dashboard mobile={false} options={this.props.options} updateOptions={this.props.updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom} />
        </div>
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
      changeRoom} = this.props
    return (
      <Responsive maxWidth={1135}>
        <TopMenu />
        <div className="mobile-container">
          <Dashboard mobile={true} options={this.props.options} updateOptions={this.props.updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom} />
        </div>
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node
};

const ResponsiveContainer = ({ children, options, updateOptions, onAddItem, onRemoveItem, changeBuilding,
changeCampus, changeCollege, changeRoom }) => (
  <div>
    <DesktopContainer options={options} updateOptions={updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom} >{children}</DesktopContainer>
    <MobileContainer options={options} updateOptions={updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom} >{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node
};

class Main extends Component {  
  state = {
    options: [],
    temp: {},
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

  render() {
    const {options} = this.state;
    return (
      <ResponsiveContainer options={options} updateOptions={this.updateOptions} 
        onAddItem={this.onAddItem} onRemoveItem={this.onRemoveItem} 
        changeBuilding={this.changeBuilding} changeCampus={this.changeCampus}
        changeCollege={this.changeCollege} changeRoom={this.changeRoom} />
    );
  }
}

export default Main;
