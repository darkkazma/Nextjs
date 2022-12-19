import { all, fork } from 'redux-saga/effects';

import postSage from './post';
import userSage from './user';

export default function* rootSaga() {
  yield all([fork(postSage), fork(userSage)]);
};
