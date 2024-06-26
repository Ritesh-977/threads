import { Flex, FormControl, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react"
import { IoSendSharp } from 'react-icons/io5';
import Picker from "emoji-picker-react";
import { useRef, useState } from "react";
import { MdEmojiEmotions } from "react-icons/md";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from '../hooks/usePreviewImg';


const MessageInput = ({setMessages}) => {
   const [messageText, setMessageText] = useState("");
   const showToast = useShowToast();
   const selectedConversation = useRecoilValue(selectedConversationAtom);
    const setConversations = useSetRecoilState(conversationsAtom)
    const [showPicker, setShowPicker] = useState(false);
    const imageRef = useRef(null);
    const {onClose} = useDisclosure();
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const [isSending, setIsSending] = useState(false);



    const onEmojiClick = (event)=>{
        setMessageText((prevInput) => prevInput + event.emoji);
        setShowPicker(false);
    }
    const handleSendMessage = async (e) =>{
      e.preventDefault();
      if(!messageText && !imgUrl) return;
      if(isSending) return;
      setIsSending(true);
      try {
        const res = await fetch("/api/messages",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            recipientId: selectedConversation.userId,
            img: imgUrl,
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
        setImgUrl("");
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally{
        setIsSending(false);
      }
    }
  return (
    <Flex gap={2} alignItems={'center'}>
    <form onSubmit={handleSendMessage} style={{flex: 95}}>
      <InputGroup>
      <Input textOverflow={"ellipsis"} placeholder="Type a message"
            value = {messageText} onChange = {(e)=> setMessageText(e.target.value) }
            w={{
              md: '385px',
              base: '290px'
            }}
            /> 
      <Flex >
      <InputRightElement   onClick={handleSendMessage}>
      <Flex alignItems={'center'} gap={3} mr={5}>
      <MdEmojiEmotions  size={20} cursor={'pointer'} onClick={()=> setShowPicker((val) => !val)}/>
       <IoSendSharp  size={20} color = 'gray' cursor={'pointer'} />
       </Flex>
      </InputRightElement>
      </Flex>
      </InputGroup>
      <Flex ml={7} mt={2}>
        {showPicker && (
          <Picker theme="dark"  width={'400px'} height={400} onEmojiClick={onEmojiClick}/>
        )}
       </Flex>
    </form>
    <Flex flex={5} cursor={'pointer'} mr={1} mb={1}>
      <BsFillImageFill size={20} onClick={()=> imageRef.current.click()} />
        <Input type="file" hidden ref={imageRef} onChange={handleImageChange}/>
    </Flex>

    <Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
    </Flex>
  )
}

export default MessageInput

