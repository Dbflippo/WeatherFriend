import React from 'react';
import { Alert, AppRegistry, Button, ScrollView, StyleSheet, Text, View } from 'react-native';

const KEY = 'd4b1790f02e5b31f';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditions: '',
      location: ''
    };
    this.get_conditions = this.get_conditions.bind(this);
    this.set_location = this.set_location.bind(this);
    this.get_advice = this.get_advice.bind(this);
  }

  get_conditions() {
    let lat = this.state.location ? `${this.state.location.coords.latitude},` : 'TN/';
    let long = this.state.location ? this.state.location.coords.longitude : 'Nashville';
    return fetch(`http://api.wunderground.com/api/d4b1790f02e5b31f/geolookup/conditions/q/${lat}${long}.json`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState(previousState => {
          return { conditions: responseJson };
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

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
          suggestion += ' Clouds should provide some shade'
      }
      if ((weather.includes("Partly Cloudy") || weather.includes("Overcast")) && (suggestion.includes("cool") || suggestion.includes("chilly") || suggestion.includes("ice"))) {
          suggestion += ' Clouds will make it even colder!'
      }
      if (weather.includes("Snow")) {
          suggestion += ' It\'s going to snow!!'
      }
      if (weather.includes("Clear") && (suggestion.includes("warm") || suggestion.includes("sweat"))) {
          suggestion += ' Clear skies will make it even warmer'
      }
      if (weather.includes("Clear") && (suggestion.includes("cool") || suggestion.includes("chilly") || suggestion.includes("ice"))) {
          suggestion += ' However, Clear skies will warm it up some'
      }
      if (weather.includes("Hail")) {
          suggestion += ' Hail today, watch for falling ice!'
      }

    }
    return '';
  }

  set_location() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState(previousState => {
          return { location: position };
        });
    });
  }

  componentWillMount() {
    this.set_location();
  }

  render() {
    let condition_list = (<Text>
      <Text style={styles.list_key}>{`City: `}</Text>
      <Text>{this.state.conditions ? this.state.conditions.location.city : ''}</Text>
      <Text style={styles.list_key}>{`\nWeather: `}</Text>
      <Text>{this.state.conditions ? this.state.conditions.current_observation.weather : ''}</Text>
      <Text style={styles.list_key}>{`\nTemperature: `}</Text>
      <Text>{this.state.conditions ? `${this.state.conditions.current_observation.temp_f} F` : ''}</Text>
      <Text style={styles.list_key}>{`\nRelative Humidity: `}</Text>
      <Text>{this.state.conditions ? this.state.conditions.current_observation.relative_humidity : ''}</Text>
      <Text style={styles.list_key}>{`\nWind: `}</Text>
      <Text>{this.state.conditions ? this.state.conditions.current_observation.wind_string : ''}</Text>
      <Text style={styles.list_key}>{`\nFeels Like: `}</Text>
      <Text>{this.state.conditions ? this.state.conditions.current_observation.feelslike_string : ''}</Text>
    </Text>);
    let advice = this.get_advice();
    let displayed_content = this.state.conditions ? condition_list : 'No conditions requested';
    return (
      <View style={styles.container}>
        <Text style={styles.title}>WeatherFriend</Text>
        <Text style={styles.advice}>{advice}</Text>
        <Text>{displayed_content}</Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this.get_conditions}
            title="Current Conditions"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 30
  },
  list_key: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center'
  },
  advice: {
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20
  }
});
