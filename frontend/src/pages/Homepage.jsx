import { Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import useShowToast from './../hooks/useShowToast';
import Post from '../componenets/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';

const Homepage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(()=>{
    const getFeedPosts = async ()=>{
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
     
      } catch (error) {
        showToast("Error", error, "error");
      } finally{
        setLoading(false);
      }
    }
    getFeedPosts();
  },[showToast, setPosts])

  return (
   <>
      {!loading && posts.length === 0 && <h1>Follow someone to see some posts</h1>}
      {loading && (
        <Flex justifyContent={'center'}>
          <Spinner size={'md'}/>
        </Flex>
      )}

      {posts.map((post)=>(
        <Post key={post._id} post = {post} postedBy = {post.postedBy} />
      ))}
   </>
  )
}

export default Homepage
