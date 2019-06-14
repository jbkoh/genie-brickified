import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Dropdown, Segment, Divider, Icon, Button, Breadcrumb, List } from 'semantic-ui-react';
import './Search.css';

class Dashboard extends Component {
    state = {
        openSearch: true,
        collegeOptions: [],
        campusOptions: [],
        buildingOptions: [],
        roomOptions: [],
        rooms: []
    }

    componentWillMount() {
        localStorage.getItem('openSearch') && this.setState({
            openSearch: JSON.parse(localStorage.getItem('openSearch'))
        })
    }

    optionObject(option) {
        return {key: option, value: option, text: option}
    }

    componentDidMount() {
      if(!localStorage.getItem('openSearch')) {
        //todo: fetch data
      }
      axios.get('/room')
        .then(res => {
            if(res != null) {
                const rooms = res.data;
                this.setState({ rooms });
                // eslint-disable-next-line array-callback-return
                rooms['rooms'].map((room) => {
                    const collegeOption = {key: room.college, value: room.college, text: room.college}
                    const campusOption = {key: room.campus, value: room.campus, text: room.campus}
                    const buildingOption = {key: room.building, value: room.building, text: room.building}
                    const roomOption = {key: room.room, value: room.room, text: room.room}
                    this.setState(
                        state => {
                            if(!state.collegeOptions.includes(collegeOption))
                                state.collegeOptions.push(collegeOption)
                            if(!state.campusOptions.includes(campusOption))
                                state.campusOptions.push(campusOption)
                            if(!state.buildingOptions.includes(buildingOption))
                                state.buildingOptions.push(buildingOption)
                            if(!state.roomOptions.includes(roomOption))
                                state.roomOptions.push(roomOption)
                            const collegeOptions = state.collegeOptions
                            const campusOptions = state.campusOptions
                            const buildingOptions = state.buildingOptions
                            const roomOptions = state.roomOptions
                            return {
                                collegeOptions,
                                campusOptions,
                                buildingOptions,
                                roomOptions
                            }
                        }
                    )
                })
            }
        })
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('openSearch', JSON.stringify(nextState.openSearch))
    }

    render() {
        const {openSearch, collegeOptions, campusOptions, buildingOptions, roomOptions} = this.state
        const {onAddItem, onRemoveItem, changeBuilding, changeCampus, changeCollege,
          changeRoom, options} = this.props
        const message = openSearch ? 'Hide Room List' : 'Show Room List'
        const table = (openSearch) ? (
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
                                        onChange={changeCollege} style={{minWidth: 90}} />
                                        <Icon name='right angle' />
                                        <Dropdown placeholder='Campus' clearable search selection options={campusOptions} 
                                        onChange={changeCampus} style={{minWidth: 90}} />
                                        <Icon name='right angle' />
                                        <Dropdown placeholder='Building' clearable search selection options={buildingOptions} 
                                        onChange={changeBuilding} style={{minWidth: 90}} />
                                        <Icon name='right angle' />
                                        <Dropdown placeholder='Room' clearable search selection options={roomOptions} 
                                        onChange={changeRoom} style={{minWidth: 90}} />
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
                                            this.setState({openSearch: !openSearch})
                                        }} color={(openSearch) ? 'red' : 'green'}>{message}</Button>
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
