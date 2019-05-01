import React, { Component } from 'react';
import { Card, Grid, Icon, Header, Divider } from 'semantic-ui-react';
import './DateWeather.css';
import Clock from 'react-live-clock';

class DateWeather extends Component {
    render() {
        return(
            <div>
                <Card fluid color='red' className={"gradient"} >
                    <Grid>
                        <Grid.Row style={{
                            paddingTop: 40,
                            paddingBottom: 0,
                            minHeight: 101
                        }}>
                            <Grid.Column width={6} style={{
                                textAlign: "center",
                                paddingTop: 0
                            }} >
                                <Grid.Row style={{
                                }} >
                                    <Icon name={"clock outline"} size='huge' style={{
                                        color: "rgb(143, 201, 251)"
                                    }} />
                                </Grid.Row>
                            </Grid.Column>
                            <Grid.Column width={10} style={{
                                textAlign: "left",
                                paddingTop: 0
                            }} >
                                <Grid.Row style={{
                                }} >
                                    <Clock
                                        className={"dashboard"}
                                        format={'HH:mm:ss'}
                                        ticking={true} />
                                </Grid.Row>
                                <Grid.Row style={{
                                }} >
                                    <Clock
                                        className={"dashboard"}
                                        format={'ddd'}
                                        ticking={true} />
                                </Grid.Row>
                                <Grid.Row style={{
                                }} >
                                    <Clock
                                        className={"dashboard"}
                                        format={'MMM/DD/YYYY'}
                                        ticking={true} />
                                </Grid.Row>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{
                            paddingTop: 0,
                            paddingBottom: 0,
                            height: 2
                        }}>
                            <Grid.Column>
                                <Divider />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{
                            paddingTop: 40,
                            paddingBottom: 0,
                            minHeight: 101
                        }}>
                            <Grid.Column width={6} style={{
                                textAlign: "center",
                                paddingTop: 0
                            }} >
                                <Grid.Row style={{
                                }} >
                                    <Icon name={"snowflake outline"} size='huge' style={{
                                        color: "rgb(143, 201, 251)"
                                    }} />
                                </Grid.Row>
                            </Grid.Column>
                            <Grid.Column width={10} style={{
                                textAlign: "left",
                                paddingTop: 0
                            }} >
                                <Grid.Row style={{
                                }} >
                                    <Header className={"dashboard"}>
                                        {"clear"}
                                    </Header>
                                </Grid.Row>
                                <Grid.Row style={{
                                    paddingTop: 10
                                }} >
                                    <Header className={"dashboard"}>
                                        {"63.8 °F"}
                                    </Header>
                                </Grid.Row>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card>
            </div>
        );
    }
}

export default DateWeather;
