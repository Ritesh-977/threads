import { Avatar, Flex, Text } from '@chakra-ui/react'


const Message = ({ownMessage}) => {
  return (
    <>
    {ownMessage ?(
    <Flex
    gap={2}
    alignSelf={'flex-end'}
    >
        <Text maxW={'350px'} bg={'blue.400'} p={1} borderRadius={'md'}>
           adipisicing elit. Provident doloribus molestiae hic dolorem tempora, distinctio vero, um?
        </Text>
        <Avatar src='' w={7} h={7} />
      
    </Flex>
    ): ( 
        <Flex gap={2} >  
            <Avatar src='' w={7} h={7} />
            <Text maxW={'350px'} bg={'#2b2c2c'} p={1} borderRadius={'md'}>
                 dolorem tempora, distinctio vero, possimus deserunt id nesciunt esse. Ut eos temporibus vitae, consectetur dolores ipsam reiciendis harum?
            </Text>
        </Flex> )}
    </>
  )
}

export default Message

