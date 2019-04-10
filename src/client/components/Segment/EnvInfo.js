import React, { Component } from 'react';
import { Grid, Icon, Header, Segment, Divider, Statistic } from 'semantic-ui-react';
import './Segment.css';
import Bar from 'react-meter-bar';

const SegmentObject = ({icon, color, title, value, label, labels, progress}) => (
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
  render() {
    const energy_value = 1.5, temperature_value = 75.7;
    const energy_progress = energy_value / 3.0 * 100.0;
    const temperature_progress = (temperature_value - 60.0) / 20.0 * 100.0;
    return (
        <Grid>
            <Grid.Row>
                <Divider horizontal style={{ marginLeft: "15px", marginRight: "15px" }} >
                    <Header as='h3' className="segtitle">
                        {this.props.title}
                    </Header>
                </Divider>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={8} >
                    <SegmentObject icon={"tachometer alternate"} color={"rgb(216, 151, 235)"} 
                        title={"Energy Usage"} value={energy_value} label={"kW"} 
                        labels={[0,0.5,1,1.5,2,2.5,3]} progress={energy_progress} />
                </Grid.Column>
                <Grid.Column width={8} >
                    <SegmentObject icon={"thermometer"} color={"rgb(100, 234, 145)"} 
                        title={"Room Temperature"} value={temperature_value} label={"°F"} 
                        labels={[60,64,68,72,76,80]} progress={temperature_progress} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
  }
}

export default SegmentComponent;