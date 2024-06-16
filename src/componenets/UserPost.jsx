import { Link } from "react-router-dom"
import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";

const UserPost = () => {
  return (
    <Link to={"/markzuckerberg/post/1"}>
       <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={'column'} alignItems={'center'}>
            <Avatar size={'md'} name="Mark Zuckerberg" src="/zuck-avatar.png"/>
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
                    <Image src="/verified.png" w={4} h={4} ml={1}/>
                </Flex>
                <Flex gap={4} alignItems={'center'}>
                    <Text fontStyle={'sm'} color={'gray.light'}>1d</Text>
                    <BsThreeDots/>
                </Flex>
            </Flex>
            <Text fontSize={'sm'}> This is my first post </Text>
        </Flex>
       </Flex>
    </Link>
  )
}

export default UserPost
