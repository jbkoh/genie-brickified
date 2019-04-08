import React, { Component } from 'react';
import { Card, Grid, Icon } from 'semantic-ui-react';
import ebu3b from '../static/img/EBU3B.jpg';
import './css/Dashboard.css';
import Clock from 'react-live-clock';

class Dashboard extends Component {

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
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
                            textAlign: "center",
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
                            textAlign: "center",
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
            <Card color='orange' className={"location"} style={{
                backgroundImage: 'linear-gradient(to bottom right, rgba(0, 47, 75, 0.6), rgba(220, 66, 37, 0.6)), url('+ebu3b+')',
                backgroundSize: 'cover'
            }}>
                <h1>UCSD/Main/EBU3B/2150</h1>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Dashboard;
