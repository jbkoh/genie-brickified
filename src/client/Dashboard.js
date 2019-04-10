import React, { Component } from 'react';
import { Card, Grid, Icon, Header, Divider } from 'semantic-ui-react';
import ebu3b from '../static/img/EBU3B.jpg';
import './css/Dashboard.css';
import Clock from 'react-live-clock';
import EnvInfo from './components/Segment/EnvInfo';
import HVACCtl from './components/Segment/HVACCtl';

class Dashboard extends Component {

  render() {
    return (
      <Grid>
        <Grid.Row>
            <Grid.Column width={8} >
                <EnvInfo title={"Environment Information"} />
            </Grid.Column>
            <Grid.Column width={8} >
                <HVACCtl title={"HVAC Control"} />
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6}>
            <Divider horizontal style={{ paddingBottom: "28px" }} >
                <Header as='h3' className="dashboard">
                    {"Time & Date, and Weather"}
                </Header>
            </Divider>
            <Card color='red' className={"gradient1"} >
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={6} style={{
                            textAlign: "center",
                            marginTop: 0
                        }} >
                            <Grid.Row style={{
                                marginTop: 40,
                            }} >
                                <Icon name={"clock outline"} size='massive' style={{
                                    color: "white"
                                }} />
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={10} style={{
                            textAlign: "left",
                            marginTop: 0
                        }} >
                            <Grid.Row style={{
                                marginTop: 40,
                            }} >
                                <Clock
                                    style={{
                                        fontSize: '3em',
                                        fontFamily: "DS-DIGII", 
                                        color: "white",
                                    }}
                                    format={'HH:mm:ss'}
                                    ticking={true} />
                            </Grid.Row>
                            <Grid.Row style={{
                                marginTop: 30,
                            }} >
                                <Clock
                                    style={{
                                        fontSize: '3em',
                                        fontFamily: "DS-DIGII", 
                                        color: "white"
                                    }}
                                    format={'ddd'}
                                    ticking={true} />
                            </Grid.Row>
                            <Grid.Row style={{
                                marginTop: 30,
                            }} >
                                <Clock
                                    style={{
                                        fontSize: '3em',
                                        fontFamily: "DS-DIGII", 
                                        color: "white"
                                    }}
                                    format={'MMM/DD/YYYY'}
                                    ticking={true} />
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card>
            <Card color='purple' className={"gradient2"}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={6} style={{
                            textAlign: "center",
                            marginTop: 0
                        }} >
                            <Grid.Row style={{
                                marginTop: 40,
                            }} >
                                <Icon name={"snowflake"} size='massive' style={{
                                    color: "white", 
                                }} />
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={10} style={{
                            textAlign: "left",
                            marginTop: 0
                        }} >
                            <Grid.Row style={{
                                marginTop: 60,
                            }} >
                                <span
                                    style={{
                                        fontSize: '3em',
                                        fontFamily: "DS-DIGII", 
                                        color: "white"
                                    }}
                                > 
                                Weather: Clear
                                </span>
                            </Grid.Row>
                            <Grid.Row style={{
                                marginTop: 30,
                            }} >
                                <span
                                    style={{
                                        fontSize: '3em',
                                        fontFamily: "DS-DIGII", 
                                        color: "white"
                                    }}
                                > 
                                Temperature: 63.8°F
                                </span>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card>
          </Grid.Column>
          <Grid.Column width={10}>
            <Divider horizontal style={{ paddingBottom: "28px" }} >
                <Header as='h3' className="dashboard">
                    {"Location"}
                </Header>
            </Divider>
            <Card color='orange' className={"location"} style={{
                backgroundImage: 'linear-gradient(to bottom right, rgba(0, 47, 75, 0.6), rgba(220, 66, 37, 0.6)), url('+ebu3b+')',
                backgroundSize: 'cover'
            }}>
                <Header className="head">UCSD/Main/EBU3B/2150</Header>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Dashboard;
