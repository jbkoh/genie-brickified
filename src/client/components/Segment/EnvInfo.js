import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Icon, Header, Segment, Divider, Statistic, Message } from 'semantic-ui-react';
import './Segment.css';
import Bar from 'react-meter-bar';

const WarningObject = ({icon, color, title, mobile}) => (
    <Segment  raised style={{minHeight: "204px"}} color="red">
        <Grid>
            <Grid.Row>
                <Grid.Column width={6} style={{
                    textAlign: "center",
                    marginTop: 0
                }} >
                    <Grid.Row style={{
                        marginTop: 40,
                    }} >
                        <Icon name={icon} size={mobile ? 'huge' : 'huge'} style={{
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
                        <Header className="segtitle">{title}</Header>
                    </Grid.Row>
                    <Grid.Row style={{
                        marginTop: 15,
                    }} >
                        <Message negative>
                            <Icon name='warning' />
                            No Data Found
                        </Message>
                    </Grid.Row>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Segment>
);

const SegmentObject = ({icon, color, title, value, label, labels, progress, mobile}) => (
    <Segment  raised style={{minHeight: "204px"}} color="red">
        <Grid>
            <Grid.Row>
                <Grid.Column width={6} style={{
                    textAlign: "center",
                    marginTop: 0
                }} >
                    <Grid.Row style={{
                        marginTop: 40,
                    }} >
                        <Icon name={icon} size={mobile ? 'huge' : 'huge'} style={{
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
                        <Header className="segtitle">{title}</Header>
                    </Grid.Row>
                    <Grid.Row style={{
                        marginTop: 15,
                    }} >
                        <Bar
                            labels={labels}
                            labelColor="#666"
                            progress={progress}
                            barColor="#fff34b"
                            seperatorColor="hotpink"
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

class SegmentComponent extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
        energy_value: 0,
        temperature_value: 60,
        energy_error: false,
        temperature_error: false
    }
    this.get_energy_usage.bind(this)
    this.get_room_temperature.bind(this)
  }

  get_energy_usage(option) {
    const roomkey = option.building.value.toLowerCase() + ':' + 
        option.building.value + '_Rm_' + option.room.value
    axios.get('http://localhost:5000/point/energy/' + roomkey)
        .then(res => {
            if(res != null 
                && res.data != null 
                && res.data['value'] != null) {
                const resp = res.data;
                this.setState({ energy_value: resp['value'],
                                energy_error: false });
            }
            else {
                this.setState({ energy_error: true });
            }
        })
  }

  get_room_temperature(option) {
    const roomkey = option.building.value.toLowerCase() + ':' + 
        option.building.value + '_Rm_' + option.room.value
    axios.get('http://localhost:5000/point/temp/' + roomkey)
        .then(res => {
            if(res != null 
                && res.data != null 
                && res.data['value'] != null) {
                const resp = res.data;
                this.setState({ temperature_value: resp['value'],
                                temperature_error: false });
            }
            else {
                this.setState({ temperature_error: true });
            }
        })
  }

  componentDidMount() {
    const { option } = this.props;
    this.get_energy_usage(option);
    this.get_room_temperature(option);
  }

  render() {
    // const { option } = this.props;
    // this.get_energy_usage(option);
    // this.get_room_temperature(option);
    const { energy_value, temperature_value, energy_error, temperature_error } = this.state;
    const energy_progress = energy_value / 10.0 * 100.0;
    const temperature_progress = (temperature_value - 60.0) / 20.0 * 100.0;
    const mobile_labels = (this.props.mobile) ? [60,65,70,75,80] : [60,64,68,72,76,80];
    const EnergyPanel = (energy_error) ? (
        <WarningObject icon={"tachometer alternate"} color={"rgb(216, 151, 235)"} 
        title={"Energy Usage"} mobile={this.props.mobile} />
    ) : (
        <SegmentObject icon={"tachometer alternate"} color={"rgb(216, 151, 235)"} 
        title={"Energy Usage"} value={energy_value} label={"kW"} 
        labels={[0,2,4,6,8,10]} progress={energy_progress} 
        mobile={this.props.mobile} />
    );
    const TemperaturePanel = (temperature_error) ? (
        <WarningObject icon={"thermometer"} color={"rgb(100, 234, 145)"} 
        title={"Room Temperature"} mobile={this.props.mobile} />
    ) : (
        <SegmentObject icon={"thermometer"} color={"rgb(100, 234, 145)"} 
        title={"Room Temperature"} value={temperature_value} label={"°F"} 
        labels={mobile_labels} progress={temperature_progress}
        mobile={this.props.mobile} />
    );
    return (
        <Grid container={this.props.mobile} stackable={this.props.mobile}>
            <Grid.Row>
                <Grid.Column>
                    <Divider horizontal style={{ marginLeft: "15px", marginRight: "15px" }} >
                        <Header as='h3' className="segtitle">
                            {this.props.title}
                        </Header>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={8} >
                    {EnergyPanel}
                </Grid.Column>
                <Grid.Column width={8} >
                    {TemperaturePanel}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
  }
}

export default SegmentComponent;
