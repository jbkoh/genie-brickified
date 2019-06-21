import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

class MyPage extends Component {
  state = {
    redir: false
  };
  
  switchPage = (e, {value}) => {
    if(value === 'profile') {
      this.props.switchAccount(true)
    }
    else if(value === 'sign-out') {
      localStorage.clear();
      sessionStorage.clear();
      this.setState({ redir: true });
    }
  }

  renderRedir = () => {
    if (this.state.redir) {
      return <Redirect to='/' />
    }
  }

  render() {
    const options = [
      {
        key: 'user',
        value: 'user', 
        text: (
          <span>
            Signed in as <strong>{this.props.user}</strong>
          </span>
        ),
        disabled: true
      },
      { key: 'profile', value: 'profile', text: 'Your Profile' },
      { key: 'sign-out', value: 'sign-out', text: 'Sign Out' }
    ];

    return(
	<div>
	  {this.renderRedir()}
          <Dropdown trigger={this.props.trigger} options={options} onChange={this.switchPage} />
	</div>
    );
  }
}

export default MyPage;
