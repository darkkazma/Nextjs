import React, {useCallback, useState} from 'react';
import AppLayout from "../component/AppLayout";
import Head from 'next/head';
import {Button, Checkbox, Form, Input} from "antd";
import useInput from "../hooks/useInput";
import styled from "styled-components";

const ErrorMessage = styled.div`
  color : red;
`;

const Signup = () => {
  const[id, onChangeId] = useInput('');
  const[nickName, onChangeNickName] = useInput('');
  const[password, onChangePassword] = useInput('');


  const[passwordCheck, setPasswordCheck] = useState('');
  const[passwordError, setPasswordError] = useState(false);
  const onChangePasswordCheck = useCallback( (e) => {
    setPasswordCheck(e.target.value);
    setPasswordError(e.target.value !== password );
  }, [password]);





  const[termError, setTermError] = useState(false);
  const[term, setTerm] = useState(false);
  const onChangeTerm = useCallback( (e) => {
    setTerm(e.target.checked);
    setTermError(false);
  },[]);


  const onSubmit = useCallback( () => {
    if( password !== passwordCheck ){
      return setPasswordError(true);
    }
    if( !term ){
      return setTermError(true);
    }
    console.log( id, nickName, password );
  },[password, passwordCheck, term]);

  return (
      <>
        <Head>
          <title>회원 가입 | NodeBird</title>
        </Head>
        <AppLayout>
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor="user-id">아이디</label>
            <br/>
            <Input name="user-id" value={id} requied onChange={onChangeId}/>
          </div>
          <div>
            <label htmlFor="user-nickname">닉네임</label>
            <br/>
            <Input name="user-nickname" value={nickName} requied onChange={onChangeNickName}/>
          </div>
          <div>
            <label htmlFor="user-pwd">패스워드</label>
            <br/>
            <Input name="user-pwd" type="password" value={password} requied onChange={onChangePassword}/>
          </div>
          <div>
            <label htmlFor="user-pwd-check">패스워드 체크</label>
            <br />
            <Input name="user-pwd-check" type="password" value={passwordCheck} required onChange={onChangePasswordCheck} />
            {passwordError && <ErrorMessage>패스워드가 일치하지 않습니다.</ErrorMessage>}
          </div>
          <div>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>약관에 동의 합니다.</Checkbox>
            {termError && <div style={{color: 'red' }}>약관에 동의가 필요합니다.</div>}
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit">가입하기</Button>
          </div>
        </Form>
        </AppLayout>
      </>

  )
};

export default Signup;