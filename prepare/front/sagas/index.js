import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import postSage from './post';
import userSage from './user';

axios.defaults.baseURL = 'http://localhost:3065';

export default function* rootSaga() {
  yield all([fork(postSage), fork(userSage)]);
};
