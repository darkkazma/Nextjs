import React from 'react';
import AppLayout from "../component/AppLayout";
import Head from "next/head";
import NickNameEditForm from "../component/NickNameEditForm";
import FollowList from "../component/FollowList";
import FollowerList from "../component/FollowerList";
import { useSelector } from "react-redux";

const Profile = () => {
  const {me} = useSelector((state) => state.user);

  // const followingList = [{ nickname : "godti"}, { nickname: "1004da"}, {nickname: "아무개"}]
  // const followerList = [{ nickname : "godti2"}, { nickname: "1004da2"}, {nickname: "아무개2"}]
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