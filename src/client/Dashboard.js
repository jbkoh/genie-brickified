import React, { Component } from 'react';
import { Grid, Message, Icon } from 'semantic-ui-react';
import './css/Dashboard.css';
import SearchPanel from './components/Search/Search';
import DateWeather from './components/DateWeather/DateWeather'
import Meter from './components/Meter/Meter'

class Dashboard extends Component {
  render() {
    const {onAddItem, onRemoveItem, changeBuilding, changeCampus, changeCollege,
      changeRoom, options, updateOptions} = this.props
    const message = (options.length === 0) ? (
      <Message attached='bottom' warning>
        <Icon name='warning' />
        Please Add Room
      </Message>
    ) : (<div></div>)

    return (
      <Grid container={this.props.mobile} stackable={this.props.mobile}>
        <Grid.Row>
          <Grid.Column width={4}>
            <DateWeather />
          </Grid.Column>
          <Grid.Column width={12}>
            <SearchPanel updateOptions={updateOptions} mobile={this.props.mobile} options={options}
            onAddItem={onAddItem} onRemoveItem={onRemoveItem} changeBuilding={changeBuilding}
            changeCampus={changeCampus} changeCollege={changeCollege} changeRoom={changeRoom} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                {message}
                {options.map(option => (
                  <Meter option={option} mobile={this.props.mobile} />
                )
                )}
            </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Dashboard;
