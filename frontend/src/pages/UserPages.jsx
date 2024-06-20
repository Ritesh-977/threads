import { useEffect, useState } from "react";
import UserHeader from "../componenets/UserHeader"
import UserPost from "../componenets/UserPost"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
const UserPages = () => {
  const showtoast = useShowToast();
  const [user, setUser] = useState(null);
  const {username} = useParams();
  useEffect(()=>{
     const getUser = async() =>{
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if(data.error){
          showtoast("Error",data.error,"error");
          return;
        }
        setUser(data);
      } catch (error) {
        showtoast("Error",error,"error");
       
      }
     };
     getUser();
  },[username, showtoast])

  if(!user) return null;
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
