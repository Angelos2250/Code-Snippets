import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  AvatarBadge,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { Logo } from "components/Navbar/Navbar";
import { UserMenuItems } from "router/router";
import { Link } from "react-router-dom";
import LogoutMenuItem from "components/Logout/LogoutMenuItem";
import { useContext } from "react";
import { AuthContext } from "auth/Auth";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const authContext = useContext(AuthContext);

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {Logo}
      </Text>
      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                {authContext?.currentUser?.photoURL ? (
                  <Box>
                    <Avatar src={authContext?.currentUser?.photoURL}>
                      <AvatarBadge boxSize="1em" bg="green.500" />
                    </Avatar>
                  </Box>
                ) : (
                  <Box>
                    <Avatar>
                      <AvatarBadge boxSize="1em" bg="green.500" />
                    </Avatar>
                  </Box>
                )}

                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">
                    {authContext?.currentUser?.email?.trim().split("@")[0]}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    User
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              {UserMenuItems.map((menuItem) => {
                // if divider is true => add divider
                return menuItem.divider ? (
                  <Box key={menuItem.name}>
                    <MenuDivider />
                    <MenuItem>
                      <Link to={menuItem.path}>{menuItem.name}</Link>
                    </MenuItem>
                  </Box>
                ) : (
                  <MenuItem key={menuItem.name}>
                    <Link to={menuItem.path}>{menuItem.name}</Link>
                  </MenuItem>
                );
              })}
              <LogoutMenuItem />
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default MobileNav;
