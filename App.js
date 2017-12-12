import React from 'react';
import Now from './Now';
import styles from './Styles';
import { Alert, Animated, AppRegistry, Button, NavigatorIOS, ScrollView, StatusBar, StyleSheet, Text, View, Image } from 'react-native';

const KEY = 'd4b1790f02e5b31f';

/*
  Handles top navigation menu with iOSNavigator
  Switches between "Now" screen from splash screen once all needed 
  information is retrieved
*/
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

  /*
    Start fetching weather information on app init
  */
  componentWillMount() {
    this.set_location();
  }

  /*
    Multiple API calls for each information type
    Each call sets the appropriate value of the state
  */
  set_location() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.get_astronomy(position);
      this.get_conditions(position);
      this.setState({ location: position })
    });
  }

  /*
    Retrieves general weather conditions and sets state
  */
  get_conditions(position) {
    // position from set_location
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

  /*
    Retrieves astronomy weather information and sets state
  */
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

  /*
    Renders after deciding whether the app is "informed" enough to render content or
    if the app should just show the splash screen until that is the case. The navigator
    is integrated here and pass props for use by child components.
  */
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
