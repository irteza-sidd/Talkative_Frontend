import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const url="https://wdsfgsd.adaptable.app"
  const [pic, setPic] = useState("");
  const { setUser } = ChatState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const history = useHistory();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    postDetails(file);
  };

  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
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

    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match",
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

      const userData = { name, email, password, pic };

      const response = await axios.post(
        url+ "/api/user",
        userData,
        config
      );

      toast({
        title: "Success",
        status: "success",
        duration: 5000,
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
    }
  };

  const postDetails = async (file) => {
    setLoading(true);

    if (!file) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "chat-app");
        formData.append("cloud_name", "dyhtwnb04");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dyhtwnb04/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setPic(data.url.toString());
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    } else {
      toast({
        title: "Please select a valid image (JPEG or PNG)",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    setLoading(false);
  };

  return (
    <VStack spacing="3px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={toggleShowPassword}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Re-type password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={toggleShowPassword}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={handleFileChange}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign up
      </Button>
    </VStack>
  );
};

export default Signup;
