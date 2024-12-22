import React, { useState, useEffect}  from 'react';
import { useAppContext, Post } from '../context/AppContext.tsx';
import Header from './HomePageComponents/Header.tsx';
import PostForm from './HomePageComponents/PostForm.tsx';
import PostList from './HomePageComponents/PostList.tsx';
import SearchBar from './HomePageComponents/SearchBar.tsx';
import PostModal from './HomePageComponents/PostModal.tsx';
import './Home.css';

const Home: React.FC = () => {
  const { user, createPost, fetchPosts, deletePost, usersMap } = useAppContext();

  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [sortOption, setSortOption] = useState('');

    useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    };

    loadPosts();
  }, [user, fetchPosts]);

  if (!user) {
      return <div> Zaloguj się, aby mieć dostęp do tej strony </div>;
    }

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
    setIsCreatePostModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsPostModalOpen(false);
    setSelectedPost(null);
  };

  const handleCreatePost = async (title: string, content: string) => {
    await createPost(title, content); 
    setIsCreatePostModalOpen(false);
 };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const sortPost = (posts: Post[], option: string) => {
    switch (option) {
      case 'comments':
        return [...posts].sort((a,b) => (b.comments?.length || 0) - (a.comments?.length || 0));
      case 'likes':
        return [...posts].sort((a,b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      case 'date':
        return [...posts].sort((a,b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
      default:
        return posts;
    }
  };

  const filteredPosts = sortPost(
    posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    sortOption
  );


  return (
    <div className='container'>
      <div className='header'>
        <Header />
      </div>
      <div className='search-bar'>
       <button onClick={() => { setIsCreatePostModalOpen(true); setIsPostModalOpen(false)}}>Stwórz post</button>
       <SearchBar onSearch={handleSearch} />
      </div>


      <div className='sort'>
        <div className='sort-label'>Sortuj według: </div> 
        <div className='sort-control'>
        <select id='sort-option' onChange={(e) => setSortOption(e.target.value)}>
          <option value=''>Domyślnej kolejności</option>
          <option value='comments'>Komentarzy</option>
          <option value='likes'>Polubień</option>
          <option value='date'>Daty utworzenia</option>
        </select>
       </div>
      </div>
    

      {isPostModalOpen && selectedPost && (
        <PostModal 
          postId={selectedPost.id}
          title={selectedPost.title}
          createdAt={selectedPost.createAt}
          content={selectedPost.content}
          likes={selectedPost.likes || []}
          comments={selectedPost.comments || []}
          onClose={handleCloseModal}
          creatorUsername={usersMap.get(selectedPost.userId) || "Anon"}
        >
          {selectedPost.userId === user?.uid && (
            <button 
              onClick={async () => {
                await deletePost(selectedPost.id);
                handleCloseModal();
              }}
            >
              Usuń Post 
            </button>
          )}
        </PostModal>
      )}

      {isCreatePostModalOpen && (
        <div className='create-modal-overlay'>
          <div className='create-modal-container'>
            <h2>Nowy post</h2>
            <PostForm onCreatePost={handleCreatePost} />
            <button className='create-modal-close' onClick={() =>setIsCreatePostModalOpen(false)}>Zamknij</button>
          </div>
        </div>
      )}


      <div className='post-list'>
        <PostList posts={filteredPosts} onPostClick={handlePostClick}/>
      </div>
    </div>
  );
};

export default Home;
