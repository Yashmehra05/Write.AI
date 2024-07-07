import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Box, VStack, useColorModeValue, Text } from '@chakra-ui/react';
import './index.css';

const QuillEditor = ({ content }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const editorBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  useEffect(() => {
    console.log('Initializing Quill editor');
    if (editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ list: 'ordered' }, { list: 'bullet' }],
          ],
        },
      });
      console.log('Quill editor initialized');

      if (content) {
        const styledContent = `
          <p style="font-size: 16px; line-height: 1.5;">
            ${content}
          </p>
        `;
        quillRef.current.clipboard.dangerouslyPasteHTML(styledContent);
        console.log('Content set in Quill editor');
      }
    }
  }, [content]);

  return (
    <VStack spacing={4} align="stretch" justifyContent="center" height="100vh" bg="gray.100">
      <Text fontSize="lg" fontWeight="bold" mb={2}></Text>
      <Box 
        border="1px solid" 
        borderColor={borderColor} 
        borderRadius="md" 
        p={4} 
        bg={editorBgColor}
        minH="297mm" 
        width="210mm" 
        maxW="210mm"
        margin="0 auto"
        boxShadow="lg"
        bgImage="url('https://www.transparenttextures.com/patterns/cubes.png')"
        bgSize="cover"
        bgPosition="center"
      >
        <div ref={editorRef} />
      </Box>
    </VStack>
  );
};

export default QuillEditor;
