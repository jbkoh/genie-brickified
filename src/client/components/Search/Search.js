import React, { Component } from 'react';
import { Grid, Dropdown, Segment, Divider, Icon, Button, Breadcrumb, List } from 'semantic-ui-react';
import './Search.css';

class Dashboard extends Component {
    state = {
        open: true
    }

    render() {
        const {open} = this.state
        const {onAddItem, onRemoveItem, changeBuilding, changeCampus, changeCollege,
          changeRoom, options} = this.props
        const message = open ? 'Hide Room List' : 'Show Room List'
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
        const table = (open) ? (
            options.map((option, index) => (
                <List.Item floated="left">
                    <List.Content>
                        <List.Header>
                            <Icon name="building" />
                            <Breadcrumb icon='right angle' sections={[
                                { key: option.college.value, content: option.college.value, link: false },
                                { key: option.campus.value, content: option.campus.value, link: false },
                                { key: option.building.value, content: option.building.value, link: false },
                                { key: option.room.value, content: option.room.value, link: false },
                            ]} style={{marginLeft: 10}}/>
                            <Button compact color="red" size="mini" 
                                    onClick={() => onRemoveItem(index)}
                                    basic style={{marginLeft: 10}}>Delete</Button>
                        </List.Header>
                    </List.Content>
                </List.Item>
            ))
        ) : (<div></div>)
        return (      
            <Grid>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <Segment className={"search"} color="teal">
                            <Grid>
                                <Grid.Row textAlign="center">
                                    <Grid.Column>
                                        <Button icon="search" basic style={{marginRight: 3}} />
                                        <Dropdown placeholder='College' clearable search selection options={collegeOptions} 
                                        onChange={changeCollege} compact />
                                        <Icon name='right angle' />
                                        <Dropdown placeholder='Campus' clearable search selection options={campusOptions} 
                                        onChange={changeCampus} compact />
                                        <Icon name='right angle' />
                                        <Dropdown placeholder='Building' clearable search selection options={buildingOptions} 
                                        onChange={changeBuilding} compact />
                                        <Icon name='right angle' />
                                        <Dropdown placeholder='Room' clearable search selection options={roomOptions} 
                                        onChange={changeRoom} compact />
                                        <Button size="small" color="green" compact style={{
                                            marginLeft: 15
                                        }} onClick={onAddItem} basic>Add</Button>
                                    </Grid.Column>
                                </Grid.Row>
                                <Divider style={{marginTop: 0, marginBottom: 0, paddingBottom: 0, paddingTop: 0}}/>
                                <Grid.Row textAlign="center">
                                    <Grid.Column>
                                        <List animated selection divided verticalAlign='middle' style={{marginTop:0, paddingTop: 0}}>
                                            {table}
                                        </List>
                                        <Button basic compact size="mini" floated="right" onClick={() => {
                                            this.setState({open: !open})
                                        }} color={(open) ? 'red' : 'green'}>{message}</Button>
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
