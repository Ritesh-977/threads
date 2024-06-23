import { Box, Avatar, Divider, Flex, Text , Menu, MenuButton, MenuDivider, MenuItem, MenuList, Portal} from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { BiHide } from "react-icons/bi";
import { MdBlock } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import useShowToast from "../hooks/useShowToast";
import {  formatDistance, formatDistanceToNow } from "date-fns"

const Comment = ({ reply, lastReply }) => {
   
    const showToast = useShowToast();
    const handleCopy = ()=>{
        try {
            const currentComment = reply.text;
            navigator.clipboard.writeText(currentComment).then(()=>{  
                showToast("Copied", "","success");
             })
        } catch (error) {
            showToast("Error", error.message,"error");
        }
    }
 
    return (
        <>
           {console.log(reply)}
            <Flex gap={4} py={2} my={2} w={'full'}>
                <Avatar src={reply.userProfilePic} />
                <Flex gap={1} w={'full'} flexDirection={'column'}>
                    <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>{reply.username}</Text>
                        <Flex gap={3} alignItems={'center'}>
                        
                            <Text fontSize={'sm'} color={'gray.light'}>{formatDistance(reply.date, Date.now(), {addSuffix: true})}</Text>
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
                                            <MenuItem icon={<TbMessageReport />} color={'red'} bg={'gray.dark'}> Delete </MenuItem>
                                        </MenuList>
                                    </Portal>
                                </Menu>
                            </Box>
                        </Flex>
                    </Flex>

                    <Text>{reply.text}</Text>
                </Flex>
            </Flex>

          {!lastReply ? <Divider /> : <div> <br /> <br /> </div> }
        </>
    )
}

export default Comment
