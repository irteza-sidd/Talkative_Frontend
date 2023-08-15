import { Box, Button, Tooltip, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, useDisclosure, useToast, Spinner, Badge } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { Input } from "@chakra-ui/input";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import UserListItem from '../userAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';


const SideDrawer = () => {
  const url="https://wdsfgsd.adaptable.app"
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,setNotification,
  } = ChatState();

const toast=useToast();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(url+`/api/user?search=${query}`, config);
      if (data.length === 0) {
        setSearchResult([]);
        setLoading(false);
        toast({
          title: "No Results Found",
          description: "No users found with the given search criteria.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      } else {
        setLoading(false);
        setSearchResult(data);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(url+`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  return <>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
    >
      <Tooltip label="Search to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <i className="fas fa-search"></i>
          <Text display={{ base: "none", md: "flex" }} px={4}>
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize="2xl" fontFamily="Work sans">
        Talk-A-Tive
      </Text>
      <div>
        <Menu>
          <MenuButton p={1}>
          <Badge
                colorScheme="red"
                color={"#FFFFFF"}
                bg={"#3498DB"}
                borderRadius="full"
                px={2}
                ml={-2}
              >
                {notification.length}
              </Badge>
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList paddingLeft={2}>
            {!notification.length && "No New Messages"}
            {notification.map(notif=>(
              <MenuItem key={notif._id} onClick={()=>{
                setSelectedChat(notif.chat)
                setNotification(notification.filter((n)=>n !==notif));
              }}>
              {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              src={user.pic}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>{" "}
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>
   <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
   <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
        <DrawerBody>
        <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name "
                mr={2}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {/* <Button onClick={handleSearch}>Go</Button> */}
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
   </Drawer>
  </>;
};

export default SideDrawer
