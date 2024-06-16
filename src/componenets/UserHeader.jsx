import { Box, Flex, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Portal, Text, VStack, useDisclosure } from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/avatar"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { FaLink } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { MdBlock } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import {useToast} from "@chakra-ui/toast";
import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';

const UserHeader = () => {
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

  return (
    <>
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
      <Box>
      <Text fontSize={"2xl"} fontWeight={"bold"}>
        Mark Zuckerberg
      </Text>
      <Flex gap={2} alignItems={"center"}>
        <Text fontSize={"sm"}>zuckerberg</Text>
        <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
          threads.net
        </Text>
      </Flex>
      </Box>
      <Box>
        <Avatar name="Mark Zuckerberg" src="/zuck-avatar.png" size={"xl"}/>
      </Box>
      </Flex> 
      
      <Text>Co-founder, executive chairman and CEO of Meta Platforms.</Text>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"}>3.2M followers</Text>
        <Box w={'1'} h={'1'} bg={'gray.light'} borderRadius={'full'}></Box>
        <Link color={'gray.light'}>linktr.ee/MarkZuckerberg</Link>
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
                  <MenuItem icon={<FaCircleInfo />} bg={'gray.dark'} onClick={onOpen}> About this profile</MenuItem>
                  <MenuDivider/>
                  <MenuItem icon={ <MdBlock /> } bg={'gray.dark'}> Block </MenuItem>
                  <MenuItem icon={<TbMessageReport />} bg={'gray.dark'}> Report </MenuItem>
                </MenuList>
              </Portal> 
            </Menu>
            
          </Box>
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
           <strong>Name</strong> <br/> Mark Zuckerburg (zuckerberg)
           <br />
           <strong>Joined</strong> <br/> 09/02/2018
          </AlertDialogBody>
          <AlertDialogFooter>  
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> }


    </>
  )
}

export default UserHeader
