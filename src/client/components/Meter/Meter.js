import React, { Component } from 'react';
import { Segment, Breadcrumb, Button, Grid, Responsive } from 'semantic-ui-react';
import './Meter.css'
import EnvInfo from '../Segment/EnvInfo'
import HVACCtl from '../Segment/HVACCtl'

class Meter extends Component {
    state = {
        openMeter: true
    }

    componentWillMount() {
        localStorage.getItem('openMeter') && this.setState({
            openMeter: JSON.parse(localStorage.getItem('openMeter'))
        })
    }
  
    componentDidMount() {
      if(!localStorage.getItem('openMeter')) {
        //todo: fetch data
      }
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('openMeter', JSON.stringify(nextState.openMeter))
    }

    render() {
        const option = this.props.option
        const sections = [
            { key: option.college.value, content: option.college.value, link: false },
            { key: option.campus.value, content: option.campus.value, link: false },
            { key: option.building.value, content: option.building.value, link: false },
            { key: option.room.value, content: option.room.value, link: false },
        ]
        const {openMeter} = this.state;
        const icon = openMeter ? 'angle up' : 'angle down'
        const control = openMeter ? (
            <Responsive as={Segment}>
                <Grid container={this.props.mobile} stackable={this.props.mobile}>
                    <Grid.Row columns={2}>
                        <Grid.Column width={8}>
                            <EnvInfo title={"Environment Information"} option={option} mobile={this.props.mobile} user_email={this.props.user_email} />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <HVACCtl title={"HVAC Control"} option={option} mobile={this.props.mobile} user_email={this.props.user_email} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Responsive>
        ) : (<div></div>)

        return(
            <Segment.Group>
                <Segment>
                    <Breadcrumb icon='right angle' sections={sections} />
                    <Button icon={icon} basic size="mini" floated="right" onClick={() => {
                        this.setState({openMeter: !openMeter})
                    }} />
                </Segment>
                {control}
            </Segment.Group>
        );
    }
}

export default Meter;
