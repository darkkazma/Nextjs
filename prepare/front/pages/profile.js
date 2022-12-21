import React, {useEffect} from 'react';
import AppLayout from "../component/AppLayout";
import Head from "next/head";
import NickNameEditForm from "../component/NickNameEditForm";
import FollowList from "../component/FollowList";
import FollowerList from "../component/FollowerList";
import { useSelector } from "react-redux";
import Router from 'next/router';

const Profile = () => {
  const {me} = useSelector((state) => state.user);

  useEffect(() => {
      if( !(me && me.id) ){
          Router.push('/');
      }
  }, [me && me.id]);


  if( !me ){
      return null;
  }
  return (<>
        <Head>
          <title>내 프로필 | NodeBird</title>
        </Head>
        <AppLayout>
          <NickNameEditForm/>
          <FollowList headers="팔로잉 목록 이라네" data={me.Followings}/>
          <FollowerList headers="팔로워 목록 이지롱" data={me.Followers}/>
        </AppLayout>
      </>)
};

export default Profile;