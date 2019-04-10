import React, { Component } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

export default class Contact extends Component {
  state = { modalOpen: false }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return (
      <Modal
        dimmer={true}
        open={this.props.open}
        onClose={this.props.onClose}
        basic
        size='small'
      >
        <Header icon='address book' content='Contact Us' />
        <Modal.Content>
          <h3>For any questions or issues, please <a href="mailto:jbkoh@eng.ucsd.edu" style={{color: 'chartreuse'}}>email us</a>.</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.onClose} inverted>
            <Icon name='checkmark' /> Close
          </Button>
          <Button color='green' href="mailto:jbkoh@eng.ucsd.edu" onClick={this.props.onClose} inverted>
            Contact <Icon name='right arrow' />
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}