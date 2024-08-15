import React, { useContext, useRef } from "react";
import { PostList as PostListContext } from "../store/post-list-store";

const CreatePost = () => {
  const { addPost } = useContext(PostListContext);
  const userIdElement = useRef();
  const postTitleElement = useRef();
  const postBodyElement = useRef();
  // const reactionsElement = useRef();
  const tagsElement = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    const userId = userIdElement.current.value;
    const postTitle = postTitleElement.current.value;
    const postBody = postBodyElement.current.value;
    // const reactions = reactionsElement.current.value;
    const tags = tagsElement.current.value.split(" ");

    console.log("Sending post to server");
    fetch("https://dummyjson.com/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: postTitle,
        body: postBody,
        // reactions: reactions,
        userId: userId,
        tags: tags,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 400) {
            alert("Bad Request: Invalid User ID.");
          } else if (res.status === 404) {
            alert("Resource Not Found: User ID Not Found.");
          } else {
            alert(`Error: Received status code ${res.status}`);
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((post) => {
        addPost(post);

        alert("Post added successfully!");

        // Reset form fields
        userIdElement.current.value = "";
        postTitleElement.current.value = "";
        postBodyElement.current.value = "";
        tagsElement.current.value = "";
      })
      .catch((error) => {
        console.error("Error adding post:", error);
      });
  };

  return (
    <div>
      <form className="create-post" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="userId" className="form-label">
            Enter Your User Id
          </label>
          <input
            type="text"
            ref={userIdElement}
            className="form-control"
            id="userId"
            placeholder="Your User Id"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Post Title
          </label>
          <input
            type="text"
            ref={postTitleElement}
            className="form-control"
            id="title"
            placeholder="How are you feeling today"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="body" className="form-label">
            Post Content
          </label>
          <textarea
            ref={postBodyElement}
            rows="4"
            className="form-control"
            id="body"
            placeholder="How are you feeling today"
          />
        </div>
        {/* <div className="mb-3">
          <label htmlFor="reactions" className="form-label">
            Number Of Reactions
          </label>
          <input
            type="text"
            // ref={reactionsElement}
            className="form-control"
            id="reactions"
            placeholder='How many people reacted to this post'
          />
        </div> */}
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">
            Enter Your Hashtags Here
          </label>
          <input
            type="text"
            ref={tagsElement}
            className="form-control"
            id="tags"
            placeholder="Please enter your hashtags separated by spaces"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
