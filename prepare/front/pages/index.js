import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import AppLayout from '../component/AppLayout';
import PostForm from '../component/PostForm';
import PostCard from '../component/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

function Home() {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostLoading, reTweetError } =
    useSelector((state) => state.post);
  useEffect(() => {
    if (reTweetError) {
      alert(reTweetError);
    }
  }, [reTweetError]);

  useEffect(() => {
    function onScroll() {
      // eslint-disable-next-line max-len
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
}

/*
 프론트 서버에서 실행 되는 부분...
 프론트 서버와 백엔드 서버의 도메인이 다르기 때문에 credential 설정 문제 발생.
 이전 credential 설정은 브라우저 -> 백엔드 서버의 설정 이었음.
 SSR 주체는 프론트 서버 -> 백엔드 서버로 보내기 때문에 추가 설정이 필요.
 axios.defaults.headers.Cookie 삽입 시 다른 사용자가 내 쿠키를 통해 로그인을 유지하는
 상황이 발생될수 있기 때문에 context.req 조건 확인 필요
 */
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = context.req
        ? context.req.headers.cookie
        : '';
    }

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });

    // dispatch가 완료되기 까지 기다린 후 결과를 리턴하게 바꿔야 한다. redux-saga 의 END
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);
export default Home;
