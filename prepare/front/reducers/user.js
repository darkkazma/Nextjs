export const initialState = {
  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,
  logOutLoading: false, // 로그아웃 시도중
  logOutDone: false,
  logOutError: null,
  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,
  changeNicknameLoading: false, // 닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,
  me: null,
  signUpdate: {},
  loginData: {},
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FIALURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FIALURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOR_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

const dummyUser = (data) => ({
  ...data,
  nickname: 'darkkazma',
  id: 1,
  Posts: [],
  Followings: [],
  Followers: [],
});

// 로그인 액션
export const loginRequestAction = (data) => {
  return {
    type: 'LOG_IN_REQUEST', data,
  };
};
/*export const loginSuccessAction = (data) => {
 return {
 type: 'LOG_IN_SUCCESS', data,
 }
 }
 export const loginRequestFailure = (data) => {
 return {
 type: 'LOG_IN_FAILURE', data,
 }
 }*/

// 로그아웃 액션
export const logoutRequestAction = () => {
  return {
    type: LOG_IN_REQUEST,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST:
      console.log('reducer login.');
      return {
        ...state, logInLoading: true, logInDone: false, logInError: null,
      };
    case LOG_IN_SUCCESS:
      return {
        ...state,
        logInLoading: false,
        logInDone: true,
        me: dummyUser(action.data),
      };
    case LOG_IN_FAILURE:
      return {
        ...state, logInLoading: false, logInError: action.error,
      };
    case LOG_OUT_REQUEST:
      return {
        ...state, logOutLoading: true, logOutDone: false, logOutError: null,
      };
    case LOG_OUT_SUCCESS:
      return {
        ...state, logOutLoading: false, logOutDone: true, me: null,
      };
    case LOG_OUT_FAILURE:
      return {
        ...state, logOutLoading: false, logOutError: action.error,
      };
    case SIGN_UP_REQUEST:
      return {
        ...state, signUpLoading: true, signUpDone: false, signUpError: null,
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state, signUpLoading: false, signUpDone: true,
      };
    case SIGN_UP_FAILURE:
      return {
        ...state, signUpLoading: false, signUpError: action.error,
      };
    case CHANGE_NICKNAME_REQUEST:
      return {
        ...state, changeNickNameLoading: true, changeNickNameDone: false, changeNickNameError: null,
      };
    case CHANGE_NICKNAME_SUCCESS:
      return {
        ...state, changeNickNameLoading: false, changeNickNameDone: true,
      };
    case CHANGE_NICKNAME_FAILURE:
      return {
        ...state, changeNickNameLoading: false, changeNickNameError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
