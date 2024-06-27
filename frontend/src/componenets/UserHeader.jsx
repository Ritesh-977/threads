import { Box, Button, Flex, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Portal, Text, VStack, useColorMode, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/avatar"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { FaLink } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import { MdBlock } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import React, { useState } from "react";
import { NavLink, Link as RouterLink, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from './../atoms/userAtom';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import useShowToast from "../hooks/useShowToast";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import Conversation from "./Conversation";
import useFollowUnFollow from "../hooks/useFollowUnFollow";

const UserHeader = ({user}) => {  // This user is the  Profile visited user


  const [conversations,setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [messagingUser, setMessagingUser] = useState(false);
  const { colorMode } = useColorMode();

  const showToast = useShowToast();

  const currentUser = useRecoilValue(userAtom); // Currently logged in user



  // Alert Box
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

const{handleFollowUnfollow, following, updating }=useFollowUnFollow(user);
const copyURL = () =>{
  const currentURL = window.location.href;
  navigator.clipboard.writeText(currentURL).then(()=>{
   showToast("Copied","","success");
  })
}
// 

//
 const handleMessageBox = () => {
  setMessagingUser(true);
  try {
    const conversationAlreadyExist = conversations.find(conversation => conversation.participants[0]._id === user._id)
    if(conversationAlreadyExist){
        setSelectedConversation({
        _id : conversationAlreadyExist._id,
        userId: user._id,
        username: user.username,
        userProfilePic: user.profilePic,
    });
    return;
    };
  
    const mockConversation = {
        mock: true,
        lastMessage: {
            text: "",
            sender: ""
        },
        _id: Date.now(),
        participants: [
            {
                _id: user._id,
                username: user.username,
                profilePic: user.profilePic,
            },
        ],
    };

    setSelectedConversation({
      _id: user._id,
      userId: user._id,
      userProfilePic: user.profilePic,
      username: user.username,
      mock: true,
    })
    setConversations((prevConvs) => [...prevConvs, mockConversation]);  
    
  } catch (error) {
    showToast("Error", error.message, "error");
  } finally{
    setMessagingUser(false);
  }
 
 }


//
 let dt = new Date(user.createdAt);
 dt = dt.toGMTString();

  return (
    <>
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
      <Box>
      <Text fontSize={"2xl"} fontWeight={"bold"} onClick={onOpen} cursor={'pointer'} className="myName">
        {user.name}
      </Text>
      <Flex gap={2} alignItems={"center"}>
        <Text fontSize={"sm"}>{user.username}</Text>
        <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
          threads.net
        </Text>
      </Flex>
      </Box>
      <Box>
       {user.profilePic && (
         <Avatar name={user.name}src={user.profilePic}
         size={{
          base: 'md',
          md: 'xl'
         }}/>
       )}
         {!user.profilePic && (
         <Avatar name={user.name}
        src="https://bit.ly/broken-link"
         size={{
          base: 'md',
          md: 'xl'
         }}/>
       )}
      </Box>
      </Flex> 
      
      <Text>{user.bio}</Text>
    
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
        <Text _hover={{fontStyle:"underline"}} color={"gray.light"}>{user.followers.length} followers</Text>
        { user.website && <Box w={'1'} h={'1'} bg={'gray.light'} borderRadius={'full'}></Box> }
        <Link color={'gray.light'} target="_blank" href={user.website}>{user.website}</Link>
        </Flex>
        <Flex>
          <Box className={colorMode === 'light' ? 'light': 'dark'}>
           <Link target="_blank"  href ="https://www.instagram.com/">  < BsInstagram size={24} cursor={'pointer'}/> </Link>
          </Box>
          <Box className={colorMode === 'light' ? 'light': 'dark'}>
            <Menu>
              <MenuButton>
              <CgMoreO size={24} cursor={'pointer'}/>
              </MenuButton>
              <Portal>
                <MenuList bg={useColorModeValue("gray.300", "#0e0e0e")}>
                  <MenuItem _hover={{ bg: (colorMode === "dark" ? 'gray.dark':'gray.200' )}} icon={ <FaLink />}   bg={useColorModeValue("gray.300", "#0e0e0e")} ml={'5px'} maxW={'210px'}  borderRadius={'5px'} onClick={copyURL}> Copy link  </MenuItem>
                  <MenuItem _hover={{ bg: (colorMode === "dark" ? 'gray.dark':'gray.200' )}} icon={<BsInfoCircle />}  bg={useColorModeValue("gray.300", "#0e0e0e")} ml={'5px'} maxW={'210px'}  borderRadius={'5px'} onClick={onOpen}> About this profile</MenuItem>
                  <MenuDivider/>
                  <MenuItem _hover={{ bg: (colorMode === "dark" ? 'gray.dark':'gray.200' )}} icon={ <MdBlock /> } color={'red'}  bg={useColorModeValue("gray.300", "#0e0e0e")} ml={'5px'} maxW={'210px'}  borderRadius={'5px'}> Block </MenuItem>
                  <MenuItem _hover={{ bg: (colorMode === "dark" ? 'gray.dark':'gray.200' )}} icon={<TbMessageReport />} color={'red'}  bg={useColorModeValue("gray.300", "#0e0e0e")} ml={'5px'} maxW={'210px'}  borderRadius={'5px'}> Report </MenuItem>
                </MenuList>
              </Portal> 
            </Menu>
            
          </Box>
        </Flex>
      </Flex>
      
      <Flex w={'full'}>

     
        {currentUser?._id === user._id && (
           <Flex w={'full'}>
          <Link as ={RouterLink} to="/update">
          <Button 
           size='md'
           height='40px'
           width={{
            base: '350px',
            sm: '500px',
            md: '600px'
           }}
          borderRadius={'10px'}
           >Edit Profile</Button>
        </Link>  </Flex> )}
       
        <Flex  justifyContent={'right'}  pb={3}>
        {currentUser?._id !== user._id && (
          <Button 
        
           size='md'
           height='37px'
           border={"1px solid"}
           width={{
            base: '180px',
            sm: '230px',
            md: '270px'
           
           }}
           borderColor={"#595353"}
          borderRadius={'10px'}
          isLoading ={updating}
          onClick={handleFollowUnfollow}
           >{following ? "Following" : "Follow"}</Button>
         )}
        </Flex>

        <Flex  justifyContent={'center'}>
        {currentUser?._id !== user._id && (
        <NavLink  to="/chat">
          <Button 
          ml={3}
          isLoading = {messagingUser}
          border={"1px solid"}
          borderColor={"#595353"}
          width={{
            base: '180px',
            sm: '230px',
            md: '270px'
           
           }}
          size='md'
           height='37px'
          borderRadius={'10px'} 
          onClick={handleMessageBox}> Message</Button>
         </NavLink> 
        )}
        </Flex>
      </Flex>

      <Flex w={'full'}>
        <Flex flex={1} borderBottom={'1.5px solid white'} justifyContent={'center'} pb={'3'} cursor={'pointer'}>
          <Text fontWeight={'bold'}>Threads</Text>
        </Flex>
        <Flex flex={1} borderBottom={'1px solid gray'} justifyContent={'center'} color='gray.light' pb={'3'} cursor={'pointer'}>
          <Text fontWeight={'bold'}>Replies</Text>
        </Flex>
      </Flex >
    </VStack>

    {/* ALERT BOX */}
    { <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent bg={'gray.dark'}>
          <AlertDialogHeader>About Profile</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody >
           <strong>Name</strong> <br/> {user.name} ({user.username})
           <br />
           <strong>Joined</strong> <br/> {dt}
          </AlertDialogBody>
          <AlertDialogFooter>  
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> }


    </>
  )
}

export default UserHeader
