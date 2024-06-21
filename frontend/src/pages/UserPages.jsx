import { useEffect, useState } from "react";
import UserHeader from "../componenets/UserHeader"
import UserPost from "../componenets/UserPost"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
const UserPages = () => {
  const showToast = useShowToast();
  const [user, setUser] = useState(null);
  const {username} = useParams();
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
     const getUser = async() =>{
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if(data.error){
          showToast("Error",data.error,"error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error",error,"error");
       
      } finally{
        setLoading(false);
      }
     };
     getUser();
  },[username, showToast]);
  if(!user && loading){
    return (
      <Flex justifyContent={'center'}><Spinner size={'xl'} /></Flex>
    )
  }
  //   if(!user) return null;
   if(!user && !loading) return <h1>User not found</h1>;
  return (
    <div>
      <UserHeader user={user}/>
      <UserPost likes={1265} replies={341} postImg="/post1.png" postTitle="Let's talk about threads"/> 
      <UserPost likes={165} replies={641} postImg="/post2.png" postTitle="Nice tutorial"/> 
      <UserPost likes={3265} replies={241} postImg="/post3.png" postTitle="I love this guy"/> 
      <UserPost likes={2365} replies={485}  postTitle="This is my first thread"/> 
    </div>
  )
}

export default UserPages
