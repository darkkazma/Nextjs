import React, { useCallback } from 'react';
import { Avatar, Button, Card } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../reducers/user";

// eslint-disable-next-line react/prop-types
const UserProfile = () => {
  const dispatch = useDispatch();
  const {me, logOutLoading} = useSelector((state) => state.user);

  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, [])
  return (<>
    <Card
        actions={[<div key="twit">짹짹 <br/>{me.Posts.length}</div>,
          <div key="followings">팔로윙 <br/>{me.Followings.length}</div>,
          <div key="follower">팔로워 <br/>{me.Followers.length}</div>]}>
      <Card.Meta
          avatar={<Avatar>{me?.nickname[0]}</Avatar>}
          title={me?.nickname}/>

      <Button style={{ marginLeft: "45px" }} onClick={onLogOut} loading={logOutLoading}>로그아웃</Button>
    </Card>
  </>);
}

export default UserProfile;