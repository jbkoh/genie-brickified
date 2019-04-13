import React, { Component } from 'react';
import { Grid, Dropdown, Segment, Divider, Header, Icon, Table, Button } from 'semantic-ui-react';
import './Search.css';

class Dashboard extends Component {
    state = {
        options: [],
        temp: {}
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
                if(!state.options.includes(state.temp))
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
        const {options} = this.state
        const collegeOptions = [
            {key: 'UCSD', value: 'UCSD', text: 'UCSD'},
        ]
        const campusOptions = [
            {key: 'Main', value: 'Main', text: 'Main'},
        ]
        const buildingOptions = [
            {key: 'EBU3B', value: 'EBU3B', text: 'EBU3B'},
        ]
        const roomOptions = [
            {key: '2140', value: '2140', text: '2140'},
            {key: '2150', value: '2150', text: '2150'},
            {key: '2160', value: '2160', text: '2160'},
        ]
        return (      
            <Grid>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <Divider horizontal style={{ paddingBottom: "28px" }} >
                            <Header as='h3' className="searchdashboard">
                                {"Room Selection"}
                            </Header>
                        </Divider>
                        <Segment className={"search"}>
                            <Grid>
                                <Grid.Row textAlign="center">
                                    <Grid.Column>
                                        <Dropdown placeholder='College' search selection options={collegeOptions} 
                                        onChange={this.changeCollege} compact />
                                        <Icon name='right angle' />
                                        <Dropdown placeholder='Campus' search selection options={campusOptions} 
                                        onChange={this.changeCampus} compact />
                                        <Icon name='right angle' />
                                        <Dropdown placeholder='Building' search selection options={buildingOptions} 
                                        onChange={this.changeBuilding} compact />
                                        <Icon name='right angle' />
                                        <Dropdown placeholder='Room' search selection options={roomOptions} 
                                        onChange={this.changeRoom} compact />
                                        <Button size="small" color="green" style={{
                                            marginLeft: 15
                                        }} onClick={this.onAddItem}>Add</Button>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row textAlign="center">
                                    <Grid.Column>
                                        <Table compact celled fixed >
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                                    <Table.HeaderCell>College</Table.HeaderCell>
                                                    <Table.HeaderCell>Campus</Table.HeaderCell>
                                                    <Table.HeaderCell>Building</Table.HeaderCell>
                                                    <Table.HeaderCell>Room</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>

                                            <Table.Body>
                                                {options.map((option, index) => (
                                                    <Table.Row>
                                                        <Table.Cell>
                                                            <Button color="red" size="mini" onClick={() => this.onRemoveItem(index)}>Delete</Button>
                                                        </Table.Cell>
                                                        <Table.Cell>{option.college.value}</Table.Cell>
                                                        <Table.Cell>{option.campus.value}</Table.Cell>
                                                        <Table.Cell>{option.building.value}</Table.Cell>
                                                        <Table.Cell>{option.room.value}</Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Dashboard;
