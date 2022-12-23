import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AppLayout from '../component/AppLayout';
import PostForm from '../component/PostForm';
import PostCard from '../component/PostCard';
import { LOAD_POST_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';

function Home() {

  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostLoading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST,
    });
  }, [])

  useEffect(() => {
      dispatch({
        type: LOAD_POST_REQUEST,
      });
  },[]);

  useEffect(() => {
    console.log( 'index.js 의 useEffect 실행. ')
    function onScroll(){
      if( window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300 ){
        if(hasMorePosts && !loadPostLoading) {
          dispatch({
            type: LOAD_POST_REQUEST,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  },[hasMorePosts, loadPostLoading]);



  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
}

export default Home;
