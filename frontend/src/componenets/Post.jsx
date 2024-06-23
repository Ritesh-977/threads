import { Link, useNavigate } from "react-router-dom"
import { Image, Box, Avatar,  Flex, Text } from "@chakra-ui/react"
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNowStrict} from "date-fns";


const Post = ({ post, postedBy }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/users/profile/" + postedBy);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                setUser(null);
            }
        };
        getUser();
    }, [postedBy, showToast]);

    
    if (!user) return null;
    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={'column'} alignItems={'center'}>
                    <Avatar
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${user.username}`);
                        }} size={'md'} name={user.name} src={user?.profilePic} />
                    <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
                    <Box position={'relative'} w={'full'}>
                        {post.replies[2] && (
                            <Avatar
                                size={'xs'}
                                name={user.name}
                                src={post.replies[2].userProfilePic}
                                position="absolute"
                                top={'0px'}
                                left={'15px'}
                                padding={'2px'}
                            />
                        )}
                        {post.replies[0] && (
                            <Avatar
                                size={'xs'}
                                name={user.name}
                                src={post.replies[0].userProfilePic}
                                position="absolute"
                                bottom={'0px'}
                                right={'-5px'}
                                padding={'2px'}
                            />)}

                        {post.replies[1] && (
                            <Avatar
                                size={'xs'}
                                name={user.name}
                                src={post.replies[1].userProfilePic}
                                position="absolute"
                                bottom={'0px'}
                                left={'4px'}
                                padding={'2px'}
                            />)}
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={'column'} gap={2}>
                    <Flex justifyContent={'space-between'} w={'full'}>
                        <Flex w={'full'} alignItems={'center'}>
                            <Text
                                _hover={{textDecoration:"underline"}}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${user.username}`);
                                }}
                                fontSize={'sm'} fontWeight={'bold'}>{user.username}</Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={'center'}>

                            <Text textAlign={'right'} fontSize={'sm'} w={36} color={'gray.light'}>
                            {formatDistanceToNowStrict(new Date(post.createdAt)) } ago
                            </Text> 

                        </Flex>
                    </Flex>
                    <Text fontSize={'sm'}> {post.text} </Text>
                    {post.img && <Box >                      
                        <Image   
                        borderRadius={6}
                        overflow={'hidden'}
                        border={'1px solid'} 
                        maxH={'500px'} 
                        borderColor={'gray.light'}
                        src={post.img} />
                    </Box>}
                    <Flex gap={3} my={1}>
                        <Actions post = {post} />
                    </Flex>
                                   </Flex>
            </Flex>
        </Link>
    )
}

export default Post
