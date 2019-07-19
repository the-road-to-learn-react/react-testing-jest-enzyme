import React from 'react';
import axios from 'axios';
import renderer from 'react-test-renderer';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import App, { dataReducer, Counter } from './App';

const list = ['a', 'b', 'c'];

describe('Reducer Test', () => {
  it('should set a list', () => {
    const state = { list: [], error: null };
    const newState = dataReducer(state, {
      type: 'SET_LIST',
      list,
    });

    expect(newState).toEqual({ list, error: null });
  });

  it('should reset the error if list is set', () => {
    const state = { list: [], error: true };
    const newState = dataReducer(state, {
      type: 'SET_LIST',
      list,
    });

    expect(newState).toEqual({ list, error: null });
  });

  it('should set the error', () => {
    const state = { list: [], error: null };
    const newState = dataReducer(state, {
      type: 'SET_ERROR',
    });

    expect(newState.error).toBeTruthy();
  });
});

describe('App', () => {
  const promise = Promise.resolve({
    data: {
      hits: [
        { objectID: '1', title: 'a' },
        { objectID: '2', title: 'b' },
      ],
    },
  });

  beforeEach(() => {
    axios.get = jest.fn(() => promise);
  });

  afterEach(() => {
    axios.get.mockClear();
  });

  test('snapshot renders', () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders the inner Counter', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find(Counter).length).toEqual(1);
  });

  it('passes all props to Counter', () => {
    const wrapper = mount(<App />);
    const counterWrapper = wrapper.find(Counter);

    expect(counterWrapper.find('p').text()).toEqual('0');
  });

  it('increments the counter', () => {
    const wrapper = mount(<App />);

    wrapper
      .find('button')
      .at(0)
      .simulate('click');

    const counterWrapper = wrapper.find(Counter);
    expect(counterWrapper.find('p').text()).toBe('1');
  });

  it('decrements the counter', () => {
    const wrapper = mount(<App />);

    wrapper
      .find('button')
      .at(1)
      .simulate('click');

    const counterWrapper = wrapper.find(Counter);
    expect(counterWrapper.find('p').text()).toBe('-1');
  });

  it('fetches async data', () => {
    const wrapper = mount(<App />);

    expect(wrapper.find('li').length).toEqual(0);

    promise.then(() => {
      expect(wrapper.find('li').length).toEqual(2);
    });
  });

  it('fetches async data but fails', () => {
    const wrapper = mount(<App />);

    promise.then(() => {
      expect(wrapper.find('li').length).toEqual(0);
      expect(wrapper.find('.error').length).toEqual(1);
    });
  });
});

describe('Counter', () => {
  test('snapshot renders', () => {
    const component = renderer.create(<Counter counter={1} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
