import React from 'react';
import styles from './Styles'
import { AppRegistry, Button, FlatList, Text, Image, StatusBar, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';

export default class HourForecast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	forecast_hour: '',
    	celsius: this.props.celsius
    };
    this.get_forecast_hour = this.get_forecast_hour.bind(this);
    this.process_forecast = this.process_forecast.bind(this);
  }

  componentWillMount() {
    this.get_forecast_hour(this.props.location);
  }

  get_forecast_hour(position) {
  	let lat = position.coords.latitude;
  	let long = position.coords.longitude;
    return fetch(`http://api.wunderground.com/api/d4b1790f02e5b31f/geolookup/hourly10day/q/${lat},${long}.json`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({forecast_hour: responseJson});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  process_forecast() {
  	let data = [];
  	if (this.state.forecast_hour) {
  		this.state.forecast_hour.hourly_forecast.forEach((element) => {
        if (element.FCTTIME.mon == this.props.month && element.FCTTIME.mday == this.props.day) {
          data.push({
            key: `${element.FCTTIME.year}${element.FCTTIME.mon}${element.FCTTIME.mday}${element.FCTTIME.hour}`,
            condition: element.condition,
            feelslike_f: element.feelslike.english,
            feelslike_c: element.feelslike.metric,
            hour: element.FCTTIME.hour,
            civil: element.FCTTIME.civil,
            temp_f: element.temp.english,
            temp_c: element.temp.metric,
            pop: element.pop,
            humidity: element.humidity
          });
        }
  		});
  	}
  	return data;
  }

  render() {
  	let forecast_object = null;
  	if (this.state.forecast_hour) {
  		forecast_object = this.process_forecast();
  	}
  	return (
      <View style={styles.container_list}>
        <FlatList
          data={forecast_object ? forecast_object : []}
          renderItem={({item}) => 
          <View style={styles.pane}>
            <View style={styles.row}>
              <Text style={styles.condition_hourly}>{item.condition} | </Text>
	            <Text style={styles.temps}>{this.state.celsius ? item.temp_c : item.temp_f}°{this.state.celsius ? 'C' : 'F'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.feels}>Feels like {this.state.celsius ? item.feelslike_c : item.feelslike_f}°{this.state.celsius ? 'C' : 'F'}</Text>
            </View>
            <View style={styles.row}>
	            <Text style={styles.pop}>Chance of precipitation: {item.pop}%</Text>
            </View>
            <View style={styles.row}>
	            <Text style={styles.weekday}>{item.civil}</Text>
            </View>
          </View>}
        />
      </View>
    );
  }
}