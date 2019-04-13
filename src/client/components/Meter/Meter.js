import React, { Component } from 'react';
import { Segment, Breadcrumb, Button } from 'semantic-ui-react';
import './Meter.css'
import EnvInfo from '../Segment/EnvInfo'
import HVACCtl from '../Segment/HVACCtl'

class Meter extends Component {
    state = {
        open: true
    }

    render() {
        const sections = [
            { key: 'UCSD', content: 'UCSD', link: false },
            { key: 'Main', content: 'Main', link: false },
            { key: 'EBU3B', content: 'EBU3B', link: false },
            { key: '2140', content: '2140', link: false },
        ]
        const {open} = this.state;
        const icon = open ? 'angle up' : 'angle down'
        const control = open ? (
            <Segment>
                <EnvInfo title={"Environment Information"} />
                <HVACCtl title={"HVAC Control"} />
            </Segment>
        ) : (<div></div>)

        return(
            <Segment.Group>
                <Segment>
                    <Breadcrumb icon='right angle' sections={sections} />
                    <Button icon={icon} basic size="mini" floated="right" onClick={() => {
                        this.setState({open: !open})
                    }} />
                </Segment>
                {control}
            </Segment.Group>
        );
    }
}

export default Meter;