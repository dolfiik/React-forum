import React, { useState } from 'react';
import '../Home.css';

interface PostFormProps {
  onCreatePost: (title: string, content: string) => Promise<void>;
}

const PostForm: React.FC<PostFormProps> = ( {onCreatePost} ) => {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!title || !content) return;


    await onCreatePost(title,content);
    setTitle("");
    setContent("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder='Tytuł postu'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder='Opis postu'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className='create-post-container-submit-container'>
        <button className='create-post-container-submit' type='submit'>Stwórz post</button>
      </div>
    </form>
  );
};

export default PostForm;
