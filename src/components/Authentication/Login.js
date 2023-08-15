import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputRightElement,InputGroup } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { ChatState } from "../../Context/ChatProvider";


const Login = () => {
  
  const url="https://wdsfgsd.adaptable.app"
  const toast = useToast();
  const { setUser } = ChatState();
  const history = useHistory();
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState()
  const [password, setpassword] = useState()
  const [loading, setLoading] = useState(false);
  const handleClick=()=>setShow(!show)
  const submitHandler = async () => {
    setLoading(true);
  
    if (!email || !password) {
      toast({
        title: "Please fill in all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
  
      const userData = { email, password };
  
      const response = await axios.post(
        url+"/api/user/login", // Use POST method for login
        userData,
        config
      );
  
      toast({
        title: "Success",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(response.data));
      setLoading(false);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo)
      history.push("/chats");
  
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: "Invalid Credentials",
        status: "error", // Use "error" status to indicate unsuccessful login
        duration: 1350,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  


  return (
    <VStack spacing='3px'>
    <FormControl id='email' isRequired>
    <FormLabel >Email</FormLabel>
        <Input 
        marginBottom="30px"
        placeholder='Enter your email'
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
    </FormControl>
    <FormControl id='password' isRequired>
    <FormLabel >Password</FormLabel>
    <InputGroup>
        <Input 
         type={show?'text':'password'}
        placeholder='Enter your password'
        value={password}
        onChange={(e)=>setpassword(e.target.value)}
        />
        <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
{show?"Hide":"Show"}
        </Button>
        </InputRightElement>
    </InputGroup>
    </FormControl>
    <Button
    colorScheme="blue"
    width="100%"
    style={{ marginTop: 45 }}
    onClick={submitHandler}
    isLoading={loading}
    >
    Login
    </Button>

    <Button
    variant={"solid"}
    colorScheme="red"
    width={"100%"}
    style={{ marginTop: 15 }}
    onClick={()=>{
      setEmail("guest@example.com");
      setpassword("123456");
    }}
    >
      Get Guest User Credentials
    </Button>
        </VStack>
  )
}

export default Login