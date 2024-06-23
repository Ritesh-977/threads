import { Flex, Image, useColorMode, Link, Menu, MenuButton, MenuList, MenuItem, IconButton, Text, MenuDivider, Button } from "@chakra-ui/react"
import userAtom from "../atoms/userAtom";
import { NavLink } from "react-router-dom";
import { AiFillHome } from 'react-icons/ai';
import { RxAvatar } from 'react-icons/rx';
import { useRecoilValue } from "recoil";
import { HamburgerIcon } from "@chakra-ui/icons";
import useLogout from "../hooks/useLogout";
import { BsFillChatLeftTextFill } from "react-icons/bs";
const Header = () => {

  const logout = useLogout();
  const user = useRecoilValue(userAtom);
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent={"space-between"} mt={"6"} mb={"12"} >
      {user && (
        <NavLink to="/">
          <AiFillHome size={24} />
        </NavLink>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {user && (
        <Flex alignItems={'center'} gap={10}>
          <NavLink to={`/${user.username}`}>
            <RxAvatar size={24} />
          </NavLink>
          <NavLink to={`/chat`}>
            <BsFillChatLeftTextFill size={24} />
          </NavLink>

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<HamburgerIcon />}
              variant='outline'
            />
            <MenuList bg={'#0e0e0e'} >
              <MenuItem bg={'#0e0e0e'} ml={'5px'} maxW={'210px'} _hover={{ bg: 'gray.dark' }} borderRadius={'5px'}  >
                <Text   > Settings</Text>
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={logout} bg={'#0e0e0e'} ml={'5px'} maxW={'210px'} _hover={{ bg: 'gray.dark' }} borderRadius={'5px'} >
                <Text   > Logout</Text>
              </MenuItem>
              <MenuDivider />
              <MenuItem bg={'#0e0e0e'} ml={'5px'} maxW={'210px'} _hover={{ bg: 'gray.dark' }} borderRadius={'5px'} >
                <Text color={'red'}  >Report a Problem</Text>
              </MenuItem>
            </MenuList>
          </Menu>

        </Flex>
      )}
      {!user && (
        <NavLink to="/auth">
          <Button >Login</Button>
        </NavLink>
      )}
    </Flex>
  )
}

export default Header
