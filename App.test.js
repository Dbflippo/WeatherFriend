
import React from 'react';
import App from './App';
import {shallow} from 'enzyme'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const wrapper = shallow(<App />);
  expect(app).toMatchSnapshot();
});
