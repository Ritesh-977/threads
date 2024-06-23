import { Link } from "react-router-dom"
import { Avatar, Box, Flex, Image, Text , Menu, MenuButton, MenuDivider, MenuItem, MenuList, Portal} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useState } from "react";
import { FaLink } from "react-icons/fa";
import { RiSaveLine } from "react-icons/ri";
import { MdBlock } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";

const UserPost = ({postImg, postTitle, likes, replies}) => {
    const [liked, setLiked] = useState(false);
    return (
        <Link to={"/zuckerberg/post/1"}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={'column'} alignItems={'center'}>
                    <Avatar size={'md'} name="Mark Zuckerberg" src="/zuck-avatar.png" />
                    <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
                    <Box position={'relative'} w={'full'}>
                        <Avatar
                            size={'xs'}
                            name="John doe"
                            src="https://bit.ly/dan-abramov"
                            position="absolute"
                            top={'0px'}
                            left={'15px'}
                            padding={'2px'}
                        />
                        <Avatar
                            size={'xs'}
                            name="Kent Dodds"
                            src="https://bit.ly/kent-c-dodds"
                            position="absolute"
                            bottom={'0px'}
                            right={'-5px'}
                            padding={'2px'}
                        />
                        <Avatar
                            size={'xs'}
                            name="Ryan Florence"
                            src="https://bit.ly/ryan-florence"
                            position="absolute"
                            bottom={'0px'}
                            left={'4px'}
                            padding={'2px'}
                        />
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={'column'} gap={2}>
                    <Flex justifyContent={'space-between'} w={'full'}>
                        <Flex w={'full'} alignItems={'center'}>
                            <Text fontSize={'sm'} fontWeight={'bold'}>zuckerberg</Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={'center'}>
                            <Text fontStyle={'sm'} color={'gray.light'}>1d</Text>
                        <Box className="icon-container">
                            <Menu>
                            <MenuButton>
                            <BsThreeDots  size={24} cursor={'pointer'}/>
                            </MenuButton>
                            <Portal>
                                <MenuList bg={'gray.dark'}>
                                <MenuItem icon={ <FaLink /> }  bg={'gray.dark'} > Copy link  </MenuItem>
                                <MenuItem icon={ <RiSaveLine />} bg={'gray.dark'} > Save </MenuItem>
                                <MenuDivider/>
                                <MenuItem icon={ <MdBlock /> } color='red' bg={'gray.dark'}> Block </MenuItem>
                                <MenuItem icon={<TbMessageReport />} color={'red'} bg={'gray.dark'}> Report </MenuItem>
                                </MenuList>
                            </Portal> 
                            </Menu>
                            
                        </Box>
                        
                        </Flex>
                    </Flex>
                    <Text fontSize={'sm'}> {postTitle} </Text>
                   {postImg && <Box
                        borderRadius={6}
                        overflow={'hidden'}
                        border={'1px solid'}
                        borderColor={'gray.light'} >

                        <Image src={postImg} w={'full'}/>
                    </Box> }
                    <Flex gap={3} my={1}>
                        <Actions liked={liked} setLiked={setLiked}/>
                    </Flex>
                    <Flex gap={2} alignItems={"center"}>
                        <Text color={'gray.light'} fontSize={'sm'} >{replies} replies</Text>
                       
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    )
}

export default UserPost
