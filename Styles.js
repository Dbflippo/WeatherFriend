import { StyleSheet } from 'react-native';

let styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  white_title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    margin: 40
  },
  list_key: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center'
  },
  advice: {
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    padding: 20,
  },
  white_advice: {
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
  text: {
    color: 'black'
  },
  white_text: {
    color: 'white'
  },
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20
  },
  container_list: {
   flex: 1,
   paddingTop: 22
  },
  pane: {
    padding: 20,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row'
  },
  container_center: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditions: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  temps: {
    fontSize: 28,
  },
  temps_c: {
    fontSize: 20,
  },
  weekday: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  date: {
    fontSize: 18,
  },
  feels: {
    fontSize: 18
  },
  condition_hourly: {
    fontSize: 28,
    fontWeight: 'bold'
  }
});

export default styles;