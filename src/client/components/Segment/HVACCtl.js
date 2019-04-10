import React, { Component } from 'react';
import { Grid, Icon, Header, Segment, Divider, Statistic, Radio, Button } from 'semantic-ui-react';
import './Segment.css';
import Slider from 'react-input-slider';

const SegmentObject = ({icon, color, title, value, label, handleChangeTemp}) => (
    <Segment raised style={{height: "204px"}} >
        <Grid>
            <Grid.Row>
                <Grid.Column width={6} style={{
                    textAlign: "center",
                    marginTop: 0
                }} >
                    <Grid.Row style={{
                        marginTop: 40,
                    }} >
                        <Icon name={icon} size='massive' style={{
                            color: color
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
                        <Header>{title}</Header>
                    </Grid.Row>
                    <Grid.Row style={{
                        marginTop: 15,
                    }} >
                        <Slider
                            styles={{
                                active: {
                                backgroundColor: 'rgb(248, 200, 46)'
                                }
                            }}
                            axis="x"
                            xmin={67}
                            xmax={73}
                            xstep={0.5}
                            x={value}
                            onChange={({x}) => handleChangeTemp(x)}
                        />
                    </Grid.Row>
                    <Grid.Row style={{
                        marginTop: 20,
                    }} >
                      <Statistic size="small" horizontal floated={"right"} >
                          <Statistic.Value>{value}<span style={{ fontSize:12 }}>{label}</span></Statistic.Value>
                      </Statistic>
                    </Grid.Row>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Segment>
);

const SwitchObject = ({icon, color, title, value, toggleStatus}) => (
    <Segment raised style={{height: "204px"}}>
        <Grid>
            <Grid.Row>
                <Grid.Column width={6} style={{
                    textAlign: "center",
                    marginTop: 0
                }} >
                    <Grid.Row style={{
                        marginTop: 40,
                    }} >
                        <Icon disabled={value === "OFF"} name={icon} size='massive' style={{
                            color: (value === "OFF") ? "#666" : color
                        }} />
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column width={10} style={{
                    marginTop: 0
                }} >
                    <Grid.Row style={{
                        marginTop: 40,
                    }} >
                        <Header>{title}</Header>
                    </Grid.Row>
                    <Grid.Row style={{
                        marginTop: 15,
                    }} >
                        <Button icon labelPosition='right' 
                            color={value === "OFF" ? 'blue' : 'red'} onClick={toggleStatus} >
                            {value === "OFF" ? "Turn On" : "Turn Off"}
                            <Icon name={value === "OFF" ? "toggle on" : "toggle off"} />
                        </Button>
                    </Grid.Row>
                    <Grid.Row style={{
                        marginTop: 20,
                    }} >
                      <Statistic size="small" horizontal floated={"left"}>  
                        <Header style={{marginRight: 20}}>Current<span><br /></span>Status:</Header><Statistic.Value>{value}</Statistic.Value>
                      </Statistic>
                    </Grid.Row>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Segment>
);

class SegmentComponent extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
        status: 3,
        temperature: 73
    }
  }

  toggleStatus = () => {
      this.setState({
        status: (this.state.status === 3) ? 1 : 3
      })
  }

  handleChangeTemp = (temperature) => {
      this.setState({
        temperature: temperature
      })
  }

  render() {
    const { status, temperature } = this.state;
    return (
        <Grid>
            <Grid.Row>
                <Divider horizontal style={{ marginLeft: "15px", marginRight: "15px" }} >
                    <Header as='h3'>
                        {this.props.title}
                    </Header>
                </Divider>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={8} >
                    <SwitchObject icon={"power off"} color={"rgb(143, 201, 251)"} 
                        title={"Status"} value={(status === 3) ? "ON" : "OFF"}
                        toggleStatus={this.toggleStatus} />
                </Grid.Column>
                <Grid.Column width={8} >
                    <SegmentObject icon={"thermometer quarter"} color={"rgb(248, 200, 46)"} 
                        title={"Temperature"} value={temperature} label={"°F"}
                        handleChangeTemp={this.handleChangeTemp} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
  }
}

export default SegmentComponent;
