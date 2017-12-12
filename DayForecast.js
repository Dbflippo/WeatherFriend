import React from 'react';
import HourForecast from './HourForecast';
import styles from './Styles'
import { NavigatorIOS, AppRegistry, Button, FlatList, Text, Image, StatusBar, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';

/*
	Gets 10 day forecast information and processes the JSON to
	render into a FlatList. 
*/
export default class DayForecast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	forecast_day: '',
    	celsius: this.props.celsius,
    };
    this.get_forecast_day = this.get_forecast_day.bind(this);
    this.process_forecast = this.process_forecast.bind(this);
    this._onForward = this._onForward.bind(this);
  }

  _onForward(month, day) {
    this.props.navigator.push({
      component: HourForecast,
      title: 'Hourly Forecast',
      passProps: {celsius: this.state.celsius, 
      	location: this.props.location,
      	month: month,
      	day: day
      },
    });
  }

  componentWillMount() {
    this.get_forecast_day(this.props.location);
  }

  get_forecast_day(position) {
  	let lat = position.coords.latitude;
  	let long = position.coords.longitude;
    return fetch(`http://api.wunderground.com/api/d4b1790f02e5b31f/geolookup/forecast10day/q/${lat},${long}.json`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({forecast_day: responseJson});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  process_forecast() {
  	let data = [];
  	if (this.state.forecast_day) {
  		this.state.forecast_day.forecast.simpleforecast.forecastday.forEach((element) => {
  			data.push({
  				key: element.period,
  				conditions: element.conditions,
  				weekday: element.date.weekday,
  				monthname: element.date.monthname,
  				month: element.date.month,
  				day: element.date.day,
  				high_f: element.high.fahrenheit,
  				high_c: element.high.celsius,
  				low_f: element.low.fahrenheit,
  				low_c: element.low.celsius,
  				pop: element.pop,
  				icon: element.icon_url
  			});
  		});
  	}
  	return data;
  }

  render() {
  	let forecast_object = null;
  	if (this.state.forecast_day) {
  		forecast_object = this.process_forecast();
  	}
  	return (
      <View style={styles.container_list}>
        <FlatList
          data={forecast_object ? forecast_object : []}
          renderItem={({item}) => 
          <TouchableOpacity style={styles.pane} hitSlop={{top: 10, left: 10, bottom: 10, right: 10}} onPress={()=>{this._onForward(item.month, item.day)}}>
            <View style={styles.row}>
	            <Text style={styles.conditions}>{item.conditions} </Text>
            </View>
            <View style={styles.row}>
	            <Text style={styles.temps}>{this.state.celsius ? item.high_c : item.high_f}°{this.state.celsius ? 'C' : 'F'} | </Text>
	            <Text style={styles.temps}>{this.state.celsius ? item.low_c : item.low_f}°{this.state.celsius ? 'C' : 'F'}</Text>
            </View>
            <View style={styles.row}>
	            <Text style={styles.pop}>Chance of precipitation: {item.pop}%</Text>
            </View>
            <View style={styles.row}>
	            <Text style={styles.weekday}>{item.weekday}, </Text>
	            <Text style={styles.date}>{item.monthname} {item.day}</Text>
            </View>
          </TouchableOpacity>}
        />
      </View>
    );
  }
}