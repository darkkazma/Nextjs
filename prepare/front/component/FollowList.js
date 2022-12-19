import React from 'react';
import {Button, Card, List} from 'antd';
import {StopOutlined} from '@ant-design/icons';
import PropTypes from 'prop-types';


const FollowList = ({ headers, data }) => {
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
        <List.Item style={{marginTop: 20}}>
          <Card actions={[<StopOutlined key="stop" />]}>
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