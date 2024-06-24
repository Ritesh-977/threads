import { Flex, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { IoSendSharp } from 'react-icons/io5';
import Picker from "emoji-picker-react";
import { useState } from "react";
import { MdEmojiEmotions } from "react-icons/md";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";


const MessageInput = ({setMessages}) => {
   const [messageText, setMessageText] = useState("");
   const showToast = useShowToast();
   const selectedConversation = useRecoilValue(selectedConversationAtom);
    const setConversations = useSetRecoilState(conversationsAtom)
    const [showPicker, setShowPicker] = useState(false);
    const onEmojiClick = (event)=>{
        setMessageText((prevInput) => prevInput + event.emoji);
        setShowPicker(false);
    }
    const handleSendMessage = async (e) =>{
      e.preventDefault();
      if(!messageText) return;
      try {
        const res = await fetch("/api/messages",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            recipientId: selectedConversation.userId,
          }),
        })
        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "error");
        }
        setMessages((messages) => [...messages, data]);

        setConversations(prevConvs => {
          const updatedConversation = prevConvs.map(conversation =>{
            if(conversation._id === selectedConversation._id){
              return {
                ...conversation,
                lastMessage:{
                  text: messageText,
                  sender: data.sender
                }
              }
            }
            return conversation;
          })
          return updatedConversation;
        })

        setMessageText("");
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    }
  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>

      <Input  w={'full'} placeholder="Type a message"
            value = {messageText} onChange = {(e)=> setMessageText(e.target.value) }
      /> 
      <Flex >
      <InputRightElement mr={2} gap={2} onClick={handleSendMessage}>
      <MdEmojiEmotions cursor={'pointer'} onClick={()=> setShowPicker((val) => !val)}/>
       <IoSendSharp color = 'gray' cursor={'pointer'} />
    
      </InputRightElement>
      </Flex>
      </InputGroup>
      <Flex ml={7} mt={2}>
        {showPicker && (
            <Picker theme="dark"  width={'400px'} height={400} onEmojiClick={onEmojiClick}/>
        )}
       </Flex>
    </form>
  )
}

export default MessageInput
