import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Spinner, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import axios from "axios";
import UserBadgeItem from '../userAvatar/UserBadgeItem'
import UserListItem from '../userAvatar/UserListItem'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
  const url="https://wdsfgsd.adaptable.app"
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        url+`/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
  
      // Only update selectedChat if it's not the same user
      if (user1._id !== user._id) {
        setSelectedChat(data);
      }
  
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        url+"/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
     setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toast({
        title: "Group Name Updated",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        url+`/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };



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
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [groupChatName, setGroupChatName] = useState();
  const [setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
    return (
        <>
          <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
    
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
                >{selectedChat.chatName}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                    {selectedChat.users.map((u)=>(<UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />))}
                </Box>
                <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
              </ModalBody>
              <ModalFooter>
              <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    }


export default UpdateGroupChatModal
