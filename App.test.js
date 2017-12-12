/*
import 'react-native';
import React from 'react';
import App from './App';
import {shallow} from 'enzyme'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

import renderer from 'react-test-renderer';
*/
// import App from './App';
const react = require('react');
const isomorphic_fetch = require('isomorphic-fetch');

let dummy_conditions = {
  "response": {
  "version": "0.1",
  "termsofService": "http://www.wunderground.com/weather/api/d/terms.html",
  "features": {
  "conditions": 1
  }
  },
  "current_observation": {
  "image": {
  "url": "http://icons-ak.wxug.com/graphics/wu2/logo_130x80.png",
  "title": "Weather Underground",
  "link": "http://www.wunderground.com"
  },
  "display_location": {
  "full": "San Francisco, CA",
  "city": "San Francisco",
  "state": "CA",
  "state_name": "California",
  "country": "US",
  "country_iso3166": "US",
  "zip": "94101",
  "latitude": "37.77500916",
  "longitude": "-122.41825867",
  "elevation": "47.00000000"
  },
  "observation_location": {
  "full": "SOMA - Near Van Ness, San Francisco, California",
  "city": "SOMA - Near Van Ness, San Francisco",
  "state": "California",
  "country": "US",
  "country_iso3166": "US",
  "latitude": "37.773285",
  "longitude": "-122.417725",
  "elevation": "49 ft"
  },
  "estimated": {},
  "station_id": "KCASANFR58",
  "observation_time": "Last Updated on June 27, 5:27 PM PDT",
  "observation_time_rfc822": "Wed, 27 Jun 2012 17:27:13 -0700",
  "observation_epoch": "1340843233",
  "local_time_rfc822": "Wed, 27 Jun 2012 17:27:14 -0700",
  "local_epoch": "1340843234",
  "local_tz_short": "PDT",
  "local_tz_long": "America/Los_Angeles",
  "local_tz_offset": "-0700",
  "weather": "Partly Cloudy",
  "temperature_string": "66.3 F (19.1 C)",
  "temp_f": 66.3,
  "temp_c": 19.1,
  "relative_humidity": "65%",
  "wind_string": "From the NNW at 22.0 MPH Gusting to 28.0 MPH",
  "wind_dir": "NNW",
  "wind_degrees": 346,
  "wind_mph": 22.0,
  "wind_gust_mph": "28.0",
  "wind_kph": 35.4,
  "wind_gust_kph": "45.1",
  "pressure_mb": "1013",
  "pressure_in": "29.93",
  "pressure_trend": "+",
  "dewpoint_string": "54 F (12 C)",
  "dewpoint_f": 54,
  "dewpoint_c": 12,
  "heat_index_string": "NA",
  "heat_index_f": "NA",
  "heat_index_c": "NA",
  "windchill_string": "NA",
  "windchill_f": "NA",
  "windchill_c": "NA",
  "feelslike_string": "66.3 F (19.1 C)",
  "feelslike_f": "66.3",
  "feelslike_c": "19.1",
  "visibility_mi": "10.0",
  "visibility_km": "16.1",
  "solarradiation": "",
  "UV": "5",
  "precip_1hr_string": "0.00 in ( 0 mm)",
  "precip_1hr_in": "0.00",
  "precip_1hr_metric": " 0",
  "precip_today_string": "0.00 in (0 mm)",
  "precip_today_in": "0.00",
  "precip_today_metric": "0",
  "icon": "partlycloudy",
  "icon_url": "http://icons-ak.wxug.com/i/c/k/partlycloudy.gif",
  "forecast_url": "http://www.wunderground.com/US/CA/San_Francisco.html",
  "history_url": "http://www.wunderground.com/history/airport/KCASANFR58/2012/6/27/DailyHistory.html",
  "ob_url": "http://www.wunderground.com/cgi-bin/findweather/getForecast?query=37.773285,-122.417725"
  }
}

let dummy_astronomy = {
  "response": {
  "version": "0.1",
  "termsofService": "http://www.wunderground.com/weather/api/d/terms.html",
  "features": {
  "astronomy": 1
  }
  },
  "moon_phase": {
  "percentIlluminated": "81",
  "ageOfMoon": "10",
  "phaseOfMoon": 'Waning Crescent',
  'hemisphere': 'North',
  "current_time": {
  "hour": "9",
  "minute": "56"
  },
  "sunrise": {
  "hour": "7",
  "minute": "01"
  },
  "sunset": {
  "hour": "16",
  "minute": "56"
  },
  'moonrise': { 
  'hour': '0', 
  'minute': '54' 
	},
  'moonset': { 'hour': '13', 'minute': '25' }
	},
	'sun_phase':
   { 'sunrise': { 'hour': '7', 'minute': '15' },
     'sunset': { 'hour': '16', 'minute': '51' } }
};

let tests = async () => {
	await test_conditions();
	await test_astronomy();
}

// Testing condition data fetched from Weather API
function test_conditions() {
	fetch(`http://api.wunderground.com/api/d4b1790f02e5b31f/conditions/q/CA/San_Francisco.json`)
      .then((response) => response.json())
      .then((responseJson) => {
      	let matching = true;
      	Object.keys(responseJson).forEach(key => {
      		if(dummy_conditions[key] === undefined) {
      			matching = false;
      		}
      	})
      	if(matching) {
      		console.log("Test Fetching Conditions: test passed\n");
      	} else {
      		console.log("Test Fetching Conditions: test failed\n");      	}
      });
      resolve("test done");
}

// Testing astronomy data fetched from Weather API
function test_astronomy() {
	fetch(`http://api.wunderground.com/api/d4b1790f02e5b31f/astronomy/q/CA/San_Francisco.json`)
      .then((response) => response.json())
      .then((responseJson) => {
      	let matching = true;
      	Object.keys(responseJson).forEach(key => {
      		if(dummy_astronomy[key] === undefined) {
      			matching = false;
      		}
      	})
      	if(matching) {
      		console.log("Test Fetching Astronomy: test passed\n");
      	} else {
      		console.log("Test Fetching Astronomy: test failed\n");
      	}
}

tests();