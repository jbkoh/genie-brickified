import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';

const options = [
  {
    key: 'user',
    text: (
      <span>
        Signed in as <strong>user</strong>
      </span>
    ),
    disabled: true
  },
  { key: 'profile', text: 'Your Profile' },
  { key: 'sign-out', text: 'Sign Out' }
];

class MyPage extends Component {
  render() {
    return <Dropdown trigger={this.props.trigger} options={options} />;
  }
}

export default MyPage;
