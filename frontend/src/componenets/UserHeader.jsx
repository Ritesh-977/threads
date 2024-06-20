import { Box, Button, Flex, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Portal, Text, VStack, useDisclosure } from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/avatar"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { FaLink } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import { MdBlock } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import {useToast} from "@chakra-ui/toast";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue } from 'recoil';
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

const UserHeader = ({user}) => {  // This user is the  Profile visited user

  const showToast = useShowToast();

  const currentUser = useRecoilValue(userAtom); // Currently logged in user

  const [following, setFollowing] = useState(user.followers.includes(currentUser._id));

  const [updating, setUpdating] = useState(false);

  // Alert Box
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

// Toast
const toast = useToast(); 
const copyURL = () =>{
  const currentURL = window.location.href;
  navigator.clipboard.writeText(currentURL).then(()=>{
    toast({
      title: "Copied",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  })
}
// 
   const handleFollowUnfollow = async ()=>{
    if(!currentUser){
      showToast("Error", "Please login to follow", "error");
      return;
    }
    setUpdating(true);
    try {
       const res = await fetch(`/api/users/follow/${user._id}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
       });
       const data = await res.json();
       if(data.error){
        showToast("Error", data.error, "error");
        return;
       }
       if(following){   
        showToast("","Unfollowed","success");  
        user.followers.pop();
       }
       else{
        user.followers.push(currentUser._id);
       }
       setFollowing(!following);

    } catch (error) {
      showToast("Error", error, "error");
    } finally{
       setUpdating(false);
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
        <Text color={"gray.light"}>{user.followers.length} followers</Text>
        { user.website && <Box w={'1'} h={'1'} bg={'gray.light'} borderRadius={'full'}></Box> }
        <Link color={'gray.light'} target="_blank" href={user.website}>{user.website}</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={'pointer'}/>
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
              <CgMoreO size={24} cursor={'pointer'}/>
              </MenuButton>
              <Portal>
                <MenuList bg={'gray.dark'}>
                  <MenuItem icon={ <FaLink /> }  bg={'gray.dark'} onClick={copyURL}> Copy link  </MenuItem>
                  <MenuItem icon={<BsInfoCircle />} bg={'gray.dark'} onClick={onOpen}> About this profile</MenuItem>
                  <MenuDivider/>
                  <MenuItem icon={ <MdBlock /> } color={'red'} bg={'gray.dark'}> Block </MenuItem>
                  <MenuItem icon={<TbMessageReport />} color={'red'} bg={'gray.dark'}> Report </MenuItem>
                </MenuList>
              </Portal> 
            </Menu>
            
          </Box>
        </Flex>
      </Flex>
      
      <Flex w={'full'} >

     
        {currentUser._id === user._id && (
           <Flex flex={1} justifyContent={'center'} pb={3}>
          <Link as ={RouterLink} to="/update">
          <Button 
           size='md'
           height='40px'
           width='600px'
          borderRadius={'10px'}
           >Edit Profile</Button>
        </Link>  </Flex> )}
       
        <Flex flex={1} justifyContent={'center'} pb={3}>
        {currentUser._id !== user._id && (
          <Button 
           size='md'
           height='37px'
           width='280px'
           border={"1px solid"}
           borderColor={"#595353"}
          borderRadius={'10px'}
          isLoading ={updating}
          onClick={handleFollowUnfollow}
           >{following ? "Following" : "Follow"}</Button>
         )}
        </Flex>

        <Flex flex={1} justifyContent={'center'}>
        {currentUser._id !== user._id && (
        // <Link as ={RouterLink} to="/">
          <Button 
          border={"1px solid"}
          borderColor={"#595353"}
          size='md'
           height='37px'
           width='280px'
          borderRadius={'10px'} > Message</Button>
        // </Link> 
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
