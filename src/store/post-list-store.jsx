import { createContext, useReducer, useEffect } from "react";
import { useState } from "react";

export const PostList = createContext({
  postList: [],
  fetching: false,
  addPost: () => {},
  deletePost: () => {},
});

const postListReducer = (currPostList, action) => {
  console.log("this is action which I performed ", action);
  console.log("this is current post list before update", currPostList);

  let updatedList;
  switch (action.type) {
    case "DELETE_POST":
      updatedList = currPostList.filter(
        (post) => post.id !== action.payload.postId
      );
      localStorage.setItem("postList", JSON.stringify(updatedList));
      break;
    case "ADD_INITIAL_POSTS":
      updatedList =
        action.payload.posts.length === currPostList.length
          ? currPostList
          : action.payload.posts;
      break;
    case "ADD_POST":
      // Find the highest `id` in the current post list
      const lastPostId =
        currPostList.length > 0
          ? Math.max(...currPostList.map((post) => post.id))
          : 0;

      const newPostId = lastPostId + 1;

      action.payload.id = newPostId;

      updatedList = [action.payload, ...currPostList];

      localStorage.setItem("postList", JSON.stringify(updatedList));
      break;
    default:
      updatedList = currPostList;
      break;
  }

  console.log("this is current post list after update", updatedList);
  return updatedList;
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, []);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    const localPostList = localStorage.getItem("postList");
    if (localPostList) {
      // If postList is already in localStorage, use it
      addInitialPosts(JSON.parse(localPostList));
    } else {
      const controller = new AbortController();
      const signal = controller.signal;
      setFetching(true);
      console.log("fetched started");
      // Fetch posts only if postList is empty
      fetch("https://dummyjson.com/posts", { signal })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("postList", JSON.stringify(data.posts));
          addInitialPosts(data.posts);
          setFetching(false);
          console.log("fetched returned");
        });

      return () => {
        controller.abort();
      };
    }
  }, [postList.length]); // Dependency on postList.length

  const addPost = (post) => {
    console.log("add post called", post);
    dispatchPostList({
      type: "ADD_POST",
      payload: post,
    });
  };

  const addInitialPosts = (posts) => {
    dispatchPostList({
      type: "ADD_INITIAL_POSTS",
      payload: {
        posts,
      },
    });
  };
  const deletePost = (postId) => {
    dispatchPostList({
      type: "DELETE_POST",
      payload: {
        postId,
      },
    });
  };

  return (
    <PostList.Provider
      value={{
        postList: postList,
        fetching,
        addPost,
        deletePost,
      }}
    >
      {children}{" "}
    </PostList.Provider>
  );
};

export default PostListProvider;
