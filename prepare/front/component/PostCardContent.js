import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

function PostCardContent({ postData }) {
  return (
    <div>
      {postData.split(/(#[^\s#]+)/g).map((v, i) => {
        if (v.match(/(#[^\s#]+)/)) {
          return (
            <Link
              key={i}
              href={`/hashtag/${v.slice(1)}`}
              legacyBehavior
            ><a>{v}</a>
            </Link>
          );
        }
        return v;
      })}
    </div>
  );
}

PostCardContent.propTypes = { postData: PropTypes.string.isRequired };

export default PostCardContent;
