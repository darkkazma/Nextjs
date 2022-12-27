import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Button, Checkbox, Form, Input } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import AppLayout from '../component/AppLayout';
import useInput from '../hooks/useInput';
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const ErrorMessage = styled.div`
  color: red;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    if (me && me.id) {
      Router.replace('/').then((r) => console.log('ok', r));
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) {
      Router.push('/');
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickName] = useInput('');
  const [password, onChangePassword] = useInput('');

  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password],
  );

  const [termError, setTermError] = useState(false);
  const [term, setTerm] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log(email, nickname, password);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
    console.log(email, nickname, password);
  }, [password, passwordCheck, term]);

  return (
    <>
      <Head>
        <title>회원 가입 | NodeBird</title>
      </Head>
      <AppLayout>
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor="user-email">이메일</label>
            <br />
            <Input
              name="user-email"
              type="email"
              value={email}
              requied
              onChange={onChangeEmail}
            />
          </div>
          <div>
            <label htmlFor="user-nickname">닉네임</label>
            <br />
            <Input
              name="user-nickname"
              value={nickname}
              requied
              onChange={onChangeNickName}
            />
          </div>
          <div>
            <label htmlFor="user-pwd">패스워드</label>
            <br />
            <Input
              name="user-pwd"
              type="password"
              value={password}
              required={true}
              onChange={onChangePassword}
            />
          </div>
          <div>
            <label htmlFor="user-pwd-check">패스워드 체크</label>
            <br />
            <Input
              name="user-pwd-check"
              type="password"
              value={passwordCheck}
              required="true"
              onChange={onChangePasswordCheck}
            />
            {passwordError && (
              <ErrorMessage>패스워드가 일치하지 않습니다.</ErrorMessage>
            )}
          </div>
          <div>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
              약관에 동의 합니다.
            </Checkbox>
            {termError && (
              <div style={{ color: 'red' }}>약관에 동의가 필요합니다.</div>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit" loading={signUpLoading}>
              가입하기
            </Button>
          </div>
        </Form>
      </AppLayout>
    </>
  );
};

/*export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    console.log('getServerSideProps start');
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    // dispatch가 완료되기 까지 기다린 후 결과를 리턴하게 바꿔야 한다. redux-saga 의 END
    context.store.dispatch(END);
    console.log('getServerSideProps end');
    await context.store.sagaTask.toPromise();
  },
);*/

export default Signup;
