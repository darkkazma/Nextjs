import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import AppLayout from '../component/AppLayout';
import PostForm from '../component/PostForm';
import PostCard from '../component/PostCard';
import { LOAD_POST_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';
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
    console.log('index.js 의 useEffect 실행. ');

    function onScroll() {
      // eslint-disable-next-line max-len
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POST_REQUEST,
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

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    context.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POST_REQUEST,
    });

    // dispatch가 완료되기 까지 기다린 후 결과를 리턴하게 바꿔야 한다. redux-saga 의 END
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);
export default Home;
