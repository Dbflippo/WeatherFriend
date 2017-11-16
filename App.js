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

  componentWillMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState(previousState => {
          return { location: position };
        });
    });
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
    let displayed_content = this.state.conditions ? condition_list : 'No conditions requested';
    return (
      <View style={styles.container}>
        <Text style={styles.title}>WeatherFriend</Text>
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
