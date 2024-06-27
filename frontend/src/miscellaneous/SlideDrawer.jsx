import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Input, Skeleton, SkeletonCircle, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import useShowToast from '../hooks/useShowToast';
import UserListItem from '../componenets/UserListItem';

const SlideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const firstField = React.useRef()
 const showToast = useShowToast();
  const handleSearch = async () => {
    if(!search){   
        toast({
          title: "Please Enter something to search",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-left"
        });
       return;
    }
    try {
       setLoading(true);
        const res = await fetch(`/api/users?search=${search}`);
        const data = await res.json();
       await setSearchResult(data);
       setSearch("");
       
        
    } catch (error) {
        showToast("Error", error.message, "error");
    } finally{
        setLoading(false);   
    }

  }

    return <>
    <Box>
        <Tooltip label="Search Users" hasArrow placement='bottom-end'>
              <Button variant={'ghost'} onClick={onOpen}>
              <FaSearch />
              <Text display={{base: 'none', md:'flex'}} px={'4'} >Search User</Text>
              </Button>
        </Tooltip>
    </Box>
    <Drawer initialFocusRef={firstField} placement='left' onClose={onClose}  isOpen = {isOpen}>
    <DrawerOverlay/>
    <DrawerContent>
        <DrawerHeader borderBottomWidth={'1px'}> Search Users </DrawerHeader>
         <DrawerBody>
            <Box display={'flex'} pb={2}>
                <Input 
                ref = {firstField}
                placeholder='Search here'
                mr={2}
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                />
                <Button isLoading={loading} onClick={handleSearch}>
                    Go
                </Button>
            </Box>
            {loading ? ( 
                    [0, 1, 2, 3, 4].map((_, i) => (
                        <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
                            <Box>
                                <SkeletonCircle size={"10"} />
                            </Box>
                            <Flex w={"full"} flexDirection={"column"} gap={3}>
                                <Skeleton h={"10px"} w={"80px"} />
                                <Skeleton h={"8px"} w={"90%"} />
                            </Flex>
                        </Flex>
                    ))
            ):(
              searchResult?.map(user =>(
                <Box onClick={onClose}>
                <UserListItem 
                key = {user._id}
                user = {user}
                />
                </Box>
              ))
            )}
         </DrawerBody>
    </DrawerContent>
    </Drawer>
    </>
};

export default SlideDrawer;
