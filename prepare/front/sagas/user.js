import { all, fork, put, takeLatest, delay, call } from 'redux-saga/effects'
import axios from "axios";
import {
  FOLLOW_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  UNFOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS
} from "../reducers/user";

import signup from "../pages/signup";

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}
function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function signUpAPI(data) {
  return axios.post('/user', data);
}
function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log( result );

    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE, error: err.response.data,
    })
  }
}

function followAPI() {
  return axios.post('/api/follow');
}
function* follow(action) {
  try {
    yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    })
  }
}

function unfollowAPI() {
  return axios.post('/api/unfollow');
}
function* unfollow(action) {
  try {
    yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    })
  }
}

function loadUserAPI() {
  return axios.get('/user');
}
function* loadUser(action) {
  try {
    //fork는 비동기 함수 호출
    //call은 동기 함수 호출
    const result = yield call(loadUserAPI, action.data);
    // yield delay(100);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });

  } catch (err) {
    yield put({
      type: LOAD_USER_FAILURE, error: err.response.data,
    });
  }
}

function logInAPI(data) {
  return axios.post('/user/login', data);
}
function* logIn(action) {
  try {
    //fork는 비동기 함수 호출
    //call은 동기 함수 호출
    const result = yield call(logInAPI, action.data);
    // yield delay(100);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });

  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE, error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('/user/logout');
}

function* logOut() {
  try {
    const result = yield call(logOutAPI);
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
  yield all([
    fork(watchLoadUser),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow)
      ])
}