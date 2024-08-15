import React, { useContext } from 'react';
import { MdDelete } from "react-icons/md";
import { PostList as PostListContext } from '../store/post-list-store';

const Post = ({ post }) => {
  const { deletePost } = useContext(PostListContext);

  return (
    <div>
      <div className="card post-card" style={{ width: "30rem" }}>
        <div className="card-body">
          <h5 className="card-title">
            {post.title}
            <span 
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
              onClick={() => deletePost(post.id)}
            >
              <MdDelete />
              <span className="visually-hidden">unread messages</span>
            </span>
          </h5>
          <p className="card-text">
            {post.body}
          </p>

          {/* Render tags only if post.tags is defined and is an array */}
          {Array.isArray(post.tags) && post.tags.map((tag) => (
            <span key={tag} className="badge text-bg-primary hashtag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
