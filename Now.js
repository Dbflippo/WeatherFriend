import React from 'react';
import DayForecast from './DayForecast';
import styles from './Styles';
import { Alert, Animated, AppRegistry, Button, NavigatorIOS, ScrollView, StyleSheet, Text, TextInput, View, Image } from 'react-native';

/*
  The Now component holds all advice decision logic. It acts as a main menu to other
  components such as 10 day forecast and hourly forecast. Also has a switch for
  temperature scales that passes the state down to other components via props.
*/
export default class Now extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
      conditions: this.props.conditions,
      location: this.props.location,
      astronomy: this.props.astronomy,
      time: this.props.time,
      text: '',
      celsius: false
    };
    this._onForward = this._onForward.bind(this);
    this.update_conditions = this.update_conditions.bind(this);
    this.update_astronomy = this.update_astronomy.bind(this);
    this.update_location = this.update_location.bind(this);
    this.get_advice = this.get_advice.bind(this);
    this.get_background = this.get_background.bind(this);
    this.switch_scale = this.switch_scale.bind(this);
    this.get_other_scale = this.get_other_scale.bind(this);
  }

  /*
    Handler for 10 day forecast button. Moves to the component screen.
  */
  _onForward() {
    this.props.navigator.push({
      component: DayForecast,
      title: '10 Day Forecast',
      passProps: {celsius: this.state.celsius, location: this.state.location},
    });
  }

  /*
    Retrieves updated general weather conditions. The location and astronomy
    results are passed to this function as this is the end of the chain which
    updates the component state all at once.
  */
  update_conditions(position, astronomy) {
  	let lat = position.coords.latitude;
  	let long = position.coords.longitude;
    return fetch(`http://api.wunderground.com/api/d4b1790f02e5b31f/geolookup/conditions/q/${lat},${long}.json`)
      .then((response) => response.json())
      .then((responseJson) => {
        let background_info = this.get_background();
        let background_url = background_info[0];
        let white_text = background_info[1];
        this.setState({ location: position, 
        	astronomy: astronomy,
        	conditions: responseJson, 
        	time: responseJson.current_observation.observation_time_rfc822.substr(17, 8).replace(":", ""),
          background_url: background_url,
          white_text: white_text });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /*
    Part of the update state call chain that takes the position value to get
    the appropriate API information. Calls update_conditions as part of the
    chain
  */
  update_astronomy(position) {
  	let lat = position.coords.latitude;
  	let long = position.coords.longitude;
    return fetch(`http://api.wunderground.com/api/d4b1790f02e5b31f/geolookup/astronomy/q/${lat},${long}.json`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.update_conditions(position, responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /*
    Retrieves advice based on the current state. The plan was to adjust boundary
    values depending on user feedback (they though it was too hot or cold)
  */
  get_advice() {
    if (this.state.conditions) {
      let temperature = this.state.conditions.current_observation.temp_f;
      let weather = this.state.conditions.current_observation.weather
      let suggestion = ""
      if (temperature < 32) {
        suggestion += 'It\'s the start of a new ice age. Bundle up.';
      }
      if (temperature >= 32 && temperature < 55) {
          suggestion += 'Chilly today. Add some layers like an onion.';
      }
      if (temperature >= 55 && temperature < 65) {
          suggestion += 'A little cool. Maybe some long sleeves?';
      }
      if (temperature >= 65 && temperature < 77) {
          suggestion += 'Pretty nice for once. Light comfy clothes will do fine.';
      }
      if (temperature >= 77 && temperature < 85) {
          suggestion += 'Getting warm. Short sleeves and shorts.';
      }
      if (temperature > 85) {
          suggestion += 'It\'s a sweat fest. Good luck.';
      }
      if (weather.includes("Thunderstorm") || weather.includes("Rain")) {
          suggestion += ' Also, don\'t forget an umbrella!'
      }
      if ((weather.includes("Partly Cloudy") || weather.includes("Overcast")) && (suggestion.includes("warm") || suggestion.includes("sweat"))) {
          suggestion += ' Clouds should provide some shade.'
      }
      if ((weather.includes("Partly Cloudy") || weather.includes("Overcast")) && (suggestion.includes("cool") || suggestion.includes("Chilly") || suggestion.includes("ice"))) {
        suggestion += ' Clouds will make it even colder!'
      }
      if (weather.includes("Snow")) {
          suggestion += ' It\'s going to snow!!'
      }
      if (weather.includes("Clear") && (suggestion.includes("warm") || suggestion.includes("sweat"))) {
          suggestion += ' Clear skies will make it even warmer.'
      }
      if (weather.includes("Clear") && (suggestion.includes("cool") || suggestion.includes("Chilly") || suggestion.includes("ice"))) {
          suggestion += ' However, Clear skies should warm it up some.'
      }
      if (weather.includes("Hail")) {
          suggestion += ' Hail today, watch for falling ice!'
      }
      return suggestion;
    }
    return '';
  }

  /*
    Initial start of the asynchronous call chain.
  */
  update_location() {
    navigator.geolocation.getCurrentPosition((position) => {
    	this.update_astronomy(position);
    });
  }

  /*
    Gets appropriate background URL based on current state (time and 
    weather conditions)
  */
  get_background() {
    let weather = this.state.conditions ? this.state.conditions.current_observation.weather : '';
    let report_time = this.state.time ? parseInt(this.state.time) : '';
    let sunrise = this.state.astronomy.sun_phase ? parseInt(this.state.astronomy.sun_phase.sunrise.hour + this.state.astronomy.sun_phase.sunrise.minute) : ''
    let sunset = this.state.astronomy.sun_phase ? parseInt(this.state.astronomy.sun_phase.sunset.hour + this.state.astronomy.sun_phase.sunset.minute) : ''
    let background_url = '/images/clear_day.jpg'
    let white_text = false;
    if(weather.includes('Thunderstorm') || weather.includes('Overcast') || weather.includes("Rain")) {
      background_url = require('./images/cloudy_day.jpg')
    } else {
      if( 400 < report_time && report_time <= sunrise) {
        background_url = require('./images/early_morn.jpg')
        white_text = true
      } else if( sunrise < report_time && report_time <= 1100) {
        background_url = require('./images/clear_morn.jpg')
      } else if( 1100 < report_time && report_time <= sunset - 200) {
        background_url = require('./images/clear_day.jpg')
      } else if( sunset - 200 < report_time && report_time <= sunset + 100) {
        background_url = require('./images/clear_evening.jpg')
      } else if( (sunset + 100 < report_time && report_time <= 2400) || report_time <= 400) {
        background_url = require('./images/clear_night.jpg')
        white_text = true
      }
    }
    return [background_url, white_text];
  }

  /*
    Essentially a switch to change scale state.
  */
  switch_scale() {
    this.setState((prevState, props) => {
      return {celsius: !prevState.celsius};
    });
  }

  /*
    Returns string value of opposite scale to update button
    text.
  */
  get_other_scale() {
    return this.state.celsius ? 'Fahrenheit' : 'Celsius';
  }

  render() {
    let background_info = this.get_background();
    let background_url = background_info[0];
    let white_text = background_info[1];
    let condition_list = (<Text>
      <Text style={styles.list_key}>{`City: `}</Text>
      <Text>{this.state.conditions ? this.state.conditions.location.city : ''}</Text>
      <Text style={styles.list_key}>{`\nWeather: `}</Text>
      <Text>{this.state.conditions ? this.state.conditions.current_observation.weather : ''}</Text>
      <Text style={styles.list_key}>{`\nTemperature: `}</Text>
      <Text>{this.state.conditions ? `${this.state.celsius ? `${this.state.conditions.current_observation.temp_c}°C` : `${this.state.conditions.current_observation.temp_f}°F`}` : ''}</Text>
      <Text style={styles.list_key}>{`\nRelative Humidity: `}</Text>
      <Text>{this.state.conditions ? this.state.conditions.current_observation.relative_humidity : ''}</Text>
      <Text style={styles.list_key}>{`\nWind: `}</Text>
      <Text>{this.state.conditions ? this.state.conditions.current_observation.wind_string : ''}</Text>
      <Text style={styles.list_key}>{`\nFeels Like: `}</Text>
      <Text>{this.state.conditions ? `${this.state.celsius ? `${this.state.conditions.current_observation.feelslike_c}°C` : `${this.state.conditions.current_observation.feelslike_f}°F`}` : ''}</Text>
    </Text>);
    let advice = this.get_advice();
    let displayed_content = this.state.conditions ? condition_list : 'No conditions requested';
    return (
      <Image source={background_url} style={styles.container}>
        <Text style={white_text ? styles.white_advice : styles.advice}>{advice}</Text>
        <Text style={white_text ? styles.white_text : styles.text}>{displayed_content}</Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this.update_location}
            title="How Is It Now?"
          />
          <Button
            onPress={this._onForward}
            title="How Do The Next 10 Days Look?"
          />
          <Button
            onPress={this.switch_scale}
            title={`Use ${this.get_other_scale()}!`}
          />
        </View>
      </Image>
    );
  }
}