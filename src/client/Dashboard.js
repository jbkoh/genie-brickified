import React, { Component } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import './css/Dashboard.css';
import SearchPanel from './components/Search/Search';
import DateWeather from './components/DateWeather/DateWeather'
import Meter from './components/Meter/Meter'

class Dashboard extends Component {

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <SearchPanel />
          </Grid.Column>
          <Grid.Column width={4}>
            <DateWeather />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Meter />
            </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Dashboard;
