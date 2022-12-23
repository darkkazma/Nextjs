import React, { useCallback, useState } from 'react';
import { Avatar, Button, Card, Comment, List, Popover } from 'antd';
import {
  EllipsisOutlined,
  MessageOutlined,
  RetweetOutlined,
  HeartOutlined, HeartTwoTone,
} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import {LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST} from "../reducers/post";
import FollowButton from "./FollowButton";

function PostCard({ post }) {

  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post );

  const [linked, setLinked] = useState(false);
  const [commentFormOpend, setCommentFormOpend] = useState(false);

  // const onToggleLike = useCallback(() => {
  //   setLinked((prev) => !prev);
  // }, []);
    const onLike = useCallback(() => {
        dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id,
        })
    }, []);
    const onUnLike = useCallback(() => {
        dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id,
        })
    },[]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpend((prev) => !prev);
  }, []);


  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id
    });
  },[])

  const id = useSelector((state) => state.user.me?.id);
    const liked = post.Likers.find((v) => v.id === id );
  return (
    <div style={{ marginBottom: 10 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          liked
            ? (
              <HeartTwoTone
                twoToneColor="#eb2f96"
                key="heart"
                onClick={onUnLike}
              />
            )
            : <HeartOutlined key="heart" onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={(
              <Button.Group>
                {id && post.User.id === id
                  ? (
                    <>
                      <Button> 수정 </Button>
                      <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                    </>
                  )
                  : <Button>신고</Button>}
              </Button.Group>
              )}
          >
            <EllipsisOutlined />
          </Popover>,
        ]}

        extra={id && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar />}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentFormOpend && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
};

export default PostCard;
