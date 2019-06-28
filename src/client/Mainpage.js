import React, { Component } from 'react';
import axios from 'axios';
import LeftMenu from './components/LeftMenu/LeftMenu';
import TopMenu from './components/TopMenu/TopMenu';
import Dashboard from './Dashboard';
import './css/Mainpage.css';
import {Responsive} from 'semantic-ui-react';
import PropTypes from "prop-types";
import Account from './components/Account/Account'
import { Redirect } from "react-router-dom";

class DesktopContainer extends Component {
  render() {
    const {onAddItem, onRemoveItem, changeBuilding, changeCampus, changeCollege,
      changeRoom, account, switchAccount, user_email} = this.props
    const main = account ? (
      <div className="main-container">
        <Account mobile={false} options={this.props.options} updateOptions={this.props.updateOptions} 
      onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
      changeBuilding={changeBuilding} changeCampus={changeCampus}
      changeCollege={changeCollege} changeRoom={changeRoom} user_email={user_email} />
      </div>
    ) : (
      <div className="main-container">
        <Dashboard mobile={false} options={this.props.options} updateOptions={this.props.updateOptions} 
      onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
      changeBuilding={changeBuilding} changeCampus={changeCampus}
      changeCollege={changeCollege} changeRoom={changeRoom}  user_email={user_email} />
      </div>
    );
    return (
      <Responsive minWidth={1136} >
        <TopMenu switchAccount={switchAccount} user_email={user_email} />
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
      changeRoom, account, switchAccount, user_email} = this.props
      const main = account ? (
        <div className="mobile-container">
          <Account mobile={true} options={this.props.options} updateOptions={this.props.updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom}  user_email={user_email} />
        </div>
      ) : (
        <div className="mobile-container">
          <Dashboard mobile={true} options={this.props.options} updateOptions={this.props.updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom}  user_email={user_email} />
        </div>
      );
    return (
      <Responsive maxWidth={1135}>
        <TopMenu switchAccount={switchAccount} user_email={user_email} />
        {main}
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node
};

const ResponsiveContainer = ({ children, options, updateOptions, onAddItem, onRemoveItem, changeBuilding,
changeCampus, changeCollege, changeRoom, account, switchAccount, user_email }) => (
  <div>
    <DesktopContainer options={options} updateOptions={updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom}
        account={account} switchAccount={switchAccount}  user_email={user_email} >{children}</DesktopContainer>
    <MobileContainer options={options} updateOptions={updateOptions} 
        onAddItem={onAddItem} onRemoveItem={onRemoveItem} 
        changeBuilding={changeBuilding} changeCampus={changeCampus}
        changeCollege={changeCollege} changeRoom={changeRoom}
        account={account} switchAccount={switchAccount}  user_email={user_email} >{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node
};

class Main extends Component {  
  state = {
    options: [],
    temp: {},
    account: false,
    rooms: [],
    user_email: null,
    redirect: false
  }

    sessionGet = (key) => {
      let stringValue = window.sessionStorage.getItem(key)
      if(stringValue !== null) {
        let value = JSON.parse(stringValue)
        let expirationDate = new Date(value.expirationDate)
        if(expirationDate > new Date()) {
          return value.value;
        }
        else {
          window.sessionStorage.removeItem(key)
        }
      }
      return null
    }

    sessionSet = (key, value, expirationInMin = 360) => {
      let expirationDate = new Date(new Date().getTime() + (60000 * expirationInMin))
      let newValue = {
        value: value,
        expirationDate: expirationDate.toISOString()
      }
      window.sessionStorage.setItem(key, JSON.stringify(newValue))
    }

    loginRedirect = () => {
      if (window.location.search !== "") {
        this.sessionSet("user_token", window.location.search.slice(19))
      }
      let user_token = this.sessionGet("user_token")
      if(user_token === null) {
	this.setState({redirect: false})
        return <Redirect to='/' />
      }
      else if(!this.state.redirect){
	axios.get('/api/redirected', {
		params: {
			user_access_token: user_token
		}
	})
          .then((res) => {
            localStorage.setItem('user_id', JSON.stringify(res))
	    this.setState({
		user_email: res,
	    	redirect: true
	    })
          })
          .catch((err) => {
	    console.log(err)
          })
      }
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
              if(state.rooms.some(o => (o.college === state.temp.college.value
                                      && o.campus === state.temp.campus.value
                                      && o.building === state.temp.building.value
                                      && o.room === state.temp.room.value))
                && state.temp.college.value != null
                && state.temp.campus.value != null
                && state.temp.building.value != null
                && state.temp.room.value != null
                && !state.options.some(o => (o.college.value === state.temp.college.value
                                      && o.campus.value === state.temp.campus.value
                                      && o.building.value === state.temp.building.value
                                      && o.room.value === state.temp.room.value))

                )
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

  componentWillUpdate(nextProps, nextState) {
      localStorage.setItem('options', JSON.stringify(nextState.options))
      localStorage.setItem('temp', JSON.stringify(nextState.temp))
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.user_email !== prevState.user_email) {
      axios.get('/api/room', {
	  params: {
		  user_email: this.state.user_email.data
	  }
      })
	.then(res => {
	    if(res != null) {
		const resp = res.data;
		this.setState({ rooms: resp['rooms'] });
	    }
	})
    }
  }
 
  render() {
    const {options, account, user_email} = this.state;
    return (
	<div>
            {this.loginRedirect()}
      <ResponsiveContainer options={options} updateOptions={this.updateOptions} 
        onAddItem={this.onAddItem} onRemoveItem={this.onRemoveItem} 
        changeBuilding={this.changeBuilding} changeCampus={this.changeCampus}
        changeCollege={this.changeCollege} changeRoom={this.changeRoom}
        account={account} switchAccount={this.switchAccount} user_email={user_email} />
	    </div>
    );
  }
}

export default Main;
