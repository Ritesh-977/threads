import { Avatar, Box, Flex, Image, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Portal, Divider, Button } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import { RiSaveLine } from "react-icons/ri";
import { MdBlock } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import Actions from "../componenets/Actions";
import {useToast} from "@chakra-ui/toast";
import { useState } from "react";
import Comment from "../componenets/Comment";

const PostPage = () => {
  const [liked, setLiked] = useState(false);
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
  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src="/zuck-avatar.png" size={'md'} name="Mark Zuckerberg" />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>zuckerberg</Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={'center'}>
          <Text fontSize={'sm'} color={'gray.light'}>1d</Text>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <BsThreeDots size={24} cursor={'pointer'} />
              </MenuButton>
              <Portal>
                <MenuList bg={'gray.dark'}>
                  <MenuItem icon={<FaLink />} bg={'gray.dark'} onClick={copyURL} > Copy link  </MenuItem>
                  <MenuItem icon={<RiSaveLine />} bg={'gray.dark'} > Save </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<MdBlock />} color='red' bg={'gray.dark'}> Block </MenuItem>
                  <MenuItem icon={<TbMessageReport />} color={'red'} bg={'gray.dark'}> Report </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Text fontSize={'sm'}> Let's talk about Threads. </Text>
      <Box
        borderRadius={6}
        overflow={'hidden'}
        border={'1px solid'}
        borderColor={'gray.light'} >
        <Image src='/post1.png' w={'full'} />
      </Box>

      <Flex gap={3} my={3} cursor={'pointer'}>
        <Actions liked={liked} setLiked={setLiked} likes={342} />
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={'gray.light'} fontSize={'sm'} > 341 replies</Text>
      </Flex>

      <Divider my={4}/>

      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>👋</Text>
          <Text color={'gray.light'}>Get the app now to like, reply and post easily,</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4}/>
  
      <Comment 
      comment = "Looks really Good!"
      createdAt = '2d'
      likes = {15}
      username = 'johndoe'
      userAvatar = 'https://bit.ly/dan-abramov'
      />
  
      <Comment 
      comment = "Excellent Work"
      createdAt = '1d'
      likes = {21}
      username = 'kentdodds'
      userAvatar = 'https://bit.ly/kent-c-dodds'
      />
  
      <Comment 
      comment = "Nice"
      createdAt = '3d'
      likes = {5}
      username = 'prosper'
      userAvatar = 'https://bit.ly/prosper-baba'
      />

    </>
  )
}

export default PostPage
