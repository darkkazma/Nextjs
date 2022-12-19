import axios from 'axios';
import { put, all, fork, takeLatest, delay } from 'redux-saga/effects';
import {
  ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
} from '../reducers/post';

function addPostAPI(data) {
  return axios.post('/api/post', data);
}
function addCommentAPI(data) {
  return axios.post(`/api/post/${data.id}/comment`, data);
}

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    console.log('saga addPost');
    yield delay(1000);
    yield put({
      type: ADD_POST_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE, data: err.response.data,
    });
  }
}

function* addComment(action) {
  try {
    // const result = yield call(addCommentAPI, action.data);
    console.log('saga addComment');
    yield delay(1000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: err.response.data,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSage() {
  yield all([fork(watchAddPost), fork(watchAddComment)]);
}
