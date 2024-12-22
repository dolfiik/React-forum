import React from 'react';

interface PostItemProps {
  title: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  onClick: () => void;
};

const PostItem: React.FC<PostItemProps> = ( {title, content, likesCount, commentsCount, onClick} ) => {
  return (
    <div className='post' onClick={onClick}>
      <div className='post-title'>{title}</div>
      <div className='post-content'>{content}</div>
      <div className='post-footer'>
        <span>👍 {likesCount} </span>
        <span>💬 {commentsCount} </span>
      </div>
    </div>
  );
};

export default PostItem;

