import React from 'react'
import { useEffect, useState} from 'react'
import { Container, Box, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from 'react-router';

const Homepage = () => {

  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      history.push("/chats");
    }
  }, [history]);
  
  return (
    <Container maxW='615px' centerContent >
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 0px 0"
        border="2px solid black"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" textAlign="center">
          TALK-A-TIVE
        </Text>
      </Box>
      <Box 
      bg="white" 
      w="100%"
      padding="5px 10px 80px 10px" 
      borderRadius="lg" 
      borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="0.6em">
            <Tab marginTop="15px">Login</Tab>
            <Tab marginTop="15px">Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel marginTop="30px">
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage