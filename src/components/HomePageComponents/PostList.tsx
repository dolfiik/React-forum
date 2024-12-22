import React from 'react';
import PostItem from './PostItem';
import { Post } from '../../context/AppContext';

interface PostListProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ( {posts, onPostClick} ) => {
  return (
    <div className='post-list'>
      {posts.map((post) => (
        <PostItem key={post.id} title={post.title} content={post.content} likesCount={post.likes ? post.likes.length : 0} commentsCount={post.comments ? post.comments.length : 0} onClick={() => onPostClick(post)} />
      ))}
    </div>
  );
};

export default PostList;
