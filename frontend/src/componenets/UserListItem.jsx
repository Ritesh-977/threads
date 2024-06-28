import { Avatar, Box, Text, useColorModeValue} from '@chakra-ui/react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const UserListItem = ({user}) => {

  return (
    <NavLink to={`/${user.username}`}> 
    <Box
    cursor={'pointer'}
    w={'100%'}
    display={'flex'}
    alignItems={'center'}
    color={'white'}
    px={3}
    py={2}
    mb={2}
    borderRadius={'lg'}
    _hover={{
        bg:'gray.600',
    }}
    >  
         
        <Avatar 
        mr={2}
        size={'sm'}
        name={user.name}
        src={user.profilePic}

        />
     
        
        <Box >
        <NavLink to={`/${user.username}`}>
            <Text color= { useColorModeValue('black','white')} fontWeight={'bold'} >{user.username}</Text>
            <Text fontSize={'xs'}  color={'gray.400'}>{user.name}</Text>
        </NavLink>
        </Box>
      
    </Box>
    </NavLink>
  )
}

export default UserListItem
