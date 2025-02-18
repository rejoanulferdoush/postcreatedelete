import React, { useContext, useRef, useState } from 'react'
import Post from './Post'
import {PostList as PostListData} from "../store/post-list-store";
import WelcomeMessage from './WelcomeMessage';
import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const PostList = () => {
  const {postList , fetching} = useContext(PostListData)
 

 
   
  
 
  return (
   <>
   {fetching && <LoadingSpinner/>}
    { !fetching && postList.length === 0 && <WelcomeMessage />}
    {
      !fetching && postList.map((post, index) => {
        return <Post post={post} key={index}/>
      })
    }
   </>
  )
}

export default PostList;
