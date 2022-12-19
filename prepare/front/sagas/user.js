import { all, fork, put, takeLatest, delay } from 'redux-saga/effects'
import axios from "axios";
import {
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS
} from "../reducers/user";
import signup from "../pages/signup";

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signup);
}

function signUpAPI() {
  return axios.post('/api/signup');
}

function* signUp() {
  try {
    yield delay(1000);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE, error: err.response.data,
    })
  }
}

function logInAPI(data) {
  return axios.post('/api/login', data);
}

function* logIn(action) {
  try {
    console.log('saga login');
    //fork는 비동기 함수 호출
    //call은 동기 함수 호출
    // const result = yield call(logInAPI, action.data);
    yield delay(100);
    yield put({
      type: LOG_IN_SUCCESS, data: action.data,
    });

  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE, error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('/api/logout');
}

function* logOut() {
  try {
    // const result = yield call(logOutAPI);
    yield delay(100);
    yield put({
      type: LOG_OUT_SUCCESS,

    });

  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE, error: err.response.data,
    });
  }
}

export default function* userSage() {
  yield all([fork(watchLogIn), fork(watchLogOut), fork(watchSignUp)])
}