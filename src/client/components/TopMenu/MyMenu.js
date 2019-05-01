import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';

class MyPage extends Component {
  switchPage = (e, {value}) => {
    if(value === 'profile')
      this.props.switchAccount(true)
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

    return <Dropdown trigger={this.props.trigger} options={options} onChange={this.switchPage} />;
  }
}

export default MyPage;
