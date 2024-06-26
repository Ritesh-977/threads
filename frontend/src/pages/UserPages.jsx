import { useEffect, useState } from "react";
import UserHeader from "../componenets/UserHeader"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from '../componenets/Post';
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
const UserPages = () => {
  const {loading, user} = useGetUserProfile();
  const showToast = useShowToast();
  const {username} = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
 
  useEffect(()=>{
     const getPosts = async () =>{
      setFetchingPosts(true);
      if(!user) return;
      
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log(data);
        setPosts(data)
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
         setFetchingPosts(false);
      }
     }

     getPosts();

  },[username, showToast, setPosts, user]);
  
  if(!user && loading){
    return (
      <Flex justifyContent={'center'}><Spinner size={'md'} /></Flex>
    )
  }
  //   if(!user) return null;
   if(!user && !loading) return <h1>User not found</h1>;
  return (
    <div>
      <UserHeader user={user}/>
       {!fetchingPosts && posts.length === 0 && <h1>User has no posts</h1>}
       {fetchingPosts && (
        <Flex justifyContent={'center'} my={12}>
          <Spinner size={'md'} />
        </Flex>
       )}

       {posts.map((posts)=>(
        <Post key = {posts._id} post = {posts} postedBy = {posts.postedBy} />
       ))}
    </div>
  )
}

export default UserPages
