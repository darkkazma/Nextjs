import React, { useSelector } from 'react-redux';
import { Avatar, Card } from 'antd';
import { END } from 'redux-saga';
import Head from 'next/head';
import { LOAD_USER_REQUEST } from '../reducers/user';
import AppLayout from '../component/AppLayout';
import wrapper from '../store/configureStore';

const About = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <Head>
        <title>darkkazma | NodeBird</title>
      </Head>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로윙
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}>
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
            description="노드버드 매니아"
          />
        </Card>
      ) : null}
    </AppLayout>
  );
};

/**
 대부분은 getServerSideProps를 사용 한다.
 getStaticProps는 블로그 게시글 처럼 바뀌지 않는 데이터에 사용된다.
 SSR을 할때 정적인 html 형태로 만드는 기능을 제공 한다.
 커머스 페이지의 이벤트 페이지?? 또는 변경이 없는 페이지 등에 쓰인다.
 html은 동적인 정보를 담을 수 없기 떄문에...
 */
export const getStaticProps = wrapper.getStaticProps(async (context) => {
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 1,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default About;
