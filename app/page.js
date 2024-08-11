"use client";
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import InfoIcon from "@mui/icons-material/Info";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [welcome, setWelcome] = useState(true);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const startChat = () => {
    setWelcome(false);
    setMessages([
      {
        role: "assistant",
        content: "Hello, How can I assist you today?",
      },
    ]);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      style={{
        backgroundImage: `url(${"https://img.freepik.com/free-photo/flat-lay-pills-stethoscope-arrangement_23-2149341647.jpg?w=900&t=st=1723281804~exp=1723282404~hmac=de20454ef9c968043895811e37fd896019be72218809c8961cb41e76eaa0ea84"})`,
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >
      <Box
        width="100vw"
        height={`${viewportHeight}px`} // Use viewportHeight state
        display="flex"
        flexDirection="column"
        style={{ overflow: "hidden" }}
      >
        <Box
          width="100%"
          p={1}
          bgcolor="primary.main"
          color="white"
          textAlign="center"
          position="fixed"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={1000}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mr={1}
          >
            <img
              src="icon.png"
              alt="medical-icon"
              style={{
                width: 48,
                height: 48,
                padding: "10px",
                fill: "white",
              }}
            />
          </Box>
          <Typography variant="h6">Healthcare Support Chat</Typography>
          <IconButton
            color="inherit"
            onClick={() => setShowAbout((prev) => !prev)}
            style={{ marginLeft: "auto" }}
          >
            <InfoIcon />
          </IconButton>
        </Box>

        <Collapse in={showAbout}>
          <Box
            width="100%"
            bgcolor="background.paper"
            p={2}
            position="fixed"
            bottom={0}
            left={0}
            boxShadow={3}
            zIndex={1100}
          >
            <Box
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                textAlign: "center",
                padding: "16px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                About This App
              </Typography>

              <Typography paragraph>
                This application provides healthcare support through a chat
                interface. You can ask questions or get information about
                various health topics. The system is designed to offer quick and
                useful responses to help you with your healthcare needs.
              </Typography>

              <Typography paragraph>
                The healthcare customer assistance bot guides you based on
                conditions, symptoms, and other details provided. It does not
                prescribe any medicine but suggests safety precautions,
                measures, and recommended processes to avoid severity.
                Additionally, the bot can recommend which specialist you might
                need to see based on your conditions and symptoms.
              </Typography>

              <Typography variant="body2" color="textSecondary">
                Authors: Umer Ghafoor, Muneeb ul Haq, Inshaad Merchant
              </Typography>
            </Box>
          </Box>
        </Collapse>

        {welcome ? (
          <Box
            width="100%"
            height={`calc(${viewportHeight}px - 64px)`} // Adjust height based on header
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={2}
            mt="64px"
          >
            <Typography variant="h4" color="white" gutterBottom align="center">
              Welcome to Healthcare Support Chat
            </Typography>

            <Typography variant="h6" color="white" gutterBottom align="center">
              Click the button below to start chatting with our assistant.
            </Typography>

            <Typography
              variant="body1"
              color="white"
              align="center"
              gutterBottom
            >
              Note: This chat is designed to provide general healthcare
              information and support. For any serious or urgent medical
              concerns, please contact a healthcare professional directly.
            </Typography>

            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={startChat}
                size="large"
                sx={{
                  borderRadius: 28,
                  padding: "12px 24px",
                }}
              >
                Start Chat
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            width="100%"
            height={`calc(${viewportHeight}px - 64px)`} // Adjust height based on header
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mt="64px"
            p={2}
            sx={{
              overflowY: "hidden",
            }}
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
                overflowY: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
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
                      message.role === "assistant" ? "flex-start" : "flex-end"
                    }
                    p={1}
                  >
                    <Box
                      bgcolor={
                        message.role === "assistant"
                          ? "primary.main"
                          : "secondary.main"
                      }
                      color="white"
                      borderRadius={5}
                      p={1.5}
                      maxWidth="70%"
                      minWidth="50px"
                      minHeight="50px"
                      position="relative"
                      sx={{
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          bottom: "0px",
                          left: message.role === "assistant" ? "0px" : "auto",
                          right: message.role === "user" ? "0px" : "auto",
                          width: 0,
                          height: 0,
                          borderLeft:
                            message.role === "assistant"
                              ? "25px solid transparent"
                              : "none",
                          borderRight:
                            message.role === "user"
                              ? "25px solid transparent"
                              : "none",
                          borderTop: "25px solid",
                          borderTopColor:
                            message.role === "assistant"
                              ? "primary.main"
                              : "secondary.main",
                          transform: "rotate(180deg)",
                          borderRadius: "10%",
                        },
                      }}
                    >
                      <Typography
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/\n/g, "<br />")
                            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                            .replace(/^\* (.*?)(<br \/>|$)/gm, "<li>$1</li>")
                            .replace(/<\/li>(\s*<br \/>)+/g, "</li>")
                            .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>"),
                        }}
                      />
                    </Box>
                  </Box>
                ))}

                <div ref={messagesEndRef} />
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
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  InputProps={{
                    style: { borderRadius: 32, height: 48 },
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
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
