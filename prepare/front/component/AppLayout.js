import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';

import styled, { createGlobalStyle } from 'styled-components';

import {useDispatch, useSelector} from 'react-redux';

import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import {CHANGE_MENU_REQUEST} from "../reducers/user";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }

  .ant-col:first-child {
    padding-left: 0 !important;
  }

  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

function AppLayout({ children }) {
  // const[isLoggedIn, setIsLoggedIn] = useState(false);
  // const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const { me, currentMenu } = useSelector((state) => state.user);
  const [current, setCurrent] = useState('node-bird');

  const items = [
    {
      label: (<Link href="/" legacyBehavior><a>노드 버드</a></Link>),
      key: 'node-bird',
    }, {
      label: (<Link href="/profile" legacyBehavior><a>프로필</a></Link>),
      key: 'node-profile',
    }, {
      label: (<SearchInput enterButton />),
      key: 'node-enter',
    }, {
      label: (<Link href="/signup" legacyBehavior><a>회원 가입</a></Link>),
      key: 'node-signup',
    },
  ];

  useEffect(() => {
    setCurrent(currentMenu);
  }, [currentMenu]);

  const selectMenu = (e) => {
    console.log(e.key);
    dispatch({
      type: CHANGE_MENU_REQUEST,
      data: e.key,
    });
  };

  return (
    <div>
      <Global />
      {/* <Menu mode="horizontal">
        <Menu.Item key="node-bird">
          <Link href="/" legacyBehavior><a>노드 버드</a></Link>
        </Menu.Item>
        <Menu.Item key="node-profile">
          <Link href="/profile" legacyBehavior><a>프로필</a></Link>
        </Menu.Item>
        <Menu.Item key="node-enter">
          <SearchInput enterButton />
        </Menu.Item>
        <Menu.Item key="node-signup">
          <Link href="/signup" legacyBehavior><a>회원 가입</a></Link>
        </Menu.Item>
      </Menu> */}
      <Menu onClick={selectMenu} selectedKeys={[current]} mode="horizontal" items={items} theme="dark" />

      <Row>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={17} style={{ padding: '10px' }}>
          {children}
        </Col>
        {/* <Col xs={24} md={6}>
          <a
            href="https://www.shadow1111.shop"
            target="_blank"
            rel="noreferrer noopener"
          >Made by Darkkazma
          </a>
        </Col> */}
      </Row>

    </div>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
