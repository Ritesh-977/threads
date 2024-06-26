import { Box, Avatar, Divider, Flex, Text , Menu, MenuButton, MenuDivider, MenuItem, MenuList, Portal, useColorModeValue, useColorMode} from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import useShowToast from "../hooks/useShowToast";
import {  useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";


const Comment = ({ reply}) => {
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();
    const showToast = useShowToast();
    const { colorMode } = useColorMode();
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
//    if(!user) return null;
    return (
        <>
           {console.log(reply)}
            <Flex gap={4} py={2} my={2} w={'full'}>
                <Avatar 
                 cursor={'pointer'}
                onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${reply.username}`);
                }}
                src={reply.userProfilePic} />
                <Flex gap={1} w={'full'} flexDirection={'column'}>
                    <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                        <Text 
                           cursor={'pointer'}
                           _hover={{textDecoration:"underline"}}
                           onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${reply.username}`);
                        }}
                          
                        fontSize={'sm'} fontWeight={'bold'}>{reply.username}</Text>
                        <Flex gap={3} alignItems={'center'}>

                            <Box>
                                <Menu>
                                    <MenuButton color="gray.light">
                                        <BsThreeDots  />
                                    </MenuButton>
                                    <Portal>
                                        <MenuList  bg={useColorModeValue("gray.300", "#0e0e0e")}>
                                            <MenuItem _hover={{ bg: (colorMode === "dark" ? 'gray.dark':'gray.200' )}} icon={<FaRegCopy />} bg={useColorModeValue("gray.300", "#0e0e0e")} onClick={handleCopy} > Copy comment  </MenuItem>
                                            { (user?.username === reply.username) ?  <MenuItem _hover={{ bg: (colorMode === "dark" ? 'gray.dark':'gray.200' )}} icon={<FaRegEdit />} bg={useColorModeValue("gray.300", "#0e0e0e")} > Edit Comment </MenuItem>  : null }

                                           
                                            <MenuDivider />
                                            <MenuItem _hover={{ bg: (colorMode === "dark" ? 'gray.dark':'gray.200' )}} icon={<MdBlock />} color='red' bg={useColorModeValue("gray.300", "#0e0e0e")}> Report </MenuItem>

                                           { (user?.username === reply.username) ?  <MenuItem _hover={{ bg: (colorMode === "dark" ? 'gray.dark':'gray.200' )}} icon={<MdOutlineDelete  />} color={'red'} bg={useColorModeValue("gray.300", "#0e0e0e")}> Delete </MenuItem> : null }
  
                                        </MenuList>
                                    </Portal>
                                </Menu>
                            </Box>
                        </Flex>
                    </Flex>

                    <Text>{reply.text}</Text>
                  
                </Flex>
               
            </Flex>
            <Divider borderColor={'gray.light'}/>

        </>
    )
}

export default Comment
