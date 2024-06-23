import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
} from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useRef, useState } from 'react';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';
import { Link } from "react-router-dom";

export default function UpdateProfilePage() {
    const [user, setUser] = useRecoilState(userAtom);

    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        website: user.website,
        password: "",
    });

    const showToast = useShowToast();

    const fileRef = useRef(null);

    const { handleImageChange, imgUrl } = usePreviewImg();
    
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(updating) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/users/update/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            
            showToast("Success", "Profile updated successfully", "success");
            setUser(data);
            localStorage.setItem("user-threads", JSON.stringify(data));

        } catch (error) {
            showToast("Error", error, "error");
        } finally{
            setUpdating(false);
        }
    }
    return (
        <form onSubmit={handleSubmit} >
            <Flex
                align={'center'}
                justify={'center'}
                my={6} >
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={useColorModeValue('white', 'dark')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        User Profile Edit
                    </Heading>
                    <FormControl>
                        <Stack direction={['column', 'row']} spacing={6}>
                            <Center>
                                <Avatar boxShadow={"md"} size="xl" src={imgUrl || user.profilePic} />
                            </Center>
                            <Center w="full">
                                <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
                                <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl  >
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            value={inputs.name}
                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                            placeholder="Your name"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl  >
                        <FormLabel>Username</FormLabel>
                        <Input
                            value={inputs.username}
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                            placeholder="username"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl id="email" >
                        <FormLabel>Email address</FormLabel>
                        <Input
                            value={inputs.email}
                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                            placeholder="your-email@example.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Bio</FormLabel>
                        <Input
                            value={inputs.bio}
                            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                            placeholder="Your bio.."
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Website Link</FormLabel>
                        <Input
                            value={inputs.website}
                            onChange={(e) => setInputs({ ...inputs, website: e.target.value })}
                            placeholder="link.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl id="password" >
                        <FormLabel>Change Password</FormLabel>
                        <Input
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                            placeholder="password"
                            _placeholder={{ color: 'gray.500' }}
                            type="password"
                        />
                    </FormControl>
                    <Stack spacing={6} direction={['column', 'row']}>
                    <Link to={`/${user.username}`}>
                        <Button
                            bg={'red.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'red.600',
                            }}>
                            Close
                        </Button>
                        </Link>
                        <Button
                         
                            type='submit'
                            isLoading={updating}
                            bg={'green.500'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'green.700',
                            }}
                            >
                            Update
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    )
}