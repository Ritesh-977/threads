import { Flex, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { IoSendSharp } from 'react-icons/io5';
import Picker from "emoji-picker-react";
import { useState } from "react";
import { MdEmojiEmotions } from "react-icons/md";
import { Theme } from 'emoji-picker-react';

const MessageInput = () => {
    const [inputStr, setInputStr] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const onEmojiClick = (event)=>{
        setInputStr((prevInput) => prevInput + event.emoji);
        setShowPicker(false);
    }
  return (
    <form>
      <InputGroup>

      <Input value={inputStr} w={'full'} placeholder="Type a message"
         onChange={(e) => setInputStr(e.target.value)}
      /> 
      <Flex >
      <InputRightElement mr={2} gap={2}>
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
