import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getFirestore, getDoc, doc} from 'firebase/firestore';

interface PostModalProps {
  postId: string;
  title: string;
  content: string;
  createdAt: Date;
  likes: string[];
  comments?: { userId: string; content: string, username: string}[]; // tablica obiektów - komentarzy
  onClose?: () => void;
  children?: React.ReactNode;
  creatorUsername: string;
}

const PostModal: React.FC<PostModalProps> = ({postId, title, content, likes = [], comments = [], onClose, children, createdAt, creatorUsername}) => {
  const { user, likePost, addComment, posts} = useAppContext();
  const [commentInput, setCommentInput] = useState("");
  const [localComments, setLocalComments] = useState(comments);
  const [localLikesCount, setLocalLikesCount] = useState(likes.length);
  const [hasLiked, setHasLiked] = useState(likes.includes(user?.uid || ""));
  const [showLikedUsers, setShowLikedUsers] = useState(false);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);

  useEffect( () => {
    const currentPost = posts.find(p => p.id === postId);

    if(currentPost) {
    const updatedComments = currentPost.comments.map((comment) => ({
      ...comment,
      username: comment.username || "anon",
    }));
      setLocalComments(updatedComments);
      setLocalLikesCount(currentPost.likes.length);
      setHasLiked(currentPost.likes.includes(user?.uid || ""));

      const fetchLikedUsernames = async () => {
        const db = getFirestore();
        const likedUsernames = await Promise.all(
          currentPost.likes.map(async (userId: string) => {
            const userDoc = await getDoc(doc(db, "users", userId));
            return userDoc.exists() ? userDoc.data().username : userId;
          })
        );
        setLikedUsers(likedUsernames);
      };

      fetchLikedUsernames();
    }
  }, [postId, posts, user?.uid]);


  const handleLike = async () => {
    if (!user) return;
    await likePost(postId);

    //if(hasLiked) {
    //  setLocalLikesCount(prevCount => prevCount - 1);
    //} else {
    //  setLocalLikesCount(prevCount => prevCount + 1);
    //}
    //setHasLiked(!hasLiked);
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!commentInput.trim()) return;
    await addComment(postId, commentInput);
    setCommentInput("");
  };
  
return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {title}
        </h2>
      <div className='modal-created'>
          <span className='created-at'>Utworzono: {new Date(createdAt).toLocaleString()}</span>
      </div>
      <div className='modal-body'>
        <p> <strong>{creatorUsername}</strong>: {content}</p>

        <div className="comments-list">
        <h3>Komentarze</h3>
        <form onSubmit={handleCommentSubmit}>
          <input type="text" value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="Dodaj komentarz..." required />
          <button type="submit">Wyślij</button>
        </form>


      
          {localComments.map((comment, index) => (
            <div key={index} className='comment'>
              <strong>{comment.username || comment.userId}:</strong> {comment.content}
            </div>
          ))}
          </div>
        </div>

        
      <div className='modal-buttons'>
        {children}


        <div className='like-button'
          onMouseEnter={() => setShowLikedUsers(true)}
          onMouseLeave={() => setShowLikedUsers(false)}
        >
        <button onClick={handleLike}>Like ({localLikesCount})</button>

        {showLikedUsers && likedUsers.length > 0 && (
          <div className='likes-users-tooltip'>
            <h4>Polajkowano przez:</h4>
            {likedUsers.map((username, index) => (
              <div key={index}>{username}</div>
            ))}
          </div>
        )}
        </div>
        <button onClick={onClose}>Zamknij</button>
      </div>

      </div>
    </div>
  );
};

export default PostModal;

