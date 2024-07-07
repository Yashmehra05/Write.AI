import React, { useEffect, useState } from 'react';
import { BrowserRouter as  useNavigate } from 'react-router-dom';
import { ChakraProvider, Box, Button, Heading, VStack, HStack, Text, FormControl, FormLabel, Input } from '@chakra-ui/react';
import QuillEditor from './QuillEditor';
import { saveAs } from 'file-saver';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      

try {
  const response = await axios.post(
    'http://localhost:4100/login',
    { email, password },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );

  if (response.status !== 200) {
    throw new Error('Login failed');
  }

  navigate('/');
} catch (error) {
  setError(error.toString());
}
    }

  
    return (
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <Heading>Login</Heading>
          {error && <Text color="red.500">{error}</Text>}
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button onClick={handleSubmit} colorScheme="teal">
            Login
          </Button>
        </VStack>
      </Box>
    );
  };
   
  export default Login;
  