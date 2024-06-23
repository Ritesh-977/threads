import { Button, CloseButton, Flex, FormControl, Image, Input, Text, Textarea, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import {AddIcon} from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";

const MAX_CHAR = 500;

const CreatePost = () => {
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const { handleImageChange, imgUrl , setImgUrl} = usePreviewImg();
    const [postText, setPostText] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);

    const handleTextChange = (e)=>{
        const inputText = e.target.value;

        if(inputText.length > MAX_CHAR ){
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        } else{
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    const handleCreatePost = async ()=>{
        setLoading(true)
      try {
        const res = await fetch("/api/posts/create",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({postedBy: user._id, text: postText, img: imgUrl })
        })
        const data = await res.json();
        if(data.error){
            showToast("Error", data.error, "error");
            return;
        }
        showToast("Success", "Post created successfully", "success")
        setPosts([data, ...posts]);
        onClose();
        setPostText("");
        setImgUrl("");
      } catch (error) {
        showToast("Error", error, "error");
      } finally{
        setLoading(false)
      }
    };

  return (
    <>
    <Button
    onClick={onOpen}
    position={"fixed"}
    bottom={10}
    right={10}
    bg={useColorModeValue("gray.400", "gray.dark")}
    size={{base: 'sm', sm:"lg"}}
    >
    <AddIcon/>
    </Button>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
                <Textarea
                placeholder="Post content goes here.."
                onChange={handleTextChange}
                value={postText}
                />
                <Text fontSize={'xs'} fontWeight={'bold'} textAlign={'right'} m={1} color={'gray.800'} >{remainingChar}/{MAX_CHAR}</Text>
                <Input
                type="file"
                hidden
                ref = {imageRef}
                onChange={handleImageChange}
                />
                <BsFillImageFill
                 style={{marginLeft:'5px', cursor:'pointer'}}
                 size={16}
                 onClick={()=> imageRef.current.click()}
                />
            </FormControl>
            {imgUrl && (
                <Flex mt={5} w={'full'} position={'relative'} >
                   
                   {/* <video width={"150px"} src={imgUrl} alt="Selected img" />  */}
                    <Image src={imgUrl} alt="Selected img"/> 
                    {console.log(imgUrl)};
                    <CloseButton onClick={()=>{setImgUrl("")}} bg={'gray.800'} position={'absolute'} top={2} right={2} />
                </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button isLoading={loading} colorScheme='blue' mr={3} onClick={handleCreatePost}>
             Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  </>
  )
}

export default CreatePost
