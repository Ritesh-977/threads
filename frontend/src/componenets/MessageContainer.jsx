import { Avatar, AvatarBadge, Divider, Flex, Image, Skeleton, SkeletonCircle, Spacer, Text, WrapItem, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Message from './Message';
import MessageInput from './MessageInput';
import useShowToast from '../hooks/useShowToast';
import { selectedConversationAtom } from '../atoms/messagesAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import {  useNavigate } from 'react-router-dom';
import { IoClose } from "react-icons/io5";

const MessageContainer = ({isOnline}) => {
  const showToast = useShowToast();
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  useEffect(()=>{
   
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if(selectedConversation.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`)
        const data = await res.json();
        if(data.error){
          showToast("Error",data.error, "error");
          return;
        }
      setMessages(data);
      } catch (error) {
        showToast("Error", error.message, "error")
      } finally {
        setLoadingMessages(false);
      }
    }
    getMessages();
  },[showToast, selectedConversation.userId])
  return (
    <Flex flex='70'
    bg={useColorModeValue("gray.1200", "gray.dark")}
    borderRadius={'md'}
    flexDirection={'column'}
    p={2}
    >
      {/* Message header */}
      <Flex w={'full'} h={12} alignItems={'center'} gap={2}>
      <WrapItem>
        {console.log(isOnline)}
      <Avatar cursor={'pointer'} onClick={(e) => { e.preventDefault();  navigate(`/${selectedConversation.username}`) }}  src={selectedConversation.userProfilePic} size={'sm'}> 
      {isOnline ?  <AvatarBadge boxSize={'1em'} bg={'green.500'} /> : ""}
      </Avatar>
      </WrapItem>
      <Text cursor={'pointer'} _hover={{textDecoration:'underline'}} onClick={(e) => { e.preventDefault();  navigate(`/${selectedConversation.username}`); }} display={'flex'} alignItems={'center'}  > {selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1}/></Text>
      <Spacer />
      <Flex mr={2}>
      <IoClose onClick={(e) => { location.reload();}} cursor={'pointer'} size={20} />
      </Flex>
      </Flex>
       
      <Divider/>
     
     <Flex flexDir={'column'} p={2} gap={4} my={4} height={'400px'} overflowY={'auto'}>
     {loadingMessages && (
        [...Array(5)].map((_, i) => (
        <Flex
            key={i}
            gap={2}
            alignItems={'center'}
            p={1}
            borderRadius={'md'}
            alignSelf={i %2 === 0 ? "flex-start": "flex-end"}
            >
            {i % 2 === 0 && <SkeletonCircle size={7}/>}
            <Flex flexDir={'column'} gap={2}>
                <Skeleton h={'8px'} w={'250px'}/>
                <Skeleton h={'8px'} w={'250px'}/>
                <Skeleton h={'8px'} w={'250px'}/>
            </Flex>
            {i % 2 !== 0 && <SkeletonCircle size={7}/>}

        </Flex>
        )))}
        {!loadingMessages && (
          messages.map((message)=>(
            <Message key={message._id} message={message} ownMessage={currentUser._id === message.sender}/>
          ))
        )}
       

    </Flex>
     <MessageInput setMessages={setMessages} />
    </Flex>
  )
};


export default MessageContainer
