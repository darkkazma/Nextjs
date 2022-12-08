import { createWrapper }  from 'next-redux-wrapper';
import { createStore } from "redux";
import reducer from '../reducers';

const configureStore = () => {
  const store = createStore(reducer);
  // store.dispatch({
  //   type: 'CHANGE_NICKNAME',
  //   data: 'boogicho',
  // });
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug : process.env.NODE_DEV === 'development',
});

export default wrapper;
