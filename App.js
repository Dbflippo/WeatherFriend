import React from 'react';
import Now from './Now';
import styles from './Styles';
import { Alert, Animated, AppRegistry, Button, NavigatorIOS, ScrollView, StatusBar, StyleSheet, Text, View, Image } from 'react-native';

const KEY = 'd4b1790f02e5b31f';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      splash: true,
      conditions: '',
      location: '',
      astronomy: '',
    };
    this.get_conditions = this.get_conditions.bind(this);
    this.get_astronomy = this.get_astronomy.bind(this);
    this.set_location = this.set_location.bind(this);
  }

  componentWillMount() {
    this.set_location();
  }

  set_location() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.get_astronomy(position);
      this.get_conditions(position);
      this.setState({ location: position })
    });
  }

  get_conditions(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    return fetch(`http://api.wunderground.com/api/d4b1790f02e5b31f/geolookup/conditions/q/${lat},${long}.json`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          conditions: responseJson, 
          time: responseJson.current_observation.observation_time_rfc822.substr(17, 8).replace(":", "") });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  get_astronomy(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    return fetch(`http://api.wunderground.com/api/d4b1790f02e5b31f/geolookup/astronomy/q/${lat},${long}.json`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ astronomy: responseJson });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    let informed = this.state.conditions && this.state.location && this.state.astronomy && this.state.time;
    let home_nav = 
    (<NavigatorIOS
        initialRoute={{
          component: Now,
          title: 'Right Now',
          passProps: {conditions: this.state.conditions, location: this.state.location, astronomy: this.state.astronomy, time: this.state.time},
        }}
        style={{flex: 1}}
      />);
    let splash = (<View style={styles.container}>
        <Text style={styles.title}>WeatherFriend</Text>
        <Text>A React-Native App</Text>
      </View>);
    let view = splash;
    if (informed) {
      view = home_nav;
    }
    return view;
  }
}
