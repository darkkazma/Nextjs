import React from 'react';
import {Button, Card, List} from 'antd';
import {StopOutlined} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST } from '../reducers/user';

const FollowList = ({ headers, data }) => {

  const dispatch = useDispatch();
  const onCancle = (id) => () => {
    dispatch({
      type: UNFOLLOW_REQUEST,
      data: id,
    });
  };

  return (
    <List
      style={{ marginBottom: 20 }}
      grid={{ gutter:4, ms:2, md:3}}
      size="small"
      header={<div>{headers}</div>}
      loadMore={<div style={{ textAlign: 'center', margin: '10px 0'}}><Button>더보기</Button></div>}
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: 20 }}>
          <Card actions={[<StopOutlined key="stop" onClick={onCancle(item.id)} />]}>
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  headers: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default FollowList;
