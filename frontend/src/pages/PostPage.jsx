import { Avatar, Box, Flex, Image, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Portal, Divider, Button, Spinner } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import { RiSaveLine } from "react-icons/ri";
import { IoHeartDislikeOutline } from "react-icons/io5";
import Actions from "../componenets/Actions";
import { useEffect } from "react";
import { formatDistanceToNowStrict} from "date-fns";
import useGetUserProfile from '../hooks/useGetUserProfile';
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {DeleteIcon} from "@chakra-ui/icons"; 
import Comment from "../componenets/Comment";
import {saveAs} from 'file-saver';
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const showToast = useShowToast();
  const {user, loading} = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const currentPost = posts[0];
  useEffect(()=>{
    const getPost = async () =>{
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "error");
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    }
    getPost();
  },[showToast, pid, setPosts]);

  const copyURL = () =>{
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(()=>{
      showToast("Copied","","success");
    })
  }

  const downloadImg = () => {
    saveAs({userProfilePic}, 'image.jpg')
  }

  const handleDeletePost = async ()=>{
    try {

        if(!window.confirm("Are you sure you want to delete this post ?")) return;

        const res = await fetch(`/api/posts/${currentPost._id}`,{
            method: "DELETE",
        });
        const data = await res.json();
        if(data.error){
            showToast("Error", data.error, "error");
            return;
        }
        showToast("Success", "Post deleted", "success");
        navigate(`/${user.username}`);
    } catch (error) {
        showToast("Error", error.message, "error");
    }
}

  if(!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'md'}/>
      </Flex>
    )
  }
  if(!currentPost) return null;
  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src={user.profilePic} size={'md'} name={user.name} />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>{user.username}</Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={'center'}>
        <Text textAlign={'right'} fontSize={'sm'} w={36} color={'gray.light'}>
          {formatDistanceToNowStrict(new Date(currentPost.createdAt)) } ago
        </Text>
          <Box className="icon-container">
            <Menu>
              <MenuButton >
                <BsThreeDots size={24} cursor={'pointer'} />
              </MenuButton>
              <Portal>
                <MenuList bg={'gray.dark'}>
                
                  <MenuItem icon={<RiSaveLine />} bg={'gray.dark'} onClick={downloadImg}> Save </MenuItem>
                  <MenuItem icon={< IoHeartDislikeOutline  />} bg={'gray.dark'} > Hide like </MenuItem>
                  <MenuDivider />
                  { currentUser?._id === user._id &&  <MenuItem color={'red'} bg={'gray.dark'} onClick={handleDeletePost} icon=  { <DeleteIcon /> }> Delete</MenuItem>  }
                  {currentUser?._id === user._id && <MenuDivider/>}
                  <MenuItem icon={<FaLink />} bg={'gray.dark'} onClick={copyURL}> Copy link  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Text fontSize={'sm'}>{currentPost.text} </Text>
      {currentPost.img && (
          <Box >                      
          <Image   
          borderRadius={6}
          overflow={'hidden'}
          border={'1px solid'}
          maxH={'500px'} 
          borderColor={'gray.light'}
          src={currentPost.img} />
      </Box>
      )}
    

      <Flex gap={3} my={3} cursor={'pointer'}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4}/>

      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>👋</Text>
          <Text color={'gray.light'}>Get the app now to like, reply and post easily,</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Flex mt={2} mb={-1}>
        <Text fontWeight={'bold'}>Replies</Text>
      </Flex>

      <Divider my={4}/>
  
      {currentPost.replies.map((reply) =>(
     <Comment
        key = {reply._id}
        reply = {reply}
        lastReply = {reply._id === currentPost.replies[currentPost.replies.length-1]._id}
  
      /> 
      ))}
      


    </>
  )
}

export default PostPage
