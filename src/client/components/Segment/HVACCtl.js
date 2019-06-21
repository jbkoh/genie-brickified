import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Icon, Header, Segment, Divider, Statistic, Button } from 'semantic-ui-react';
import './Segment.css';
import Slider from 'react-input-slider';

const SegmentObject = ({icon, color, title, value, label, handleChangeTemp, mobile}) => (
    <Segment className={"glowfloat"} raised style={{minHeight: "204px"}} color="violet">
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
                            color: color,
                            marginTop: "50% !important",
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
                        <Slider
                            styles={{
                                track: {
                                    width: '100% !important',
                                },
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

const SwitchObject = ({icon, color, title, value, toggleStatus, mobile, loading}) => (
    <Segment className={"glowfloat"} raised style={{minHeight: "204px"}} color="teal">
        <Grid>
            <Grid.Row>
                <Grid.Column width={6} style={{
                    textAlign: "center",
                    marginTop: 0
                }} >
                    <Grid.Row style={{
                        marginTop: 40,
                    }} >
                        <Icon disabled={value === "OFF"} name={icon} size={mobile ? 'huge' : 'huge'} style={{
                            color: (value === "OFF") ? "#666" : color,
                            marginTop: "50% !important",
                        }} />
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column width={10} style={{
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
                        <Button icon labelPosition='right' loading={loading}
                            color={value === "OFF" ? 'blue' : 'red'} onClick={toggleStatus} 
                            style={{width: '100% !important'}}>
                            {value === "OFF" ? "Turn On" : "Turn Off"}
                            <Icon name={value === "OFF" ? "toggle on" : "toggle off"} />
                        </Button>
                    </Grid.Row>
                    <Grid.Row style={{
                        marginTop: 20,
                    }} >
                      <Statistic size="small" horizontal floated={"left"}>  
                        <Statistic.Value>{value}</Statistic.Value>
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
        status: 1,
        temperature: 73,
        status_error: false,
        setpoint_error: false,
        loading: false
    }
    this.get_status.bind(this)
    this.get_temp_setpoint.bind(this)
  }

  toggleStatus = () => {
    const { option, user_email } = this.props;
    const status = (this.state.status === 3) ? 1 : 3
    this.setState({loading: true})
    this.set_status(option, status.toString(), status, user_email)
  }

  handleChangeTemp = (temperature) => {
      const { option, user_email } = this.props;
      this.set_temp_setpoint(option, temperature, user_email)
      this.setState({
        temperature: temperature
      })
  }

  get_status(option, user_email) {
    const roomkey = option.building.value.toLowerCase() + ':' + 
        option.building.value + '_Rm_' + option.room.value
    axios.get('/point/status/' + roomkey, {
    	params: {
		user_email: user_email.data
	}
    })
        .then(res => {
            if(res != null 
                && res.data != null 
                && res.data['value'] != null) {
                const resp = res.data;
                this.setState({ status: resp['value'],
                                status_error: false });
            }
            else {
                this.setState({ status_error: true });
            }
        })
  }

  get_temp_setpoint(option, user_email) {
    const roomkey = option.building.value.toLowerCase() + ':' + 
        option.building.value + '_Rm_' + option.room.value
    axios.get('/point/setpoint/' + roomkey, {
    	params: {
		user_email: user_email.data
	}
    })
        .then(res => {
            if(res != null 
                && res.data != null 
                && res.data['value'] != null) {
                const resp = res.data;
                this.setState({ temperature: resp['value'],
                                setpoint_error: false });
            }
            else {
                this.setState({ setpoint_error: true });
            }
        })
  }

  set_status(option, status, numStatus, user_email) {
    const roomkey = option.building.value.toLowerCase() + ':' + 
        option.building.value + '_Rm_' + option.room.value
    axios.post('/point/status/' + roomkey, { value: status }, {
	    params: {
	    	user_email: user_email.data
	    }
    })
        .then(res => {
            this.setState({
              status: numStatus,
              loading: false
            })
        })
        .catch(function (error) {
            console.log(error);
        });
  }

  set_temp_setpoint(option, temp, user_email) {
    const roomkey = option.building.value.toLowerCase() + ':' + 
        option.building.value + '_Rm_' + option.room.value
    axios.post('/point/setpoint/' + roomkey, { value: temp }, {
    	params: {
		user_email: user_email.data
	}
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
  }

  static getDerivedStateFromProps(props, state) {
    const { user_email } = props;
    if(user_email != null) {
      if(user_email !== state.user_email) {
        return {
		user_email: user_email
	};
      }
      else {
      	return null;
      }
    }
    return null;
  }

  componentDidMount(prevProps, prevState) {
    const { option, user_email } = this.props;
	  console.log(option)
    if(user_email != null) {
      localStorage.setItem('user_id', JSON.stringify(user_email))
      if(typeof prevProps === 'undefined' || user_email !== prevProps.user_email) {
	this.get_status(option, user_email);
	this.get_temp_setpoint(option, user_email);
      }
    }
    else if(localStorage.getItem('user_id')) {
	let user_id = JSON.parse(localStorage.getItem('user_id'))
	this.get_status(option, user_id);
	this.get_temp_setpoint(option, user_id);
    }
  }

  render() {
    const { status, temperature, loading } = this.state;
    return (
        <Grid container={this.props.mobile} stackable={this.props.mobile}>
            <Grid.Row>
                <Grid.Column>
                    <Divider horizontal style={{ marginLeft: "15px", marginRight: "15px" }} >
                        <Header as='h3' className="segtitle" >
                            {this.props.title}
                        </Header>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={8} >
                    <SwitchObject icon={"power off"} color={"rgb(143, 201, 251)"} 
                        title={"Status"} value={(status === 3) ? "ON" : "OFF"}
                        toggleStatus={this.toggleStatus} mobile={this.props.mobile} loading={loading} />
                </Grid.Column>
                <Grid.Column width={8} >
                    <SegmentObject icon={"thermometer quarter"} color={"rgb(248, 200, 46)"} 
                        title={"Temperature"} value={temperature} label={"°F"}
                        handleChangeTemp={this.handleChangeTemp} mobile={this.props.mobile} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
  }
}

export default SegmentComponent;
