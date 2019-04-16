import React, { Component } from 'react';
import './Account.css';
import {Grid, Segment, Header, Icon, Responsive, Form, Breadcrumb, Button, Checkbox} from 'semantic-ui-react'
import SearchPanel from '../Search/Search';

class Account extends Component {
    render() {
        const {onAddItem, onRemoveItem, changeBuilding, changeCampus, changeCollege,
          changeRoom, options, updateOptions} = this.props
        return(
            <Grid container={this.props.mobile} stackable={this.props.mobile}>
                <Grid.Row>
                    <Grid.Column>
                        <Segment.Group className={"bigglow"}>
                            <Segment inverted style={{backgroundColor: '#cabadf'}}>
                                <Header as='h3' style={{color: '#563d7c'}}>
                                    <Icon name='terminal' />
                                    <Header.Content>User Information Console</Header.Content>
                                </Header>
                            </Segment>

                            <Segment.Group style={{marginTop: 10}} className={"bigglow"}>
                                <Responsive as={Segment} inverted style={{backgroundColor: '#cabadf'}}>
                                    <Breadcrumb sections={[
                                        { key: 'General Information', content: 'General Information', active: true },
                                        ]} style={{color: '#563d7c'}} />
                                </Responsive>
                                <Responsive as={Segment}>
                                    <Form>
                                        <Form.Field>
                                            <label>First Name</label>
                                            <input placeholder='Renxu' />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Last Name</label>
                                            <input placeholder='Hu' />
                                        </Form.Field>
                                        <Form.Field>
                                            <Checkbox label='I agree to the Terms and Conditions' />
                                        </Form.Field>
                                        <Button color="green" basic type='submit'>Change</Button>
                                    </Form>
                                </Responsive>
                            </Segment.Group>

                            <Segment.Group className={"bigglow"}>
                                <Responsive as={Segment} inverted style={{backgroundColor: '#cabadf'}}>
                                    <Breadcrumb sections={[
                                        { key: 'Password', content: 'Password', active: true },
                                        ]} style={{color: '#563d7c'}} />
                                </Responsive>
                                <Responsive as={Segment}>
                                    <Form>
                                        <Form.Field>
                                            <label>Old Password</label>
                                            <input placeholder='Old Password' type='password' />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>New Password</label>
                                            <input placeholder='New Password' type='password' />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>New Password (Again)</label>
                                            <input placeholder='New Password (Again)' type='password' />
                                        </Form.Field>
                                        <Form.Field>
                                            <Checkbox label='I agree to the Terms and Conditions' />
                                        </Form.Field>
                                        <Button color="green" basic type='submit'>Change</Button>
                                    </Form>
                                </Responsive>
                            </Segment.Group>

                            <Segment.Group className={"bigglow"}>
                                <Responsive as={Segment} inverted style={{backgroundColor: '#cabadf'}}>
                                    <Breadcrumb sections={[
                                        { key: 'Room', content: 'Room', active: true },
                                        ]} style={{color: '#563d7c'}} />
                                </Responsive>
                                <Responsive as={Segment} style={{}}>
                                    <SearchPanel updateOptions={updateOptions} mobile={this.props.mobile} options={options}
                                    onAddItem={onAddItem} onRemoveItem={onRemoveItem} changeBuilding={changeBuilding}
                                    changeCampus={changeCampus} changeCollege={changeCollege} changeRoom={changeRoom} />
                                </Responsive>
                            </Segment.Group>
                        </Segment.Group> 
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        );
    }
}

export default Account;