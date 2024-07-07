import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ChakraProvider, Box, Button, Heading, VStack, HStack, Text, FormControl, FormLabel, Input } from '@chakra-ui/react';
import QuillEditor from './QuillEditor';
import { saveAs } from 'file-saver';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState('');
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/check-auth', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          navigate('/login');
        }
      })
      .catch(error => {
        // console.error('Error during authentication check:', error);
        // setError(error.toString());
        console.log("getting the error in:",error);
      });
  }, [navigate]);

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const API_URL = 'https://api.cohere.ai/generate';
    const API_KEY = 'KiMD2I9vtwSLgdmHtsjJBBCNjz3zM4eRIdgH0tyW';

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
      }),
    };

    fetch(API_URL, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data.text);
      })
      .catch(error => {
        console.error('Error during API call:', error);
        setError(error.toString());
      });
  };

  const handleDownload = () => {
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'generated-text.txt');
  };

  if (!setIsAuthenticated) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={4}>
        <Heading>Hey buddy.. Write here</Heading>
        <Button onClick={handleDownload} colorScheme="blue">
          Download
        </Button>
      </HStack>
      {error && (
        <Text color="red.500">Error: {error}</Text>
      )}
      <VStack spacing={4} align="stretch">
        <FormControl id="prompt">
          <FormLabel>Enter your prompt</FormLabel>
          <Input
            value={prompt}
            onChange={handleInputChange}
            placeholder="Write a paragraph on my best friend"
          />
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="teal">
          Generate
        </Button>
      </VStack>
      <Box mt={40}>
        <QuillEditor content={data} />
      </Box>
    </Box>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:4100/login', {  // Ensure this URL matches your backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.toString());
    }
  };

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

const App = () => (
  <ChakraProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </ChakraProvider>
);

export default App;
