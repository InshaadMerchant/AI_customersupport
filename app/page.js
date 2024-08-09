'use client'
import { useState } from "react";
import { Box, Stack, TextField, Button, useMediaQuery, useTheme, Typography, IconButton } from "@mui/material";
import { sendChatMessage } from './api';  // Import the API utility function
import SendIcon from '@mui/icons-material/Send'; 

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `
            Hello, How can I assist you today?
            `
    }
  ]);

  const [message, setMessage] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages
  
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '...' },
    ]);
    setMessage('');
  
    try {
      const apiKey = "put-api-key-here";  // Move your API key here
      const assistantMessage = await sendChatMessage(messages, apiKey);
      
      setMessages((messages) => {
        let lastMessages = messages.slice(0, -1);
        return [
          ...lastMessages,
          { role: 'assistant', content: assistantMessage },
        ];
      });
    } catch (error) {
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
    >
      <Box
        width="100%"
        p={2}
        bgcolor="primary.main"
        color="white"
        textAlign="center"
        position="fixed"
        top={0}
        left={0}
        zIndex={1000}
        boxShadow={0}
      >
        <Typography variant="h6">Healthcare Support Chat</Typography>
      </Box>
      <Box
        width="100%"
        height="calc(100vh - 64px)" 
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        mt="64px"
        p={2}
      >
        <Stack
          direction="column"
          width={isSmallScreen ? "100%" : "600px"}
          height="100%"
          border="1px solid #ddd" 
          borderRadius={8}
          bgcolor="white"
          p={0}
          sx={{
            overflowY: 'scroll',  // Enable vertical scrolling
            '&::-webkit-scrollbar': {
              display: 'none',  // Hide scrollbar for WebKit-based browsers
            },
            scrollbarWidth: 'none',  // Hide scrollbar for Firefox
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="calc(100% - 80px)" 
            p={1}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
                p={1}
              >
                <Box
                  bgcolor={
                    message.role === 'assistant'
                      ? 'primary.main' : 'secondary.main'
                  }
                  color="white"
                  borderRadius={5}
                  p={1.5}
                  maxWidth="70%"
                  minWidth="150px"
                  position="relative"
                  sx={{
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: '0px',
                      left: message.role === 'assistant' ? '0px' : 'auto',
                      right: message.role === 'user' ? '0px' : 'auto',
                      width: 0,
                      height: 0,
                      borderLeft: message.role === 'assistant' ? '25px solid transparent' : 'none',
                      borderRight: message.role === 'user' ? '25px solid transparent' : 'none',
                      borderTop: '25px solid',
                      borderTopColor: message.role === 'assistant' ? 'primary.main' : 'secondary.main',
                      transform: 'rotate(180deg)',
                      borderRadius: '10%',
                    }
                  }}
                >

                  {message.content}
                  
                </Box>
              </Box>
            ))}
          </Stack>
          <Box
            display="flex"
            alignItems="center"
            p={2}
            borderTop="0px solid #ddd"
          >
            <TextField 
              label="Message" 
              fullWidth 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              InputProps={{
                style: { borderRadius: 32, height: 48 }
              }}
              sx={{ mr: 1 }}
            />
              <IconButton
              variant="contained" 
              onClick={sendMessage}
              color="primary"
              style={{ borderRadius: 32, height: 56, width: 56 }}
              >
                <SendIcon />
              </IconButton>
              {/* Send */}

          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
