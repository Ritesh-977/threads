import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import useFollowUnFollow from '../hooks/useFollowUnFollow'

const SuggestedUser = ({user}) => {
    const {handleFollowUnfollow, following, updating} = useFollowUnFollow(user);
  return (
    <>
       <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			<Flex gap={2} as={Link} to={`${user.username}`}>
				<Avatar src={user.profilePic} />
				<Box>
					<Text _hover={{textDecoration:'underline'}} fontSize={"sm"} fontWeight={"bold"}>
						{user.username}
					</Text>
					<Text color={"gray.light"} fontSize={"sm"}>
						{user.name}
					</Text>
				</Box>
			</Flex>
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={handleFollowUnfollow}
				isLoading={updating}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "Following" : "Follow"}
			</Button>
		</Flex>
    </>
  )
}

export default SuggestedUser
