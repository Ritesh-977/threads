import UserHeader from "../componenets/UserHeader"
import UserPost from "../componenets/UserPost"
const UserPages = () => {
  return (
    <div>
      <UserHeader/>
      <UserPost likes={1265} replies={341} postImg="/post1.png" postTitle="Let's talk about threads"/> 
      <UserPost likes={165} replies={641} postImg="/post2.png" postTitle="Nice tutorial"/> 
      <UserPost likes={3265} replies={241} postImg="/post3.png" postTitle="I love this guy"/> 
      <UserPost likes={2365} replies={485}  postTitle="This is my first thread"/> 
    </div>
  )
}

export default UserPages
