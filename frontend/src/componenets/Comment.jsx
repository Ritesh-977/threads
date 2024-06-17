import { Box, Avatar, Divider, Flex, Text , Menu, MenuButton, MenuDivider, MenuItem, MenuList, Portal} from "@chakra-ui/react"
import { useState } from "react"
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { FaRegCopy } from "react-icons/fa";
import { BiHide } from "react-icons/bi";
import { MdBlock } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import {useToast} from "@chakra-ui/toast";

const Comment = ({ comment, username, likes, createdAt, userAvatar }) => {
    const [liked, setLiked] = useState(false);
    const toast = useToast(); 
    const handleCopy = ()=>{
        const currentComment = comment;
        navigator.clipboard.writeText(currentComment).then(()=>{
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
            <Flex gap={4} py={2} my={2} w={'full'}>
                <Avatar src={userAvatar} />
                <Flex gap={1} w={'full'} flexDirection={'column'}>
                    <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>{username}</Text>
                        <Flex gap={3} alignItems={'center'}>
                            <Text fontSize={'sm'} color={'gray.light'}>{createdAt}</Text>
                            <Box >
                                <Menu>
                                    <MenuButton color="gray.light">
                                        <BsThreeDots  />
                                    </MenuButton>
                                    <Portal>
                                        <MenuList bg={'gray.dark'}>
                                            <MenuItem icon={<FaRegCopy />} bg={'gray.dark'} onClick={handleCopy} > Copy comment  </MenuItem>
                                            <MenuItem icon={<BiHide />} bg={'gray.dark'} > Hide Comment </MenuItem>
                                            <MenuDivider />
                                            <MenuItem icon={<MdBlock />} color='red' bg={'gray.dark'}> Block </MenuItem>
                                            <MenuItem icon={<TbMessageReport />} color={'red'} bg={'gray.dark'}> Report </MenuItem>
                                        </MenuList>
                                    </Portal>
                                </Menu>
                            </Box>
                        </Flex>
                    </Flex>
                    <Text>{comment}</Text>
                    <Actions liked={liked} setLiked={setLiked} likes={likes} />
                </Flex>
            </Flex>

            <Divider />
        </>
    )
}

export default Comment
